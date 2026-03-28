import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.js";
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

// Routes
app.use('/api', itemRouter);
app.use('/api', collectionRoutes);
app.use('/api', highlightRoutes);

connectDB();

export default app;