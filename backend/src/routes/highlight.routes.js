import express from "express";
import {
  addHighlight,
  getHighlightsByItem,
  deleteHighlight,
  updateHighlight,
} from "../controllers/highlight.controller.js";

const router = express.Router();

router.post("/highlights", addHighlight);
router.get("/highlights/:itemId", getHighlightsByItem);
router.delete("/highlights/:id", deleteHighlight);
router.put("/highlights/:id", updateHighlight);

export default router;
