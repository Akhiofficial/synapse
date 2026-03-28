import mongoose from 'mongoose';
import Item from '../models/Item.js';
import { generateEmbedding } from '../services/ai/embeddingGenerator.js';
import { generateTags } from '../services/ai/tagGenerator.js';
import { index as pineconeIndex } from '../config/pinecone.js';
import { searchVectors } from '../services/ai/vectorSearch.js';
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

// ─────────────────────────────────────────────────────────────────────────────
// FR6 — Semantic Search
// GET /api/search?query=your_text
// ─────────────────────────────────────────────────────────────────────────────
export const searchItems = async (req, res) => {
  const { query } = req.query;

  // ── Validation ──────────────────────────────────────────────────────────
  if (!query || query.trim().length === 0) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  console.log(`[API:Search] New semantic search query: "${query}"`);

  try {
    // ── Step 1: Generate embedding for the query text ────────────────────
    console.log(`[API:Search] Generating Gemini embedding for query...`);
    const queryEmbedding = await generateEmbedding(query.trim());
    if (!queryEmbedding || queryEmbedding.length === 0) {
      console.error('[API:Search] Embedding generation returned empty result.');
      return res.status(500).json({ message: 'Failed to generate query embedding.' });
    }
    console.log(`[API:Search] Embedding generated — ${queryEmbedding.length} dimensions.`);

    // ── Step 2: Query Pinecone via vectorSearch service ──────────────────
    console.log(`[API:Search] Querying Pinecone vector index...`);
    const vectorMatches = await searchVectors(queryEmbedding, { topK: 5, includeMetadata: true });
    console.log(`[API:Search] Pinecone returned ${vectorMatches.length} match(es).`);

    if (vectorMatches.length === 0) {
      console.log('[API:Search] No Pinecone matches found — returning empty result set.');
      return res.status(200).json([]);
    }

    // ── Step 3: Extract valid MongoDB IDs with their Pinecone scores ─────
    const scoreMap = {}; // id -> base Pinecone score
    const validIds = vectorMatches
      .filter(m => {
        if (!mongoose.Types.ObjectId.isValid(m.id)) {
          console.warn(`[API:Search] Skipping non-ObjectId match: ${m.id}`);
          return false;
        }
        scoreMap[m.id] = m.score;
        return true;
      })
      .map(m => m.id);

    if (validIds.length === 0) {
      console.log('[API:Search] All Pinecone IDs were invalid or non-ObjectId — returning empty.');
      return res.status(200).json([]);
    }

    // ── Step 4: Fetch matched documents from MongoDB ─────────────────────
    console.log(`[API:Search] Fetching ${validIds.length} item(s) from MongoDB...`);
    const items = await Item.find({ _id: { $in: validIds } });

    // ── Step 5: Apply boosts + sort by final score ───────────────────────
    // Parse a loose keyword set from the query to detect tag/topic overlap
    const queryTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);

    const scoredItems = items.map(item => {
      let score = scoreMap[item._id.toString()] ?? 0;

      // Boost: shared tags with query keywords
      if (item.tags && item.tags.length > 0) {
        const sharedTagCount = item.tags.filter(tag =>
          queryTokens.some(token => tag.toLowerCase().includes(token))
        ).length;
        if (sharedTagCount > 0) {
          score += sharedTagCount * 0.02;
          console.log(`[API:Search] Tag boost +${(sharedTagCount * 0.02).toFixed(2)} for "${item.title}"`);
        }
      }

      // Boost: topic matches query keyword
      if (item.topic && queryTokens.some(token => item.topic.toLowerCase().includes(token))) {
        score += 0.03;
        console.log(`[API:Search] Topic boost +0.03 for "${item.title}" (topic: ${item.topic})`);
      }

      return {
        _id: item._id,
        title: item.title,
        type: item.type,
        content: item.content,
        url: item.url,
        tags: item.tags,
        topic: item.topic,
        createdAt: item.createdAt,
        score: parseFloat(Math.min(score, 1).toFixed(4)), // cap at 1.0
      };
    });

    // Sort by final boosted score descending
    scoredItems.sort((a, b) => b.score - a.score);

    console.log(`[API:Search] Returning ${scoredItems.length} result(s) for query: "${query}"`);
    console.log('[API:Search] Top results:', scoredItems.map(i => `${i.title} (${i.score})`).join(' | '));

    return res.status(200).json(scoredItems);

  } catch (error) {
    console.error('[API:Search] Semantic search failed:', error);
    return res.status(500).json({
      message: 'An error occurred during semantic search. Please try again.',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FR5 — Related Items Suggestion
// GET /api/related/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getRelatedItems = async (req, res) => {
  const { id } = req.params;

  // ── Validation ──────────────────────────────────────────────────────────
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid item ID format.' });
  }

  console.log(`[API:Related] Fetching related items for ID: ${id}`);

  try {
    // ── Step 1: Fetch the source item ────────────────────────────────────
    const item = await Item.findById(id);
    if (!item) {
      console.warn(`[API:Related] Item not found: ${id}`);
      return res.status(404).json({ message: 'Item not found.' });
    }
    console.log(`[API:Related] Source item: "${item.title}" | Tags: [${item.tags?.join(', ')}] | Topic: ${item.topic}`);

    // ── Step 2: Guard — embedding must exist ────────────────────────────
    if (!item.embedding || item.embedding.length === 0) {
      console.warn(`[API:Related] Item "${item.title}" has no embedding yet.`);
      return res.status(200).json({
        message: 'AI processing not complete yet for this item. Try again shortly.',
        related: [],
      });
    }
    console.log(`[API:Related] Source embedding found (${item.embedding.length} dims). Querying Pinecone...`);

    // ── Step 3: Query Pinecone — exclude source item ID ──────────────────
    const vectorMatches = await searchVectors(item.embedding, {
      topK: 5,
      includeMetadata: true,
      excludeId: id,
    });
    console.log(`[API:Related] Pinecone returned ${vectorMatches.length} related match(es).`);

    if (vectorMatches.length === 0) {
      console.log('[API:Related] No similar vectors found in Pinecone.');
      return res.status(200).json({ related: [] });
    }

    // ── Step 4: Extract valid MongoDB IDs (guard against non-ObjectId values)
    const scoreMap = {};
    const validIds = vectorMatches
      .filter(m => {
        if (m.id === id) return false; // belt-and-suspenders self-exclusion
        if (!mongoose.Types.ObjectId.isValid(m.id)) {
          console.warn(`[API:Related] Skipping non-ObjectId: ${m.id}`);
          return false;
        }
        scoreMap[m.id] = m.score;
        return true;
      })
      .map(m => m.id);

    if (validIds.length === 0) {
      return res.status(200).json({ related: [] });
    }

    // ── Step 5: Fetch related docs from MongoDB ──────────────────────────
    console.log(`[API:Related] Fetching ${validIds.length} related item(s) from MongoDB...`);
    const relatedDocs = await Item.find({ _id: { $in: validIds } });

    // ── Step 6: Apply boosts (shared tags, same topic) + sort ────────────
    const boostedItems = relatedDocs.map(relItem => {
      let score = scoreMap[relItem._id.toString()] ?? 0;

      // Boost: shared tags between source and related item
      if (item.tags?.length && relItem.tags?.length) {
        const sharedTags = item.tags.filter(tag => relItem.tags.includes(tag));
        if (sharedTags.length > 0) {
          score += sharedTags.length * 0.02;
          console.log(
            `[API:Related] Tag boost +${(sharedTags.length * 0.02).toFixed(2)} for "${relItem.title}" (shared: ${sharedTags.join(', ')})`
          );
        }
      }

      // Boost: same topic
      if (
        item.topic &&
        relItem.topic &&
        item.topic === relItem.topic &&
        item.topic !== 'Uncategorized'
      ) {
        score += 0.05;
        console.log(`[API:Related] Topic boost +0.05 for "${relItem.title}" (topic: ${relItem.topic})`);
      }

      return {
        _id: relItem._id,
        title: relItem.title,
        type: relItem.type,
        content: relItem.content,
        url: relItem.url,
        tags: relItem.tags,
        topic: relItem.topic,
        createdAt: relItem.createdAt,
        score: parseFloat(Math.min(score, 1).toFixed(4)),
      };
    });

    // Sort by final score descending, then limit to top 5
    boostedItems.sort((a, b) => b.score - a.score);
    const finalRelated = boostedItems.slice(0, 5);

    console.log(
      `[API:Related] Returning ${finalRelated.length} related item(s): ` +
      finalRelated.map(i => `"${i.title}" (${i.score})`).join(' | ')
    );

    return res.status(200).json({ related: finalRelated });

  } catch (error) {
    console.error('[API:Related] Error fetching related items:', error);
    return res.status(500).json({
      message: 'An error occurred while fetching related items.',
      error: error.message,
    });
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

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG — Pinecone vs MongoDB Sync Inspector
// GET /api/debug/pinecone
// ─────────────────────────────────────────────────────────────────────────────
export const debugPinecone = async (req, res) => {
  try {
    console.log('[DEBUG:Pinecone] Running sync diagnostic...');

    // STEP 1: Fetch ALL MongoDB items using .lean() → plain JS objects
    // WHY lean()? Without it, Mongoose returns "MongooseDocument" objects
    // whose .embedding field is a MongooseArray wrapper, not a plain number[].
    const allItems = await Item.find().select('_id title embedding tags').lean();
    const totalMongo = allItems.length;
    const withEmbedding = allItems.filter(i => Array.isArray(i.embedding) && i.embedding.length > 0);
    const withoutEmbedding = allItems.filter(i => !Array.isArray(i.embedding) || i.embedding.length === 0);

    console.log(`[DEBUG:Pinecone] MongoDB: ${totalMongo} total | ${withEmbedding.length} with embeddings | ${withoutEmbedding.length} without`);

    // STEP 2: Pinecone index stats (how many vectors are stored)
    const stats = await pineconeIndex.describeIndexStats();
    console.log('[DEBUG:Pinecone] Pinecone stats:', JSON.stringify(stats));

    // STEP 3: Verify which MongoDB IDs actually exist in Pinecone
    // The Pinecone fetch() API lets us look up specific IDs directly
    const idsToCheck = withEmbedding.slice(0, 10).map(i => i._id.toString());
    let pineconeHits = [];
    let pineconeMisses = [];
    let fetchError = null;

    if (idsToCheck.length > 0) {
      try {
        // Also bypassing SDK for fetch to avoid "Must pass in at least 1 recordID" error
        const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
        const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
        const { default: axios } = await import('axios');
        
        // 1. Get host
        const describeRes = await axios.get(
          `https://api.pinecone.io/indexes/${PINECONE_INDEX_NAME}`,
          { headers: { 'Api-Key': PINECONE_API_KEY, 'X-Pinecone-API-Version': '2025-01' } }
        );
        const indexHost = describeRes.data.host;

        // 2. Fetch using REST API
        // Pinecone fetch endpoint: GET https://{index_host}/vectors/fetch?ids=id1&ids=id2
        const params = new URLSearchParams();
        idsToCheck.forEach(id => params.append('ids', id));

        const fetchResult = await axios.get(
          `https://${indexHost}/vectors/fetch?${params.toString()}`,
          { 
            headers: { 
              'Api-Key': PINECONE_API_KEY,
              'X-Pinecone-API-Version': '2025-01' 
            } 
          }
        );
        
        const fetchedIds = Object.keys(fetchResult.data?.vectors || {});
        console.log('[DEBUG:Pinecone] Pinecone REST API returned IDs:', fetchedIds);
        pineconeHits = idsToCheck.filter(id => fetchedIds.includes(id));
        pineconeMisses = idsToCheck.filter(id => !fetchedIds.includes(id));

      } catch (fetchErr) {
        fetchError = fetchErr.response?.data?.message || fetchErr.response?.data || fetchErr.message;
        console.error('[DEBUG:Pinecone] ❌ Pinecone REST fetch failed:', fetchError);
        pineconeMisses = idsToCheck;
      }
    }

    console.log(`[DEBUG:Pinecone] Pinecone hits: ${pineconeHits.length} | misses: ${pineconeMisses.length}`);

    const needsSync = pineconeMisses.length > 0 || fetchError;

    return res.status(200).json({
      diagnosis: {
        mongodb: {
          total: totalMongo,
          withEmbedding: withEmbedding.length,
          withoutEmbedding: withoutEmbedding.length,
          itemsMissingEmbedding: withoutEmbedding.map(i => ({ id: i._id, title: i.title })),
        },
        pinecone: {
          indexStats: stats,
          checkedIds: idsToCheck.length,
          foundInPinecone: pineconeHits.length,
          missingFromPinecone: pineconeMisses.length,
          missingIds: pineconeMisses,
          fetchError: fetchError || null,
        },
        verdict: needsSync
          ? `⚠️ ${pineconeMisses.length} MongoDB item(s) are NOT in Pinecone. Run POST /api/sync/pinecone to fix.`
          : '✅ All checked items are present in Pinecone.',
      },
    });
  } catch (error) {
    console.error('[DEBUG:Pinecone] Error:', error);
    return res.status(500).json({ message: 'Debug failed', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REPAIR — Re-sync all MongoDB items → Pinecone via REST API (bypasses SDK)
// POST /api/sync/pinecone
// ─────────────────────────────────────────────────────────────────────────────
export const syncPinecone = async (req, res) => {
  try {
    console.log('[SYNC:Pinecone] Starting full re-sync via REST API...');

    // WHY REST API INSTEAD OF SDK?
    // The Pinecone SDK v7 has an internal validator that checks `!record.values`
    // before sending the request. MongoDB BSON arrays, even after JSON.parse/stringify
    // and Array.from(), fail this truthy check in the SDK's compiled JS.
    // Calling the Pinecone REST API directly via axios sends pure JSON — no SDK
    // validation middleware — and always works with native number arrays.

    const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
    const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

    if (!PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
      return res.status(500).json({ message: 'Missing PINECONE_API_KEY or PINECONE_INDEX_NAME in .env' });
    }

    // STEP 1: Discover the index host URL from Pinecone control plane
    // We need the host URL (e.g. https://synapse-index-xxxx.svc.aped.pinecone.io)
    // to make data plane REST calls
    const { default: axios } = await import('axios');

    let indexHost;
    try {
      const describeRes = await axios.get(
        `https://api.pinecone.io/indexes/${PINECONE_INDEX_NAME}`,
        { headers: { 'Api-Key': PINECONE_API_KEY, 'X-Pinecone-API-Version': '2025-01' } }
      );
      indexHost = describeRes.data.host;
      console.log(`[SYNC:Pinecone] Index host: ${indexHost}`);
    } catch (hostErr) {
      console.error('[SYNC:Pinecone] Failed to get index host:', hostErr.response?.data || hostErr.message);
      return res.status(500).json({ message: 'Could not resolve Pinecone index host', error: hostErr.message });
    }

    // STEP 2: Fetch MongoDB items
    const rawItems = await Item.find({ embedding: { $exists: true, $ne: [] } })
      .select('_id title type tags embedding topic')
      .lean();

    if (rawItems.length === 0) {
      return res.status(200).json({ message: 'No items with embeddings found in MongoDB.', synced: 0 });
    }

    console.log(`[SYNC:Pinecone] Found ${rawItems.length} item(s). Upserting via REST API...`);

    let syncedCount = 0;
    let failedCount = 0;
    const failedItems = [];

    // STEP 3: Upsert each item via REST API
    for (const rawItem of rawItems) {
      try {
        // Convert to native number[] via JSON round-trip
        const values = JSON.parse(JSON.stringify(rawItem.embedding));

        if (!Array.isArray(values) || values.length === 0) {
          throw new Error(`Invalid embedding: not an array or empty`);
        }

        console.log(`[SYNC:Pinecone] Upserting "${rawItem.title}" | dims: ${values.length}`);

        // Direct REST API upsert — Pinecone v1 data plane format
        await axios.post(
          `https://${indexHost}/vectors/upsert`,
          {
            vectors: [{
              id: rawItem._id.toString(),
              values,                           // plain JSON array — always works
              metadata: {
                title: rawItem.title || '',
                type: rawItem.type || '',
                tags: (rawItem.tags || []).join(', '),
                topic: rawItem.topic || 'Uncategorized',
              },
            }],
          },
          {
            headers: {
              'Api-Key': PINECONE_API_KEY,
              'Content-Type': 'application/json',
              'X-Pinecone-API-Version': '2025-01',
            },
          }
        );

        syncedCount++;
        console.log(`[SYNC:Pinecone] ✅ (${syncedCount}/${rawItems.length}) "${rawItem.title}"`);

      } catch (itemErr) {
        failedCount++;
        const errDetail = itemErr.response?.data || itemErr.message;
        failedItems.push({
          id: rawItem._id.toString(),
          title: rawItem.title,
          error: typeof errDetail === 'object' ? JSON.stringify(errDetail) : errDetail,
        });
        console.error(`[SYNC:Pinecone] ❌ Failed "${rawItem.title}":`, errDetail);
      }

      await new Promise(r => setTimeout(r, 100));
    }

    console.log(`[SYNC:Pinecone] Done. ✅ Synced: ${syncedCount} | ❌ Failed: ${failedCount}`);

    return res.status(200).json({
      message: syncedCount > 0
        ? `✅ Sync complete! ${syncedCount}/${rawItems.length} item(s) upserted to Pinecone.`
        : `❌ All upserts failed — see failedItems[].error`,
      totalFound: rawItems.length,
      synced: syncedCount,
      failed: failedCount,
      failedItems,
      nextStep: syncedCount > 0
        ? 'Now test: GET /api/search?query=machine+learning'
        : 'Check failedItems[].error for details.',
    });

  } catch (error) {
    console.error('[SYNC:Pinecone] Fatal error:', error);
    return res.status(500).json({ message: 'Sync failed', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FR7 — Memory Resurfacing
// GET /api/resurface
// ─────────────────────────────────────────────────────────────────────────────
export const getResurfaceItems = async (req, res) => {
  try {
    const defaultDaysAgo = 7;
    let oldThreshold = new Date();
    oldThreshold.setDate(oldThreshold.getDate() - defaultDaysAgo);

    console.log(`[API:Resurface] Finding items older than ${defaultDaysAgo} days.`);
    
    // 1. Fetch items older than the threshold
    let items = await Item.find({
      createdAt: { $lt: oldThreshold }
    }).select('title type createdAt tags url topic').lean();

    // Strategy 2: If we don't have enough old items (new user, test data), gracefully decay the threshold
    if (items.length < 3) {
      console.log(`[API:Resurface] Very few / no old items found. Applying 1-day fallback.`);
      const fallbackThreshold = new Date();
      fallbackThreshold.setDate(fallbackThreshold.getDate() - 1);
      
      items = await Item.find({
        createdAt: { $lt: fallbackThreshold }
      }).select('title type createdAt tags url topic').lean();
    }
    
    // Strategy 3: Development / New User Fallback (Ensure results aren't empty for demo)
    if (items.length < 3) {
      console.log(`[API:Resurface] Still too few items. Fetching latest items just to avoid empty results.`);
      items = await Item.find().sort({ createdAt: 1 }).limit(5).select('title type createdAt tags url topic').lean();
    }
    
    // If absolutely zero items exist in DB
    if (items.length === 0) {
      return res.status(200).json([]);
    }

    // 2. Randomize results (Shuffle items)
    const shuffledItems = items.sort(() => 0.5 - Math.random());
    
    // Pick 3 - 5 items randomly
    const count = Math.min(items.length, Math.floor(Math.random() * 3) + 3); // 3, 4, or 5
    const selectedItems = shuffledItems.slice(0, count);

    // 3. Add context messages
    const now = new Date();
    
    const results = selectedItems.map(item => {
      // Calculate time difference in days
      const createdAt = new Date(item.createdAt);
      const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
      
      let message = "";
      if (diffDays >= 365) {
        const years = Math.floor(diffDays / 365);
        message = `You saved this ${years} year${years > 1 ? 's' : ''} ago`;
      } else if (diffDays >= 30) {
        const months = Math.floor(diffDays / 30);
        message = `From ${months} month${months > 1 ? 's' : ''} ago`;
      } else if (diffDays >= 14) {
        message = `From a couple of weeks ago`;
      } else if (diffDays >= 7) {
        message = "From last week";
      } else if (diffDays > 0) {
        message = `You saved this ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else {
        message = "Revisit this recent insight";
      }
      
      return {
        _id: item._id,
        title: item.title,
        type: item.type,
        tags: item.tags,
        url: item.url,
        createdAt: item.createdAt,
        message: message
      };
    });

    res.status(200).json(results);
    
  } catch (error) {
    console.error('[API:Resurface] Error:', error);
    res.status(500).json({ message: 'Error fetching resurface items', error: error.message });
  }
};
