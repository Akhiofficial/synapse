import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ 
  model: "models/gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Consolidates all generative tasks (Title, Tags, Summary, Topic, Breakdown) into a single call.
 * Implements a failover strategy: Gemini (Primary) -> Qwen (Backup via OpenRouter).
 * Supports Multimodal interaction (Text + Image).
 */
export const analyzeNeuralContent = async (content, url, type, imageData = null, maxRetries = 2) => {
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
    console.log(`[Gemini:Analysis] Starting primary analysis (Gemini 1.5 Flash)... ${imageData ? "(Vision Mode)" : "(Text Mode)"}`);
    const startTime = Date.now();
    
    // Support multimodal: [prompt, {inlineData}]
    const inputPayload = imageData 
      ? [prompt, { inlineData: { data: imageData.imageBuffer, mimeType: imageData.mimeType } }]
      : [prompt];

    const result = await geminiModel.generateContent(inputPayload);
    let responseText = result.response.text();
    
    // Robust cleaning for JSON
    responseText = responseText.replace(/```json\n?|```/g, "").trim();
    const data = JSON.parse(responseText);

    console.log(`[Gemini:Analysis] Successfully completed in ${Date.now() - startTime}ms`);
    return data;
  } catch (error) {
    console.error(`[Gemini:Analysis] Primary model error:`, error.status || error.message);
    
    // Check if it's a transient 503 or a 429 quota/rate limit error
    if (error.status === 429 || error.status === 503 || error.message?.includes("503") || error.message?.includes("429")) {
      console.warn(`[Gemini:Analysis] Primary model hit limits or is unavailable. Failing over to Qwen (OpenRouter)...`);
      return await failoverToQwen(prompt);
    }
    
    // For other errors, we still try failover once as a safety measure
    console.warn(`[Gemini:Analysis] Unexpected error. Attempting failover to Qwen...`);
    return await failoverToQwen(prompt);
  }
};

/**
 * Failover to Qwen-Plus via OpenRouter.
 */
async function failoverToQwen(prompt) {
  if (!process.env.QWEN_API_KEY) {
    console.error(`[Qwen:Failover] QWEN_API_KEY is missing in .env. Analysis failed.`);
    throw new Error("AI Analysis unavailable - no secondary provider configured.");
  }

  try {
    console.log(`[Qwen:Failover] Requesting analysis from OpenRouter (qwen/qwen-plus)...`);
    const startTime = Date.now();

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen-plus",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.QWEN_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://synapse-second-brain.com", // Optional, but good practice for OpenRouter
          "X-Title": "Synapse AI Brain"
        },
        timeout: 30000
      }
    );

    const resultText = response.data.choices[0].message.content;
    const data = JSON.parse(resultText);

    console.log(`[Qwen:Failover] Successfully completed in ${Date.now() - startTime}ms`);
    return data;
  } catch (error) {
    console.error(`[Qwen:Failover] Failover model error:`, error.response?.data || error.message);
    throw new Error(`AI Analysis failed across all providers: ${error.message}`);
  }
}
