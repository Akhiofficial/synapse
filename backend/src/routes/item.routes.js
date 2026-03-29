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
  syncPinecone,
  getResurfaceItems
} from '../controllers/item.controller.js';
import identifyUser from '../middlewears/auth.middleware.js';

const router = express.Router();

// Multer configuration for memory storage (for extraction)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Use upload.single('file') to handle multipart form data for PDF/Image
router.post('/save',identifyUser, upload.single('file'), saveItem);
router.get('/items',identifyUser, getAllItems);
router.get('/item/:id',identifyUser, getItemById);
router.get('/search',identifyUser, searchItems);
router.get('/resurface',identifyUser, getResurfaceItems);
router.get('/related/:id',identifyUser, getRelatedItems);
router.get('/graph',identifyUser, getGraphData);
router.get('/clusters',identifyUser, getClusters);

// ── Diagnostic & Repair ──────────────────────────────────────────────────────
router.get('/debug/pinecone',debugPinecone);   // inspect sync state
router.post('/sync/pinecone',syncPinecone);    // re-upsert all items to Pinecone


export default router;
