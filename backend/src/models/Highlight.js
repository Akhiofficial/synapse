import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Highlight = mongoose.model('Highlight', highlightSchema);
export default Highlight;
