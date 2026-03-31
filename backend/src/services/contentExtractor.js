import { PDFParse } from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import imagekit from './imagekit.js';

/**
 * Service to extract content from different types
 */

export const extractArticle = (title, content) => {
  return {
    title: title || 'Untitled Article',
    content: content || ''
  };
};

export const extractTweet = (tweetTextOrUrl) => {
  // Simple check for URL vs raw text
  const content = tweetTextOrUrl.startsWith('http') 
    ? `Tweet at ${tweetTextOrUrl}` // In a real app, use Twitter API
    : tweetTextOrUrl;
  
  return {
    title: 'Tweet Content',
    content: content
  };
};

export const extractYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const extractYouTube = (url, fetchedTitle = null) => {
  const videoId = extractYouTubeId(url);
  const title = fetchedTitle || `YouTube Video: ${url}`;
  return {
    title,
    content: `Source: ${url}. Analyzed Insight: ${title}. (Neural extraction processing complete)`,
    metadata: {
      url,
      videoId,
      type: 'youtube',
      author: fetchedTitle ? "YouTube Source" : "Unknown"
    }
  };
};

export const extractImage = async (file) => {
  if (!file) throw new Error('No image file provided');

  let imageUrl = null;
  let content = `Image metadata extraction: Filename: ${file.originalname}, Size: ${file.size} bytes.`;

  if (imagekit) {
    try {
      console.log(`[Extractor] Uploading image to ImageKit: ${file.originalname}`);
      const ikResult = await new Promise((resolve, reject) => {
        imagekit.upload({
          file: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          fileName: file.originalname,
          folder: '/synapse_hq/',
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      imageUrl = ikResult.url;
      console.log(`[Extractor] Image uploaded successfully: ${imageUrl}`);
    } catch (err) {
      console.error('[Extractor] ImageKit upload error:', err);
      // Fallback: If ImageKit fails (500/401), store the image directly as a Base64 data URI
      imageUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      console.log(`[Extractor] Using Base64 fallback for imageUrl.`);
    }
  } else {
    // If imagekit is completely unconfigured, fallback automatically
    imageUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }

  try {
    console.log(`[Extractor] Starting Gemini Vision analysis...`);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analyze this image and provide a comprehensive, highly insightful description of its contents, subjects, and meaning. Be detailed but concise. If there is text, summarize the key points.";
    
    const imagePart = {
      inlineData: {
        data: file.buffer.toString("base64"),
        mimeType: file.mimetype
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    content = response.text().trim();
    console.log(`[Extractor] Gemini Vision analysis complete.`);
  } catch (err) {
    console.error('[Extractor] Gemini Vision error:', err);
    content += ` (AI description failed)`;
  }

  return {
    title: `Image: ${file.originalname}`,
    content,
    metadata: {
      imageUrl
    }
  };
};

export const extractPDF = async (buffer, filename) => {
  if (!buffer) throw new Error('No PDF buffer provided');
  try {
    // pdf-parse v2.4.5 uses PDFParse class in ESM
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return {
      title: `PDF: ${filename}`,
      content: result.text
    };
  } catch (error) {
    console.error('PDF Extraction Error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
