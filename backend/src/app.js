import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.js";
import identifyUser from "./middlewears/auth.middleware.js";
import authRouter from "./routes/auth.routes.js";
import itemRouter from "./routes/item.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
import highlightRoutes from "./routes/highlight.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean),
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

// ── Static Files & SPA Routing ──────────────────────────────────────────────
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// Catch-all route to serve the frontend index.html for any non-API route
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(publicPath, "index.html"));
    }
});

connectDB();

export default app;