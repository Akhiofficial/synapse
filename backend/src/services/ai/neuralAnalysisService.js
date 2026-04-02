import { aiProvider } from "./aiProvider.js";

/**
 * Consolidates all generative tasks (Title, Tags, Summary, Topic, Breakdown) into a single call.
 * Uses the global load-balancing aiProvider.
 */
export const analyzeNeuralContent = async (content, url, type, imageData = null) => {
  const prompt = `
    Analyze the following digital capture and provide a structured JSON response.
    
    SPECIAL INSTRUCTION: 
    - If the Content Snippet indicates a "404", do NOT repeat the error. Use URL context to infer.
    - ${imageData ? "ANALYZE THE ATTACHED IMAGE. Provide a deep visual narrative of its contents, style, and meaning." : "Analyze the text provided below."}

    CONTEXT:
    - URL: ${url || "N/A"}
    - Type: ${type}
    - Content Snippet: ${content.substring(0, 5000)}

    JSON STRUCTURE:
    {
      "title": "A concise, high-quality title (MAX 6 WORDS). ${imageData ? "Describe the image subject." : "Based on content."}",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "summary": "2-3 insightful sentences. ${imageData ? "Explain what the image depicts." : "Synthesize the core meaning."}",
      "topic": "A single category name for high-level clustering (e.g. AI, DevOps, Science, Lifestyle).",
      "breakdown": "A 3-paragraph conceptual breakdown. ${imageData ? "1. Visual Components, 2. Artistic/Technical Style, 3. Contextual Significance." : "1. Objectives, 2. Key Insights, 3. Implications."}"
    }

    IMPORTANT: Return ONLY valid JSON.
  `;

  try {
    console.log(`[AI:Analysis] Delegating to aiProvider... ${imageData ? "(Vision Mode)" : "(Text Mode)"}`);
    const startTime = Date.now();
    
    let responseText = await aiProvider.generateContent({
      prompt,
      imageData,
      responseMimeType: "application/json"
    });

    // Robust cleaning for JSON
    responseText = responseText.replace(/```json\n?|```/g, "").trim();
    const data = JSON.parse(responseText);

    console.log(`[AI:Analysis] Completed in ${Date.now() - startTime}ms`);
    return data;
  } catch (error) {
    console.error(`[AI:Analysis] Fatal Error:`, error.message);
    throw new Error(`AI Analysis failed despite multiple failovers: ${error.message}`);
  }
};
