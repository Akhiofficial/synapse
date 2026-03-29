import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.js";
import identifyUser from "./middlewears/auth.middleware.js";
import authRouter from "./routes/auth.routes.js";
import itemRouter from "./routes/item.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
import highlightRoutes from "./routes/highlight.routes.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Public routes (no auth required) ─────────────────────────────────────────
app.use('/api/auth', authRouter);

// ── Protected routes (JWT required) ──────────────────────────────────────────
app.use('/api', identifyUser, itemRouter);
app.use('/api', identifyUser, collectionRoutes);
app.use('/api', identifyUser, highlightRoutes);

connectDB();

export default app;