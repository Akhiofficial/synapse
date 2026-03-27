import { PDFParse } from 'pdf-parse';

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

export const extractYouTube = (url) => {
  // Basic title extraction from URL for now
  const title = `YouTube Video: ${url}`;
  return {
    title,
    content: `Video Link: ${url}. (Automatically processed from YouTube)`
  };
};

export const extractImage = (file) => {
  if (!file) throw new Error('No image file provided');
  return {
    title: `Image: ${file.originalname}`,
    content: `Image metadata extraction: Filename: ${file.originalname}, Size: ${file.size} bytes.`
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
