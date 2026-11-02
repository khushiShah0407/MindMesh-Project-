import React, { useEffect, useRef, useState } from 'react';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Trash2,
  Move,
  Download,
  Share2,
  Sparkles,
  Palette,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const CanvasBoardPage = ({
  items = [],
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  darkMode,
}) => {
  const [boardItems, setBoardItems] = useState(items);
  const [zoom, setZoom] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [toastNote, setToastNote] = useState(null);

  const canvasRef = useRef(null);
  const dragStateRef = useRef(null);
  const itemsSyncKey = JSON.stringify(items);

  useEffect(() => {
    setBoardItems(items);
  }, [itemsSyncKey]);

  const colors = [
    { id: 'indigo', name: 'Indigo', border: 'border-indigo-500/50', bgDark: 'bg-[#12163b]', bgLight: 'bg-indigo-50', text: 'text-indigo-400' },
    { id: 'emerald', name: 'Emerald', border: 'border-emerald-500/50', bgDark: 'bg-[#0f2922]', bgLight: 'bg-emerald-50', text: 'text-emerald-400' },
    { id: 'amber', name: 'Amber', border: 'border-amber-500/50', bgDark: 'bg-[#2b200b]', bgLight: 'bg-amber-50', text: 'text-amber-400' },
    { id: 'rose', name: 'Rose', border: 'border-rose-500/50', bgDark: 'bg-[#2d121c]', bgLight: 'bg-rose-50', text: 'text-rose-400' },
    { id: 'cyan', name: 'Cyan', border: 'border-cyan-500/50', bgDark: 'bg-[#0c2633]', bgLight: 'bg-cyan-50', text: 'text-cyan-400' },
  ];

  const getCanvasPoint = (event) => {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return { x: event.clientX, y: event.clientY };
    return {
      x: (event.clientX - bounds.left + canvasRef.current.scrollLeft) / zoom,
      y: (event.clientY - bounds.top + canvasRef.current.scrollTop) / zoom,
    };
  };

  const showError = (action, error) => {
    const message = error instanceof Error ? error.message : 'Please try again.';
    setToastNote(`${action} failed: ${message}`);
  };

  const saveItem = async (item, action) => {
    try {
      if (onUpdateItem) await onUpdateItem(item);
    } catch (error) {
      showError(action, error);
    }
  };

  const handlePointerDown = (e, item) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.stopPropagation();
    setSelectedItemId(item.id);
    const point = getCanvasPoint(e);
    dragStateRef.current = {
      id: item.id,
      pointerId: e.pointerId,
      offsetX: point.x - item.x,
      offsetY: point.y - item.y,
      startX: item.x,
      startY: item.y,
      item,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const point = getCanvasPoint(e);
    const updatedItem = {
      ...drag.item,
      x: Math.max(20, point.x - drag.offsetX),
      y: Math.max(20, point.y - drag.offsetY),
    };
    drag.item = updatedItem;

    setBoardItems((prev) =>
      prev.map((item) =>
        item.id === drag.id ? updatedItem : item
      )
    );
  };

  const handlePointerUp = (e) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragStateRef.current = null;
    const moved = drag.item.x !== drag.startX || drag.item.y !== drag.startY;
    if (moved) saveItem(drag.item, 'Saving position');
  };

  const handleAddNewNote = async (color = 'indigo') => {
    const newItem = {
      id: `c-${Date.now()}`,
      type: 'note',
      x: 100 + (boardItems.length % 5) * 40,
      y: 120 + (boardItems.length % 4) * 30,
      width: 250,
      color: color,
      title: 'New Idea Node',
      content: 'Double click to edit idea or connect to vector memory clusters.',
    };

    try {
      if (onAddItem) await onAddItem(newItem);
      setBoardItems((prev) => (
        prev.some((item) => item.id === newItem.id) ? prev : [...prev, newItem]
      ));
      setSelectedItemId(newItem.id);
      setToastNote('Added new thought node to canvas!');
      setTimeout(() => setToastNote(null), 2500);
    } catch (error) {
      showError('Adding note', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      if (onDeleteItem) await onDeleteItem(id);
      setBoardItems((prev) => prev.filter((i) => i.id !== id));
      if (selectedItemId === id) setSelectedItemId(null);
    } catch (error) {
      showError('Deleting note', error);
    }
  };

  const handleUpdateContent = (id, field, value) => {
    setBoardItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleExportBoard = () => {
    const exportData = {
      app: 'MindMesh',
      type: 'spatial_canvas',
      exportedAt: new Date().toISOString(),
      nodesCount: boardItems.length,
      items: boardItems,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmesh_canvas_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastNote('Canvas exported to JSON vault!');
    setTimeout(() => setToastNote(null), 2500);
  };

  return (
    <div
      className={`h-[calc(100vh-64px)] flex flex-col relative select-none overflow-hidden ${
        darkMode ? 'bg-[#060814] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Toast Feedback */}
      {toastNote && (
        <div role="alert" className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100%-2rem)] px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg animate-in fade-in">
          {toastNote}
        </div>
      )}

      {/* Top Floating Toolbar */}
      <div className={`p-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 z-20 ${
        darkMode ? 'bg-[#090c20]/90 border-indigo-950/80 backdrop-blur-md' : 'bg-white/90 border-slate-200 backdrop-blur-md'
      }`}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              SPATIAL CANVAS
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-tight">Mind Whiteboard</span>
          </div>

          <div className="h-4 w-px bg-slate-700/40 hidden sm:block" />

          {/* Color palette selector for new notes */}
          <div className="flex items-center gap-1">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => handleAddNewNote(c.id)}
                title={`Add ${c.name} Note`}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform hover:scale-110 ${
                  c.id === 'indigo'
                    ? 'bg-indigo-600 border-indigo-400'
                    : c.id === 'emerald'
                    ? 'bg-emerald-600 border-emerald-400'
                    : c.id === 'amber'
                    ? 'bg-amber-600 border-amber-400'
                    : c.id === 'rose'
                    ? 'bg-rose-600 border-rose-400'
                    : 'bg-cyan-600 border-cyan-400'
                }`}
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
            ))}
          </div>
        </div>

        {/* Board Zoom & Export Tools */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className={`flex items-center rounded-lg border px-1 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
              className="p-1.5 hover:text-indigo-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
              className="p-1.5 hover:text-indigo-400"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:text-indigo-400 border-l border-slate-700/40 ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleExportBoard}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              darkMode
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Infinite Canvas Field with Grid Background */}
      <div
        ref={canvasRef}
        className={`flex-1 relative overflow-auto cursor-crosshair ${
          darkMode
            ? 'bg-[radial-gradient(#1e2445_1px,transparent_1px)] [background-size:24px_24px]'
            : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]'
        }`}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        onClick={() => setSelectedItemId(null)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Render Canvas Nodes */}
        {boardItems.map((item) => {
          const colorObj = colors.find((c) => c.id === item.color) || colors[0];
          const isSelected = selectedItemId === item.id;

          return (
            <div
              key={item.id}
              onPointerDown={(e) => handlePointerDown(e, item)}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `min(${item.width || 250}px, calc(100vw - 40px))`,
                touchAction: 'none',
              }}
              className={`rounded-2xl border p-4 shadow-xl cursor-move transition-shadow duration-150 ${
                darkMode ? colorObj.bgDark : colorObj.bgLight
              } ${colorObj.border} ${
                isSelected ? 'ring-2 ring-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.4)]' : ''
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleUpdateContent(item.id, 'title', e.target.value)}
                  onBlur={(e) => saveItem({ ...item, title: e.currentTarget.value }, 'Saving note')}
                  className={`bg-transparent text-xs font-bold w-full focus:outline-none ${colorObj.text}`}
                  placeholder="Node Title..."
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card Body */}
              <textarea
                rows={3}
                value={item.content}
                onChange={(e) => handleUpdateContent(item.id, 'content', e.target.value)}
                onBlur={(e) => saveItem({ ...item, content: e.currentTarget.value }, 'Saving note')}
                className={`w-full bg-transparent text-xs leading-relaxed resize-none focus:outline-none ${
                  darkMode ? 'text-slate-200' : 'text-slate-800'
                }`}
                placeholder="Write your thought, insight, or architecture snippet..."
              />

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-black/10 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Move className="w-3 h-3 opacity-60" /> Drag to move
                </span>
                <span className="font-mono">
                  {Math.round(item.x)}, {Math.round(item.y)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Helper Pill */}
      <div className={`absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 max-w-[calc(100%-1rem)] px-3 py-1.5 rounded-full border text-[10px] sm:text-[11px] shadow-lg flex items-center gap-2 ${
        darkMode ? 'bg-slate-900/90 border-slate-700 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-700'
      }`}>
        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
        <span className="min-w-0">Click color circles to add nodes · Drag to arrange</span>
      </div>
    </div>
  );
};
