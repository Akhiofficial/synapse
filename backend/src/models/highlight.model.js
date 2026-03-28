import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000, 
    },
    note: {
      type: String,
      trim: true,
      maxlength: 1000, 
    },
  },
  { timestamps: true }
);

const Highlight = mongoose.model("Highlight", highlightSchema);
export default Highlight;
