import express from 'express';
import multer from 'multer';
import { 
  saveItem, 
  getAllItems, 
  getItemById, 
  searchItems, 
  getRelatedItems, 
  getGraphData,
  getClusters,
  debugPinecone,
  syncPinecone
} from '../controllers/item.controller.js';

const router = express.Router();

// Multer configuration for memory storage (for extraction)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Use upload.single('file') to handle multipart form data for PDF/Image
router.post('/save', upload.single('file'), saveItem);
router.get('/items', getAllItems);
router.get('/item/:id', getItemById);
router.get('/search', searchItems);
router.get('/related/:id', getRelatedItems);
router.get('/graph', getGraphData);
router.get('/clusters', getClusters);

// ── Diagnostic & Repair ──────────────────────────────────────────────────────
router.get('/debug/pinecone', debugPinecone);   // inspect sync state
router.post('/sync/pinecone', syncPinecone);    // re-upsert all items to Pinecone


export default router;
