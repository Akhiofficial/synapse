import React, { useRef, useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useDashboard } from '../../dashboard/hooks/useDashboard';

const NeuralGraphView = ({ data, onNodeClick, filterTopic }) => {
  const graphRef = useRef();

  // Filter logic handled in parent (GraphPage), but we can adjust visual density here
  const filteredLinks = useMemo(() => {
    if (!filterTopic) return data.links;
    return data.links.filter(l => {
      const sourceNode = data.nodes.find(n => n.id === l.source.id || n.id === l.source);
      const targetNode = data.nodes.find(n => n.id === l.target.id || n.id === l.target);
      return (sourceNode?.topic === filterTopic || targetNode?.topic === filterTopic);
    });
  }, [data, filterTopic]);

  const filteredData = useMemo(() => ({
    nodes: data.nodes,
    links: filteredLinks
  }), [data.nodes, filteredLinks]);

  // Handle custom node rendering to match Stitch "Glow" aesthetic
  const paintNode = useCallback((node, ctx, globalScale) => {
    // Ensure coordinates are valid (non-finite values cause Canvas errors)
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

    const label = node.title;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px "Space Grotesk"`;
    
    // Draw Glow
    const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 10);
    glowGradient.addColorStop(0, 'rgba(255, 144, 105, 0.4)');
    glowGradient.addColorStop(1, 'rgba(255, 144, 105, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath(); ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false); ctx.fill();

    // Draw Core
    ctx.fillStyle = node.topic === filterTopic ? '#ff9069' : '#fe5e1e';
    ctx.beginPath(); ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI, false); ctx.fill();

    // Draw Label (only if zoomed in enough)
    if (globalScale > 2) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(label, node.x, node.y + 10);
    }
  }, [filterTopic]);

  return (
    <div className="w-full h-full bg-brand-black cursor-grab active:cursor-grabbing">
      <ForceGraph2D
        ref={graphRef}
        graphData={filteredData}
        nodeLabel="title"
        nodeRelSize={4}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={d => d.weight * 0.01}
        linkColor={() => 'rgba(255, 255, 255, 0.08)'}
        linkWidth={d => (d.weight - 0.6) * 4}
        onNodeClick={onNodeClick}
        nodeCanvasObject={paintNode}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
};

export default NeuralGraphView;
