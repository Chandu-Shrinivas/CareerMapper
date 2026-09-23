import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, ArrowRight, Award, MapPin, AlertCircle
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { CompanyLogo } from '../components/CompanyLogo';
import { api } from '../services/api';

export default function MyRoadmapsPage() {
  const navigate = useNavigate();
  const [preparations, setPreparations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobPreparations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getJobPreparations();
      if (res.status === 'success' && Array.isArray(res.data)) {
        setPreparations(res.data);
      } else {
        setError('Failed to load job preparation roadmaps.');
      }
    } catch (err: any) {
      console.error('[FETCH MY ROADMAPS ERROR]', err);
      setError(err.message || 'Unable to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobPreparations();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase px-3 py-1">
            MY JOB PREPARATION ROADMAPS
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          My Job Preparation Roadmaps
        </h1>
        <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
          Job-specific preparation roadmaps analyzing complete job descriptions, calculating deterministic readiness scores, matching your skills inventory, and providing custom preparation graphs.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl bg-zinc-900" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="bg-rose-950/20 border border-rose-500/30 p-6 text-center space-y-2">
          <p className="text-xs text-rose-300 font-bold">{error}</p>
          <button onClick={fetchJobPreparations} className="text-xs text-emerald-400 underline font-semibold">
            Retry Loading
          </button>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && preparations.length === 0 && (
        <Card className="p-12 bg-zinc-900/20 border border-zinc-900 rounded-2xl text-center space-y-5 max-w-xl mx-auto">
          <div className="size-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mx-auto">
            <Briefcase className="size-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">No job preparation roadmaps yet.</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              Open a job and choose <strong>"Prepare for this Job"</strong> to create a job-specific preparation plan.
            </p>
          </div>
          <Button onClick={() => navigate('/jobs')} className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-10 px-6 rounded-xl shadow">
            Explore Jobs →
          </Button>
        </Card>
      )}

      {/* Preparations Concise Cards Grid */}
      {!loading && !error && preparations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {preparations.map((prep) => (
            <Card
              key={prep.id}
              onClick={() => navigate(`/job-preparation/${prep.id}`)}
              className="p-6 bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all cursor-pointer group space-y-5 rounded-2xl shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <CompanyLogo 
                      companyName={prep.company} 
                      companyLogo={prep.companyLogo}
                      className="size-12 shrink-0 rounded-xl border border-zinc-800 bg-zinc-950 p-1"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {prep.jobTitle}
                      </h3>
                      <p className="text-xs text-zinc-400 flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-zinc-300">{prep.company}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-zinc-500" /> {prep.location || 'Remote'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Readiness</span>
                    <span className="font-mono text-sm font-black text-emerald-400 flex items-center gap-1 justify-end">
                      <Award className="size-3.5" /> {prep.readinessScore}% Ready
                    </span>
                  </div>
                </div>

                {/* Progress breakdown */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400 font-bold">Preparation Completion</span>
                    <span className="text-zinc-300 font-bold">{prep.completedNodes || 0} / {prep.totalNodes || 0} Topics</span>
                  </div>
                  <Progress value={prep.progressPercentage || 0} className="h-2 bg-zinc-950" />
                </div>
              </div>

              {/* Card Footer Summary */}
              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-zinc-500 font-mono text-[10px]">
                  <span>{prep.totalGapsCount || 0} gaps remaining</span>
                  <span>·</span>
                  <span className="text-rose-400 font-bold">{prep.criticalGapsCount || 0} critical gaps</span>
                </div>

                <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Continue Preparation <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
