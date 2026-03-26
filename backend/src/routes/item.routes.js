import express from 'express';
import { 
  saveItem, 
  getAllItems, 
  getItemById, 
  searchItems, 
  getRelatedItems, 
  getGraphData 
} from '../controllers/item.controller.js';

const router = express.Router();

router.post('/save', saveItem);
router.get('/items', getAllItems);
router.get('/item/:id', getItemById);
router.get('/search', searchItems);
router.get('/related/:id', getRelatedItems);
router.get('/graph', getGraphData);

export default router;
