import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Trophy, ArrowRight, Map as MapIcon,
  RefreshCw, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Skeleton } from '../components/ui/skeleton';
import { api } from '../services/api';
import { authService } from '../services/auth';
import { useActiveTargetRole } from '../hooks/useActiveTargetRole';
import FrontendSvgRoadmap from '../components/roadmap/FrontendSvgRoadmap';
import BackendSvgRoadmap from '../components/roadmap/BackendSvgRoadmap';
import FullstackSvgRoadmap from '../components/roadmap/FullstackSvgRoadmap';
import DevopsSvgRoadmap from '../components/roadmap/DevopsSvgRoadmap';
import AndroidSvgRoadmap from '../components/roadmap/AndroidSvgRoadmap';
import AiEngineerSvgRoadmap from '../components/roadmap/AiEngineerSvgRoadmap';
import DataAnalystSvgRoadmap from '../components/roadmap/DataAnalystSvgRoadmap';
import DevSecOpsSvgRoadmap from '../components/roadmap/DevSecOpsSvgRoadmap';
import DataEngineerSvgRoadmap from '../components/roadmap/DataEngineerSvgRoadmap';
import PostgreSqlDbaSvgRoadmap from '../components/roadmap/PostgreSqlDbaSvgRoadmap';

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roadmapParamId = searchParams.get('id');
  const roleParam = searchParams.get('role');

  const { activeTargetRole, setActiveTargetRole } = useActiveTargetRole();

  // Loading & State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setActiveRoadmapId] = useState<string | null>(null);

  // Experience Data
  const [experience, setExperience] = useState<any>(null);

  // Quick Launcher Roles if user has no role selected
  const POPULAR_ROLES = [
    { title: 'Data Scientist', domain: 'Data Science', company: 'Target Company' },
    { title: 'Software Engineer', domain: 'Software Engineering', company: 'Target Company' },
    { title: 'Frontend Developer', domain: 'Software Engineering', company: 'Target Company' },
    { title: 'Backend Developer', domain: 'Software Engineering', company: 'Target Company' },
    { title: 'DevOps Engineer', domain: 'DevOps & Cloud', company: 'Target Company' },
    { title: 'Data Analyst', domain: 'Data Science', company: 'Target Company' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const email = authService.getSession().user?.email || 'demo@careermapper.app';

      // 1. Resolve Target Role (URL param -> activeTargetRole -> localStorage fallback)
      let currentRoleTitle = roleParam || activeTargetRole?.roleTitle || '';
      if (!currentRoleTitle) {
        try {
          const raw = localStorage.getItem('cm_target_role');
          if (raw) {
            const p = JSON.parse(raw);
            currentRoleTitle = p.roleTitle || p.targetRole || '';
          }
        } catch (e) {}
      }

      if (currentRoleTitle) {
        currentRoleTitle = currentRoleTitle.split(',')[0].trim();
      }

      // 2. Fetch User Roadmaps
      let targetId = roadmapParamId;
      if (!targetId) {
        try {
          const roadmapsRes = await api.getRoadmaps(email);
          const list = roadmapsRes.roadmaps || [];

          if (currentRoleTitle) {
            const matched = list.find((r: any) => 
              (r.targetRole || '').toLowerCase().includes(currentRoleTitle.toLowerCase())
            );
            if (matched) targetId = matched._id;
          }

          if (!targetId && list.length > 0) {
            targetId = list[0]._id;
          }
        } catch (e) {}
      }

      // 3. Auto-generate if no roadmap document exists for target role
      if (!targetId && currentRoleTitle) {
        try {
          const genRes = await api.generateRoadmap({
            targetRole: currentRoleTitle,
            company: activeTargetRole?.company || 'Target Company',
            domain: activeTargetRole?.domain || 'Technology',
            userSkills: []
          });
          targetId = genRes.roadmap?._id || genRes._id;
        } catch (genErr: any) {
          console.error('[ROADMAP AUTO-GEN ERROR]', genErr);
          setError(genErr.message || 'Failed to generate career roadmap.');
          setLoading(false);
          return;
        }
      }

      if (!targetId) {
        setLoading(false);
        return; // Render Quick Role Selection launcher
      }

      setActiveRoadmapId(targetId);
      const expData = await api.getRoadmapExperience(targetId);
      setExperience(expData);

      // Keep activeTargetRole in sync if inferred from loaded roadmap
      if (expData?.roadmap?.targetRole && (!activeTargetRole || activeTargetRole.roleTitle !== expData.roadmap.targetRole)) {
        setActiveTargetRole({
          roleTitle: expData.roadmap.targetRole,
          company: expData.roadmap.company || 'Target Company',
          domain: expData.roadmap.domain || 'Technology'
        });
      }

    } catch (err: any) {
      console.error('[FETCH ROADMAP ERROR]', err);
      setError(err.message || 'Failed to load career roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roadmapParamId, roleParam]);

  // Select Quick Launcher Target Role
  const handleSelectRoleLauncher = async (roleObj: { title: string; company: string; domain: string }) => {
    try {
      setLoading(true);
      await setActiveTargetRole({
        roleTitle: roleObj.title,
        company: roleObj.company,
        domain: roleObj.domain
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to initialize role roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const targetRoleTitle = experience?.roadmap?.targetRole || activeTargetRole?.roleTitle || '';
  const nextAction = experience?.nextAction;
  const progressPercentage = experience?.progress?.percentage ?? 0;
  const daysRemaining = experience?.timePlan?.daysRemaining ?? 84;

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-28 w-full rounded-2xl bg-zinc-900" />
        <Skeleton className="h-36 w-full rounded-2xl bg-zinc-900" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full rounded-xl bg-zinc-900" />
          <Skeleton className="h-48 w-full rounded-xl bg-zinc-900" />
          <Skeleton className="h-48 w-full rounded-xl bg-zinc-900" />
        </div>
      </div>
    );
  }

  // Error State Banner
  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <Card className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-6 space-y-4 text-center">
          <AlertTriangle className="size-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Roadmap Load Failure</h2>
          <p className="text-xs text-rose-300 font-mono leading-relaxed">{error}</p>
          <Button onClick={fetchData} className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs h-9 px-4 rounded-lg">
            <RefreshCw className="size-3.5 mr-1.5" /> Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  // Quick Launcher State if no target role exists
  if (!targetRoleTitle && !(experience?.skills?.length)) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-mono text-[10px] px-3 py-1">
            CAREER ROADMAP SYSTEM
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Select Your Target Role to Launch Roadmap
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Choose a target career path below to generate your interactive, visual skill learning tree mapped to industry criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROLES.map(role => (
            <Card
              key={role.title}
              onClick={() => handleSelectRoleLauncher(role)}
              className="p-5 bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-zinc-750 text-zinc-400 text-[10px]">
                  {role.domain}
                </Badge>
                <ArrowRight className="size-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {role.title}
              </h3>
              <p className="text-xs text-zinc-400">
                Launch interactive connected roadmap for {role.title}.
              </p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* TOP HEADER */}
      <Card className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase">
                {experience?.roadmap?.domain || activeTargetRole?.domain || 'Technology'}
              </Badge>
              <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-[10px] font-mono">
                {experience?.roadmap?.company || 'Target Company Focus'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight capitalize">
              {targetRoleTitle} Roadmap
            </h1>
            <p className="text-xs text-zinc-400">
              Personalized interactive learning tree mapped to industry standards for {targetRoleTitle}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-right">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Countdown</span>
              <span className="font-mono text-sm font-black text-emerald-400">{daysRemaining} days remaining</span>
            </div>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-bold h-10 px-3.5 rounded-xl cursor-pointer"
            >
              Change Role
            </Button>
          </div>
        </div>

        {/* Overall Progress Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-900">
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">Overall Roadmap Completion</span>
              <span className="text-emerald-400 font-black">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2.5 bg-zinc-900" />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Verified Skills</span>
              <span className="font-mono text-sm font-black text-white">
                {(experience?.skills || []).filter((s: any) => s.state === 'VERIFIED' || s.state === 'STRONG' || s.state === 'MAINTENANCE').length} / {(experience?.skills || []).length}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Gamification XP</span>
              <span className="font-mono text-sm font-black text-amber-400 flex items-center gap-1">
                <Trophy className="size-3.5" /> {experience?.progress?.xpEarned || 0} XP
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* CURRENT FOCUS BANNER */}
      {nextAction && nextAction.skill && (
        <Card className="bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-500/40 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500 text-zinc-950 font-black text-[9px] uppercase tracking-wider">
                Current Focus
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-bold">~30m Prep</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {nextAction.title || `Strengthen ${nextAction.skill}`}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {nextAction.reason || `Highest priority next step to unlock verification for ${nextAction.skill}.`}
            </p>
          </div>

          <Button
            onClick={() => {
              toast.info(`Next action focus: ${nextAction.skill}`);
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs h-10 px-4 rounded-xl cursor-pointer shadow flex items-center gap-1.5 shrink-0"
          >
            Execute Action <ArrowRight className="size-4" />
          </Button>
        </Card>
      )}

      {/* ROADMAP GRAPH */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <MapIcon className="size-5 text-emerald-400" />
              {targetRoleTitle || 'Career'} Developer Roadmap
            </h2>
            <p className="text-xs text-zinc-400">Deterministic SVG Graph Reference</p>
          </div>
        </div>

        {targetRoleTitle.toLowerCase().includes('backend') ? (
          <BackendSvgRoadmap />
        ) : targetRoleTitle.toLowerCase().includes('full') || targetRoleTitle.toLowerCase().includes('stack') ? (
          <FullstackSvgRoadmap />
        ) : targetRoleTitle.toLowerCase().includes('devops') && !targetRoleTitle.toLowerCase().includes('sec') ? (
          <DevopsSvgRoadmap />
        ) : targetRoleTitle.toLowerCase().includes('android') ? (
          <AndroidSvgRoadmap />
        ) : targetRoleTitle.toLowerCase().includes('ai') ? (
          <AiEngineerSvgRoadmap />
        ) : targetRoleTitle.toLowerCase().includes('data') && targetRoleTitle.toLowerCase().includes('engineer') ? (
          <DataEngineerSvgRoadmap />
        ) : targetRoleTitle.toLowerCase().includes('analyst') ? (
          <DataAnalystSvgRoadmap />
        ) : targetRoleTitle.toLowerCase().includes('sec') ? (
          <DevSecOpsSvgRoadmap />
        ) : targetRoleTitle.toLowerCase().includes('postgres') || targetRoleTitle.toLowerCase().includes('dba') ? (
          <PostgreSqlDbaSvgRoadmap />
        ) : (
          <FrontendSvgRoadmap />
        )}
      </div>
    </div>
  );
}
