import { queueManager } from './queue.js';
import { generateEmbedding } from '../services/ai/embeddingGenerator.js';
import { generateTags } from '../services/ai/tagGenerator.js';
import Item from '../models/Item.js';
import { index as pineconeIndex } from '../config/pinecone.js';

/**
 * Worker to process embeddings and tags for saved items.
 */
export const initEmbeddingWorker = () => {
  queueManager.on('process:embedding', async (data) => {
    const { itemId } = data;
    
    try {
      console.log(`[Worker:Embedding] Processing item: ${itemId}`);
      const item = await Item.findById(itemId);
      
      if (!item) {
        console.error(`[Worker:Embedding] Item ${itemId} not found`);
        return;
      }

      // 1. Generate Tags
      try {
        console.log(`[Worker:Embedding] Generating tags for item: ${item._id}`);
        const tags = await generateTags(item.content);
        item.tags = [...new Set([...item.tags, ...tags])];
        await item.save(); // Save tags even if embedding fails later
        console.log(`[Worker:Embedding] Tags saved: ${item.tags.join(', ')}`);
      } catch (tagError) {
        console.error(`[Worker:Embedding] Tag generation failed: ${tagError.message}`);
      }

      // 2. Generate Embedding
      try {
        console.log(`[Worker:Embedding] Generating embedding for item: ${item._id}`);
        const embedding = await generateEmbedding(item.content);
        item.embedding = embedding;
        
        // 3. Store in Pinecone
        console.log(`[Worker:Embedding] Indexing in Pinecone...`);
        await pineconeIndex.upsert({
          records: [{
            id: item._id.toString(),
            values: embedding,
            metadata: {
              title: item.title,
              type: item.type,
              tags: item.tags.join(',')
            }
          }]
        });
        
        await item.save();
        console.log(`[Worker:Embedding] Embedding saved and indexed in Pinecone`);
      } catch (embedError) {
        console.error(`[Worker:Embedding] Embedding generation failed: ${embedError.message}`);
      }

      console.log(`[Worker:Embedding] Completed processing attempt for item ${itemId}`);
      
      // Trigger cluster and graph updates (even with partial data)
      queueManager.addJob('clustering', { itemId });
      queueManager.addJob('graph', { itemId });

    } catch (error) {
      console.error(`[Worker:Embedding] Critical Worker Error for item ${itemId}:`, error);
    } finally {
      // Add a mandatory delay between items
      setTimeout(() => {
        queueManager.completeJob('embedding');
      }, 5000);
    }
  });
};
