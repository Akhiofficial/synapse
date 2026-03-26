/**
 * Mock tag generator service.
 * Suggests tags based on keywords in content.
 */
export const generateTags = async (content) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const contentLower = content.toLowerCase();
  const commonTags = ['tech', 'productivity', 'learning', 'coding', 'health', 'finance', 'news'];
  
  // Simple keyword matching
  const suggestedTags = commonTags.filter(tag => contentLower.includes(tag));
  
  // Add some generic tags if no keywords found
  if (suggestedTags.length === 0) {
    suggestedTags.push('general');
  }

  return suggestedTags;
};
