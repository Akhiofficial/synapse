import Collection from '../models/Collection.js';
import Item from '../models/Item.js';

export const createCollection = async (req, res) => {
    try {
        const { name } = req.body || {};

        if (!name) {
            return res.status(400).json({ success: false, message: "Collection name is required" });
        }

        const existingCollection = await Collection.findOne({ name });
        if (existingCollection) {
            return res.status(400).json({ success: false, message: "Collection name already exists" });
        }

        const collection = await Collection.create({ name });

        return res.status(201).json({
            success: true,
            collection,
            message: "Collection created successfully"
        });
    } catch (error) {
        console.error("Error creating collection:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCollections = async (req, res) => {
    try {
        const collections = await Collection.find().sort({ createdAt: -1 });
        
        // Optional: add count of items per collection
        const collectionsWithCounts = await Promise.all(collections.map(async (collection) => {
            const count = await Item.countDocuments({ collectionId: collection._id });
            return {
                ...collection.toObject(),
                itemCount: count
            };
        }));

        return res.status(200).json({
            success: true,
            collections: collectionsWithCounts
        });
    } catch (error) {
        console.error("Error getting collections:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const addItemToCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const { itemId } = req.body || {};

        
        if (!itemId) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }

        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        if (item.collectionId && item.collectionId.toString() === collectionId) {
            return res.status(400).json({ success: false, message: "Item is already in this collection" });
        }

        item.collectionId = collectionId;
        await item.save();

        return res.status(200).json({
            success: true,
            message: "Item added to collection successfully",
            item
        });
    } catch (error) {
        console.error("Error adding item to collection:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCollectionItems = async (req, res) => {
    try {
        const collectionId = req.params.id;

        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        const items = await Item.find({ collectionId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            collection: collection.name,
            items
        });
    } catch (error) {
        console.error("Error getting collection items:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const removeItemFromCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const { itemId } = req.body || {};

        if (!itemId) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Technically we might want to check if the item actually belongs to this collection
        if (!item.collectionId || item.collectionId.toString() !== collectionId) {
            return res.status(400).json({ success: false, message: "Item is not in this collection" });
        }

        item.collectionId = null;
        await item.save();

        return res.status(200).json({
            success: true,
            message: "Item removed from collection successfully",
            item
        });
    } catch (error) {
        console.error("Error removing item from collection:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
