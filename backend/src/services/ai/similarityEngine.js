/**
 * Similarity engine service.
 * Performs cosine similarity between vectors.
 */

/**
 * Calculates cosine similarity between two vectors.
 * Returns a score between -1 and 1 (usually 0 to 1 for embeddings).
 */
export const calculateSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let mA = 0;
  let mB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += (vecA[i] * vecB[i]);
    mA += (vecA[i] * vecA[i]);
    mB += (vecB[i] * vecB[i]);
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);

  if (mA === 0 || mB === 0) return 0;

  const similarity = dotProduct / (mA * mB);
  return similarity;
};

/**
 * Finds top-N most similar items based on vector similarity.
 */
export const findNearestItems = (targetVec, items, limit = 5) => {
  const scoredItems = items
    .map(item => ({
      ...item.toObject ? item.toObject() : item,
      similarity: calculateSimilarity(targetVec, item.embedding)
    }))
    .filter(item => item.similarity > 0.3) // threshold
    .sort((a, b) => b.similarity - a.similarity);

  return scoredItems.slice(0, limit);
};
