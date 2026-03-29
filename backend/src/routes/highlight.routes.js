import express from "express";
import {
  addHighlight,
  getHighlightsByItem,
  deleteHighlight,
  updateHighlight,
} from "../controllers/highlight.controller.js";
import identifyUser from "../middlewears/auth.middleware.js";

const router = express.Router();

router.post("/highlights",identifyUser, addHighlight);
router.get("/highlights/:itemId",identifyUser, getHighlightsByItem);
router.delete("/highlights/:id",identifyUser, deleteHighlight);
router.put("/highlights/:id",identifyUser, updateHighlight);

export default router;
