import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, Layers, Layout, Server, Cloud, 
  Cpu, BarChart, Database, CheckCircle, Shield, Smartphone, Info
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../components/ui/hover-card';
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

  const categories = ['ALL', 'Engineering', 'Infrastructure', 'AI & Data', 'Mobile', 'Security'];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Compact Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Role-Based Career Roadmaps
          </h1>

          {/* HoverCard for page description */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="inline-flex items-center justify-center p-1.5 rounded-full text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 transition-colors cursor-pointer">
                <Info className="size-4" />
                <span className="sr-only">Page Info</span>
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-zinc-950 border-zinc-800 text-zinc-300 text-xs p-3.5 space-y-1.5 shadow-xl">
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

        <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase px-3 py-1 self-start sm:self-auto">
          SYSTEM 1 — CAREER LEARNING PATHS
        </Badge>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/40 p-3.5 border border-zinc-800/80 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search role roadmaps (e.g., Frontend, DevOps, AI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-zinc-950 border-zinc-800 text-xs text-white placeholder-zinc-500 rounded-xl focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl bg-zinc-900" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="bg-rose-950/20 border border-rose-500/30 p-6 text-center space-y-2">
          <p className="text-xs text-rose-300 font-bold">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs text-emerald-400 underline font-semibold">
            Retry Connection
          </button>
        </Card>
      )}

      {/* Empty Filter Results State */}
      {!loading && !error && filteredRoadmaps.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-zinc-900/20 border border-zinc-900 rounded-2xl">
          <Layers className="size-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Roadmaps Found</h3>
          <p className="text-xs text-zinc-400">Try adjusting your search keywords or category filters.</p>
        </div>
      )}

      {/* Role Roadmaps Grid - Clean & Compact */}
      {!loading && !error && filteredRoadmaps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoadmaps.map((role) => {
            const IconComponent = getCategoryIcon(role.icon);
            return (
              <Card
                key={role.slug}
                onClick={() => navigate(`/role-roadmaps/${role.slug}`)}
                className="p-5 bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all cursor-pointer group flex flex-col justify-between space-y-3 rounded-2xl shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors">
                      <IconComponent className="size-5" />
                    </div>
                    <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-[10px] font-mono">
                      {role.nodeCount} Topics
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {role.title}
                    </h3>

                    {/* HoverCard for card description */}
                    {role.description && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                          >
                            <Info className="size-3.5" />
                            <span className="sr-only">Topic Overview</span>
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent
                          side="top"
                          className="w-72 bg-zinc-950 border-zinc-800 text-zinc-300 text-xs p-3 space-y-1 shadow-xl"
                        >
                          <span className="font-bold text-white block">{role.title}</span>
                          <p className="text-zinc-400 leading-relaxed">{role.description}</p>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-zinc-900/90 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{role.category}</span>
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore Roadmap <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
