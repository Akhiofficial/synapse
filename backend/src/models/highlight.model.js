import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000, 
    },
    note: {
      type: String,
      trim: true,
      maxlength: 10000, 
    },
  },
  { timestamps: true }
);

const Highlight = mongoose.model("Highlight", highlightSchema);
export default Highlight;
