import Groq from "groq-sdk";
import dotenv from "dotenv";
import axios from "axios";
import Standup from "../models/Standup.js";
import WeeklySummary from "../models/WeeklySummary.js";

dotenv.config();

const generateWeeklySummary = async () => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date();
  weekEnd.setHours(23, 59, 59, 999);

  const standups = await Standup.find({
    createdAt: { $gte: weekStart, $lte: weekEnd },
  });

  if (standups.length === 0) {
    console.log("No standups this week — skipping summary");
    return null;
  }

  const totalStandups = standups.length;
  const totalBlockers = standups.filter(
    (s) => s.blockers && s.blockers.trim() !== "",
  ).length;

  const memberCount = standups.reduce((acc, s) => {
    acc[s.name] = (acc[s.name] || 0) + 1;
    return acc;
  }, {});
  const mostActive =
    Object.entries(memberCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  const blockerCount = standups
    .filter((s) => s.blockers && s.blockers.trim() !== "")
    .reduce((acc, s) => {
      acc[s.name] = (acc[s.name] || 0) + 1;
      return acc;
    }, {});
  const mostBlocked =
    Object.entries(blockerCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  const standupText = standups
    .map(
      (s) =>
        `${s.name}: Yesterday: ${s.yesterday} | Today: ${s.today} | Blockers: ${s.blockers || "None"} | Severity: ${s.aiSummary?.severity || "none"}`,
    )
    .join("\n");

  const prompt = `
You are an agile project manager. Analyze this week's team standups.
Return ONLY a valid JSON object. No explanation. No markdown. Just JSON.

Week's Standups:
${standupText}

Return exactly this JSON:
{
  "criticalIssues": ["issue 1", "issue 2"],
  "wins": ["win 1", "win 2"],
  "aiRecommendation": "one paragraph recommendation for next week",
  "rawSummary": "2-3 sentence overall summary of the week"
}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const rawText = response.choices[0].message.content;
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(cleaned);

    // ✅ FIXED: upsert — same weekStart pe duplicate nahi banega
    const summary = await WeeklySummary.findOneAndUpdate(
      { weekStart: weekStart.toISOString().split("T")[0] },
      {
        $set: {
          weekEnd: weekEnd.toISOString().split("T")[0],
          totalStandups,
          totalBlockers,
          mostActive,
          mostBlocked,
          criticalIssues: aiData.criticalIssues || [],
          wins: aiData.wins || [],
          aiRecommendation: aiData.aiRecommendation || "",
          rawSummary: aiData.rawSummary || "",
        },
      },
      { upsert: true, new: true },
    );

    await sendWeeklySummaryToSlack(summary);

    return summary;
  } catch (error) {
    console.log("Weekly summary error:", error.message);
    return null;
  }
};

const sendWeeklySummaryToSlack = async (summary) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `📊 Weekly Summary — ${summary.weekStart} to ${summary.weekEnd}`,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Total Standups*\n${summary.totalStandups}` },
        { type: "mrkdwn", text: `*Total Blockers*\n${summary.totalBlockers}` },
        {
          type: "mrkdwn",
          text: `*Most Active*\n${summary.mostActive || "N/A"}`,
        },
        {
          type: "mrkdwn",
          text: `*Most Blocked*\n${summary.mostBlocked || "N/A"}`,
        },
      ],
    },
    { type: "divider" },
  ];

  if (summary.rawSummary) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*📝 Week Overview*\n${summary.rawSummary}`,
      },
    });
  }

  if (summary.criticalIssues.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🚨 Critical Issues*\n${summary.criticalIssues.map((i) => `→ ${i}`).join("\n")}`,
      },
    });
  }

  if (summary.wins.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*✅ Wins This Week*\n${summary.wins.map((w) => `→ ${w}`).join("\n")}`,
      },
    });
  }

  if (summary.aiRecommendation) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🤖 AI Recommendation*\n${summary.aiRecommendation}`,
      },
    });
  }

  blocks.push({ type: "divider" });

  try {
    await axios.post(webhookUrl, { blocks });
    console.log("Weekly summary sent to Slack!");

    await WeeklySummary.findByIdAndUpdate(summary._id, { slackSent: true });
  } catch (error) {
    console.log("Slack weekly summary error:", error.message);
  }
};

export { generateWeeklySummary, sendWeeklySummaryToSlack };
