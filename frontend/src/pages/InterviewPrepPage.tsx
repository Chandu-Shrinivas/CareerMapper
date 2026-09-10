import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Award, ShieldAlert,
  Send, MessageSquare, Eye, EyeOff, Trophy,
  Compass
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { api } from '../services/api';

export default function InterviewPrepPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prepParamId = searchParams.get('prepId') || searchParams.get('id');

  // Loading & State
  const [loading, setLoading] = useState(true);
  const [prepList, setPrepList] = useState<any[]>([]);
  const [activePrepId, setActivePrepId] = useState<string | null>(prepParamId);
  const [prepData, setPrepData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Question Answer Toggles
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Simulation Session State
  const [simulationMode, setSimulationMode] = useState<string>('Mixed');
  const [simulating, setSimulating] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<any>(null);
  const [simulationSummary, setSimulationSummary] = useState<any>(null);

  const initWorkspace = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch user's job preparations list
      const listRes = await api.getJobPreparations();
      const list = listRes.data || [];
      setPrepList(list);

      let targetId = activePrepId || prepParamId;
      if (!targetId && list.length > 0) {
        targetId = list[0].id;
      }

      if (!targetId) {
        setLoading(false);
        return; // Empty state
      }

      setActivePrepId(targetId);
      const detailRes = await api.getJobInterviewPrep(targetId);
      if (detailRes.status === 'success' && detailRes.data) {
        setPrepData(detailRes.data);
      } else {
        setError('Failed to load interview prep data.');
      }
    } catch (err: any) {
      console.error('[INTERVIEW PREP INIT ERROR]', err);
      setError(err.message || 'Unable to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initWorkspace();
  }, [prepParamId]);

  const handleSelectPrep = async (newPrepId: string) => {
    setActivePrepId(newPrepId);
    setLoading(true);
    try {
      const res = await api.getJobInterviewPrep(newPrepId);
      setPrepData(res.data);
      setSimulating(false);
    } catch (err: any) {
      toast.error('Failed to load selected job prep.');
    } finally {
      setLoading(false);
    }
  };

  // Start Simulation Session
  const handleStartSimulation = async () => {
    if (!activePrepId) return;
    try {
      setSubmittingResponse(true);
      const res = await api.startJobInterviewSimulation(activePrepId, simulationMode);
      if (res.status === 'success' && res.data) {
        setSimulation(res.data);
        setCurrentQuestionIdx(0);
        setUserResponse('');
        setLastFeedback(null);
        setSimulationSummary(null);
        setSimulating(true);
        toast.success(`Mock interview simulation started in ${simulationMode} mode!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to start simulation.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Submit Answer to Question
  const handleRespondSimulation = async () => {
    if (!simulation || !userResponse.trim()) {
      toast.error('Please enter your response before submitting.');
      return;
    }

    const currentQ = simulation.questions[currentQuestionIdx];
    if (!currentQ) return;

    try {
      setSubmittingResponse(true);
      const res = await api.respondJobInterviewSimulation(
        simulation._id,
        currentQ.questionId,
        userResponse
      );

      setLastFeedback(res);
      if (res.isFinished) {
        setSimulationSummary(res);
        toast.success('Simulation completed!');
      } else {
        setCurrentQuestionIdx(prev => prev + 1);
        setUserResponse('');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit answer.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const toggleAnswerReveal = (qId: string) => {
    setRevealedAnswers(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto animate-pulse">
        <Skeleton className="h-24 bg-zinc-900 w-full rounded-2xl" />
        <Skeleton className="h-44 bg-zinc-900 w-full rounded-2xl" />
        <Skeleton className="h-64 bg-zinc-900 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <Card className="bg-rose-950/20 border border-rose-500/30 p-6 space-y-3">
          <ShieldAlert className="size-10 text-rose-400 mx-auto" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">Interview Workspace Error</h2>
          <p className="text-xs text-rose-300 font-mono leading-relaxed">{error}</p>
          <Button onClick={initWorkspace} className="bg-white text-zinc-950 font-bold text-xs">
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  // Empty state if user has no job preparations
  if (!prepData) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-6 animate-fadeIn">
        <div className="size-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mx-auto">
          <Compass className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white">No Job Preparation Workspace Selected</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Interview Preparation is bound to specific jobs. Generate a preparation plan for a job posting to unlock company-specific question banks and interactive mock interviews.
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-3">
          <Button onClick={() => navigate('/my-roadmaps')} className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-10 px-5 rounded-xl shadow">
            View My Roadmaps →
          </Button>
          <Button onClick={() => navigate('/jobs')} variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 font-bold text-xs h-10 px-5 rounded-xl">
            Browse Jobs
          </Button>
        </div>
      </div>
    );
  }

  const { jobTitle, company, readinessScore, questions = [] } = prepData;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Selector & Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-zinc-950/80 border border-zinc-800 rounded-2xl shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase">
              JOB-BOUND INTERVIEW PREPARATION
            </Badge>
            {prepList.length > 1 && (
              <select
                value={activePrepId || ''}
                onChange={(e) => handleSelectPrep(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2.5 py-1 font-bold focus:outline-none"
              >
                {prepList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.jobTitle} ({p.company})
                  </option>
                ))}
              </select>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {jobTitle} at {company}
          </h1>
          <p className="text-xs text-zinc-400">
            Job-specific interview question bank, technical guide, and AI mock interview simulator.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl text-right shrink-0">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Readiness Score</span>
          <span className="font-mono text-xl font-black text-emerald-400 flex items-center gap-1.5 justify-end">
            <Award className="size-5 text-emerald-400" />
            {readinessScore}%
          </span>
        </div>
      </div>

      {/* Main Tabbed Area */}
      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="bg-zinc-900/60 border border-zinc-900 p-1 rounded-xl">
          <TabsTrigger value="questions" className="text-xs font-bold px-5">Question Bank ({questions.length})</TabsTrigger>
          <TabsTrigger value="simulator" className="text-xs font-bold px-5">AI Mock Simulator</TabsTrigger>
        </TabsList>

        {/* Tab 1: Question Bank */}
        <TabsContent value="questions" className="space-y-4">
          <div className="space-y-4">
            {questions.map((q: any, idx: number) => {
              const isRevealed = revealedAnswers[q.questionId];

              return (
                <Card key={q.questionId} className="p-5 bg-zinc-900/40 border-zinc-850 rounded-2xl space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-emerald-400">Q{idx + 1}</span>
                        <Badge variant="outline" className="border-zinc-800 text-zinc-300 text-[9px] uppercase font-bold">
                          {q.category}
                        </Badge>
                        {q.isCompanyReported && (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">
                            Reported Question
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white leading-relaxed">{q.question}</h3>
                    </div>

                    <Badge variant="outline" className={`text-[9px] uppercase font-mono px-2 py-0.5 ${
                      q.difficulty === 'Advanced' ? 'border-rose-500/30 text-rose-400' :
                      q.difficulty === 'Intermediate' ? 'border-amber-500/30 text-amber-400' :
                      'border-blue-500/30 text-blue-400'
                    }`}>
                      {q.difficulty}
                    </Badge>
                  </div>

                  {/* Toggle Evaluation Guide */}
                  <div className="pt-2 border-t border-zinc-900 flex justify-between items-center">
                    <button
                      onClick={() => toggleAnswerReveal(q.questionId)}
                      className="text-xs text-zinc-400 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      <span>{isRevealed ? 'Hide Answer Guide' : 'Show Answer & Evaluation Guide'}</span>
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2 text-xs animate-fadeIn">
                      <span className="font-bold text-emerald-400 text-[10px] uppercase tracking-wider block">Evaluation Focus & Recommended Answer Structure</span>
                      <p className="text-zinc-300 leading-relaxed">{q.answerGuide || 'Focus on structured problem solving and technical tradeoffs.'}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: AI Mock Simulator */}
        <TabsContent value="simulator" className="space-y-6">
          {!simulating ? (
            <Card className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-center max-w-xl mx-auto space-y-6">
              <div className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <MessageSquare className="size-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Interactive AI Mock Interview</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Practice answering role-specific questions for {jobTitle} at {company}. Get real-time AI evaluation and performance scoring.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="flex justify-center gap-2 flex-wrap">
                {['Mixed', 'Technical', 'Coding', 'Project', 'HR'].map(m => (
                  <button
                    key={m}
                    onClick={() => setSimulationMode(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      simulationMode === m 
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-500' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <Button
                disabled={submittingResponse}
                onClick={handleStartSimulation}
                className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-10 px-6 rounded-xl shadow cursor-pointer"
              >
                {submittingResponse ? 'Initializing...' : 'Start Mock Session →'}
              </Button>
            </Card>
          ) : simulationSummary ? (
            /* Completed Summary */
            <Card className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
              <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Trophy className="size-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Simulation Completed!</h3>
                <p className="text-xs text-zinc-400">Your mock interview response session has been evaluated.</p>
              </div>

              <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 max-w-xs mx-auto">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Overall Session Score</span>
                <span className="font-mono text-3xl font-black text-emerald-400">{simulationSummary.overallScore}%</span>
              </div>

              <Button
                onClick={() => {
                  setSimulating(false);
                  setSimulationSummary(null);
                }}
                className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-10 px-6 rounded-xl shadow"
              >
                Return to Interview Prep
              </Button>
            </Card>
          ) : (
            /* Active Simulation Trial */
            <Card className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-6 max-w-2xl mx-auto animate-fadeIn">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-900 text-xs font-mono">
                <span className="text-zinc-400 font-bold">
                  Question {currentQuestionIdx + 1} of {simulation?.questions?.length || 0}
                </span>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[9px] uppercase">
                  {simulation?.questions?.[currentQuestionIdx]?.category || 'Technical'}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white leading-relaxed">
                  {simulation?.questions?.[currentQuestionIdx]?.question}
                </h3>
              </div>

              <div className="space-y-2">
                <textarea
                  placeholder="Type your response here..."
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 h-32 resize-none"
                />
              </div>

              {lastFeedback && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-emerald-400 text-[10px] uppercase">AI Evaluation (Score: {lastFeedback.score}%)</span>
                  <p className="text-zinc-300 leading-relaxed">{lastFeedback.feedback}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  disabled={submittingResponse || !userResponse.trim()}
                  onClick={handleRespondSimulation}
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-10 px-5 rounded-xl flex items-center gap-2 cursor-pointer shadow"
                >
                  <span>{submittingResponse ? 'Evaluating...' : 'Submit Answer'}</span>
                  <Send className="size-3.5" />
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
