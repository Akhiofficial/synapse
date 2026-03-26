import { queueManager } from './queue.js';
import { generateEmbedding } from '../services/ai/embeddingGenerator.js';
import { generateTags } from '../services/ai/tagGenerator.js';
import Item from '../models/Item.js';

/**
 * Worker to process embeddings and tags for saved items.
 */
export const initEmbeddingWorker = () => {
  queueManager.on('process:embedding', async (data) => {
    const { itemId } = data;
    
    try {
      console.log(`[Worker:Embedding] Processing item ${itemId}`);
      const item = await Item.findById(itemId);
      
      if (!item) {
        console.error(`[Worker:Embedding] Item ${itemId} not found`);
        return;
      }

      // 1. Generate Tags
      const tags = await generateTags(item.content);
      item.tags = [...new Set([...item.tags, ...tags])];

      // 2. Generate Embedding
      const embedding = await generateEmbedding(item.content);
      item.embedding = embedding;

      await item.save();
      console.log(`[Worker:Embedding] Completed processing item ${itemId}`);
      
      // Trigger cluster and graph updates after embedding is ready
      queueManager.addJob('clustering', { itemId });
      queueManager.addJob('graph', { itemId });

    } catch (error) {
      console.error(`[Worker:Embedding] Error processing item ${itemId}:`, error);
    } finally {
      queueManager.completeJob('embedding');
    }
  });
};
