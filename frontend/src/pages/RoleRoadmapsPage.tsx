import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, Layers, Layout, Server, Cloud, 
  Cpu, BarChart, Database, CheckCircle, Shield, Smartphone, Info,
  Copy, ExternalLink, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../components/ui/hover-card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../components/ui/context-menu';
import { api } from '../services/api';

export default function RoleRoadmapsPage() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getRoleRoadmaps();
        if (res.status === 'success' && Array.isArray(res.data)) {
          setRoadmaps(res.data);
        } else {
          setError('Failed to load role roadmaps.');
        }
      } catch (err: any) {
        console.error('[ROLE ROADMAPS FETCH ERROR]', err);
        setError(err.message || 'Unable to connect to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return Layout;
      case 'Server': return Server;
      case 'Layers': return Layers;
      case 'Cloud': return Cloud;
      case 'Cpu': return Cpu;
      case 'BarChart': return BarChart;
      case 'Database': return Database;
      case 'CheckCircle': return CheckCircle;
      case 'Shield': return Shield;
      case 'Smartphone': return Smartphone;
      default: return Layers;
    }
  };

  const filteredRoadmaps = roadmaps.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || r.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'Engineering', 'Infrastructure', 'AI & Data', 'Mobile', 'Security', 'Management'];

  return (
    <div className="p-3 sm:p-5 md:p-6 space-y-4 max-w-7xl mx-auto animate-fadeIn">
      {/* Compact Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Role-Based Career Roadmaps
          </h1>

          {/* HoverCard for page description */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="inline-flex items-center justify-center p-1 rounded-full text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 transition-colors cursor-pointer">
                <Info className="size-3.5" />
                <span className="sr-only">Page Info</span>
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-zinc-950 border-zinc-800 text-zinc-300 text-xs p-3 space-y-1.5 shadow-xl">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-mono">
                  Career Tracks
                </Badge>
                <span>Role Roadmaps</span>
              </div>
              <p className="leading-relaxed text-zinc-400">
                Interactive, step-by-step career learning trees mapped to industry standards. Select a career track to view prerequisite topics, recommended documentation, and track learning progress.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>

        <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-mono text-[9px] uppercase px-2.5 py-0.5 self-start sm:self-auto">
          SYSTEM 1 — CAREER LEARNING PATHS
        </Badge>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/40 p-2.5 border border-zinc-800/80 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search role roadmaps (e.g., Product Manager, MLOps, Frontend)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 bg-zinc-950 border-zinc-800 text-xs text-white placeholder-zinc-500 rounded-lg focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Skeleton key={i} className="h-28 w-full rounded-xl bg-zinc-900" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="bg-rose-950/20 border border-rose-500/30 p-5 text-center space-y-2">
          <p className="text-xs text-rose-300 font-bold">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs text-emerald-400 underline font-semibold">
            Retry Connection
          </button>
        </Card>
      )}

      {/* Empty Filter Results State */}
      {!loading && !error && filteredRoadmaps.length === 0 && (
        <div className="text-center py-12 space-y-2 bg-zinc-900/20 border border-zinc-900 rounded-xl">
          <Layers className="size-8 text-zinc-600 mx-auto" />
          <h3 className="text-xs font-bold text-white">No Roadmaps Found</h3>
          <p className="text-[11px] text-zinc-400">Try adjusting your search keywords or category filters.</p>
        </div>
      )}

      {/* Role Roadmaps Grid - Compact without logos */}
      {!loading && !error && filteredRoadmaps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredRoadmaps.map((role) => {
            return (
              <ContextMenu key={role.slug}>
                <ContextMenuTrigger asChild>
                  <Card
                    onClick={() => navigate(`/role-roadmaps/${role.slug}`)}
                    className="p-3.5 bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all cursor-pointer group flex flex-col justify-between space-y-2.5 rounded-xl shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-[9px] font-mono py-0 px-1.5">
                          {role.nodeCount} Topics
                        </Badge>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{role.category}</span>
                      </div>

                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          {(() => {
                            const CategoryIcon = getCategoryIcon(role.icon);
                            return <CategoryIcon className="size-3.5 text-emerald-400 shrink-0" />;
                          })()}
                          <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {role.title}
                          </h3>
                        </div>

                        {/* HoverCard for card description */}
                        {role.description && (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-0.5 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                              >
                                <Info className="size-3" />
                                <span className="sr-only">Topic Overview</span>
                              </button>
                            </HoverCardTrigger>
                            <HoverCardContent
                              side="top"
                              className="w-64 bg-zinc-950 border-zinc-800 text-zinc-300 text-xs p-2.5 space-y-1 shadow-xl"
                            >
                              <span className="font-bold text-white block">{role.title}</span>
                              <p className="text-zinc-400 leading-relaxed text-[11px]">{role.description}</p>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/50 flex items-center justify-end text-xs">
                      <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Roadmap <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-52">
                  <ContextMenuLabel>{role.title}</ContextMenuLabel>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => navigate(`/role-roadmaps/${role.slug}`)}>
                    <ExternalLink className="mr-2 size-3.5 text-emerald-400" />
                    <span>Open Roadmap</span>
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + `/role-roadmaps/${role.slug}`);
                      toast.success(`Copied link for ${role.title}!`);
                    }}
                  >
                    <Copy className="mr-2 size-3.5 text-zinc-400" />
                    <span>Copy Share Link</span>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => setSelectedCategory(role.category)}>
                    <Filter className="mr-2 size-3.5 text-zinc-400" />
                    <span>Filter by {role.category}</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      )}
    </div>
  );
}
