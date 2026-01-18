import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export type ExpertiseLevel = "junior" | "senior" | "intern";

export interface AnalysisResult {
  whatWentWrong: string;
  howToFix: string[];
  preventionTips: string[];
  tldr: string;
}

export async function analyzeError(
  errorLog: string,
  localEnv: string,
  prodEnv: string,
  expertiseLevel: ExpertiseLevel
): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const expertisePrompts: Record<ExpertiseLevel, string> = {
    junior:
      "Explain in a friendly, educational way with analogies. Assume they know basic programming but might not understand infrastructure deeply. Be encouraging.",
    senior:
      "Be concise and technical. Skip the basics, focus on edge cases, root causes, and advanced debugging strategies. No hand-holding needed.",
    intern:
      "Explain like they just mass-applied to 500 jobs and somehow got this one. Use humor, Gen-Z references, and be very patient. Assume they've been mass console.log() debugging and crying. Make it funny but helpful.",
  };

  const prompt = `You are an expert developer debugging assistant called "It Works Locally". A developer's code works on their local machine but fails in production. Your job is to analyze and help.

**Error/Logs Provided:**
${errorLog}

**Local Environment Details:**
${localEnv || "Not provided - make reasonable assumptions"}

**Production Environment Details:**
${prodEnv || "Not provided - make reasonable assumptions"}

**Communication Style:**
${expertisePrompts[expertiseLevel]}

Analyze this situation and respond in this EXACT JSON format (no markdown code blocks, just pure valid JSON):

{
  "whatWentWrong": "A clear explanation of the root cause in 2-4 sentences. Be specific about WHY it works locally but fails in prod.",
  "howToFix": ["Step 1: Specific actionable fix", "Step 2: Another step if needed", "Step 3: Verification step"],
  "preventionTips": ["Tip 1: How to prevent this in future", "Tip 2: Best practice", "Tip 3: Tool or process recommendation"],
  "tldr": "One witty sentence summarizing the issue - make it memorable"
}

Important:
- Be accurate and helpful
- Match the tone to the expertise level
- If the error is ambiguous, provide the MOST LIKELY cause based on common patterns
- Make the tldr punchy and shareable
- Ensure valid JSON output`;

  try {
    console.log("Calling Gemini API...");
    const result = await model.generateContent(prompt);
    console.log("Got result from Gemini");
    const response = await result.response;
    console.log("Got response object");
    const text = response.text();
    console.log("Raw response text:", text);

    // Clean the response - remove markdown code blocks if present
    const cleanedText = text
      .replace(/```json?/gi, "")
      .replace(/```?/g, "")
      .trim();
    
    console.log("Cleaned text:", cleanedText);

    const parsed = JSON.parse(cleanedText);

    return {
      whatWentWrong:
        parsed.whatWentWrong || "Unable to determine the exact cause.",
      howToFix: Array.isArray(parsed.howToFix)
        ? parsed.howToFix
        : ["Review your environment configurations"],
      preventionTips: Array.isArray(parsed.preventionTips)
        ? parsed.preventionTips
        : ["Always test in a staging environment first"],
      tldr:
        parsed.tldr ||
        "Something's different between your local setup and production.",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error(
      `Failed to analyze the error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
