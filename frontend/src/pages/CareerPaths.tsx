import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Briefcase, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { getCanonicalRoleName, getRoleRoadmap, hasRoleRoadmap } from '../utils/roleResolver';

const careerPaths = [
  { title: 'Frontend Developer', domain: 'IT', desc: 'Builds and maintains user-facing web layouts.' },
  { title: 'Backend Developer', domain: 'IT', desc: 'Architects backend services, servers, and databases.' },
  { title: 'Full Stack Developer', domain: 'IT', desc: 'Handles both client-side and server-side components.' },
  { title: 'DevOps Engineer', domain: 'IT', desc: 'Manages automated deployments, server infrastructures, and scaling pipelines.' },
  { title: 'UI/UX Designer', domain: 'Design', desc: 'Researches and designs visual interfaces and prototypes.' },
  { title: 'Cloud Engineer', domain: 'IT', desc: 'Architects and operates multi-cloud virtual network infrastructures.' },
  { title: 'Data Scientist', domain: 'Data', desc: 'Extracts strategic knowledge from datasets using modeling.' },
  { title: 'Machine Learning Engineer', domain: 'Data', desc: 'Builds and deploys machine learning and AI inference systems.' },
  { title: 'Software Tester', domain: 'QA', desc: 'Writes automated checks and scenarios to ensure application health.' },
  { title: 'Data Analyst', domain: 'Data', desc: 'Cleans, interprets, and visualizes insights from datasets.' }
];

export default function CareerPaths() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');

  const filteredPaths = careerPaths.filter(path => {
    const matchesQuery = path.title.toLowerCase().includes(query.toLowerCase()) || 
                         path.desc.toLowerCase().includes(query.toLowerCase());
    const matchesDomain = activeDomain === 'All' || path.domain === activeDomain;
    return matchesQuery && matchesDomain;
  });

  const domains = ['All', 'IT', 'Data', 'Design', 'QA'];

  const handleExplore = (title: string) => {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/dashboard?role=${slug}`);
  };

  const handleViewJobs = (title: string) => {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/jobs?query=${slug}`);
  };

  return (
    <div className="flex-1 w-full bg-zinc-950 p-6 sm:p-8 space-y-6 max-w-[1000px] mx-auto animate-fadeUp">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">Career Paths Directory</h1>
        <p className="text-xs text-zinc-400">Search and explore supported career roles in the CareerMapper network.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/10 border border-zinc-900 p-4 rounded-lg">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
          <Input 
            placeholder="Search career paths..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-950/60 border-zinc-900 text-zinc-100"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setActiveDomain(dom)}
              className={`px-3 py-1 text-[11px] font-bold rounded cursor-pointer transition-all ${
                activeDomain === dom 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'bg-zinc-950 text-zinc-500 hover:text-white border border-zinc-900'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {filteredPaths.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPaths.map((path) => {
            const canonicalName = getCanonicalRoleName(path.title);
            const roadmapMatch = getRoleRoadmap(path.title);

            return (
              <Card key={path.title} className="bg-zinc-900/20 border-zinc-900 shadow-soft flex flex-col justify-between rounded-lg">
                <CardHeader className="p-5 pb-2 flex flex-row items-start justify-between space-y-0 gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white tracking-tight">{canonicalName}</h3>
                    <Badge variant="outline" className="text-[9px] uppercase font-bold border-zinc-800 bg-zinc-900/40 text-zinc-400">
                      {path.domain}
                    </Badge>
                  </div>
                  <Compass className="size-4 text-zinc-500 shrink-0 mt-0.5" />
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[32px]">{path.desc}</p>
                  <div className="flex flex-wrap items-center gap-2 w-full">
                    <Button 
                      onClick={() => handleExplore(path.title)}
                      className="flex-1 h-8 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-300 font-bold text-xs rounded border border-zinc-800 transition-colors"
                    >
                      <Compass className="mr-1.5 size-3.5" />
                      Explore
                    </Button>
                    <Button 
                      onClick={() => handleViewJobs(path.title)}
                      variant="outline"
                      className="flex-1 h-8 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <Briefcase className="mr-1.5 size-3.5 text-zinc-400" />
                      Jobs
                    </Button>
                    {roadmapMatch && (
                      <Button 
                        onClick={() => navigate(roadmapMatch.route)}
                        className="w-full sm:w-auto h-8 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded transition-colors cursor-pointer flex items-center justify-center gap-1 px-3 shadow"
                      >
                        <MapPin className="size-3" />
                        Prepare with Roadmap →
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/10 border border-zinc-900 rounded-lg">
          <p className="text-xs text-zinc-500">No career paths matches your search configurations.</p>
        </div>
      )}
    </div>
  );
}
