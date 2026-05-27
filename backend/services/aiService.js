import Groq from "groq-sdk";

const analyzeStandup = async (yesterday, today, blockers) => {
  // Groq client andar banao
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  if (!blockers || blockers.trim() === "") {
    return {
      blockersDetected: false,
      severity: "none",
      extractedBlockers: [],
      actionNeeded: "",
      summary: today,
    };
  }

  const prompt = `
You are an agile project manager. Analyze this standup entry.
Return ONLY a valid JSON object. No explanation. No markdown. Just JSON.

Standup:
- Yesterday: ${yesterday}
- Today: ${today}
- Blockers: ${blockers}

Return exactly this JSON:
{
  "blockersDetected": true or false,
  "severity": "critical" or "moderate" or "watch" or "none",
  "extractedBlockers": ["blocker 1", "blocker 2"],
  "actionNeeded": "one line what manager should do",
  "summary": "one line summary of this person update"
}

Severity rules:
- critical  → blocks all work, needs action today
- moderate  → slows work, needs action in 24 hours
- watch     → minor issue, just keep an eye
- none      → no blocker
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const rawText = response.choices[0].message.content;
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.log("Groq API error:", error.message);
    return {
      blockersDetected: true,
      severity: "watch",
      extractedBlockers: [blockers],
      actionNeeded: "Review blocker manually",
      summary: today,
    };
  }
};

export default analyzeStandup;
