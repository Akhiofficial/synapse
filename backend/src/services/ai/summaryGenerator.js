import { aiProvider } from "./aiProvider.js";

/**
 * AI summary generator service with load balancing.
 */
export const generateSummary = async (content) => {
  const prompt = `Synthesize the following content (which may be a title or URL) into exactly 2-3 concise, insightful sentences. 
  IMPORTANT: Focus ONLY on the provided topic. Do NOT hallucinate information from other sources.
  Content: ${content.substring(0, 5000)}`;

  try {
    console.log(`[AI:Summary] Delegating to aiProvider...`);
    const startTime = Date.now();

    const text = await aiProvider.generateContent({
      prompt,
      responseMimeType: "text/plain"
    });

    const endTime = Date.now();
    console.log(`[AI:Summary] Summary generated in ${endTime - startTime}ms`);
    
    return text.trim();
  } catch (error) {
    console.error(`[AI:Summary] Error:`, error.message);
    return "Synthesis unavailable due to neural network congestion.";
  }
};

/**
 * Generates a more detailed breakdown specifically for highlighting.
 */
export const generateDetailedBreakdown = async (content) => {
  if (!content) return "";

  const prompt = `Based on the following content (which may be a title/URL), generate a 3-paragraph "Neural Narrative". 
  Focus on: 1. Main Objectives, 2. Key Insights/Takeaways, 3. Potential Implications. 
  Maintain a professional tone. Content: ${content.substring(0, 3000)}`;

  try {
    console.log(`[AI:Breakdown] Delegating to aiProvider...`);
    return await aiProvider.generateContent({
      prompt,
      responseMimeType: "text/plain"
    });
  } catch (error) {
    console.error('[AI:Breakdown] Error:', error.message);
    return content; // Fallback to original content
  }
};

/**
 * Generates a concise, catchy title (4-7 words) based on URL and content.
 */
export const generateTitle = async (url, content) => {
  const prompt = `Based on this URL (${url}) and content snippet, generate a high-quality, concise title (MAX 6 WORDS). Do NOT use generic prefixes like "YouTube Video:". Return ONLY the title string. Content: ${content?.slice(0, 1000)}`;

  try {
    console.log(`[AI:Title] Delegating to aiProvider...`);
    const title = await aiProvider.generateContent({
      prompt,
      responseMimeType: "text/plain"
    });
    return title.trim().replace(/[*"']/g, '') || "New Synaptic Capture";
  } catch (error) {
    console.error('[AI:Title] Error:', error.message);
    return "Untitled Brain Capture";
  }
};
