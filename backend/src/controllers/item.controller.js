import mongoose from 'mongoose';
import Item from '../models/Item.js';
import { generateEmbedding } from '../services/ai/embeddingGenerator.js';
import { generateTags } from '../services/ai/tagGenerator.js';
import { index as pineconeIndex } from '../config/pinecone.js';
import {
  extractArticle,
  extractTweet,
  extractYouTube,
  extractImage,
  extractPDF
} from '../services/contentExtractor.js';
import { normalizeContent } from '../utils/contentNormalizer.js';
import { runTopicClustering } from '../services/ai/clusteringService.js';
import { cosineSimilarity } from '../utils/similarity.js';


const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const saveItem = async (req, res) => {
  try {
    let { type, title, content, url, collectionId } = req.body;
    const file = req.file;

    console.log(`[API:Save] Processing new save request. Type: ${type}, File: ${file ? file.originalname : 'none'}`);

    // Step 2: Content Type Handling & Extraction
    let extractedData = { title, content };

    if (file) {
      if (file.mimetype === 'application/pdf') {
        type = 'pdf';
        extractedData = await extractPDF(file.buffer, file.originalname);
      } else if (file.mimetype.startsWith('image/')) {
        type = 'image';
        extractedData = extractImage(file);
      }
    } else if (type === 'tweet') {
      extractedData = extractTweet(content || url);
    } else if (type === 'youtube') {
      extractedData = extractYouTube(url);
    } else if (type === 'article' || type === 'text') {
      type = 'article';
      extractedData = extractArticle(title, content);
    }

    // Step 3: Content Normalization
    const finalTitle = extractedData.title || title || 'Untitled';
    const normalizedText = normalizeContent(extractedData.content || content);

    // Step 7: Validation
    if (!normalizedText || normalizedText.length < 10) {
      return res.status(400).json({
        message: 'Extracted content is too short or empty. Please provide more detail.'
      });
    }

    console.log(`[API:Save] Extracted content length: ${normalizedText.length}`);

    // Step 4: AI Processing Pipeline (Synchronous)
    console.log(`[API:Save] Starting AI processing pipeline...`);

    // 1. Generate Tags
    const tags = await generateTags(normalizedText);
    console.log(`[API:Save] Tags generated: ${tags.join(', ')}`);

    // 2. Generate Embedding (Wait is already handled inside the generators)
    const embedding = await generateEmbedding(normalizedText);
    console.log(`[API:Save] Embedding generated (Length: ${embedding.length})`);

    // Step 5: Store Data in MongoDB
    const newItem = new Item({
      type,
      title: finalTitle,
      content: normalizedText,
      url,
      collectionId,
      tags,
      embedding,
    });

    await newItem.save();
    console.log(`[API:Save] Item saved to MongoDB: ${newItem._id}`);

    // Step 6: Pinecone Upsert
    try {
      await pineconeIndex.upsert([{
        id: newItem._id.toString(),
        values: embedding,
        metadata: {
          title: finalTitle,
          type,
          tags: tags.join(', ')
        }
      }]);
      console.log(`[API:Save] Vector upserted to Pinecone`);
    } catch (pineconeError) {
      console.error('[API:Save] Pinecone Upsert Error:', pineconeError);
      // We don't fail the whole request if Pinecone fails, but we log it
    }

    // Step 7: Trigger Topic Clustering (Asynchronous)
    runTopicClustering().catch(err => console.error('[API:Save] Deferred clustering error:', err));


    res.status(201).json({
      message: 'Item saved and processed successfully',
      item: {
        id: newItem._id,
        type,
        title: finalTitle,
        tags
      }
    });

  } catch (error) {
    console.error('[API:Save] Error:', error);
    res.status(500).json({ message: 'Error processing content', error: error.message });
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
    // 1. Fetch items with embeddings/metadata (Limit to 100 for performance)
    const items = await Item.find()
      .select('title type tags topic embedding')
      .limit(100);

    // 2. Transform items to nodes
    const nodes = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      type: item.type,
      topic: item.topic || "General"
    }));

    // 3. Compute Edges (Links)
    const links = [];
    const SIMILARITY_THRESHOLD = 0.75;
    const MAX_LINKS_PER_NODE = 5;

    for (let i = 0; i < items.length; i++) {
      let nodeLinks = [];
      const item1 = items[i];

      // Ensure item1 has embeddings
      if (!item1.embedding || item1.embedding.length === 0) continue;

      for (let j = 0; j < items.length; j++) {
        if (i === j) continue; // Skip self

        const item2 = items[j];

        // Ensure item2 has embeddings
        if (!item2.embedding || item2.embedding.length === 0) continue;

        // Base Similarity
        let similarity = cosineSimilarity(item1.embedding, item2.embedding);

        // Optional Boosts
        // Shared Tags Boost
        if (item1.tags && item2.tags) {
          const sharedTags = item1.tags.filter(tag => item2.tags.includes(tag));
          if (sharedTags.length > 0) {
            similarity += sharedTags.length * 0.02; // +0.02 per shared tag
          }
        }

        // Same Topic Boost
        if (item1.topic && item2.topic && item1.topic === item2.topic && item1.topic !== 'Uncategorized') {
          similarity += 0.05;
        }

        if (similarity > SIMILARITY_THRESHOLD) {
          nodeLinks.push({
            source: item1._id.toString(),
            target: item2._id.toString(),
            weight: parseFloat(similarity.toFixed(4))
          });
        }
      }

      // Sort by weight and limit
      nodeLinks.sort((a, b) => b.weight - a.weight);
      const topLinks = nodeLinks.slice(0, MAX_LINKS_PER_NODE);

      // Add to main links array, avoiding duplicates (A->B and B->A)
      topLinks.forEach(link => {
        const reverseExists = links.find(l => 
          (l.source === link.target && l.target === link.source) || 
          (l.source === link.source && l.target === link.target)
        );
        if (!reverseExists) {
          links.push(link);
        }
      });
    }

    console.log(`[API:Graph] Generated ${nodes.length} nodes and ${links.length} links.`);
    res.json({ nodes, links });
  } catch (error) {
    console.error('[API:Graph] Error:', error);
    res.status(500).json({ message: 'Error fetching graph data', error: error.message });
  }
};

export const getClusters = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    // Group items by topic
    const clusters = items.reduce((acc, item) => {
      const topic = item.topic || 'Uncategorized';
      if (!acc[topic]) {
        acc[topic] = [];
      }
      acc[topic].push(item);
      return acc;
    }, {});

    // Format as array of objects
    const result = Object.entries(clusters).map(([topic, items]) => ({
      topic,
      count: items.length,
      items
    }));

    res.json(result);
  } catch (error) {
    console.error('Get Clusters error:', error);
    res.status(500).json({ message: 'Error fetching clusters', error: error.message });
  }
};
