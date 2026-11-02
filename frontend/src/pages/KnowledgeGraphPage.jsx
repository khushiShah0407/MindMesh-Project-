import React, { useState, useRef, useEffect } from 'react';
import {
  Share2,
  Search,
  Zap,
  ExternalLink,
} from 'lucide-react';

export const KnowledgeGraphPage = ({
  nodes: initialNodes,
  edges: initialEdges,
  onNavigate,
  darkMode,
}) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(nodes[0] || null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [physicsEnabled, setPhysicsEnabled] = useState(true);

  const canvasRef = useRef(null);
  const draggingNodeRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const categoryColors = {
    'AI Systems': '#06b6d4',
    'Product Strategy': '#3b82f6',
    'Market Research': '#a855f7',
    'Personal Ideas': '#f59e0b',
    'Papers & Books': '#10b981',
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = darkMode ? 'rgba(99, 102, 241, 0.04)' : 'rgba(0, 0, 0, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Edges
      edges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) return;

        const isSourceVisible = activeCategory === 'ALL' || sourceNode.category === activeCategory;
        const isTargetVisible = activeCategory === 'ALL' || targetNode.category === activeCategory;
        if (!isSourceVisible && !isTargetVisible) return;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);

        if (edge.isAiSuggested) {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = darkMode ? 'rgba(99, 102, 241, 0.22)' : 'rgba(99, 102, 241, 0.35)';
          ctx.setLineDash([]);
          ctx.lineWidth = 1;
        }

        ctx.stroke();
        ctx.restore();
      });

      // Draw Nodes
      nodes.forEach((node) => {
        const isVisible = activeCategory === 'ALL' || node.category === activeCategory;
        const isSelected = selectedNode?.id === node.id;
        const color = categoryColors[node.category] || '#6366f1';

        ctx.save();

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
          ctx.fillStyle = `${color}33`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = isVisible ? color : 'rgba(148, 163, 184, 0.2)';
        ctx.shadowColor = color;
        ctx.shadowBlur = isSelected ? 15 : 6;
        ctx.fill();

        ctx.font = '11px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = isSelected
          ? (darkMode ? '#ffffff' : '#0f172a')
          : isVisible
          ? (darkMode ? '#94a3b8' : '#475569')
          : 'rgba(148, 163, 184, 0.3)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + (isSelected ? 20 : 18));

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, edges, selectedNode, activeCategory, physicsEnabled, darkMode]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
      if (dist <= 18) {
        draggingNodeRef.current = node;
        dragOffsetRef.current = { x: node.x - mouseX, y: node.y - mouseY };
        setSelectedNode(node);
        return;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const updatedNode = draggingNodeRef.current;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === updatedNode.id
          ? {
              ...n,
              x: mouseX + dragOffsetRef.current.x,
              y: mouseY + dragOffsetRef.current.y,
            }
          : n
      )
    );
  };

  const handleMouseUp = () => {
    draggingNodeRef.current = null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 lg:p-8 space-y-4">
      {/* Top Header matching Screenshot 10 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Knowledge graph
            </h1>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
              darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Drag nodes · click to inspect · dashed violet edges are AI suggestions awaiting approval
          </p>
        </div>

        {/* Right Search & Physics */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Find a node..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                const match = nodes.find((n) =>
                  n.label.toLowerCase().includes(e.target.value.toLowerCase())
                );
                if (match) setSelectedNode(match);
              }}
              className={`pl-8 pr-3 py-1.5 text-xs rounded-lg w-48 border focus:outline-none focus:border-indigo-500 ${
                darkMode ? 'bg-[#0c1024] border-indigo-950 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          <button
            onClick={() => setPhysicsEnabled(!physicsEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              physicsEnabled
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                : darkMode
                ? 'bg-[#0c1024] text-slate-400 border-indigo-950 hover:text-white'
                : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>PHYSICS</span>
          </button>
        </div>
      </div>

      {/* Category Pills Row matching Screenshot 10 */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1 text-xs rounded-lg border transition-all ${
            activeCategory === 'ALL'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : darkMode
              ? 'bg-[#0c1024] text-slate-400 border-indigo-950 hover:text-slate-200'
              : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
          }`}
        >
          All Clusters
        </button>

        {Object.entries(categoryColors).map(([cat, col]) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-3 py-1 text-xs rounded-lg border transition-all ${
              activeCategory === cat
                ? 'bg-indigo-950 text-white border-indigo-600'
                : darkMode
                ? 'bg-[#0c1024] text-slate-400 border-indigo-950 hover:text-slate-200'
                : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col }} />
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Main Canvas & Inspector Area */}
      <div className={`flex-1 relative rounded-xl border overflow-hidden flex ${
        darkMode ? 'border-indigo-950/80 bg-[#070914]' : 'border-slate-200 bg-slate-100'
      }`}>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Right Node Inspector Drawer */}
        <div className={`w-80 border-l p-5 flex flex-col justify-between overflow-y-auto backdrop-blur-md ${
          darkMode ? 'border-indigo-950/80 bg-[#090d20]/95 text-white' : 'border-slate-200 bg-white/95 text-slate-900'
        }`}>
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  style={{
                    color: categoryColors[selectedNode.category],
                    borderColor: `${categoryColors[selectedNode.category]}40`,
                    backgroundColor: `${categoryColors[selectedNode.category]}15`,
                  }}
                >
                  {selectedNode.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {Math.round(selectedNode.confidence * 100)}% Confidence
                </span>
              </div>

              <div>
                <h3 className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {selectedNode.label}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5 capitalize">
                  Entity type: {selectedNode.type}
                </div>
              </div>

              <div className={`p-3 border rounded-lg space-y-2 text-xs ${
                darkMode ? 'bg-[#0d132d] border-indigo-950' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Provenance & Source
                </div>
                <div className={darkMode ? 'text-slate-200' : 'text-slate-700'}>{selectedNode.provenance}</div>
                <div className="text-[11px] text-indigo-400 font-mono">
                  Source: {selectedNode.source}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Connected Relationships
                </div>
                <div className="space-y-1.5">
                  {edges
                    .filter(
                      (e) => e.source === selectedNode.id || e.target === selectedNode.id
                    )
                    .map((edge, i) => {
                      const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const otherNode = nodes.find((n) => n.id === otherId);
                      return (
                        <div
                          key={i}
                          onClick={() => otherNode && setSelectedNode(otherNode)}
                          className={`p-2 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                            darkMode ? 'bg-[#0e1329] border-indigo-950/80 hover:border-indigo-700/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                            {otherNode?.label || otherId}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {edge.relationship}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedNode.type === 'note') onNavigate('notes');
                  if (selectedNode.type === 'meeting') onNavigate('meetings');
                  if (selectedNode.type === 'document') onNavigate('documents');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
              >
                <span>Open Source Item</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs">
              <Share2 className="w-8 h-8 text-indigo-900 mb-2" />
              <p>Click any node to inspect its type, cluster, relationships, and provenance.</p>
            </div>
          )}

          <div className={`pt-4 border-t text-[10px] font-mono ${darkMode ? 'border-indigo-950 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
            {nodes.length} NODES · {edges.length} EDGES · DEMO
          </div>
        </div>
      </div>
    </div>
  );
};
