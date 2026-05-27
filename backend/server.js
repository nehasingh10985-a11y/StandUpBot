import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import dns from "dns";
import cors from "cors";
import cron from "node-cron";
import axios from "axios";
import standupRouter from "./routes/standup.js";
import weeklyRouter from "./routes/weeklySummary.js";
import Standup from "./models/Standup.js";
import { generateWeeklySummary } from "./services/weeklyService.js";
import authRouter from "./routes/auth.js";

// Set DNS servers to prevent lookup failures
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection with process termination on failure
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Fatal MongoDB Connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/standup", standupRouter);
app.use("/api/weekly", weeklyRouter);
app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ── Daily 9 AM Reminder (IST) ────────────────────
cron.schedule(
  "0 9 * * *",
  async () => {
    console.log("Running 9AM standup reminder...");

    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;

      if (!webhookUrl) {
        console.log("Slack webhook URL not found");
        return;
      }

      // Safely calculate today's midnight in IST regardless of server timezone
      const today = new Date();
      today.setMinutes(today.getMinutes() + 330); // Shift forward 5.5 hours to IST
      today.setHours(0, 0, 0, 0); // Clamp to IST midnight
      today.setMinutes(today.getMinutes() - 330); // Shift back to UTC for MongoDB matching

      const todayStandups = await Standup.find({
        createdAt: { $gte: today },
      });

      const submittedNames = todayStandups.map((s) => s.name);

      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🌅 Daily Standup Reminder",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Good morning team! 👋 Time for your daily standup.\n\n*${submittedNames.length} submitted so far today.*`,
          },
        },
      ];

      if (submittedNames.length > 0) {
        blocks.push({
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `✅ Already submitted: ${submittedNames.join(", ")}`,
            },
          ],
        });
      }

      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Please submit your standup 🙏",
        },
      });

      blocks.push({ type: "divider" });

      await axios.post(webhookUrl, { blocks });
      console.log("Daily reminder sent to Slack!");
    } catch (error) {
      console.log("Cron job error:", error.message);
    }
  },
  {
    timezone: "Asia/Kolkata", // Forces node-cron to use Indian Standard Time
  },
);

// ── Weekly Summary — Every Friday 6 PM IST ──
cron.schedule(
  "0 18 * * 5",
  async () => {
    console.log("Running weekly summary...");
    try {
      await generateWeeklySummary();
      console.log("Weekly summary executed successfully.");
    } catch (error) {
      console.log("Weekly summary error:", error.message);
    }
  },
  {
    timezone: "Asia/Kolkata", // Forces node-cron to use Indian Standard Time
  },
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
