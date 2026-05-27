import express from "express";
import Standup from "../models/Standup.js";
import analyzeStandup from "../services/aiService.js";
import {
  sendToSlack,
  sendEditToSlack,
  sendDeleteToSlack,
} from "../services/slackService.js";
import { Parser } from "json2csv";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/standup
router.post("/", protect, async (req, res) => {
  try {
    const { yesterday, today, blockers } = req.body;

    if (!yesterday || !today) {
      return res
        .status(400)
        .json({ message: "Yesterday and today are required" });
    }

    const aiSummary = await analyzeStandup(yesterday, today, blockers);

    const standup = await Standup.create({
      userId: req.user._id,
      name: req.user.name,
      role: req.user.role,
      teamId: req.user.teamId,
      teamName: req.user.teamName,
      yesterday,
      today,
      blockers: blockers || "",
      aiSummary,
    });

    await sendToSlack(req.user.name, standup, aiSummary);

    res.status(201).json({ message: "Standup saved", data: standup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/standup — poori team ka data dikhao
router.get("/", protect, async (req, res) => {
  try {
    const standups = await Standup.find({
      $or: [{ teamId: req.user.teamId }, { teamId: { $exists: false } }],
    }).sort({ createdAt: -1 });

    res.status(200).json({ count: standups.length, data: standups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/standup/export
router.get("/export", protect, async (req, res) => {
  try {
    const standups = await Standup.find({
      $or: [{ teamId: req.user.teamId }, { teamId: { $exists: false } }],
    }).sort({ createdAt: -1 });

    const data = standups.map((s) => ({
      Name: s.name,
      Role: s.role || "",
      Date: new Date(s.createdAt).toLocaleDateString("en-US"),
      Yesterday: s.yesterday,
      Today: s.today,
      Blockers: s.blockers || "None",
      Severity: s.aiSummary?.severity || "none",
      "Action Needed": s.aiSummary?.actionNeeded || "",
      Edited: s.isEdited ? "Yes" : "No",
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("standups.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/standup/:id — Sirf owner edit kar sakta hai
// PUT /api/standup/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const { yesterday, today, blockers } = req.body;

    const existing = await Standup.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Standup not found" });
    }

    // ← Fixed ownership check — userId ya name dono se check karo
    const isOwner =
      (existing.userId &&
        existing.userId.toString() === req.user._id.toString()) ||
      existing.name === req.user.name;

    if (!isOwner) {
      return res.status(403).json({
        message: "Not allowed — you can only edit your own standups",
      });
    }

    const aiSummary = await analyzeStandup(yesterday, today, blockers);

    existing.previousData = {
      yesterday: existing.yesterday,
      today: existing.today,
      blockers: existing.blockers,
    };
    existing.yesterday = yesterday;
    existing.today = today;
    existing.blockers = blockers || "";
    existing.aiSummary = aiSummary;
    existing.isEdited = true;
    existing.userId = req.user._id; // ← purane standups mein bhi userId save karo

    const updated = await existing.save();

    await sendEditToSlack(req.user.name, updated, aiSummary);

    res.status(200).json({ message: "Standup updated", data: updated });
  } catch (error) {
    console.log("PUT error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/standup/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const standup = await Standup.findById(req.params.id);
    if (!standup) {
      return res.status(404).json({ message: "Standup not found" });
    }

    // ← Fixed ownership check — userId ya name dono se check karo
    const isOwner =
      (standup.userId &&
        standup.userId.toString() === req.user._id.toString()) ||
      standup.name === req.user.name;

    if (!isOwner) {
      return res.status(403).json({
        message: "Not allowed — you can only delete your own standups",
      });
    }

    await sendDeleteToSlack(req.user.name, standup);
    await Standup.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Standup deleted" });
  } catch (error) {
    console.log("DELETE error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/standup/:id — Sirf owner delete kar sakta hai
router.delete("/:id", protect, async (req, res) => {
  try {
    const standup = await Standup.findById(req.params.id);
    if (!standup) {
      return res.status(404).json({ message: "Standup not found" });
    }

    // ← Ownership check
    if (
      standup.userId &&
      standup.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    // Slack delete notification bhejo pehle
    await sendDeleteToSlack(req.user.name, standup);

    await Standup.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Standup deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
