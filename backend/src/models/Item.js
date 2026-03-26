import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Adding index for potential text search
itemSchema.index({ title: 'text', content: 'text' });

const Item = mongoose.model('Item', itemSchema);
export default Item;
