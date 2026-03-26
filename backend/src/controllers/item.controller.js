import Item from '../models/Item.js';
import { queueManager } from '../workers/queue.js';
import { calculateSimilarity, findNearestItems } from '../services/ai/similarityEngine.js';
import { generateEmbedding } from '../services/ai/embeddingGenerator.js';

export const saveItem = async (req, res) => {
  try {
    const { type, title, content, url, tags = [], collectionId } = req.body;

    if (!type || !title || !content) {
      return res.status(400).json({ message: 'Type, title, and content are required' });
    }

    const newItem = new Item({
      type,
      title,
      content,
      url,
      tags,
      collectionId
    });

    await newItem.save();

    // Trigger background job for AI processing
    queueManager.addJob('embedding', { itemId: newItem._id });

    res.status(201).json({
      message: 'Item saved and queued for processing',
      item: newItem
    });
  } catch (error) {
    console.error('Save Item error:', error);
    res.status(500).json({ message: 'Error saving item', error: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    // 1. Convert query to embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2. Fetch all items with embeddings
    const items = await Item.find({ embedding: { $ne: [] } });

    // 3. Perform semantic search
    const results = findNearestItems(queryEmbedding, items, 10);

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error during search', error: error.message });
  }
};

export const getRelatedItems = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (!item.embedding || item.embedding.length === 0) {
      return res.status(200).json({ message: 'No embedding available yet', related: [] });
    }

    const otherItems = await Item.find({ 
      _id: { $ne: item._id },
      embedding: { $ne: [] } 
    });

    const related = findNearestItems(item.embedding, otherItems, 5);
    res.json(related);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching related items', error: error.message });
  }
};

export const getGraphData = async (req, res) => {
  try {
    const items = await Item.find().select('title type tags embedding');
    
    // Build Graph structure
    const nodes = items.map(item => ({
      id: item._id,
      label: item.title,
      type: item.type,
      tags: item.tags
    }));

    const links = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const similarity = calculateSimilarity(items[i].embedding, items[j].embedding);
        
        // Connect if similarity > threshold OR share tags
        const commonTags = items[i].tags.filter(tag => items[j].tags.includes(tag));
        
        if (similarity > 0.8 || commonTags.length >= 2) {
          links.push({
            source: items[i]._id,
            target: items[j]._id,
            value: similarity,
            type: similarity > 0.8 ? 'semantic' : 'tag'
          });
        }
      }
    }

    res.json({ nodes, links });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching graph data', error: error.message });
  }
};
