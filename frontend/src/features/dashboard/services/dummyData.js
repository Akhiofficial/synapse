export const dummyResurfaceItems = [
  {
    _id: 'resurface_1',
    title: 'Neural Networks: Deep Learning Fundamentals',
    type: 'pdf',
    resurfaceMsg: 'YOU SAVED THIS 2 MONTHS AGO',
    createdAt: '2023-10-12T10:00:00Z',
    metadata: {
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNJeIlzf0OL-GYxXf-meFH6pP1ftgkRZRusfBqqqEE1d3QSicdXYWqcyIFhvwIqs7H9-Bv6qP_ryyzvpDa7tZIcm5CUcvMNdQpLUslTPaUXGydiTYxBUG8UOFrI4NhXTKtbfF4_FLqpTgyTXV_ttg6pv5lUd0VANo49XtH9a3FXxS5fPZt7vEJffWcaW6ZGztuf674_RmQnG_11cgB678mHmYhAm9lE4qYhp3yTBtt-1pUjuJ2lzH96yclsNXQjs-B3hGPrV_RK3vS',
    }
  },
  {
    _id: 'resurface_2',
    title: 'Scaling Design Systems for SaaS',
    type: 'youtube',
    resurfaceMsg: 'SUGGESTED REVISIT',
    createdAt: '2023-11-20T10:00:00Z',
    metadata: {
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5_1OiMTVoy_N3w1DyzBDBM4Xw1FnxEff3H5a8NUOibMG3HXASPD4bUVZxIvMibnMY-HMeCZhrHz6oPmixfHiqGFR6nAzZfawzr0UC5HVcsWoMiQQfdMah9DkZ15qav0eMmhcavKcGWX24afonB-O1K28j2WwXrFa89ISCucFjbO3FZJzY4GtIm57icGSpX-w29M6qNhMAbuEgiIjFwPruiStjus7azdTjhSAKi_znUIk3021Bs3D_Ku7IXJ6hFazMaB4SFxdhH9Op',
    }
  }
];

export const dummyRecentItems = [
  {
    _id: 'item_1',
    title: 'The Future of Multi-Modal AI Agents',
    type: 'article',
    content: 'Exploring how language models are evolving to handle vision and action sequences concurrently...',
    tags: ['AI', 'RESEARCH'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
  },
  {
    _id: 'item_2',
    title: 'Interface Texture Study',
    type: 'image',
    tags: ['UI', 'DESIGN'],
    createdAt: new Date().toISOString(), // Today
    metadata: {
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOrvl0H18Q42y1XjXygqhDUKgg9lFolwDni3Wu3Iftli2FOXbcXo1wDSt2gbehSa_e-astNBBLN5TcASLYq_E-xqLzptGBuXWapJHUDoal8tkfZ-WzRfNmfnVvqSkyPnHiSZZcyTSgvtPTwSRjsU7iGlCwaFythfqoo7fJc609iukPxutmcOmW8wVz1c4moHO-hTJITX6vpA7aKNER1YF_Yp9Ju05Ge4RoCwElsb5kzmf5xhbrmUVjOyeSMvQxahspxFSljiDuX_85',
    }
  },
  {
    _id: 'item_3',
    title: 'Mapping Logic v2',
    type: 'code',
    content: 'const synapse = (thought) => {\n  return thought.map(node => ...);\n}',
    tags: ['TYPESCRIPT'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
  },
  {
    _id: 'item_4',
    title: 'Meeting with Nexus Lab',
    type: 'audio',
    content: 'Transcript summary: Primary focus on decentralizing the knowledge graph architecture...',
    tags: ['MEETING', 'NEXUS'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3d ago
  },
  {
    _id: 'item_5',
    title: 'Vector Search Library: FAISS Explained',
    type: 'article',
    content: 'GitHub repository for FAISS - efficient similarity search and clustering of dense vectors.',
    tags: ['VECTORS', 'SEARCH'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4d ago
    metadata: {
        source: 'github.com'
    }
  },
  {
    _id: 'item_6',
    title: 'Project: Bioluminescent Interface',
    type: 'notion',
    content: '• Define glass refraction\n• Tone down bright orange',
    tags: ['ACTIVE'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1h ago
    pinned: true,
  }
];
