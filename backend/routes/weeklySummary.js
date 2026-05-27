import express from "express";
import WeeklySummary from "../models/WeeklySummary.js";
import { generateWeeklySummary } from "../services/weeklyService.js";

const router = express.Router();

// GET /api/weekly — Sab summaries fetch karo
router.get("/", async (req, res) => {
  try {
    const summaries = await WeeklySummary.find().sort({
      createdAt: -1,
    });
    res.status(200).json({ data: summaries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/weekly/generate — Manual trigger
router.post("/generate", async (req, res) => {
  try {
    const summary = await generateWeeklySummary();
    if (!summary) {
      return res.status(400).json({
        message: "No standups this week to summarize",
      });
    }
    res.status(201).json({
      message: "Weekly summary generated!",
      data: summary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
