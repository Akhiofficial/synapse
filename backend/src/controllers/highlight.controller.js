import Highlight from '../models/highlight.model.js';
import Item from '../models/Item.js';

// Add new highlight
export const addHighlight = async (req, res) => {
  try {
    const { itemId, text, note } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: "itemId is required" });
    }
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: "text is required and cannot be empty" });
    }

    // Validate item exists and belongs to user
    const itemExists = await Item.findOne({ _id: itemId, userId: req.user.id });
    if (!itemExists) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check for duplicate highlight
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingHighlight = await Highlight.findOne({ itemId, userId: req.user.id, text: { $regex: new RegExp(`^${escapeRegex(text.trim())}$`, "i") } });
    if (existingHighlight) {
       return res.status(409).json({ error: "This exact highlight already exists for this item" });
    }

    // Create highlight
    const newHighlight = await Highlight.create({
      userId: req.user.id,
      itemId,
      text: text.trim(),
      note: note ? note.trim() : "",
    });

    res.status(201).json(newHighlight);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error adding highlight:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get highlights for an item
export const getHighlightsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Also ensuring item actually belongs to user implicitly via highlight's ownership
    const highlights = await Highlight.find({ itemId, userId: req.user.id }).sort({ createdAt: -1 });
    
    // Formatting response to match example (can just return objects normally but keeping clean)
    const formatted = highlights.map(h => ({
      _id: h._id,
      text: h.text,
      note: h.note,
      createdAt: h.createdAt,
    }));
    
    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching highlights:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete highlight
export const deleteHighlight = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Highlight.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) {
       return res.status(404).json({ error: "Highlight not found" });
    }
    
    res.status(200).json({ message: "Highlight deleted successfully", id });
  } catch (error) {
    console.error("Error deleting highlight:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update highlight
export const updateHighlight = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, note } = req.body;
    
    const updateData = {};
    if (text !== undefined) {
      if (text.trim() === '') return res.status(400).json({ error: "text cannot be empty" });
      updateData.text = text.trim();
    }
    if (note !== undefined) updateData.note = note.trim();
    
    const updated = await Highlight.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updated) {
       return res.status(404).json({ error: "Highlight not found" });
    }
    
    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error updating highlight:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
