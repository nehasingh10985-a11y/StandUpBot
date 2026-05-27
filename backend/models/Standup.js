import mongoose from "mongoose";

const standupSchema = new mongoose.Schema(
  {
    // ← Yeh dono add karo
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    teamName: { type: String, default: "" },

    name: { type: String, required: true },
    role: { type: String, default: "" },
    yesterday: { type: String, required: true },
    today: { type: String, required: true },
    blockers: { type: String, default: "" },

    previousData: {
      yesterday: { type: String, default: "" },
      today: { type: String, default: "" },
      blockers: { type: String, default: "" },
    },

    aiSummary: {
      blockersDetected: { type: Boolean, default: false },
      severity: {
        type: String,
        enum: ["critical", "moderate", "watch", "none"],
        default: "none",
      },
      extractedBlockers: [{ type: String }],
      actionNeeded: { type: String, default: "" },
      summary: { type: String, default: "" },
    },

    isEdited: { type: Boolean, default: false },
    slackSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Standup = mongoose.model("Standup", standupSchema);
export default Standup;
