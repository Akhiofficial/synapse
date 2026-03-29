import express from 'express';
import {
    createCollection,
    getCollections,
    addItemToCollection,
    getCollectionItems,
    removeItemFromCollection
} from '../controllers/collection.controller.js';
import identifyUser from '../middlewears/auth.middleware.js';

const router = express.Router();

router.post('/collections',identifyUser, createCollection);
router.get('/collections',identifyUser, getCollections);

router.post('/collections/:id/add',identifyUser, addItemToCollection);
router.get('/collections/:id/items',identifyUser, getCollectionItems);
router.post('/collections/:id/remove',identifyUser, removeItemFromCollection);

export default router;
