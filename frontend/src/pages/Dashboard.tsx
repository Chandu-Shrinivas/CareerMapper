import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { api } from '../services/api';
import { useActiveTargetRole } from '../hooks/useActiveTargetRole';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { OnboardingCard } from '../components/dashboard/OnboardingCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ContinueLearningCard } from '../components/dashboard/ContinueLearningCard';
import { SkillGapsCard } from '../components/dashboard/SkillGapsCard';
import { JobMatchesCard } from '../components/dashboard/JobMatchesCard';
import { InterviewPrepCard } from '../components/dashboard/InterviewPrepCard';
import { ApplicationSummaryCard } from '../components/dashboard/ApplicationSummaryCard';

const DRAFT_KEY = 'cm_profile_draft';

const ROLE_TITLE_TO_SLUG: Record<string, string> = {
  'frontend developer': 'frontend',
  'backend developer': 'backend',
  'full stack developer': 'fullstack',
  'devops engineer': 'devops',
  'android developer': 'android',
  'ai engineer': 'ai-engineer',
  'data analyst': 'data-analyst',
  'devsecops engineer': 'devsecops',
  'data engineer': 'data-engineer',
  'postgresql dba': 'postgresql-dba',
  'machine learning engineer': 'machine-learning',
  'data scientist': 'data-scientist',
  'ios developer': 'ios',
  'blockchain developer': 'blockchain'
};

function getRoleSlug(title?: string): string {
  if (!title) return 'frontend';
  const clean = title.toLowerCase().trim();
  return ROLE_TITLE_TO_SLUG[clean] || 'frontend';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeTargetRole } = useActiveTargetRole();

  // Authentication & Profile State
  const [profile, setProfile] = useState<any>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(true);

  // Summary Metrics State
  const [jobCount, setJobCount] = useState<number>(0);
  const [jobsLoading, setJobsLoading] = useState<boolean>(false);

  const [trackerSummary, setTrackerSummary] = useState<{ active: number; interview: number }>({
    active: 0,
    interview: 0
  });
  const [trackerLoading, setTrackerLoading] = useState<boolean>(false);

  const [skillsToStrengthen, setSkillsToStrengthen] = useState<string[]>([]);

  // 1. Guard & Profile Initializer
  useEffect(() => {
    const session = authService.getSession();
    if (!session.authenticated) {
      navigate('/signin');
      return;
    }

    const rawDraft = localStorage.getItem(DRAFT_KEY);
    if (!rawDraft) {
      setIsOnboardingCompleted(false);
      return;
    }

    try {
      const parsedDraft = JSON.parse(rawDraft);
      if (parsedDraft.step < 4 && !parsedDraft.onboardingCompleted) {
        setIsOnboardingCompleted(false);
      } else {
        setIsOnboardingCompleted(true);
        setProfile(parsedDraft);
      }
    } catch {
      setIsOnboardingCompleted(false);
    }
  }, [navigate]);

  // 2. Fetch Dashboard Summary Data
  const fetchDashboardData = useCallback(async () => {
    // A. Tracker Summary
    setTrackerLoading(true);
    try {
      const res = await api.getTrackerSummary();
      if (res.status === 'success' && res.data) {
        const jobs = res.data.jobs || [];
        const active = jobs.filter((j: any) => !['Rejected', 'Withdrawn', 'Offer'].includes(j.status)).length;
        const interview = jobs.filter((j: any) => j.status === 'Interview').length;
        setTrackerSummary({ active, interview });
      }
    } catch (e) {
      console.warn('[DASHBOARD] Failed to fetch tracker summary:', e);
    } finally {
      setTrackerLoading(false);
    }

    // B. Job Matches Count
    setJobsLoading(true);
    try {
      const targetRoleTitle = activeTargetRole?.roleTitle || 'Frontend Developer';
      const jobsRes = await api.getJobs({ query: getRoleSlug(targetRoleTitle), page: 1 });
      if (jobsRes.status === 'success' && jobsRes.data) {
        setJobCount(jobsRes.data.jobs?.length || 0);
      }
    } catch (e) {
      console.warn('[DASHBOARD] Failed to fetch job matches:', e);
    } finally {
      setJobsLoading(false);
    }
  }, [activeTargetRole]);

  // 3. Trigger Data Fetch & Sync Listener
  useEffect(() => {
    fetchDashboardData();

    const handleSync = () => {
      fetchDashboardData();
    };

    window.addEventListener('savedJobsUpdated', handleSync);
    return () => {
      window.removeEventListener('savedJobsUpdated', handleSync);
    };
  }, [fetchDashboardData]);

  // 4. Update Skill Gaps based on active target role
  useEffect(() => {
    if (activeTargetRole?.skillsToStrengthen && activeTargetRole.skillsToStrengthen.length > 0) {
      setSkillsToStrengthen(activeTargetRole.skillsToStrengthen);
    } else if (profile?.skills) {
      // Extract missing skills or default role skills fallback
      const userSkillNames = new Set((profile.skills || []).map((s: any) => s.name?.toLowerCase()));
      const roleTitle = (activeTargetRole?.roleTitle || 'Frontend Developer').toLowerCase();
      const standardSkills: Record<string, string[]> = {
        'frontend developer': ['react', 'typescript', 'testing', 'css'],
        'backend developer': ['node.js', 'postgresql', 'apis', 'docker'],
        'full stack developer': ['react', 'node.js', 'postgresql', 'docker'],
        'android developer': ['kotlin', 'jetpack compose', 'coroutines', 'room'],
        'devops engineer': ['docker', 'kubernetes', 'aws', 'ci/cd'],
        'ai engineer': ['python', 'llms', 'langchain', 'vector dbs'],
        'data analyst': ['sql', 'python', 'tableau', 'excel'],
        'data scientist': ['python', 'machine learning', 'pandas', 'statistics']
      };
      const expected = standardSkills[roleTitle] || standardSkills['frontend developer'];
      const missing = expected.filter(s => !userSkillNames.has(s));
      setSkillsToStrengthen(missing.length > 0 ? missing : expected.slice(0, 3));
    }
  }, [activeTargetRole, profile]);

  const currentRoleTitle = activeTargetRole?.roleTitle || 'Frontend Developer';
  const currentRoleSlug = getRoleSlug(currentRoleTitle);
  const userName = profile?.profile?.fullName?.split(' ')[0] || '';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Header with Role Selector & Readiness */}
      <DashboardHeader userName={userName} />

      {/* 2. Onboarding Banner (Only if profile incomplete) */}
      <OnboardingCard isCompleted={isOnboardingCompleted} />

      {/* 3. Quick Action Buttons */}
      <QuickActions roleSlug={currentRoleSlug} />

      {/* 4. Primary High-Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ContinueLearningCard roleSlug={currentRoleSlug} roleTitle={currentRoleTitle} />
        <SkillGapsCard skillsToStrengthen={skillsToStrengthen} roleTitle={currentRoleTitle} />
      </div>

      {/* 5. Secondary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <JobMatchesCard jobCount={jobCount} roleTitle={currentRoleTitle} loading={jobsLoading} />
        <InterviewPrepCard questionCount={18} roleTitle={currentRoleTitle} />
        <ApplicationSummaryCard
          activeCount={trackerSummary.active}
          interviewCount={trackerSummary.interview}
          loading={trackerLoading}
        />
      </div>
    </div>
  );
}
