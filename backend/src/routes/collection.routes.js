import express from 'express';
import {
    createCollection,
    getCollections,
    addItemToCollection,
    getCollectionItems,
    removeItemFromCollection
} from '../controllers/collection.controller.js';

const router = express.Router();

router.post('/collections', createCollection);
router.get('/collections', getCollections);

router.post('/collections/:id/add', addItemToCollection);
router.get('/collections/:id/items', getCollectionItems);
router.post('/collections/:id/remove', removeItemFromCollection);

export default router;
