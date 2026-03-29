import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['article', 'tweet', 'image', 'youtube', 'pdf'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  embedding: {
    type: [Number],
    default: [],
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
  },
  topic: {
    type: String,
    default: 'Uncategorized',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Adding index for potential text search
itemSchema.index({ title: 'text', content: 'text' });

const Item = mongoose.model('Item', itemSchema);
export default Item;
