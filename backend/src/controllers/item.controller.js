import mongoose from 'mongoose';
import Item from '../models/Item.js';
import { queueManager } from '../workers/queue.js';
import { generateEmbedding } from '../services/ai/embeddingGenerator.js';
import { generateTags } from '../services/ai/tagGenerator.js';
import { index as pineconeIndex } from '../config/pinecone.js';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const saveItem = async (req, res) => {
  try {
    const { type, title, content, url, collectionId } = req.body;

    if (!type || !title || !content) {
      return res.status(400).json({ message: 'Type, title, and content are required' });
    }

    // 1. Create Basic Item
    const newItem = new Item({
      type,
      title,
      content,
      url,
      collectionId,
      tags: [], // Will be populated by worker
      embedding: [], // Will be populated by worker
    });

    await newItem.save();

    // 2. Offload AI Processing to Background Worker
    console.log(`[API:Save] Offloading AI processing for item ${newItem._id} to worker`);
    queueManager.addJob('embedding', { itemId: newItem._id });

    res.status(201).json({
      message: 'Item saved. AI processing (tags/embeddings) started in background.',
      item: newItem,
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

    // 1. Convert query to embedding using Gemini
    const queryEmbedding = await generateEmbedding(query);

    // 2. Query Pinecone for semantic similarity
    const pineconeRes = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true
    });

    // 3. Get matching item IDs and FILTER for valid MongoDB ObjectIds
    const matches = pineconeRes?.matches || [];
    const itemIds = matches
      .map(match => match.id)
      .filter(id => mongoose.Types.ObjectId.isValid(id));

    // 4. Fetch items from MongoDB to return full data
    const items = await Item.find({ _id: { $in: itemIds } });

    // Sort items to match Pinecone similarity ranking
    const sortedItems = itemIds
      .map(id => items.find(item => item._id.toString() === id))
      .filter(Boolean);

    res.json(sortedItems);
  } catch (error) {
    console.error('Semantic Search error:', error);
    res.status(500).json({ message: 'Error during semantic search', error: error.message });
  }
};

export const getRelatedItems = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (!item.embedding || item.embedding.length === 0) {
      return res.status(200).json({ message: 'AI processing not complete yet', related: [] });
    }

    // Query Pinecone for nearest neighbors
    const pineconeRes = await pineconeIndex.query({
      vector: item.embedding,
      topK: 6, // inclusive of the item itself
      includeMetadata: true
    });

    const matches = pineconeRes.matches || [];
    const relatedIds = matches
      .filter(match => match.id !== item._id.toString())
      .map(match => match.id);

    const relatedItems = await Item.find({ _id: { $in: relatedIds } });
    
    res.json(relatedItems);
  } catch (error) {
    console.error('Related items error:', error);
    res.status(500).json({ message: 'Error fetching related items', error: error.message });
  }
};

export const getGraphData = async (req, res) => {
  try {
    const items = await Item.find().select('title type tags');
    
    // Nodes
    const nodes = items.map(item => ({
      id: item._id,
      label: item.title,
      type: item.type,
      tags: item.tags
    }));

    // In a real production app, links should be pre-computed by a worker
    // For now, we return nodes; links can be defined by shared tags locally in frontend
    res.json({ nodes, links: [] }); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching graph data', error: error.message });
  }
};
