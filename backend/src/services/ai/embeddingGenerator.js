/**
 * Mock embedding generator service.
 * Converts content into a 128-dimensional vector (simulated).
 */
export const generateEmbedding = async (content) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Generate a deterministic vector based on content string hash
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const vector = [];
  for (let i = 0; i < 128; i++) {
    // Deterministic random-like values between -1 and 1
    const value = Math.sin(hash + i) * Math.cos(hash * (i + 1));
    vector.push(parseFloat(value.toFixed(4)));
  }

  return vector;
};
