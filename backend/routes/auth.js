import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/User.js";
import Team from "../models/Team.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Slack notification for new member
const sendRegisterNotification = async (name, teamName, role) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const roleEmoji = {
    "Frontend Developer": "🎨",
    "Backend Developer": "⚙️",
    "Full Stack Developer": "🚀",
    "DevOps Engineer": "🔧",
    "UI/UX Designer": "✏️",
    "QA Engineer": "🧪",
    "Product Manager": "📋",
  };

  const emoji = roleEmoji[role] || "👨‍💻";

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${emoji} New Member Joined — ${name}`,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Name*\n${name}` },
        { type: "mrkdwn", text: `*Role*\n${emoji} ${role || "Developer"}` },
        { type: "mrkdwn", text: `*Team*\n${teamName}` },
      ],
    },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: "Welcome to StandupBot! 🚀" }],
    },
    { type: "divider" },
  ];

  try {
    await axios.post(webhookUrl, { blocks });
    console.log(`Slack notification sent for new member: ${name}`);
  } catch (error) {
    console.log("Slack register error:", error.message);
  }
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, teamName, role } = req.body;

    if (!name || !email || !password || !teamName) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let team = await Team.findOne({ name: teamName });
    if (!team) {
      team = await Team.create({ name: teamName });
    }

    const user = await User.create({
      name,
      email,
      password,
      teamId: team._id,
      teamName: team.name,
      role: role || "Developer", // ← role save karo
    });

    team.members.push(user._id);
    await team.save();

    // Slack notification
    await sendRegisterNotification(name, teamName, role);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      teamId: user.teamId,
      teamName: user.teamName,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("Register error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        teamId: user.teamId,
        teamName: user.teamName,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    res.json(user);
  } catch (error) {
    console.log("Me error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
