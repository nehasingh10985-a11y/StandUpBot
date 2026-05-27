import mongoose from "mongoose";

const weeklySummarySchema = new mongoose.Schema(
  {
    weekStart: { type: String, required: true },
    weekEnd: { type: String, required: true },
    totalStandups: { type: Number, default: 0 },
    totalBlockers: { type: Number, default: 0 },
    mostActive: { type: String, default: "" },
    mostBlocked: { type: String, default: "" },
    criticalIssues: [{ type: String }],
    wins: [{ type: String }],
    aiRecommendation: { type: String, default: "" },
    rawSummary: { type: String, default: "" },
    slackSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const WeeklySummary = mongoose.model("WeeklySummary", weeklySummarySchema);
export default WeeklySummary;
 