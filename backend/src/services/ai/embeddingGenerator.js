import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Gemini API Key Prefix:", process.env.GEMINI_API_KEY?.slice(0, 5));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Real Gemini embedding generator service (3072 dimensions) with strict rate limiting and logging.
 */
export const generateEmbedding = async (text, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
      console.log(`[Gemini:Embedding] Attempt ${attempt}/${retries} for content: ${text.substring(0, 20)}...`);
    try {
      // Step 4: Strict delay between API calls (15 seconds)
      console.log(`[Gemini:Embedding] Waiting 15s for rate limit pacing...`);
      await sleep(15000);

      console.log(`[Gemini:Embedding] Request started (Attempt ${attempt})`);
      const startTime = Date.now();

      const result = await model.embedContent(text);

      const endTime = Date.now();
      console.log(`[Gemini:Embedding] Request completed in ${endTime - startTime}ms`);
      console.log(`[Gemini:Embedding] Success on attempt ${attempt}`);

      return result.embedding.values;
    } catch (error) {
      console.error(`[Gemini:Embedding] Error on attempt ${attempt}:`, error);
      console.log(`[Gemini:Embedding] Error on attempt ${attempt}: ${error.message}`);

      // Step 8: Pause for 60s on 429
      if (error.status === 429) {
        console.log("[Gemini:Embedding] Rate limit (429) hit, waiting 60s...");
        console.log(`[Gemini:Embedding] 429 detected, pausing 60s`);
        await sleep(60000);
      }

      if (attempt < retries) {
        console.log(`[Gemini:Embedding] Retrying...`);
        continue;
      }

      // Step 1: No fallback logic as per goal
      throw error;
    }
  }
};
