import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Real Gemini summary generator service with strict rate limiting.
 */
export const generateSummary = async (content, maxRetries = 2) => {
  // If we have a very short content (like just a title), we still want to synthesize it
  const prompt = `Synthesize the following content (which may be a title or URL) into exactly 2-3 concise, insightful sentences. 
  IMPORTANT: Focus ONLY on the provided topic. Do NOT hallucinate information from other sources like Andrew Ng or common deep learning courses.
  If the content is about Docker or AWS, analyze ONLY Docker or AWS.
  Content: ${content}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Mandatory Delay for Rate Control
    console.log(`[Gemini:Summary] Waiting 5s for rate limit pacing...`);
    await sleep(5000);

    try {
      console.log(`[Gemini:Summary] Request started (Attempt ${attempt})`);
      const startTime = Date.now();

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const endTime = Date.now();
      console.log(`[Gemini:Summary] Summary generated in ${endTime - startTime}ms`);
      
      return text.trim();
    } catch (error) {
      console.error(`[Gemini:Summary] Error on attempt ${attempt}:`, error);

      if (error.status === 429) {
        console.log("[Gemini:Summary] Rate limit hit, waiting 30s...");
        await sleep(30000);
      }

      if (attempt < maxRetries) {
        console.log(`[Gemini:Summary] Retrying...`);
        continue;
      }
      
      return "Synthesis unavailable due to neural network congestion.";
    }
  }
};

/**
 * Generates a more detailed breakdown specifically for highlighting.
 */
export const generateDetailedBreakdown = async (content, maxRetries = 2) => {
  if (!content) return "";

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });

  const prompt = `Based on the following content (which may be a title/URL), generate a 3-paragraph "Neural Narrative". 
  If the content is a title, analyze the specific topic mentioned in that title (e.g. AWS, Docker, SpaceX). 
  Do NOT hallucinate famous unrelated researchers like Andrew Ng unless they are in the content. 
  Focus on: 1. Main Objectives, 2. Key Insights/Takeaways, 3. Potential Implications. 
  Maintain a professional tone. Content: ${content}`;

  try {
    await sleep(2000); // Small delay for rate pacing
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('[Gemini:Breakdown] Error:', error);
    return content; // Fallback to original content
  }
};

/**
 * Generates a concise, catchy title (4-7 words) based on URL and content.
 */
export const generateTitle = async (url, content, maxRetries = 2) => {
  const prompt = `Based on this URL (${url}) and content snippet, generate a high-quality, concise title (MAX 6 WORDS). Do NOT use generic prefixes like "YouTube Video:". Return ONLY the title string. Content: ${content?.slice(0, 500)}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    await sleep(2000);
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const title = response.text().trim().replace(/[*"']/g, '');
      return title || "New Synaptic Capture";
    } catch (error) {
      if (attempt === maxRetries) return "Untitled Brain Capture";
      await sleep(5000);
    }
  }
};
