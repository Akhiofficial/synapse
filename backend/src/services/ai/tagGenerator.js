import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Gemini API Key Prefix:", process.env.GEMINI_API_KEY?.slice(0, 5));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Real Gemini tag generator service with strict rate limiting and logging.
 */
export const generateTags = async (content, maxRetries = 2) => {
  const prompt = `Generate 5 relevant tags for the following content. Return ONLY a single array of strings like ["tag1", "tag2"]. Content: ${content}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Step 1: Mandatory Delay for Rate Control (15s)
    console.log(`[Gemini:Tags] Waiting 15s for rate limit pacing...`);
    await sleep(15000);

    try {
      console.log(`[Gemini:Tags] Request started (Attempt ${attempt})`);
      const startTime = Date.now();

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const endTime = Date.now();
      console.log(`[Gemini:Tags] Request completed in ${endTime - startTime}ms`);
      console.log(`[Gemini:Tags] API response text:`, text);

      // Parse tags from common formats (e.g., "[tag1, tag2]" or "tag1, tag2")
      const parsedTags = text.replace(/[\[\]'"]/g, '').split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (parsedTags.length > 0) {
        return parsedTags;
      }

      throw new Error("Invalid response format - No valid tags found");
    } catch (error) {
      console.error(`[Gemini:Tags] Error on attempt ${attempt}:`, error);

      if (error.status === 429) {
        console.log("[Gemini:Tags] Rate limit (429) hit, waiting 60s...");
        await sleep(60000);
      }

      if (attempt < maxRetries) {
        console.log(`[Gemini:Tags] Retrying...`);
        continue;
      }

      // Step 1: No fallback logic as per goal
      throw error;
    }
  }
};
