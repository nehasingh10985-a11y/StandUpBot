import axios from "axios";

// ── New Standup ────────────────────────────
const sendToSlack = async (name, standup, aiSummary) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const severityEmoji = {
    critical: "🚨",
    moderate: "⚠️",
    watch: "👀",
    none: "✅",
  };
  const emoji = severityEmoji[aiSummary.severity] || "✅";

  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: `${emoji} Standup — ${name}` },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Yesterday*\n${standup.yesterday}` },
        { type: "mrkdwn", text: `*Today*\n${standup.today}` },
      ],
    },
  ];

  if (aiSummary.blockersDetected) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${emoji} Blocker — ${aiSummary.severity.toUpperCase()}*\n${standup.blockers}`,
      },
    });
    blocks.push({
      type: "context",
      elements: [
        { type: "mrkdwn", text: `*Action Needed:* ${aiSummary.actionNeeded}` },
      ],
    });
  }

  blocks.push({ type: "divider" });

  try {
    await axios.post(webhookUrl, { blocks });
    console.log(`Slack notification sent for ${name}`);
  } catch (error) {
    console.log("Slack error:", error.message);
  }
};

// ── Edit Notification ──────────────────────
const sendEditToSlack = async (name, standup, aiSummary) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const severityEmoji = {
    critical: "🚨",
    moderate: "⚠️",
    watch: "👀",
    none: "✅",
  };
  const emoji = severityEmoji[aiSummary.severity] || "✅";

  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: `✏️ Standup Edited — ${name}` },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Yesterday*\n${standup.yesterday}` },
        { type: "mrkdwn", text: `*Today*\n${standup.today}` },
      ],
    },
  ];

  if (standup.blockers && standup.blockers.trim() !== "") {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${emoji} Blocker — ${aiSummary.severity?.toUpperCase()}*\n${standup.blockers}`,
      },
    });
    if (aiSummary.actionNeeded) {
      blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Action Needed:* ${aiSummary.actionNeeded}`,
          },
        ],
      });
    }
  }

  // What changed
  if (standup.previousData) {
    const changes = [];
    if (standup.previousData.yesterday !== standup.yesterday)
      changes.push("Yesterday updated");
    if (standup.previousData.today !== standup.today)
      changes.push("Today updated");
    if (standup.previousData.blockers !== standup.blockers)
      changes.push("Blockers updated");

    if (changes.length > 0) {
      blocks.push({
        type: "context",
        elements: [
          { type: "mrkdwn", text: `*Changes:* ${changes.join(" · ")}` },
        ],
      });
    }
  }

  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: `_Edited by ${name}_` }],
  });

  blocks.push({ type: "divider" });

  try {
    await axios.post(webhookUrl, { blocks });
    console.log(`Slack edit notification sent for ${name}`);
  } catch (error) {
    console.log("Slack edit error:", error.message);
  }
};

// ── Delete Notification ────────────────────
const sendDeleteToSlack = async (name, standup) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: `🗑️ Standup Deleted — ${name}` },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Yesterday*\n${standup.yesterday}` },
        { type: "mrkdwn", text: `*Today*\n${standup.today}` },
      ],
    },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: `_Deleted by ${name}_` }],
    },
    { type: "divider" },
  ];

  try {
    await axios.post(webhookUrl, { blocks });
    console.log(`Slack delete notification sent for ${name}`);
  } catch (error) {
    console.log("Slack delete error:", error.message);
  }
};

export { sendToSlack, sendEditToSlack, sendDeleteToSlack };
