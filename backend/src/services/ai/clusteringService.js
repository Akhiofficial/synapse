import Item from '../../models/Item.js';
import { calculateSimilarity } from './similarityEngine.js';

/**
 * Runs the topic clustering algorithm on all items in the database.
 * Groups items by semantic similarity and updates their 'topic' field.
 */
export const runTopicClustering = async () => {
  try {
    console.log('[AI:Clustering] Starting topic clustering process...');
    
    // 1. Fetch all items that have embeddings
    const items = await Item.find({ embedding: { $exists: true, $not: { $size: 0 } } });
    
    if (items.length === 0) {
      console.log('[AI:Clustering] No items with embeddings found.');
      return;
    }

    const clusters = [];
    const processedIds = new Set();
    const SIMILARITY_THRESHOLD = 0.8;

    // 2. Clustering logic (O(n^2) - simple version)
    for (let i = 0; i < items.length; i++) {
      const itemA = items[i];
      if (processedIds.has(itemA._id.toString())) continue;

      const currentCluster = [itemA];
      processedIds.add(itemA._id.toString());

      for (let j = i + 1; j < items.length; j++) {
        const itemB = items[j];
        if (processedIds.has(itemB._id.toString())) continue;

        const similarity = calculateSimilarity(itemA.embedding, itemB.embedding);
        
        if (similarity > SIMILARITY_THRESHOLD) {
          currentCluster.push(itemB);
          processedIds.add(itemB._id.toString());
        }
      }

      clusters.push(currentCluster);
    }

    console.log(`[AI:Clustering] Formed ${clusters.length} clusters from ${items.length} items.`);

    // 3. Assign topics and update DB
    for (const cluster of clusters) {
      // Find the most common tag in the cluster
      const allTags = cluster.flatMap(item => item.tags || []);
      
      let topic = 'General';
      if (allTags.length > 0) {
        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {});
        
        topic = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
      } else if (cluster.length > 0) {
         // Fallback to title keywords or just stay uncategorized if no tags
         topic = 'Uncategorized';
      }

      // Update all items in this cluster with the chosen topic
      const clusterIds = cluster.map(item => item._id);
      await Item.updateMany(
        { _id: { $in: clusterIds } },
        { $set: { topic: topic } }
      );
    }

    console.log('[AI:Clustering] Topic clustering completed successfully.');
    return { success: true, clusterCount: clusters.length };

  } catch (error) {
    console.error('[AI:Clustering] Error during clustering:', error);
    throw error;
  }
};

/**
 * Legacy mocked export - kept for compatibility if needed elsewhere
 */
export const clusterItems = async (items) => {
  if (items.length < 2) return [];
  // For now, reuse the internal logic or just return as is
  return []; 
};
