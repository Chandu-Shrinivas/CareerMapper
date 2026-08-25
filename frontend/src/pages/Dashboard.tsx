import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, AlertCircle, Building2, Search, Check, Loader2, Circle, RotateCw, Briefcase
} from 'lucide-react';
import { gsap } from 'gsap';
import { 
  Line, LineChart, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { authService } from '../services/auth';
import { api } from '../services/api';
import { SkillIcon } from '../components/SkillIcon';
import type { Skill, CareerMatch, SkillMatch, SkillGapEntry } from '../types';

const DRAFT_KEY = 'cm_profile_draft';

const standardRoleSkills: Record<string, string[]> = {
  'frontend developer': ['react', 'javascript', 'html', 'css', 'typescript', 'testing'],
  'backend developer': ['node', 'sql', 'databases', 'apis', 'python', 'go'],
  'full stack developer': ['react', 'node', 'javascript', 'sql', 'html', 'css'],
  'ui/ux designer': ['figma', 'design systems', 'wireframing', 'user research'],
  'devops engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux'],
  'data scientist': ['python', 'pandas', 'machine learning', 'sql', 'statistics'],
  'software tester': ['testing', 'selenium', 'cypress', 'javascript', 'qa'],
  'data analyst': ['sql', 'excel', 'tableau', 'python', 'statistics'],
  'cloud engineer': ['aws', 'cloud', 'terraform', 'security', 'linux']
};

