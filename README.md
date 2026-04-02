# Synapse — Your AI-Augmented Second Brain

**Synapse** is a high-performance, personal knowledge management system designed to function as a digitized "second brain." It leverages advanced AI to capture, analyze, and connect your thoughts, links, and documents into a cohesive neural network.

---

## 🧠 Core Features

### ⚡ Neural Link Capture
Effortlessly capture anything from across the web. Whether it's a research paper URL, a quick thought, an image, or a PDF document, Synapse stores it all in your central intelligence hub.

### 🤖 Predictive AI Engine
Every item you save is automatically processed by our AI pipeline (powered by Google Gemini):
- **Instant Summarization**: Get the gist of long articles and documents in seconds.
- **Auto-Tagging**: Semantic categories are intelligently assigned to your content.
- **Key Takeaways**: Vital information is extracted and presented as bullet points.

### 🕸️ Neural Graph Visualization
Visualize the hidden connections between your ideas. Our interactive, D3-powered Force Graph allows you to explore your knowledge spatially, discovering non-obvious links across different topics.

### 🔍 Semantic AI Search
Stop searching for keywords and start searching for ideas. Using vector embeddings and Pinecone, Synapse understands the *context* of your queries, allowing for natural language retrieval across your entire library.

### 📁 Intelligent Collections
Curate your second brain into themed hubs. Create specialized collections for research projects, reading lists, or specific topics to maintain a focused workspace.

### 🖊️ Highlights & Annotations
Engage directly with your content. Save specific neural fragments by highlighting text, and add your own context with persistent personal notes.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Project Alpha Aesthetic)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Visualization**: [React Force Graph](https://github.com/vasturiano/react-force-graph)
- **State Management**: React Context API

### Backend
- **Server**: [Node.js](https://nodejs.org/) with [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Vector Search**: [Pinecone](https://www.pinecone.io/)
- **AI Integration**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **File Processing**: ImageKit (Hosting), Multer, PDF-Parse

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Pinecone Cloud Account
- Google AI (Gemini) API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Akhiofficial/synapse.git
   cd synapse
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd ../backend
   npm install
   # Create a .env file and add your credentials (see below)
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory with the following keys:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_ai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_env
IMAGEKIT_PUBLIC=your_imagekit_public_key
IMAGEKIT_PRIVATE=your_imagekit_private_key
IMAGEKIT_ENDPOINT=your_imagekit_url
```

---

## 🎨 Design Philosophy — "Project Alpha"
Synapse is built with a premium, high-end aesthetic featuring:
- **Glassmorphism**: Subtle translucency and backdrop blurs.
- **Micro-Animations**: Smooth, intent-based transitions.
- **OLED Dark Mode**: Optimized for high contrast and focus.
- **Responsive Fluidity**: Seamlessly transitions across all device sizes.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
