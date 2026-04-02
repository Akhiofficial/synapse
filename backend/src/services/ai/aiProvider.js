import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

/**
 * Robust AI Provider with Dynamic Load Balancing and Failover.
 * Supports Gemini, Mistral, and OpenRouter.
 */
class AIProvider {
  constructor() {
    this.initialized = false;
    this.providers = {};
  }

  _ensureInitialized() {
    if (this.initialized) return;

    this.providers = {
      gemini: {
        key: process.env.GEMINI_API_KEY,
        healthy: true,
        coolDownUntil: 0,
        type: "gemini",
        models: ["gemini-1.5-flash", "gemini-1.5-pro"]
      },
      mistral: {
        key: process.env.MISTRAL_KEY,
        healthy: true,
        coolDownUntil: 0,
        type: "mistral",
        models: ["mistral-small-latest", "mistral-medium-latest"]
      },
      openrouter: {
        key: process.env.QWEN_API_KEY,
        healthy: true,
        coolDownUntil: 0,
        type: "openrouter",
        models: ["qwen/qwen-plus", "google/gemini-2.0-flash-001"]
      }
    };

    this.genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
    this.initialized = true;
  }

  /**
   * Selects a random healthy provider.
   */
  getHealthyProvider() {
    this._ensureInitialized();
    const now = Date.now();
    const healthyOnes = Object.values(this.providers).filter(p => p.key && p.healthy && p.coolDownUntil < now);
    
    if (healthyOnes.length === 0) {
      console.warn("[AI:Provider] No healthy providers found. Resetting cooldowns...");
      Object.values(this.providers).forEach(p => p.coolDownUntil = 0);
      return Object.values(this.providers).find(p => p.key); // Try any with a key
    }
    
    // Sort by "priority" (Gemini is free, so prioritize it if available, otherwise randomize)
    const gemini = healthyOnes.find(p => p.type === "gemini");
    if (gemini && Math.random() > 0.3) return gemini; // 70% chance to pick Gemini if healthy
    
    return healthyOnes[Math.floor(Math.random() * healthyOnes.length)];
  }

  markUnhealthy(providerType, errorCode) {
    const p = this.providers[providerType];
    if (!p) return;

    p.healthy = true; // Still keep it in the loop but with a cooldown
    let duration = 60000; // Default 1 minute

    if (errorCode === 402) {
      console.error(`[AI:Provider] Provider ${providerType} out of credits (402). 1 hour cooldown.`);
      duration = 3600000; // 1 hour
    } else if (errorCode === 429) {
      console.warn(`[AI:Provider] Provider ${providerType} rate limited (429). 2 minute cooldown.`);
      duration = 120000; // 2 minutes
    } else {
      console.warn(`[AI:Provider] Provider ${providerType} failed with error ${errorCode}. 1 minute cooldown.`);
    }

    p.coolDownUntil = Date.now() + duration;
  }

  async generateContent(options) {
    const { prompt, imageData, responseMimeType = "text/plain", systemInstruction = "" } = options;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const provider = this.getHealthyProvider();
      if (!provider) throw new Error("No AI providers configured in .env");

      try {
        console.log(`[AI:Provider] Using ${provider.type} (Attempt ${attempts + 1})`);
        const result = await this.executeRequest(provider, options);
        return result;
      } catch (error) {
        attempts++;
        const status = error.response?.status || error.status || 500;
        this.markUnhealthy(provider.type, status);
        
        if (attempts >= maxAttempts) {
          throw new Error(`AI processing failed after ${maxAttempts} attempts across multiple providers: ${error.message}`);
        }
        
        console.log(`[AI:Provider] Retrying with different provider...`);
      }
    }
  }

  async executeRequest(provider, options) {
    const { prompt, imageData, responseMimeType } = options;

    if (provider.type === "gemini") {
      const model = this.genAI.getGenerativeModel({ model: provider.models[0] });
      const payload = imageData 
        ? [prompt, { inlineData: { data: imageData.imageBuffer, mimeType: imageData.mimeType } }]
        : [prompt];
      
      const result = await model.generateContent(payload);
      return result.response.text();
    }

    if (provider.type === "mistral") {
      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model: provider.models[0],
          messages: [{ role: "user", content: prompt }],
          response_format: responseMimeType === "application/json" ? { type: "json_object" } : undefined
        },
        {
          headers: { "Authorization": `Bearer ${provider.key}`, "Content-Type": "application/json" },
          timeout: 15000
        }
      );
      return response.data.choices[0].message.content;
    }

    if (provider.type === "openrouter") {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: provider.models[0],
          messages: [{ role: "user", content: prompt }],
          response_format: responseMimeType === "application/json" ? { type: "json_object" } : undefined
        },
        {
          headers: {
            "Authorization": `Bearer ${provider.key}`,
            "Content-Type": "application/json",
            "X-Title": "Synapse AI Brain"
          },
          timeout: 20000
        }
      );
      return response.data.choices[0].message.content;
    }
  }
}

export const aiProvider = new AIProvider();
