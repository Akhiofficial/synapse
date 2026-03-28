import { index as pineconeIndex } from '../../config/pinecone.js';

/**
 * Pinecone Vector Search Service
 * Queries the Pinecone index with a given embedding and returns matched IDs + scores.
 *
 * @param {number[]} embedding - The query vector (must match index dimensions)
 * @param {object}  options
 * @param {number}  options.topK           - Number of nearest neighbours to return (default: 5)
 * @param {boolean} options.includeMetadata - Whether to include Pinecone metadata in response (default: true)
 * @param {string}  options.excludeId      - An item ID to exclude from results (e.g. self-exclusion)
 * @returns {Promise<Array<{ id: string, score: number, metadata: object }>>}
 */

export const searchVectors = async (embedding, options = {}) => {
  const { topK = 5, includeMetadata = true, excludeId = null } = options;

  if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
    console.error('[VectorSearch] Invalid embedding provided — cannot query Pinecone.');
    throw new Error('A valid embedding array is required to search vectors.');
  }

  console.log(`[VectorSearch] Querying Pinecone | topK: ${topK} | excludeId: ${excludeId || 'none'}`);

  const response = await pineconeIndex.query({
    vector: embedding,
    topK: excludeId ? topK + 1 : topK, // fetch one extra so we can drop the excluded ID
    includeMetadata,
  });

  const rawMatches = response?.matches || [];
  console.log(`[VectorSearch] Pinecone returned ${rawMatches.length} raw match(es).`);

  // Filter out any excluded ID (e.g. the item queried for "related" lookup)
  const matches = excludeId
    ? rawMatches.filter(m => m.id !== excludeId)
    : rawMatches;

  // Remove duplicates by ID (safety net)
  const seen = new Set();
  const uniqueMatches = matches.filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  // Slice to the requested topK after filtering
  const finalMatches = uniqueMatches.slice(0, topK);

  console.log(`[VectorSearch] Returning ${finalMatches.length} match(es) after dedup/filter.`);

  return finalMatches.map(m => ({
    id: m.id,
    score: parseFloat((m.score ?? 0).toFixed(4)),
    metadata: m.metadata || {},
  }));
};
