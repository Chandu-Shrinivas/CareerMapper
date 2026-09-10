import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Award, CheckSquare, Square, 
  MapPin, Briefcase, ArrowRight, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { CompanyLogo } from '../components/CompanyLogo';
import { api } from '../services/api';

export default function JobPreparationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [prep, setPrep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setTogglingTaskId] = useState<string | null>(null);

  const fetchPrepDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getJobPreparationById(id);
      if (res.status === 'success' && res.data) {
        setPrep(res.data);
      } else {
        setError(res.message || 'Job preparation plan not found.');
      }
    } catch (err: any) {
      console.error('[FETCH JOB PREP DETAIL ERROR]', err);
      setError(err.message || 'Failed to load job preparation plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrepDetail();
  }, [id]);

  const handleToggleTask = async (taskId: string) => {
    if (!id) return;
    try {
      setTogglingTaskId(taskId);
      const res = await api.togglePreparationTask(id, taskId);
      toast.success(res.newStatus === 'COMPLETED' ? 'Task marked complete!' : 'Task marked pending.');

      if (prep) {
        const updatedTasks = res.tasks || prep.tasks.map((t: any) => t.id === taskId ? { ...t, status: res.newStatus } : t);
        setPrep({
          ...prep,
          completedTasks: res.completedTasks,
          totalTasks: res.totalTasks,
          progressPercentage: res.progressPercentage,
          tasks: updatedTasks
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update task.');
    } finally {
      setTogglingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-36 w-full rounded-2xl bg-zinc-900" />
        <Skeleton className="h-28 w-full rounded-xl bg-zinc-900" />
        <Skeleton className="h-64 w-full rounded-xl bg-zinc-900" />
      </div>
    );
  }

  if (error || !prep) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <Card className="bg-rose-950/20 border border-rose-500/30 p-6 space-y-3">
          <AlertTriangle className="size-10 text-rose-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Job Preparation Plan Not Found</h2>
          <p className="text-xs text-rose-300 font-mono">{error || 'The requested job preparation plan does not exist.'}</p>
          <Button onClick={() => navigate('/my-roadmaps')} className="bg-white text-zinc-950 font-bold text-xs">
            Back to My Roadmaps
          </Button>
        </Card>
      </div>
    );
  }

  const tasksByPhase: Record<string, any[]> = {};
  (prep.phases || []).forEach((phase: any) => {
    tasksByPhase[phase.phaseId] = (prep.tasks || []).filter((t: any) => t.phaseId === phase.phaseId);
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Top Back Navigation */}
      <button
        onClick={() => navigate('/my-roadmaps')}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="size-4" /> Back to My Roadmaps
      </button>

      {/* Header Card */}
      <Card className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <CompanyLogo
              companyName={prep.company}
              companyLogo={prep.companyLogo}
              className="size-14 shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-1.5"
            />
            <div className="space-y-1 min-w-0">
              <Badge className="bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase">
                JOB-SPECIFIC PREPARATION ROADMAP
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {prep.jobTitle}
              </h1>
              <p className="text-xs text-zinc-400 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-zinc-200">{prep.company}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-zinc-500" /> {prep.location || 'Remote'}
                </span>
                <span>·</span>
                <span className="font-mono text-zinc-500">Source: {prep.source}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl text-right min-w-[140px]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Readiness Score</span>
              <span className="font-mono text-xl font-black text-emerald-400 flex items-center gap-1.5 justify-end">
                <Award className="size-5 text-emerald-400" />
                {prep.readinessScore}%
              </span>
            </div>

            <Button
              onClick={() => navigate(`/interview-prep?prepId=${prep._id}`)}
              className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-12 px-5 rounded-2xl shadow cursor-pointer flex items-center gap-2"
            >
              <span>Interview Prep</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Skill Gap Analysis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              ✓ Matched Skills ({prep.matchedSkills?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(prep.matchedSkills || []).map((skill: string) => (
                <Badge key={skill} variant="outline" className="border-emerald-500/30 text-emerald-300 bg-emerald-500/5 text-xs py-0.5 px-2">
                  ✓ {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              🔴 Skills to Strengthen / Gaps ({prep.missingSkills?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(prep.missingSkills || []).map((skill: string) => (
                <Badge key={skill} variant="outline" className="border-amber-500/30 text-amber-300 bg-amber-500/5 text-xs py-0.5 px-2">
                  🔴 {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Completion Progress */}
        <div className="space-y-2 pt-2 border-t border-zinc-900">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-400 font-bold uppercase tracking-wider">Preparation Completion</span>
            <span className="text-emerald-400 font-black">{prep.completedTasks} / {prep.totalTasks} Tasks ({prep.progressPercentage}%)</span>
          </div>
          <Progress value={prep.progressPercentage} className="h-2.5 bg-zinc-900" />
        </div>
      </Card>

      {/* Phased Action Roadmap Tasks */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Briefcase className="size-5 text-emerald-400" />
          Phased Preparation Action Roadmap
        </h2>

        {(prep.phases || []).map((phase: any) => {
          const phaseTasks = tasksByPhase[phase.phaseId] || [];
          if (phaseTasks.length === 0) return null;

          return (
            <Card key={phase.phaseId} className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{phase.title}</h3>
                  <p className="text-xs text-zinc-400">{phase.description}</p>
                </div>
                <Badge variant="outline" className="border-zinc-800 text-zinc-400 font-mono text-[10px]">
                  Est. {phase.estimatedDays} Days
                </Badge>
              </div>

              <div className="space-y-3">
                {phaseTasks.map((task: any) => {
                  const isDone = task.status === 'COMPLETED';

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isDone 
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-300' 
                          : 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-750 text-white'
                      }`}
                    >
                      <button className="mt-0.5 text-emerald-400 shrink-0">
                        {isDone ? <CheckSquare className="size-5 text-emerald-400" /> : <Square className="size-5 text-zinc-600" />}
                      </button>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold ${isDone ? 'line-through text-zinc-500' : 'text-white'}`}>
                            {task.title}
                          </span>
                          <Badge variant="outline" className={`text-[9px] py-0 px-1.5 font-mono ${
                            task.priority === 'CRITICAL' ? 'border-rose-500/30 text-rose-400 bg-rose-500/5' :
                            task.priority === 'HIGH' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                            'border-zinc-800 text-zinc-400'
                          }`}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{task.description}</p>
                      </div>

                      <span className="text-[10px] font-mono text-zinc-500 shrink-0 self-center">
                        {task.estimatedTime}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
