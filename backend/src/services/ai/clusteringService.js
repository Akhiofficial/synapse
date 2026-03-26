/**
 * Mock clustering service.
 * Groups items based on tags and embeddings.
 */
import { calculateSimilarity } from './similarityEngine.js';

export const clusterItems = async (items) => {
  if (items.length < 2) return [];

  const clusters = [];
  const assigned = new Set();

  for (let i = 0; i < items.length; i++) {
    if (assigned.has(items[i]._id.toString())) continue;

    const currentCluster = [items[i]];
    assigned.add(items[i]._id.toString());

    for (let j = i + 1; j < items.length; j++) {
      if (assigned.has(items[j]._id.toString())) continue;

      const similarity = calculateSimilarity(items[i].embedding, items[j].embedding);
      
      // If similarity is above 0.7 or they share multiple tags, cluster them
      const commonTags = items[i].tags.filter(tag => items[j].tags.includes(tag));
      
      if (similarity > 0.7 || commonTags.length >= 2) {
        currentCluster.push(items[j]);
        assigned.add(items[j]._id.toString());
      }
    }

    if (currentCluster.length > 1) {
      clusters.push({
        id: `cluster-${clusters.length + 1}`,
        items: currentCluster.map(item => item._id),
        commonTags: [...new Set(currentCluster.flatMap(item => item.tags))].slice(0, 3)
      });
    }
  }

  return clusters;
};
