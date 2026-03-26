import 'dotenv/config';
import app from "./src/app.js";
import { initEmbeddingWorker } from './src/workers/embedding.worker.js';
import { initClusteringWorker } from './src/workers/clustering.worker.js';
import { initGraphWorker } from './src/workers/graph.worker.js';

// Initialize background workers
initEmbeddingWorker();
initClusteringWorker();
initGraphWorker();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});