const getRelativeTimeString = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return 'just now';
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  if (isNaN(diffMs) || diffMs < 0) return 'just now';
  
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRoleSlug = searchParams.get('role');
  const dashboardRef = useRef<HTMLDivElement>(null);

  // State Management
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<CareerMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Market Intelligence State
  const [marketData, setMarketData] = useState<any>(null);
  const [marketLoading, setMarketLoading] = useState<boolean>(false);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<number>(1);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [forceRefreshTrigger, setForceRefreshTrigger] = useState<number>(0);
  const [isForcedRefresh, setIsForcedRefresh] = useState<boolean>(false);
  const [staleWarning, setStaleWarning] = useState<boolean>(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState<boolean>(false);
  
  // Interactive filters for Company Listings
  const [companySearch, setCompanySearch] = useState<string>('');
  const [companyLocation, setCompanyLocation] = useState<string>('all');
  const [companyExperience, setCompanyExperience] = useState<string>('all');

  // Authentication & Onboarding Guards check
  useEffect(() => {
    const session = authService.getSession();
    if (!session.authenticated) {
      navigate('/signin');
      return;
    }

    const rawDraft = localStorage.getItem(DRAFT_KEY);
    if (!rawDraft) {
      navigate('/onboarding');
      return;
    }

    try {
      const parsedDraft = JSON.parse(rawDraft);
      if (parsedDraft.step < 4 && !parsedDraft.onboardingCompleted) {
        navigate('/onboarding');
        return;
      }
      setProfile(parsedDraft);
    } catch {
      navigate('/onboarding');
    }
  }, [navigate]);

  // Dynamic recommendations fetch
  const fetchRecommendations = async (currentProfile: any) => {
    setLoading(true);
    setError(null);
    try {
      const userSkills: Skill[] = currentProfile.skills || [];
      const result = await api.updateSkills(userSkills);
      setRecommendations(result.otherMatches ? [result.topMatch, ...result.otherMatches].filter(Boolean) as CareerMatch[] : []);
    } catch (err: any) {
      setError(err.message || 'Career analysis couldn\'t be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchRecommendations(profile);
    }
  }, [profile]);

  // Dynamic market analysis fetch
  useEffect(() => {
    if (!selectedRoleSlug) {
      setMarketData(null);
      setMarketError(null);
      setStaleWarning(false);
      return;
    }

    const isForced = isForcedRefresh;

    // Immediately clear previous role's market data if this is NOT a manual forced refresh on the same role
    if (!isForced) {
      setMarketData(null);
      setMarketError(null);
      setStaleWarning(false);
    }

    let active = true;

    const fetchMarketData = async () => {
      setMarketLoading(true);
      if (!isForced) setMarketError(null);

      console.log(`[MARKET FRONTEND] role=${selectedRoleSlug} country=India forceRefresh=${isForced} fetchStarted=true`);

      try {
        // Build skills query from current profile snapshot (reading from localStorage snapshot prevents unnecessary re-fetches)
        const currentProfile = JSON.parse(localStorage.getItem('cm_profile_draft') || '{}');
        const skillsQuery = currentProfile?.skills
          ? currentProfile.skills.map((s: any) => `${s.name}:${s.proficiency || 'beginner'}`).join(',')
          : '';

        const data = await api.getMarketAnalysis(selectedRoleSlug, 'India', skillsQuery, isForced);
        console.log(`[MARKET FRONTEND] role=${selectedRoleSlug} fetchCompleted=true cacheHit=${data?.isCacheHit}`);

        if (active) {
          setMarketData(data);
          setMarketError(null);
          setStaleWarning(false);
        }
      } catch (err: any) {
        console.error(`[MARKET FRONTEND] role=${selectedRoleSlug} fetchFailed=true error="${err.message}"`);
        if (active) {
          if (isForced && marketData) {
            // On forced refresh error when cached data is already visible, retain old data & warn user
            setStaleWarning(true);
          } else {
            setMarketError(err.message || 'Market intelligence is temporarily unavailable.');
            setMarketData(null);
          }
        }
      } finally {
        if (active) {
          setMarketLoading(false);
          setIsForcedRefresh(false);
        }
      }
    };

    fetchMarketData();

    return () => {
      active = false;
    };
  }, [selectedRoleSlug, forceRefreshTrigger, retryCount]);

  const handleManualRefresh = () => {
    if (marketLoading) return;
    setIsForcedRefresh(true);
    setForceRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!marketLoading) {
      setLoadingStage(1);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < 5) return prev + 1;
        return prev;
      });
    }, 3000); // 3 seconds per stage to align with a cold backend response
    return () => clearInterval(interval);
  }, [marketLoading]);

  // GSAP Entrance Animations for Dashboard Overview
  useEffect(() => {
    if (!loading && recommendations.length > 0 && !selectedRoleSlug && dashboardRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        
        tl.fromTo('.animate-fade', 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );

        tl.fromTo('.animate-profile', 
          { opacity: 0, y: -10 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        );

        tl.fromTo('.animate-card', 
          { opacity: 0, y: 35 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08 },
          '-=0.3'
        );
      }, dashboardRef);

      return () => ctx.revert();
    }
  }, [loading, recommendations, selectedRoleSlug]);

  // GSAP Entrance Animations for Selected Role Workspace
  useEffect(() => {
    if (!loading && selectedRoleSlug && dashboardRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.fromTo('.animate-workspace-header', 
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
        tl.fromTo('.animate-workspace-content', 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        );
      }, dashboardRef);
      return () => ctx.revert();
    }
  }, [loading, selectedRoleSlug]);

  // Helper: Get counts of skill levels as readable string
  const getSkillsSummary = () => {
    const counts = { expert: 0, advanced: 0, intermediate: 0, beginner: 0 };
    if (profile && profile.skills) {
      profile.skills.forEach((s: Skill) => {
        const lvl = s.proficiency.toLowerCase();
        if (counts[lvl as keyof typeof counts] !== undefined) {
          counts[lvl as keyof typeof counts]++;
        }
      });
    }
    const list = [];
    if (counts.expert > 0) list.push(`${counts.expert} Expert`);
    if (counts.advanced > 0) list.push(`${counts.advanced} Advanced`);
    if (counts.intermediate > 0) list.push(`${counts.intermediate} Intermediate`);
    if (counts.beginner > 0) list.push(`${counts.beginner} Beginner`);
    return list.join(', ') || '0 skills';
  };

  const totalSkillsCount = profile?.skills?.length || 0;

  // Navigates to existing skills step inside onboarding wizard
  const handleEditSkills = () => {
    try {
      const draftRaw = localStorage.getItem(DRAFT_KEY);
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        draft.step = 3;
        draft.onboardingStep = 3;
        draft.onboardingCompleted = false;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      }
    } catch (e) {}
    navigate('/onboarding');
  };

  // Match category resolver
  const getMatchCategory = (score: number) => {
    if (score >= 80) return { label: 'Strong match', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if (score >= 60) return { label: 'Good match', color: 'bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700' };
    if (score >= 40) return { label: 'Potential match', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
    return { label: 'Low match', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
  };





  const getSlug = (title: string) => title.toLowerCase().replace(/[\s/]+/g, '-');

  // Contextual Citations State
  const [citationOpen, setCitationOpen] = useState(false);
  const [citationTitle, setCitationTitle] = useState('');
  const [citations, setCitations] = useState<any[]>([]);

  const openCitations = (title: string, items: any[]) => {
    setCitationTitle(title);
    setCitations(items || []);
    setCitationOpen(true);
  };

  // Skill Frequency calculation based on analyzed job postings (real counts only)
  const getSkillFrequencyData = () => {
    if (!marketData || !marketData.companies || marketData.companies.length === 0) return null;
    const counts: Record<string, number> = {};
    marketData.companies.forEach((job: any) => {
      const skills = [...(job.requiredSkills || []), ...(job.preferredSkills || [])];
      skills.forEach((s: string) => {
        const clean = s.trim();
        if (clean) {
          counts[clean] = (counts[clean] || 0) + 1;
        }
      });
    });
    
    const data = Object.entries(counts).map(([name, count]) => ({
      skill: name,
      count,
      percentage: Math.round((count / marketData.companies.length) * 100)
    }));

    if (data.length === 0) return null;

    // Sort descending and take top 6
    return data.sort((a, b) => b.count - a.count).slice(0, 6);
  };

  // Group salaries by currency and period (enforcing Data Honesty)
  const getSalaryGroups = () => {
    if (!marketData || !marketData.salary) return {};
    const groups: Record<string, any[]> = {};
    marketData.salary.forEach((sal: any) => {
      const key = `${sal.currency}:${sal.period}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(sal);
    });
    return groups;
  };

  const getValidHistoricalData = () => {
    if (!marketData) return null;

    // Use the new structured historicalTrend (index based)
    const trend = marketData.historicalTrend;
    if (trend && trend.available === true && Array.isArray(trend.data) && trend.data.length >= 3) {
      // Sort by year (numeric)
      const allPoints = [...trend.data].sort((a: any, b: any) => Number(a.year) - Number(b.year));
      
      return {
        metric: trend.metric || 'normalized job demand index',
        baseYear: trend.baseYear || 2016,
        baseValue: trend.baseValue || 100,
        allPoints: allPoints.map((p: any) => ({
          year: String(p.year),
          value: p.value !== null ? Number(p.value) : null,
          type: p.type || 'predicted'
        })),
        method: trend.method || '',
        observedEvidence: Array.isArray(trend.observedEvidence) ? trend.observedEvidence : [],
        confidence: trend.confidence || 'medium'
      };
    }

    return null;
  };



  const getActiveRoleMatch = (): CareerMatch | null => {
    if (!selectedRoleSlug) return null;
    const found = recommendations.find(r => getSlug(r.roleTitle) === selectedRoleSlug);
    if (found) return found;

    const roleTitle = selectedRoleSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const expected = standardRoleSkills[selectedRoleSlug.replace(/-/g, ' ')] || [];
    
    const userSkills = profile?.skills || [];
    const matchedSkills: SkillMatch[] = [];
    const gaps: SkillGapEntry[] = [];
    
    expected.forEach(skillName => {
      const hasSkill = userSkills.find((s: Skill) => s.name.toLowerCase() === skillName.toLowerCase());
      if (hasSkill) {
        matchedSkills.push({
          skillId: skillName,
          skillName: skillName,
          status: 'strong'
        });
      } else {
        gaps.push({
          skillName: skillName,
          gapType: 'learn'
        });
      }
    });
    
    const score = expected.length > 0 ? Math.round((matchedSkills.length / expected.length) * 100) : 40;
    
    return {
      id: selectedRoleSlug,
      roleTitle,
      domain: 'it',
      matchScore: score,
      summary: `Alignment with your current ${roleTitle} skill profile.`,
      matchedSkills,
      gaps
    };
  };

  const activeRoleMatch = getActiveRoleMatch();

  // Emphasize the #1 recommended role
  const recommendedRole = recommendations[0];
  const otherMatches = recommendations.slice(1);

  return (
    <div className="flex-1 w-full bg-zinc-955 p-6 sm:p-8" ref={dashboardRef}>
      {loading ? (
        /* Skeletons */
        <div className="space-y-8 max-w-[1000px] mx-auto">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-zinc-900" />
            <Skeleton className="h-4 w-72 bg-zinc-900" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-44 bg-zinc-900 w-full" />
            <Skeleton className="h-36 bg-zinc-900 w-full" />
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <AlertCircle className="size-10 text-red-500 animate-bounce" />
          <h2 className="font-display text-base font-bold text-white">Career analysis couldn't be loaded</h2>
          <p className="text-[11px] text-zinc-400 max-w-[320px]">
            We encountered a network issue communicating with the recommender server. Please check your connection.
          </p>
          <Button onClick={() => fetchRecommendations(profile)} className="h-9 px-4 bg-white text-zinc-950 font-bold hover:bg-zinc-200 rounded-md cursor-pointer text-xs">
            Try again
          </Button>
        </div>
      ) : selectedRoleSlug && activeRoleMatch ? (
        
        /* ==========================================
           DEDICATED ROLE EXPLORATION WORKSPACE
           ========================================== */
        <div className="space-y-6 max-w-[1000px] mx-auto">
          
          {/* Back button and workspace header */}
          <div className="space-y-4 animate-workspace-header">
            <button 
              onClick={() => setSearchParams({})} 
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              Back to Career Analysis
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-zinc-900/10 border border-zinc-900 rounded-lg">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-white tracking-tight capitalize">{activeRoleMatch.roleTitle}</h1>
                  
                  <button
                    disabled={marketLoading}
                    onClick={handleManualRefresh}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                    title="Force fresh market research using live web grounding"
                  >
                    <RotateCw className={`size-3 text-zinc-400 ${marketLoading ? 'animate-spin' : ''}`} />
                    <span>{marketLoading && isForcedRefresh ? 'Refreshing...' : 'Refresh market data'}</span>
                  </button>

                  {marketData?.generatedAt && (
                    <span className="text-[10px] font-mono text-zinc-500">
                      Market data · Updated {getRelativeTimeString(marketData.generatedAt)}
                    </span>
                  )}

                  {staleWarning && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 border border-amber-800/60 px-2 py-0.5 rounded">
                      Unable to refresh · Showing cached data
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">IT · {marketData?.country || 'India'}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-6 sm:gap-8 items-center pt-2 md:pt-0">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Role Match</span>
                  <span className="font-mono text-sm sm:text-base font-extrabold text-white">{activeRoleMatch.matchScore}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Market Status</span>
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-400 capitalize">{marketData?.demand?.status || 'Growing'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Readiness</span>
                  <span className="font-mono text-sm sm:text-base font-extrabold text-white">{marketData?.userGap?.marketReadiness || 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workspace tabs panel */}
          <div className="animate-workspace-content">
            {marketLoading ? (
              <Card className="bg-zinc-900/10 border border-zinc-900 rounded-lg p-6 max-w-xl mx-auto space-y-6 animate-pulse-once">
                <div className="space-y-1 text-center">
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin text-zinc-400" />
                    Researching {activeRoleMatch.roleTitle}
                  </h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-mono">
                    Step {loadingStage} of 5
                  </p>
                </div>

                <div className="space-y-3 font-medium text-xs">
                  {[
                    { step: 1, label: "Researching market data..." },
                    { step: 2, label: "Searching hiring sources..." },
                    { step: 3, label: "Collecting employer requirements..." },
                    { step: 4, label: "Analyzing market trends..." },
                    { step: 5, label: "Preparing market insights..." }
                  ].map((s) => {
                    const isDone = loadingStage > s.step;
                    const isActive = loadingStage === s.step;
                    
                    return (
                      <div key={s.step} className="flex items-center gap-2.5 text-zinc-300">
                        {isDone ? (
                          <Check className="size-4 text-emerald-500 shrink-0" />
                        ) : isActive ? (
                          <Loader2 className="size-4 animate-spin text-white shrink-0" />
                        ) : (
                          <Circle className="size-4 text-zinc-700 shrink-0 animate-pulse" />
                        )}
                        <span className={isDone ? "text-zinc-500 line-through" : isActive ? "text-white font-bold" : "text-zinc-500"}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <Progress value={(loadingStage / 5) * 100} className="h-1.5 bg-zinc-950 border border-zinc-900" />
                  <p className="text-[11px] text-zinc-400 italic text-center">
                    {loadingStage === 1 && "Researching market data..."}
                    {loadingStage === 2 && "Searching hiring sources..."}
                    {loadingStage === 3 && "Collecting employer requirements..."}
                    {loadingStage === 4 && "Analyzing market trends..."}
                    {loadingStage === 5 && "Preparing market insights..."}
                  </p>
                </div>
              </Card>
            ) : marketError ? (
              <div className="p-8 bg-zinc-900/10 border border-zinc-900 rounded-lg text-center space-y-3">
                <AlertCircle className="size-8 text-red-500 mx-auto" />
                <h3 className="font-display text-sm font-bold text-white">Market intelligence is temporarily unavailable</h3>
                <p className="text-xs text-zinc-400 max-w-[360px] mx-auto">
                  {marketError}
                </p>
                <Button onClick={() => setRetryCount(prev => prev + 1)} className="h-7 px-3 bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] rounded hover:bg-zinc-800">
                  Try again
                </Button>
              </div>
            ) : marketData ? (
              <Tabs defaultValue="overview" className="w-full space-y-6">
                <TabsList className="bg-zinc-950 border border-zinc-900 p-0.5 h-10 w-full justify-start overflow-x-auto overflow-y-hidden rounded-md flex">
                  <TabsTrigger value="overview" className="flex-1 py-1.5 text-xs font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Overview</TabsTrigger>
                  <TabsTrigger value="market" className="flex-1 py-1.5 text-xs font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Market</TabsTrigger>
                  <TabsTrigger value="skills" className="flex-1 py-1.5 text-xs font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Skills</TabsTrigger>
                  <TabsTrigger value="companies" className="flex-1 py-1.5 text-xs font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Companies</TabsTrigger>
                  <TabsTrigger value="salary" className="flex-1 py-1.5 text-xs font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Salary</TabsTrigger>
                  <TabsTrigger value="your-gap" className="flex-1 py-1.5 text-xs font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Your Gap</TabsTrigger>
                </TabsList>

                {/* Tab 1: Overview */}
                <TabsContent value="overview" className="space-y-6 focus-visible:ring-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="space-y-6 md:col-span-2">
                      <div className="space-y-2.5">
                        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">What is this role?</h2>
                        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/10 p-5 border border-zinc-900 rounded-lg">
                          {marketData.overview?.description || 'No description available.'}
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Responsibilities</h2>
                        <div className="bg-zinc-900/10 p-5 border border-zinc-900 rounded-lg space-y-2">
                          {marketData.overview?.responsibilities?.map((resp: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                              <span className="text-zinc-500 font-mono mt-0.5">•</span>
                              <span>{resp}</span>
                            </div>
                          )) || <span className="text-xs text-zinc-500">No responsibilities listed.</span>}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Work Environment</h2>
                        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/10 p-5 border border-zinc-900 rounded-lg">
                          {marketData.overview?.environment || 'Typical environment statistics not specified.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Experience Profile</span>
                          <span className="text-xs text-white font-semibold">{marketData.overview?.experienceLevels || 'All levels'}</span>
                        </div>
                        <div className="h-px bg-zinc-900" />
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Primary Tools & Tech</span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {marketData.overview?.technologies?.map((tech: any) => {
                              const techName = typeof tech === 'object' && tech !== null ? tech.display || tech.canonical : tech;
                              const techKey = typeof tech === 'object' && tech !== null ? tech.canonical || tech.display || tech._id : tech;
                              return (
                                <Badge key={techKey} variant="outline" className="bg-zinc-950 text-zinc-300 border-zinc-800 text-[10px] py-0.5 px-2 flex items-center gap-1.5">
                                  <SkillIcon skill={tech} className="size-3" />
                                  {techName}
                                </Badge>
                              );
                            }) || <span className="text-[10.5px] text-zinc-500">None listed</span>}
                          </div>
                        </div>
                      </div>

                      {/* Top Market Signals */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Top Market Signals</h3>
                          {marketData.sources && marketData.sources.length > 0 && (
                            <button
                              onClick={() => openCitations("Market Signals Evidence", marketData.sources)}
                              className="text-[9px] font-bold text-zinc-400 hover:text-white underline cursor-pointer"
                            >
                              View evidence
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {marketData.demand?.signals?.slice(0, 3).map((sig: any, idx: number) => (
                            <div key={idx} className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-lg space-y-2 text-xs animate-card">
                              <p className="text-zinc-200 leading-relaxed font-medium">"{sig.signal}"</p>
                              <span className="text-[9.5px] text-zinc-500 block">— Source: {sig.source || 'Market citation'}</span>
                            </div>
                          )) || <span className="text-xs text-zinc-500">No active signals found.</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Market */}
                <TabsContent value="market" className="space-y-6 focus-visible:ring-0">
                  <Tabs defaultValue="status" className="w-full space-y-4">
                    <TabsList className="bg-zinc-950/60 border border-zinc-900/80 p-0.5 h-8 w-fit rounded-md flex">
                      <TabsTrigger value="status" className="px-3 py-1 text-[11px] font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Market Status</TabsTrigger>
                      <TabsTrigger value="historical" className="px-3 py-1 text-[11px] font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Historical</TabsTrigger>
                      <TabsTrigger value="signals" className="px-3 py-1 text-[11px] font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Current Signals</TabsTrigger>
                    </TabsList>

                    {/* Sub-tab 1: Market Status */}
                    <TabsContent value="status" className="space-y-6 focus-visible:ring-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-4 md:col-span-2">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Market Demand Status</span>
                            <Badge className="bg-white text-zinc-950 text-xs font-extrabold uppercase py-0.5 px-2.5 hover:bg-white rounded">
                              {marketData.demand?.status || 'insufficient_data'}
                            </Badge>
                          </div>
                          <div className="h-px bg-zinc-900" />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Confidence Rating</span>
                            <span className="text-xs text-zinc-300 font-semibold capitalize">{marketData.demand?.confidence || 'low'}</span>
                          </div>
                          <div className="h-px bg-zinc-900" />
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Demand Signals Summary</span>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                              Based on our analyzed dataset of job postings and market intelligence, the demand is currently labeled as <strong className="text-white">{marketData.demand?.status || 'insufficient_data'}</strong> with a confidence score of <strong className="text-white">{marketData.demand?.confidence || 'low'}</strong>.
                            </p>
                          </div>
                        </div>

                        <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-4">
                          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Evidence Counts</h3>
                          <div className="space-y-1.5 text-xs text-zinc-400">
                            <div className="flex justify-between">
                              <span>Analyzed Postings:</span>
                              <span className="font-semibold text-white">{marketData.companies?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Salary Indicators:</span>
                              <span className="font-semibold text-white">{marketData.salary?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Verified Citations:</span>
                              <span className="font-semibold text-white">{marketData.sources?.length || 0}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => openCitations("Verified Sources", marketData.sources)}
                            variant="outline"
                            className="w-full h-8 text-[10px] font-bold border-zinc-800 hover:bg-zinc-900 hover:text-white transition-colors"
                          >
                            View Evidence Sources
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Sub-tab 2: Historical */}
                    <TabsContent value="historical" className="space-y-0 focus-visible:ring-0">
                      {marketLoading ? (
                        // Historical-specific loading state using skeletons
                        <Card className="bg-zinc-900/10 border border-zinc-900 rounded-lg p-6 space-y-5">
                          <div className="space-y-1.5">
                            <Skeleton className="h-5 w-48 bg-zinc-800" />
                            <Skeleton className="h-3.5 w-32 bg-zinc-800" />
                          </div>
                          <div className="space-y-3 text-xs font-medium">
                            {[
                              { step: 1, label: "Researching market history..." },
                              { step: 2, label: "Analyzing hiring trends..." },
                              { step: 3, label: "Building demand timeline..." }
                            ].map((s) => {
                              const isDone = loadingStage > s.step;
                              const isActive = loadingStage === s.step;
                              return (
                                <div key={s.step} className="flex items-center gap-2.5">
                                  {isDone ? (
                                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                                  ) : isActive ? (
                                    <Loader2 className="size-3.5 animate-spin text-white shrink-0" />
                                  ) : (
                                    <Circle className="size-3.5 text-zinc-700 shrink-0" />
                                  )}
                                  <span className={isDone ? "text-zinc-600 line-through" : isActive ? "text-white font-bold animate-pulse" : "text-zinc-500"}>
                                    {s.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <Skeleton className="h-1.5 w-full bg-zinc-950 border border-zinc-900" />
                        </Card>
                      ) : marketError ? (
                        // Historical-specific error state
                        <Card className="bg-zinc-900/10 border border-zinc-900 rounded-lg p-8 text-center space-y-3">
                          <AlertCircle className="size-7 text-red-500 mx-auto" />
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white">Historical Job Demand</h3>
                            <p className="text-xs text-zinc-400">Unable to retrieve reliable market data. The market research service could not complete this request.</p>
                          </div>
                          <Button onClick={() => setRetryCount(prev => prev + 1)} className="h-7 px-3 bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] rounded hover:bg-zinc-800">
                            Try again
                          </Button>
                        </Card>
                      ) : (() => {
                          const hist = getValidHistoricalData();

                          if (!hist) {
                            return (
                              <Card className="bg-zinc-900/10 border border-zinc-900 rounded-lg p-8 text-center space-y-2">
                                <AlertCircle className="size-6 text-zinc-500 mx-auto" />
                                <h4 className="text-sm font-bold text-white">Historical demand data is unavailable for this role.</h4>
                                <p className="text-[11px] text-zinc-400 max-w-[360px] mx-auto">
                                  No historical indices could be compiled for this role.
                                </p>
                              </Card>
                            );
                          }

                          const filteredPoints = hist.allPoints;
                          const chartData = filteredPoints.map((pt: any) => ({
                            period: pt.year,
                            value: pt.value  // null stays null → Recharts renders as gap
                          }));

                          const chartConfig = {
                            value: { label: 'Demand Index', color: '#ffffff' }
                          };

                          const nonNullCount = filteredPoints.filter((p: any) => p.value !== null).length;
                          const totalPoints = filteredPoints.length;

                          return (
                            <Card className="bg-zinc-900/10 border border-zinc-900 rounded-xl overflow-hidden">
                              {/* Card Header */}
                              <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
                                    Historical Job Demand
                                    {hist.confidence === 'low' && (
                                      <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 border-amber-500/40 text-amber-500 bg-amber-500/5 rounded font-mono font-medium">
                                        Low confidence
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                                    Normalized demand index &middot; 2016 = 100
                                  </p>
                                </div>
                              </div>

                              {/* Chart */}
                              <div className="px-2 pb-2">
                                <ChartContainer config={chartConfig} className="w-full h-72">
                                  <LineChart data={chartData} margin={{ left: 4, right: 16, top: 12, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                                    <XAxis
                                      dataKey="period"
                                      stroke="#3f3f46"
                                      fontSize={11}
                                      tickLine={false}
                                      axisLine={false}
                                      tick={{ fill: '#71717a' }}
                                    />
                                    <YAxis
                                      stroke="#3f3f46"
                                      fontSize={11}
                                      tickLine={false}
                                      axisLine={false}
                                      tick={{ fill: '#71717a' }}
                                      width={40}
                                      label={{ value: 'Normalized Demand Index', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#52525b', fontSize: 9, textAnchor: 'middle' } }}
                                    />
                                    <ChartTooltip
                                      content={
                                        <ChartTooltipContent
                                          formatter={(value, _name, props) => {
                                            if (value === null || value === undefined) {
                                              return [<span key="na" className="text-zinc-500 italic">No data available for this year</span>, ''];
                                            }
                                            const year = props.payload.period;
                                            const pointData = hist.allPoints.find((p: any) => p.year === year);
                                            const typeLabel = pointData ? pointData.type.charAt(0).toUpperCase() + pointData.type.slice(1) : '';
                                            const signal = hist.observedEvidence.find((e: any) => String(e.year) === year);

                                            return [
                                              <div key="details" className="space-y-1 text-xs font-mono">
                                                <div className="flex justify-between gap-4">
                                                  <span className="text-zinc-400">Demand Index:</span>
                                                  <span className="font-bold text-white">{Number(value).toFixed(1)}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                  <span className="text-zinc-400">Type:</span>
                                                  <span className="font-semibold text-white">{typeLabel}</span>
                                                </div>
                                                {signal && (
                                                  <div className="flex justify-between gap-4">
                                                    <span className="text-zinc-400">Growth signal:</span>
                                                    <span className="font-semibold text-emerald-400">+{signal.growth}%</span>
                                                  </div>
                                                )}
                                              </div>,
                                              ''
                                            ];
                                          }}
                                          labelFormatter={(label) => <span className="text-zinc-300 font-semibold">Year: {label}</span>}
                                        />
                                      }
                                    />
                                    <Line
                                      type="monotone"
                                      dataKey="value"
                                      stroke="#ffffff"
                                      strokeWidth={2}
                                      connectNulls={false}
                                      dot={({ cx, cy, payload }: any) => {
                                        const pointData = hist.allPoints.find((p: any) => p.year === payload.period);
                                        const type = pointData?.type || 'predicted';
                                        
                                        if (type === 'base' || type === 'derived') {
                                          // Solid white circle for base and derived/observed evidence
                                          return <circle key={cx} cx={cx} cy={cy} r={4} fill="#ffffff" stroke="#09090b" strokeWidth={2} />;
                                        } else {
                                          // Hollow/grey circle for estimated and predicted
                                          return <circle key={cx} cx={cx} cy={cy} r={4} fill="#09090b" stroke="#71717a" strokeWidth={2} />;
                                        }
                                      }}
                                      activeDot={{ r: 6, fill: '#ffffff', stroke: '#09090b', strokeWidth: 2 }}
                                    />
                                  </LineChart>
                                </ChartContainer>
                              </div>

                              {/* Coverage + Source stats */}
                              <div className="px-6 py-3 flex items-center gap-4 text-[10px] text-zinc-600 border-t border-zinc-900/60">
                                <span>Data coverage: <span className="text-zinc-400 font-semibold">{nonNullCount} of {totalPoints} years</span></span>
                                {hist.observedEvidence.length > 0 && (
                                  <span>Observed signals: <span className="text-zinc-400 font-semibold">{hist.observedEvidence.length}</span></span>
                                )}
                              </div>

                              {/* Footer */}
                              <div className="px-6 pb-5 pt-2 flex items-start justify-between gap-4">
                                <p className="text-[10px] text-zinc-600 leading-relaxed flex-1">
                                  {hist.method && <span>{hist.method}</span>}
                                </p>
                                {hist.observedEvidence.length > 0 && (
                                  <button
                                    onClick={() => setEvidenceModalOpen(true)}
                                    className="text-[10px] font-bold text-zinc-400 hover:text-white underline shrink-0 cursor-pointer"
                                  >
                                    View evidence
                                  </button>
                                )}
                              </div>
                            </Card>
                          );
                        })()}
                    </TabsContent>

                    {/* Sub-tab 3: Current Signals */}
                    <TabsContent value="signals" className="space-y-6 focus-visible:ring-0">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Hiring Signals</h2>
                          {marketData.demand?.signals && marketData.demand.signals.length > 0 && (
                            <button
                              onClick={() => openCitations("Market Signals Evidence", marketData.sources)}
                              className="text-[9px] font-bold text-zinc-400 hover:text-white underline cursor-pointer"
                            >
                              View evidence
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {marketData.demand?.signals?.map((sig: any, idx: number) => (
                            <div key={idx} className="p-4 bg-zinc-900/10 border border-zinc-900 rounded-lg flex flex-col justify-between gap-3 text-xs">
                              <p className="text-zinc-200 leading-relaxed font-medium">"{sig.signal}"</p>
                              <div className="flex items-center justify-between pt-1 border-t border-zinc-900/60">
                                <span className="text-[9.5px] text-zinc-500">— {sig.source || 'Market citation'}</span>
                                {marketData.sources && marketData.sources.length > 0 && (
                                  <button
                                    onClick={() => openCitations(`Evidence for Signal ${idx+1}`, marketData.sources)}
                                    className="text-[9px] font-bold text-zinc-400 hover:text-white hover:underline cursor-pointer"
                                  >
                                    [View evidence]
                                  </button>
                                )}
                              </div>
                            </div>
                          )) || <span className="text-xs text-zinc-500">No active hiring signals documented.</span>}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* Tab 3: Skills */}
                <TabsContent value="skills" className="space-y-6 focus-visible:ring-0">
                  <Tabs defaultValue="core" className="w-full space-y-4">
                    <TabsList className="bg-zinc-950/60 border border-zinc-900/80 p-0.5 h-8 w-fit rounded-md flex">
                      <TabsTrigger value="core" className="px-3 py-1 text-[11px] font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Core</TabsTrigger>
                      <TabsTrigger value="emerging" className="px-3 py-1 text-[11px] font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Emerging</TabsTrigger>
                      <TabsTrigger value="yours" className="px-3 py-1 text-[11px] font-semibold data-[state=active]:bg-zinc-900 data-[state=active]:text-white rounded">Your Skills</TabsTrigger>
                    </TabsList>

                    {/* Sub-tab 1: Core */}
                    <TabsContent value="core" className="space-y-6 focus-visible:ring-0">
                      <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-3">
                        <div className="space-y-0.5">
                          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Core Skills</h3>
                          <p className="text-[10.5px] text-zinc-400">Essential baseline skills required to perform in this role.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {marketData.skills?.core?.map((skill: any) => {
                            const skillName = typeof skill === 'object' && skill !== null ? skill.display || skill.canonical : skill;
                            const skillKey = typeof skill === 'object' && skill !== null ? skill.canonical || skill.display || skill._id : skill;
                            return (
                              <Badge key={skillKey} variant="secondary" className="bg-zinc-900 text-zinc-100 border border-zinc-800 text-xs py-1.5 px-3 font-semibold rounded flex items-center gap-1.5">
                                <SkillIcon skill={skill} className="size-3.5" />
                                {skillName}
                              </Badge>
                            );
                          }) || <span className="text-xs text-zinc-500">None listed</span>}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Sub-tab 2: Emerging */}
                    <TabsContent value="emerging" className="space-y-6 focus-visible:ring-0">
                      <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-3">
                        <div className="space-y-0.5">
                          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-emerald-400">Emerging Skills</h3>
                          <p className="text-[10.5px] text-zinc-400">Skills displaying rapid growth and increasing adoption.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {marketData.skills?.emerging?.map((skill: any) => {
                            const skillName = typeof skill === 'object' && skill !== null ? skill.display || skill.canonical : skill;
                            const skillKey = typeof skill === 'object' && skill !== null ? skill.canonical || skill.display || skill._id : skill;
                            return (
                              <Badge key={skillKey} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs py-1.5 px-3 font-semibold rounded hover:bg-emerald-500/10 flex items-center gap-1.5">
                                <SkillIcon skill={skill} className="size-3.5" />
                                {skillName}
                              </Badge>
                            );
                          }) || <span className="text-xs text-zinc-500">None listed</span>}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Sub-tab 3: Your Skills */}
                    <TabsContent value="yours" className="space-y-6 focus-visible:ring-0">
                      <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-3">
                        <div className="space-y-0.5">
                          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Skill Portfolio</h3>
                          <p className="text-[10.5px] text-zinc-400">Your verified skill list and declared proficiency levels.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {profile?.skills?.map((s: Skill) => (
                            <Badge key={s.id} variant="outline" className="bg-transparent text-zinc-300 border-zinc-800 text-xs py-1.5 px-3 font-semibold rounded flex items-center gap-1.5 capitalize">
                              <SkillIcon skill={s.name} className="size-3.5" />
                              {s.name} · {s.proficiency}
                            </Badge>
                          )) || <span className="text-xs text-zinc-500">No skills in profile.</span>}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* Tab 4: Companies */}
                <TabsContent value="companies" className="space-y-6 focus-visible:ring-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    
                    {/* Listings Column */}
                    <div className="space-y-4 md:col-span-2">
                      {/* Filters header bar */}
                      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-zinc-900/10 border border-zinc-900 rounded-lg justify-between items-center">
                        <div className="relative w-full sm:max-w-xs">
                          <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="Search companies or skills..."
                            value={companySearch}
                            onChange={(e) => setCompanySearch(e.target.value)}
                            className="w-full bg-zinc-955 border border-zinc-900 rounded-md py-1.5 pl-9 pr-4 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-zinc-800"
                          />
                        </div>
                        <div className="flex gap-2.5 w-full sm:w-auto">
                          <select
                            value={companyLocation}
                            onChange={(e) => setCompanyLocation(e.target.value)}
                            className="bg-zinc-955 border border-zinc-900 rounded-md py-1.5 px-3 text-xs text-zinc-400 focus:outline-none focus:border-zinc-800 cursor-pointer"
                          >
                            <option value="all">All Locations</option>
                            {[...new Set((marketData.companies || []).map((c: any) => c.location).filter(Boolean))].map((loc: any) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>

                          <select
                            value={companyExperience}
                            onChange={(e) => setCompanyExperience(e.target.value)}
                            className="bg-zinc-955 border border-zinc-900 rounded-md py-1.5 px-3 text-xs text-zinc-400 focus:outline-none focus:border-zinc-800 cursor-pointer"
                          >
                            <option value="all">All Experience Levels</option>
                            {[...new Set((marketData.companies || []).map((c: any) => c.experience).filter(Boolean))].map((exp: any) => (
                              <option key={exp} value={exp}>{exp}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Listings list */}
                      {(() => {
                        const filtered = (marketData.companies || []).filter((c: any) => {
                          const searchLower = companySearch.toLowerCase();
                          const matchesSearch = 
                            (c.company || '').toLowerCase().includes(searchLower) ||
                            (c.role || '').toLowerCase().includes(searchLower) ||
                            (c.requiredSkills || []).some((s: string) => s.toLowerCase().includes(searchLower)) ||
                            (c.preferredSkills || []).some((s: string) => s.toLowerCase().includes(searchLower));
                          
                          const matchesLoc = companyLocation === 'all' || c.location === companyLocation;
                          const matchesExp = companyExperience === 'all' || c.experience === companyExperience;

                          return matchesSearch && matchesLoc && matchesExp;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="p-8 bg-zinc-900/10 border border-zinc-900 rounded-lg text-center space-y-2">
                              <Building2 className="size-6 text-zinc-500 mx-auto" />
                              <p className="text-xs text-zinc-400">No matching company requirements found.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-1 gap-4">
                            {filtered.map((item: any, idx: number) => {
                              // Fallback logo using initials
                              const initials = (item.company || 'UN')
                                .split(' ')
                                .map((n: string) => n.charAt(0))
                                .join('')
                                .slice(0, 2)
                                .toUpperCase();
                              
                              return (
                                <div key={idx} className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg flex flex-col justify-between gap-4">
                                  <div className="space-y-3.5">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-3">
                                        <div className="size-9 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center font-bold text-xs text-zinc-300 shrink-0">
                                          {initials}
                                        </div>
                                        <div className="space-y-1">
                                          <h4 className="font-semibold text-white text-sm">{item.role || 'Job Posting'}</h4>
                                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-400 font-medium">
                                            <span className="text-white font-bold">{item.company}</span>
                                            <span className="text-zinc-700">•</span>
                                            <span>{item.location || 'Location unspecified'}</span>
                                            <span className="text-zinc-700">•</span>
                                            <span>{item.experience || 'Experience unspecified'}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-1.5 text-right shrink-0">
                                        {item.salary && (
                                          <Badge variant="secondary" className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] py-0.5 px-2">
                                            {item.salary}
                                          </Badge>
                                        )}
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                                          {item.postingDate || 'Posted age unspecified'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                      <div className="space-y-1.5">
                                        <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest block">Required Skills</span>
                                        <div className="flex flex-wrap gap-1">
                                          {item.requiredSkills?.map((s: any) => {
                                            const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
                                            const sKey = typeof s === 'object' && s !== null ? s.canonical || s.display || s._id : s;
                                            return (
                                              <Badge key={sKey} variant="outline" className="bg-zinc-950 text-zinc-300 border-zinc-800 text-[9.5px] py-0.5 px-1.5 flex items-center gap-1.5">
                                                <SkillIcon skill={s} className="size-3" />
                                                {sName}
                                              </Badge>
                                            );
                                          }) || <span className="text-[10px] text-zinc-500">Unspecified</span>}
                                        </div>
                                      </div>

                                      <div className="space-y-1.5">
                                        <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest block">Preferred Skills</span>
                                        <div className="flex flex-wrap gap-1">
                                          {item.preferredSkills?.map((s: any) => {
                                            const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
                                            const sKey = typeof s === 'object' && s !== null ? s.canonical || s.display || s._id : s;
                                            return (
                                              <Badge key={sKey} variant="outline" className="bg-zinc-950 text-zinc-400 border-zinc-900 border-dashed text-[9.5px] py-0.5 px-1.5 flex items-center gap-1.5">
                                                <SkillIcon skill={s} className="size-3" />
                                                {sName}
                                              </Badge>
                                            );
                                          }) || <span className="text-[10px] text-zinc-500">None specified</span>}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-end pt-2 border-t border-zinc-900/60">
                                    {item.source?.url ? (
                                      <a
                                        href={item.source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-bold text-white hover:underline flex items-center gap-1 cursor-pointer"
                                      >
                                        View source posting →
                                      </a>
                                    ) : (
                                      <span className="text-[9.5px] text-zinc-500">Source url unavailable</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Skill Demand Graph Column */}
                    <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-4">
                      <div>
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Requested Skills</h3>
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">Skills requested across analyzed postings.</p>
                      </div>

                      {(() => {
                        const freqData = getSkillFrequencyData();
                        if (!freqData) {
                          return (
                            <div className="py-12 text-center text-zinc-500 text-xs">
                              Skill frequency data is not available yet.
                            </div>
                          );
                        }

                        const chartConfig = {
                          percentage: {
                            label: "Demand %",
                            color: "#ffffff"
                          }
                        };

                        return (
                          <div className="h-56 w-full pt-4">
                            <ChartContainer config={chartConfig} className="w-full h-full">
                              <BarChart
                                data={freqData}
                                layout="vertical"
                                margin={{ left: -10, right: 10, top: 0, bottom: 0 }}
                              >
                                <CartesianGrid stroke="#1f1f23" vertical={true} horizontal={false} />
                                <XAxis type="number" stroke="#52525b" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="skill" stroke="#52525b" fontSize={10} width={70} tickLine={false} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="percentage" fill="#ffffff" radius={[0, 2, 2, 0]} />
                              </BarChart>
                            </ChartContainer>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 5: Salary */}
                <TabsContent value="salary" className="space-y-6 focus-visible:ring-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    
                    <div className="space-y-6 md:col-span-2">
                      <div className="space-y-1">
                        <h2 className="text-base font-bold text-white tracking-tight">Salary Landscape</h2>
                        <p className="text-xs text-zinc-400">Current reported ranges based on active hiring listings and market platforms.</p>
                      </div>

                      {(() => {
                        const salaryGroups = getSalaryGroups();
                        const keys = Object.keys(salaryGroups);
                        if (keys.length === 0) {
                          return (
                            <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg text-center">
                              <span className="text-xs text-zinc-500">No salary ranges reported.</span>
                            </div>
                          );
                        }

                        // Explicit Experience Mapping helper
                        const mapExperienceLevel = (level: string): string => {
                          const lower = (level || '').toLowerCase().trim();
                          if (lower.includes('fresher') || lower.includes('entry') || lower.includes('intern')) return 'Fresher';
                          if (lower.includes('junior')) return 'Junior';
                          if (lower.includes('mid') || lower.includes('intermediate')) return 'Mid-level';
                          if (lower.includes('senior')) return 'Senior';
                          if (lower.includes('lead') || lower.includes('architect') || lower.includes('manager')) return 'Lead / Architect';
                          return level; // Keep original source terminology for unknown classifications
                        };

                        return (
                          <div className="space-y-6">
                            {keys.map((groupKey) => {
                              const [currency, period] = groupKey.split(':');
                              const list = salaryGroups[groupKey];
                              
                              return (
                                <div key={groupKey} className="space-y-3">
                                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-2">
                                    {currency} - {period === 'annual' ? 'Annual' : 'Monthly'} Benchmark
                                  </h4>
                                  <div className="space-y-3">
                                    {list.map((sal: any, idx: number) => {
                                      const minVal = sal.min >= 100000 ? `${(sal.min / 100000).toFixed(1)}L` : sal.min;
                                      const maxVal = sal.max >= 100000 ? `${(sal.max / 100000).toFixed(1)}L` : sal.max;
                                      
                                      return (
                                        <div key={idx} className="p-4 bg-zinc-900/10 border border-zinc-900 rounded-lg flex items-center justify-between gap-6">
                                          <div className="space-y-1">
                                            <span className="text-xs font-bold text-zinc-200 capitalize">
                                              {mapExperienceLevel(sal.experienceLevel)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9.5px] text-zinc-500 uppercase font-semibold">
                                                Source: {sal.source?.organization || 'Salary Index'}
                                              </span>
                                              {sal.source?.url && (
                                                <button
                                                  onClick={() => openCitations(`Salary Report Details`, [sal.source])}
                                                  className="text-[9px] font-bold text-zinc-400 hover:text-white underline cursor-pointer"
                                                >
                                                  [View citation]
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-right shrink-0">
                                            <span className="font-mono text-base font-extrabold text-white">
                                              {sal.currency === 'INR' ? '₹' : '$'}{minVal}{maxVal ? ` – ${maxVal}` : ''}
                                            </span>
                                            <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-widest">{sal.period}</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-4">
                      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Discrepancy Note</h3>
                      <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                        Salaries vary widely depending on location, specific employer (product vs service), and personal negotiations. 
                        We list reported data ranges separately, grouped by currency and period, rather than averaging to preserve metric fidelity.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 6: Your Gap */}
                <TabsContent value="your-gap" className="space-y-6 focus-visible:ring-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    
                    <div className="space-y-6 md:col-span-2">
                      <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Market Readiness Profile</h3>
                          <p className="text-[10.5px] text-zinc-400">Deterministic alignment matching user profile skills against required and preferred company benchmarks.</p>
                        </div>
                        
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-zinc-400">Readiness Score</span>
                            <span className="text-white font-mono">{marketData.userGap?.marketReadiness || 0}%</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-950 border border-zinc-900 rounded overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-500" 
                              style={{ width: `${marketData.userGap?.marketReadiness || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* YOU HAVE */}
                      <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-3">
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Already Covered ({marketData.userGap?.covered?.length || 0})</h3>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {marketData.userGap?.covered?.map((skill: any) => {
                            const skillName = typeof skill === 'object' && skill !== null ? skill.display || skill.canonical : skill;
                            const skillKey = typeof skill === 'object' && skill !== null ? skill.canonical || skill.display || skill._id : skill;
                            return (
                              <Badge key={skillKey} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs py-1.5 px-3 font-semibold rounded hover:bg-emerald-500/10 flex items-center gap-1.5">
                                <SkillIcon skill={skill} className="size-3.5" />
                                ✓ {skillName}
                              </Badge>
                            );
                          }) || <span className="text-xs text-zinc-500">None covered yet.</span>}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-4">
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-zinc-400">Skill Priority Gaps</h3>
                        
                        <div className="space-y-3">
                          {/* High priority */}
                          {marketData.userGap?.gaps?.high?.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-widest">High Priority (Required)</span>
                              <div className="flex flex-wrap gap-1.5">
                                {marketData.userGap.gaps.high.map((s: any) => {
                                  const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
                                  const sKey = typeof s === 'object' && s !== null ? s.canonical || s.display || s._id : s;
                                  return (
                                    <Badge key={sKey} variant="outline" className="bg-red-500/5 text-red-400 border-red-500/20 text-[10px] py-1.5 px-2.5 font-medium flex items-center gap-1.5">
                                      <SkillIcon skill={s} className="size-3" />
                                      {sName}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Medium priority */}
                          {marketData.userGap?.gaps?.medium?.length > 0 && (
                            <div className="space-y-2 pt-2">
                              <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Medium Priority (Preferred)</span>
                              <div className="flex flex-wrap gap-1.5">
                                {marketData.userGap.gaps.medium.map((s: any) => {
                                  const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
                                  const sKey = typeof s === 'object' && s !== null ? s.canonical || s.display || s._id : s;
                                  return (
                                    <Badge key={sKey} variant="outline" className="bg-zinc-950 text-zinc-300 border-zinc-800 border-dashed text-[10px] py-1.5 px-2.5 font-medium flex items-center gap-1.5">
                                      <SkillIcon skill={s} className="size-3" />
                                      {sName}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {marketData.userGap?.gaps?.high?.length === 0 && marketData.userGap?.gaps?.medium?.length === 0 && (
                            <span className="text-xs text-emerald-400 font-semibold">✓ No skill gaps identified! You are market ready!</span>
                          )}
                        </div>

                        <div className="h-px bg-zinc-900 pt-2" />
                        <Button 
                          onClick={handleEditSkills} 
                          className="w-full h-8 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded transition-colors"
                        >
                          Improve Skills
                        </Button>
                      </div>
                    </div>

                  </div>
                </TabsContent>
              </Tabs>
            ) : null}

            {/* Contextual Citation Dialog */}
            <Dialog open={citationOpen} onOpenChange={setCitationOpen}>
              <DialogContent className="bg-zinc-950 border border-zinc-900 max-w-md rounded-lg p-6">
                <DialogHeader className="pb-3 border-b border-zinc-900">
                  <DialogTitle className="text-sm font-bold text-white uppercase tracking-widest">
                    {citationTitle}
                  </DialogTitle>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto space-y-3 pt-3 pr-2 scrollbar-thin">
                  {citations.length === 0 ? (
                    <p className="text-xs text-zinc-500">No sources found.</p>
                  ) : (
                    citations.map((src: any, idx: number) => (
                      <div key={idx} className="p-3 bg-zinc-900/20 border border-zinc-900 rounded text-xs space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-zinc-200">{src.title || 'Market Citation'}</span>
                          {src.sourceType && (
                            <Badge variant="outline" className="text-[8px] uppercase border-zinc-800 text-zinc-400 px-1 py-0 rounded shrink-0 bg-transparent">
                              {src.sourceType}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-medium">
                          <span className="text-white font-bold">{src.organization || 'Grounded Web Search'}</span>
                          {src.url && src.url !== 'N/A' && src.url !== 'https://url.com' && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:underline font-bold"
                            >
                              View full article ↗
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

        </div>
      ) : (
        
        /* ==========================================
           MAIN CAREER ANALYSIS DASHBOARD OVERVIEW
           ========================================== */
        <div className="space-y-6 max-w-[1000px] mx-auto">
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">Career Analysis</h1>
            <p className="text-xs text-zinc-400">Understand where your current skills can take you.</p>
          </div>

          {/* Compact Profile summary horizontal bar */}
          <div className="p-4 bg-zinc-900/10 border border-zinc-900 rounded-md flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-zinc-400 animate-profile">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>YOUR PROFILE</span>
              <span className="text-zinc-700">|</span>
              <span><strong className="text-white uppercase">{profile?.domain?.label || 'IT'}</strong> · {profile?.domain?.confidence || 0}% confidence</span>
              <span className="text-zinc-700">|</span>
              <span>{totalSkillsCount} skills ({getSkillsSummary()})</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] uppercase font-bold py-0.5 px-2">
                Profile Complete
              </Badge>
              <Button onClick={handleEditSkills} className="h-7 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-800 rounded text-[10px] cursor-pointer">
                Edit profile
              </Button>
            </div>
          </div>

          {/* Matches column - Emphasizing #1 recommendation first, followed by others in list */}
          <div className="space-y-6">
            
            <div className="flex items-center justify-between animate-fade pt-2">
              <div className="space-y-0.5">
                <h2 className="font-display text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Career Matches</h2>
                <p className="text-xs text-zinc-400">Explore the roles that best align with your current profile.</p>
              </div>
              
              {/* Compact comparison progress meter trigger */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                <span>Sorted by:</span>
                <Badge variant="outline" className="text-[10px] font-semibold border-zinc-800 text-white bg-zinc-900/40">Best Match</Badge>
              </div>
            </div>

            {/* Recommended Role (#1 Featured Recommendation) */}
            {recommendedRole && (
              <div className="space-y-2.5 animate-card">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Recommended role</span>
                
                <Card className="bg-zinc-900/30 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/40 transition-all duration-300 shadow-lg rounded-lg flex flex-col justify-between">
                  <div className="p-6 space-y-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-lg font-bold text-white tracking-tight capitalize">{recommendedRole.roleTitle}</h3>
                          <Badge variant="outline" className="bg-zinc-900 text-zinc-300 text-[10px] capitalize border-zinc-800 px-2 py-0.5">
                            Domain: {recommendedRole.domain}
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-400 italic">
                          "Strong alignment with your current skill profile."
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-lg font-extrabold text-white">{recommendedRole.matchScore}% Match</span>
                        <Badge variant="outline" className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded ${getMatchCategory(recommendedRole.matchScore).color}`}>
                          {getMatchCategory(recommendedRole.matchScore).label}
                        </Badge>
                      </div>
                    </div>

                    {/* Matched Skills */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Matched Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {recommendedRole.matchedSkills.map((s) => (
                          <Badge 
                            key={s.skillId} 
                            variant="secondary" 
                            className="bg-zinc-900 text-zinc-100 border border-zinc-800 text-xs h-9 px-3.5 font-semibold rounded flex items-center gap-1.5"
                          >
                            <SkillIcon skill={s.skillRaw || s.skillName} className="size-3.5" />
                            <span>{s.skillName} (✓)</span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Gaps */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Skills to Strengthen</span>
                      <div className="flex flex-wrap gap-2">
                        {recommendedRole.gaps && recommendedRole.gaps.length > 0 ? (
                          recommendedRole.gaps.map((s) => (
                            <Badge 
                              key={s.skillName} 
                              variant="outline" 
                              className="bg-transparent text-zinc-500 border border-zinc-800 border-dashed text-xs h-9 px-3.5 font-semibold rounded flex items-center gap-1.5"
                            >
                              <SkillIcon skill={s.skillRaw || s.skillName} className="size-3.5" />
                              <span>{s.skillName}</span>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-500">No missing gaps identified!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-end gap-3">
                    <Button 
                      onClick={() => navigate(`/jobs?query=${encodeURIComponent(getSlug(recommendedRole.roleTitle))}`)}
                      variant="outline"
                      className="border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-xs h-9 px-4 rounded transition-colors cursor-pointer"
                    >
                      <Briefcase className="mr-1.5 size-3.5 text-zinc-400" />
                      View Jobs →
                    </Button>
                    <Button 
                      onClick={() => setSearchParams({ role: getSlug(recommendedRole.roleTitle) })}
                      className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs h-9 px-4 rounded transition-colors cursor-pointer"
                    >
                      Explore role →
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Other matches section */}
            {otherMatches.length > 0 && (
              <div className="space-y-3.5 pt-4 animate-card">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Other Matches</span>
                
                <div className="space-y-4">
                  {otherMatches.map((match) => {
                    const cat = getMatchCategory(match.matchScore);
                    const slug = getSlug(match.roleTitle);
                    
                    return (
                      <Card key={match.roleTitle} className="bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30 transition-all duration-300 shadow rounded-lg flex flex-col justify-between">
                        <div className="p-6 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900/60">
                            <div className="space-y-0.5">
                              <h3 className="text-base font-bold text-white tracking-tight capitalize">{match.roleTitle}</h3>
                              <p className="text-[11px] text-zinc-400 italic">
                                "Alignment with your current skill profile."
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm font-bold text-white">{match.matchScore}% Match</span>
                              <Badge variant="outline" className={`text-[8.5px] uppercase font-bold px-1.5 py-px rounded ${cat.color}`}>
                                {cat.label}
                              </Badge>
                            </div>
                          </div>

                          {/* Matched list */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Matched Skills</span>
                            <div className="flex flex-wrap gap-1.5">
                              {match.matchedSkills.map((s) => (
                                <Badge 
                                  key={s.skillId} 
                                  variant="secondary" 
                                  className="bg-zinc-900 text-zinc-300 border border-zinc-800 text-[11px] h-8 px-3 font-semibold rounded flex items-center gap-1.5"
                                >
                                  <SkillIcon skill={s.skillName} className="size-3" />
                                  <span>{s.skillName} (✓)</span>
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Gaps list */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Skills to Strengthen</span>
                            <div className="flex flex-wrap gap-1.5">
                              {match.gaps && match.gaps.length > 0 ? (
                                match.gaps.map((s) => (
                                  <Badge 
                                    key={s.skillName} 
                                    variant="outline" 
                                    className="bg-transparent text-zinc-500 border border-zinc-800 border-dashed text-[11px] h-8 px-3 font-semibold rounded flex items-center gap-1.5"
                                  >
                                    <SkillIcon skill={s.skillName} className="size-3" />
                                    <span>{s.skillName}</span>
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-zinc-500">No missing gaps identified!</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 pt-0 flex items-center justify-end gap-3">
                          <Button 
                            onClick={() => navigate(`/jobs?query=${encodeURIComponent(slug)}`)}
                            variant="outline"
                            className="border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-xs h-8 px-3 rounded transition-colors cursor-pointer"
                          >
                            <Briefcase className="mr-1.5 size-3.5 text-zinc-400" />
                            View Jobs →
                          </Button>
                          <Button 
                            onClick={() => setSearchParams({ role: slug })}
                            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-800 text-xs h-8 px-4 rounded transition-colors cursor-pointer"
                          >
                            Explore role →
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      )}
      <Dialog open={evidenceModalOpen} onOpenChange={setEvidenceModalOpen}>
        <DialogContent className="bg-zinc-950 border border-zinc-900 text-white max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              Observed Market Evidence
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {(() => {
              const hist = getValidHistoricalData();
              const evidence = hist?.observedEvidence || [];
              if (evidence.length === 0) {
                return <p className="text-xs text-zinc-500">No observed growth signals recorded for this role.</p>;
              }
              return (
                <div className="space-y-3">
                  {evidence.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg space-y-2 text-xs">
                      <div className="flex justify-between items-start gap-4">
                        <span className="font-bold text-white font-mono text-[13px]">{item.year}</span>
                        {item.growth && (
                          <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5 font-bold font-mono">
                            +{item.growth}% Growth
                          </Badge>
                        )}
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-medium">"{item.evidence}"</p>
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1 border-t border-zinc-900/60">
                        <span>Source: {item.source || 'Verified citation'}</span>
                        {item.url && item.url !== 'URL' && item.url !== 'null' && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-white underline"
                          >
                            [Link]
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
