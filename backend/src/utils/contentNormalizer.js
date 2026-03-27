/**
 * Utility to normalize content for AI processing
 */

export const normalizeContent = (input) => {
  if (typeof input !== 'string') {
    input = String(input || '');
  }

  // 1. Remove unnecessary whitespace
  let cleanText = input.replace(/\s+/g, ' ').trim();

  // 2. Limit length (2000-5000 characters)
  const maxLength = 5000;
  if (cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength) + '...';
  }

  return cleanText;
};
