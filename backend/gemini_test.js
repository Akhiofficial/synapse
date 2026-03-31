import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });
    
    // Create a dummy transparent 1x1 png base64
    const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    
    const imagePart = {
      inlineData: {
        data: b64,
        mimeType: "image/png"
      }
    };
    
    const result = await model.generateContent(["Describe this image", imagePart]);
    const response = await result.response;
    console.log("SUCCESS:", response.text());
  } catch (err) {
    console.error("ERROR 1:", err.message);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const imagePart = { inlineData: { data: b64, mimeType: "image/png" } };
    const result = await model.generateContent(["Describe this image", imagePart]);
    console.log("SUCCESS 2:", await result.response.text());
  } catch (err) {
    console.error("ERROR 2:", err.message);
  }
}

test();
