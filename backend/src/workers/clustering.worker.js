import { queueManager } from './queue.js';
import Item from '../models/Item.js';
import { clusterItems } from '../services/ai/clusteringService.js';

/**
 * Worker to handle item clustering.
 */
export const initClusteringWorker = () => {
  queueManager.on('process:clustering', async (data) => {
    try {
      console.log(`[Worker:Clustering] Running periodic clustering update...`);
      
      // Fetch all items with embeddings
      const items = await Item.find({ embedding: { $ne: [] } });
      const clusters = await clusterItems(items);
      
      console.log(`[Worker:Clustering] Found ${clusters.length} clusters`);
      // In a real app, we'd store these clusters in a collection
      // For now, we just log the result

    } catch (error) {
      console.error(`[Worker:Clustering] Error in clustering worker:`, error);
    } finally {
      queueManager.completeJob('clustering');
    }
  });
};
