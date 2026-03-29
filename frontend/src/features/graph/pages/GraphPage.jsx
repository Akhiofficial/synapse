import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../dashboard/components/Sidebar';
import Topbar from '../../dashboard/components/Topbar';
import NeuralGraphView from '../components/NeuralGraphView';
import GraphControls from '../components/GraphControls';
import NodeDetailPanel from '../components/NodeDetailPanel';
import { DashboardProvider } from '../../dashboard/store/DashboardContext';
import axios from 'axios';

const GraphContent = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get('/api/graph?limit=100');
        setGraphData(response.data);
      } catch (err) {
        setError('Failed to sync neural connections.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraphData();
  }, []);

  const topics = useMemo(() => {
    const uniqueTopics = new Set(graphData.nodes.map(n => n.topic).filter(Boolean));
    return Array.from(uniqueTopics);
  }, [graphData.nodes]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return graphData;
    const lowerQuery = searchQuery.toLowerCase();
    const matchedNodes = graphData.nodes.filter(n => 
      n.title.toLowerCase().includes(lowerQuery) || 
      n.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
    const matchedNodeIds = new Set(matchedNodes.map(n => n.id));
    const matchedLinks = graphData.links.filter(l => 
      matchedNodeIds.has(l.source.id || l.source) || 
      matchedNodeIds.has(l.target.id || l.target)
    );
    return { nodes: graphData.nodes, links: matchedLinks };
  }, [graphData, searchQuery]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-black">
        <div className="text-brand-orange animate-pulse text-xl font-display">Initializing Neural Map...</div>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen overflow-hidden">
      <Sidebar />
      <Topbar />
      
      <main className="ml-64 h-screen pt-20 relative">
        {error && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl backdrop-blur-md">
            {error}
          </div>
        )}

        <NeuralGraphView 
          data={filteredData} 
          onNodeClick={handleNodeClick}
          filterTopic={selectedTopic}
        />

        <GraphControls 
          topics={topics}
          selectedTopic={selectedTopic}
          onTopicSelect={setSelectedTopic}
          onSearch={setSearchQuery}
          nodeCount={graphData.nodes.length}
        />

        <NodeDetailPanel 
          node={selectedNode} 
          onClose={() => setSelectedNode(null)} 
        />

        {/* Neural Overlay Effects */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-brand-orange/5 to-transparent"></div>
        
        {/* System Status Footer */}
        <div className="absolute bottom-6 left-8 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
           <div className="text-brand-orange flex items-center gap-2">
             <span className="material-symbols-outlined text-sm font-fill-1">check_circle</span>
             Neural Link OK
           </div>
           <div className="flex items-center gap-2">
             <span className="material-symbols-outlined text-sm"> Psychology </span>
             Active Thinking
           </div>
        </div>
      </main>
    </div>
  );
};

const GraphPage = () => (
  <DashboardProvider>
    <GraphContent />
  </DashboardProvider>
);

export default GraphPage;

