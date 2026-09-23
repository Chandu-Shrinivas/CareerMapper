import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Award, CheckCircle2, RefreshCw, 
  MapPin, Briefcase, ArrowRight, AlertTriangle, Layers, BookOpen, Target
} from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { CompanyLogo } from '../components/CompanyLogo';
import { api } from '../services/api';
import { JobPreparationRoadmapView, type JobNodeStatus } from '../components/roadmap/JobPreparationRoadmapView';
import { ReadinessBreakdownModal } from '../components/roadmap/ReadinessBreakdownModal';

export default function JobPreparationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [prep, setPrep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

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

  const handleNodeStatusChange = async (nodeId: string, newStatus: JobNodeStatus) => {
    if (!id || !prep) return;
    try {
      const res = await api.togglePreparationNode(id, nodeId, newStatus);
      if (res.status === 'success' && res.data) {
        setPrep(res.data);
        toast.success(`Node status updated to ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update node status.');
    }
  };

  const handleRecalculateReadiness = async () => {
    if (!id) return;
    try {
      setRecalculating(true);
      const res = await api.recalculateReadiness(id);
      if (res.status === 'success' && res.data) {
        setPrep({ ...prep, readiness: res.data });
        toast.success('Readiness score recalculated deterministically!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Recalculation failed.');
    } finally {
      setRecalculating(false);
    }
  };

  const handleReanalyzeJob = async () => {
    if (!id) return;
    try {
      setReanalyzing(true);
      const res = await api.reanalyzeJob(id);
      if (res.status === 'success') {
        toast.success('Re-analysis complete! Check updated preparation requirements.');
        fetchPrepDetail();
      }
    } catch (err: any) {
      toast.error(err.message || 'Re-analysis failed.');
    } finally {
      setReanalyzing(false);
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

  const overallReadiness = prep.readiness?.overallReadiness ?? 50;
  const criticalGapsCount = (prep.readiness?.missingRequirements || []).filter((r: any) => r.importance === 'critical').length;
  const requiredGapsCount = (prep.readiness?.missingRequirements || []).filter((r: any) => r.importance === 'required').length;

  const matchedSkills = prep.readiness?.matchedRequirements || [];
  const learnedNodes = (prep.nodes || []).filter((n: any) => n.status === 'done');

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Back Navigation */}
      <button
        onClick={() => navigate('/my-roadmaps')}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="size-4" /> Back to My Roadmaps
      </button>

      {/* Job Details Header Card */}
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
                MY JOB PREPARATION ROADMAP
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

          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Readiness Button opening Modal */}
            <button
              onClick={() => setShowReadinessModal(true)}
              className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 px-4 py-2.5 rounded-2xl text-right cursor-pointer transition-colors group"
            >
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block group-hover:text-emerald-400">Why {overallReadiness}%?</span>
              <span className="font-mono text-xl font-black text-emerald-400 flex items-center gap-1.5 justify-end">
                <Award className="size-5 text-emerald-400" />
                {overallReadiness}% Ready
              </span>
            </button>

            <Button
              onClick={() => navigate(`/interview-prep?prepId=${prep._id}`)}
              className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-11 px-4 rounded-xl shadow cursor-pointer flex items-center gap-2"
            >
              <span>Interview Prep</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Gap Summary Row */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-zinc-900 text-xs">
          <div className="flex items-center gap-4 text-zinc-400 font-mono text-[11px] flex-wrap">
            <span className="text-rose-400 font-bold">Critical Gaps: {criticalGapsCount}</span>
            <span>·</span>
            <span className="text-amber-400 font-bold">Required Gaps: {requiredGapsCount}</span>
            <span>·</span>
            <span className="text-emerald-400 font-bold">Matched: {matchedSkills.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalculateReadiness}
              disabled={recalculating}
              className="border-zinc-800 text-zinc-300 text-[11px] h-8 font-mono"
            >
              <RefreshCw className={`size-3 mr-1 ${recalculating ? 'animate-spin' : ''}`} />
              Recalculate Readiness
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReanalyzeJob}
              disabled={reanalyzing}
              className="border-zinc-800 text-zinc-300 text-[11px] h-8 font-mono"
            >
              <RefreshCw className={`size-3 mr-1 ${reanalyzing ? 'animate-spin' : ''}`} />
              Re-analyze Job
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Feature Tabs */}
      <Tabs defaultValue="roadmap" className="space-y-6">
        <TabsList className="bg-zinc-950 border border-zinc-850 p-1 rounded-xl">
          <TabsTrigger value="roadmap" className="text-xs font-bold font-mono">
            🗺️ Preparation Roadmap
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-xs font-bold font-mono">
            📚 Skills Learned ({learnedNodes.length})
          </TabsTrigger>
          <TabsTrigger value="interview" className="text-xs font-bold font-mono">
            🎯 Interview Mapping ({prep.interviewQuestions?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Roadmap View */}
        <TabsContent value="roadmap" className="space-y-6">
          <JobPreparationRoadmapView
            nodes={prep.nodes || []}
            edges={prep.edges || []}
            nodeStatuses={prep.nodeStatuses || {}}
            onNodeStatusChange={handleNodeStatusChange}
          />
        </TabsContent>

        {/* Tab 2: Skills Learned */}
        <TabsContent value="skills" className="space-y-6">
          <Card className="p-6 bg-zinc-950/70 border border-zinc-900 rounded-2xl space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                Already Matched Profile Skills ({matchedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((req: any) => (
                  <Badge key={req.id || req.name} variant="outline" className="border-emerald-500/30 text-emerald-300 bg-emerald-500/5 text-xs py-1 px-3">
                    ✓ {req.name || req}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="size-4 text-amber-400" />
                Skills Learned During Preparation ({learnedNodes.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {learnedNodes.length > 0 ? (
                  learnedNodes.map((n: any) => (
                    <Badge key={n.id} variant="outline" className="border-amber-500/30 text-amber-300 bg-amber-500/5 text-xs py-1 px-3">
                      ✓ {n.title}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic">No nodes completed during job preparation yet.</p>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Interview Mapping */}
        <TabsContent value="interview" className="space-y-6">
          <Card className="p-6 bg-zinc-950/70 border border-zinc-900 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="size-4 text-emerald-400" />
              Targeted Interview Questions for {prep.jobTitle}
            </h3>
            <div className="space-y-3">
              {(prep.interviewQuestions || []).map((q: any) => (
                <div key={q.questionId} className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">{q.question}</span>
                    <Badge variant="outline" className="border-zinc-800 text-zinc-400 font-mono text-[9px]">
                      {q.difficulty}
                    </Badge>
                  </div>
                  {q.answerGuide && (
                    <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950 p-2.5 rounded-lg border border-zinc-900">
                      💡 <strong>Answer Guide:</strong> {q.answerGuide}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Readiness Score Explainability Modal */}
      <ReadinessBreakdownModal
        open={showReadinessModal}
        onOpenChange={setShowReadinessModal}
        readiness={prep.readiness}
        jobTitle={prep.jobTitle}
        company={prep.company}
      />
    </div>
  );
}
