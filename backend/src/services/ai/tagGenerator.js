import { aiProvider } from "./aiProvider.js";

/**
 * Real AI tag generator service with load balancing and failover.
 */
export const generateTags = async (content) => {
  const prompt = `Generate 5 relevant tags for the following content. Return ONLY a single array of strings like ["tag1", "tag2"]. Content: ${content.substring(0, 5000)}`;

  try {
    console.log(`[AI:Tags] Delegating to aiProvider...`);
    const startTime = Date.now();

    const text = await aiProvider.generateContent({
      prompt,
      responseMimeType: "text/plain"
    });

    const endTime = Date.now();
    console.log(`[AI:Tags] Completed in ${endTime - startTime}ms`);

    // Parse tags from common formats (e.g., "[tag1, tag2]" or "tag1, tag2")
    const parsedTags = text.replace(/[\[\]'"]/g, '').split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    if (parsedTags.length > 0) {
      return parsedTags.slice(0, 5);
    }

    return ["Uncategorized"];
  } catch (error) {
    console.error(`[AI:Tags] Error:`, error.message);
    return ["AI-Processing-Fail"];
  }
};
