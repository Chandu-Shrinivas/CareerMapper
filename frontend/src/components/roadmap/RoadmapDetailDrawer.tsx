import React from 'react';
import { X, BookOpen, Check, X as XIcon, ExternalLink, Bot, Sparkles, Layers } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import type { NodeStatus } from '../../services/RoadmapProgressStore';

export interface DrawerNodeData {
  id: string;
  title: string;
  type: string;
  description?: string;
  parentId?: string;
  parentTitle?: string;
  status: NodeStatus;
}

interface RoadmapDetailDrawerProps {
  node: DrawerNodeData | null;
  onClose: () => void;
  onStatusChange: (status: 'learning' | 'done' | 'skipped') => void;
  onAskAITutor?: (topicTitle: string) => void;
}

export const RoadmapDetailDrawer: React.FC<RoadmapDetailDrawerProps> = ({
  node,
  onClose,
  onStatusChange,
  onAskAITutor
}) => {
  if (!node) return null;

  const getResourcesForTopic = (title: string) => {
    const encoded = encodeURIComponent(title);
    return [
      { name: 'MDN Web Docs', url: `https://developer.mozilla.org/en-US/search?q=${encoded}`, type: 'Documentation' },
      { name: 'CareerMapper Guide', url: `https://www.google.com/search?q=${encoded}+guide`, type: 'Learning Guide' },
      { name: 'freeCodeCamp Search', url: `https://www.google.com/search?q=site:freecodecamp.org+${encoded}`, type: 'Tutorial' }
    ];
  };

  const resources = getResourcesForTopic(node.title);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 text-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-start justify-between gap-4 bg-zinc-900/50">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-mono uppercase">
                {node.type}
              </Badge>
              {node.parentTitle && (
                <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-[10px] font-mono flex items-center gap-1">
                  <Layers className="size-3" /> {node.parentTitle}
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{node.title}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-8 w-8 shrink-0 cursor-pointer"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Selector Section */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Learning Status</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onStatusChange('learning')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  node.status === 'learning'
                    ? 'bg-[#874efe] text-white border-[#874efe] shadow-lg shadow-purple-500/20'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-purple-500/50 hover:text-purple-300'
                }`}
              >
                <BookOpen className="size-3.5" />
                <span>Learning</span>
              </button>

              <button
                type="button"
                onClick={() => onStatusChange('done')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  node.status === 'done'
                    ? 'bg-[#00a843] text-white border-[#00a843] shadow-lg shadow-emerald-500/20'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-300'
                }`}
              >
                <Check className="size-3.5" />
                <span>Done</span>
              </button>

              <button
                type="button"
                onClick={() => onStatusChange('skipped')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  node.status === 'skipped'
                    ? 'bg-[#4b4d58] text-white border-[#4b4d58]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <XIcon className="size-3.5" />
                <span>Skip</span>
              </button>
            </div>
          </div>

          {/* Overview & Description */}
          <Card className="bg-zinc-900/60 border-zinc-800 p-4 rounded-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Topic Overview
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {node.description || `Master essential principles of ${node.title} to build modern, production-grade frontend applications.`}
            </p>
          </Card>

          {/* Learning Resources */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Recommended Resources</span>
            <div className="space-y-2">
              {resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all text-xs group"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors block">
                      {res.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{res.type}</span>
                  </div>
                  <ExternalLink className="size-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* AI Tutor Callout */}
          <Card className="bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="size-4 text-purple-400" />
              <span className="text-xs font-bold text-white">AI Learning Assistance</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Get an instant AI explanation, interview question breakdown, or code example for <strong className="text-zinc-200">{node.title}</strong>.
            </p>
            <Button
              type="button"
              onClick={() => onAskAITutor?.(node.title)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot className="size-4" /> Ask AI Tutor
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetailDrawer;
