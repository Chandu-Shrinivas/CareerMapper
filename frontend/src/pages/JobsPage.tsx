import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, Filter, RotateCw, ExternalLink, 
  AlertTriangle, Sparkles, SlidersHorizontal, ArrowRight,
  ChevronDown, Check, Info, Clock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { SkillIcon } from '../components/SkillIcon';
import { CompanyLogo } from '../components/CompanyLogo';
import { api } from '../services/api';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../components/ui/chart';
import { PieChart, Pie, Cell, Label } from 'recharts';

const DRAFT_KEY = 'cm_profile_draft';

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



// ── Platform selector ─────────────────────────────────────────────────────
interface PlatformDef {
  name: string;
  /** Absolute URL to logo image. If load fails → fallback logo or text shown. */
  logo: string;
  fallbackLogo?: string;
  /** Fallback text shown when all image URLs fail */
  initials: string;
  /** Brand bg color class for fallback circle */
  bgColor: string;
  url: string;
  description: string;
  tags: string[];
}

/**
 * Platform logo wrapped inside a round circle with a white background.
 * Ensures dark/transparent logos (like Indeed/Glassdoor/LinkedIn) pop clearly.
 */
function PlatformLogo({
  logo,
  fallbackLogo,
  initials,
  bgColor,
  name,
  hovered,
}: {
  logo: string;
  fallbackLogo?: string;
  initials: string;
  bgColor: string;
  name: string;
  hovered: boolean;
}) {
  const [src, setSrc] = useState<string>(logo);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (src === logo && fallbackLogo && fallbackLogo !== logo) {
      setSrc(fallbackLogo);
    } else {
      setFailed(true);
    }
  };

  return (
    <div
      className={`size-14 rounded-full bg-white flex items-center justify-center overflow-hidden p-1.5 shadow-md border border-zinc-700/30 transition-all duration-200 shrink-0 ${
        hovered ? 'scale-110 shadow-lg shadow-white/10 ring-2 ring-white/50' : 'opacity-95'
      }`}
    >
      {!failed ? (
        <img
          src={src}
          alt={name}
          onError={handleError}
          className="w-full h-full object-contain"
          draggable={false}
        />
      ) : (
        <div className={`w-full h-full rounded-full ${bgColor} flex items-center justify-center text-white text-sm font-extrabold select-none`}>
          {initials}
        </div>
      )}
    </div>
  );
}

function PlatformButton({ plat }: { plat: PlatformDef }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <a
          href={plat.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer select-none outline-none focus-visible:outline-none group px-2 py-1 transition-all"
          aria-label={`Search ${plat.name} jobs`}
        >
          {/* Round Circle White-Backgrounded Logo */}
          <PlatformLogo
            logo={plat.logo}
            fallbackLogo={plat.fallbackLogo}
            initials={plat.initials}
            bgColor={plat.bgColor}
            name={plat.name}
            hovered={hovered}
          />

          {/* Name below — aligned bottom-center */}
          <div className="flex items-center justify-center gap-0.5 w-full">
            <span
              className={`text-[9.5px] font-medium leading-none tracking-tight text-center transition-colors duration-150 ${
                hovered ? 'text-white font-semibold' : 'text-zinc-400'
              }`}
            >
              {plat.name}
            </span>
            <ExternalLink
              className={`size-2 shrink-0 transition-opacity duration-150 ${
                hovered ? 'opacity-100 text-zinc-300' : 'opacity-0 text-zinc-500'
              }`}
            />
          </div>
        </a>
      </TooltipTrigger>

      {/* Lightweight Tooltip */}
      <TooltipContent
        side="top"
        className="max-w-[210px] bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 shadow-xl"
      >
        <p className="text-[12px] font-semibold mb-0.5 flex items-center justify-between gap-2">
          <span>{plat.name}</span>
          <ExternalLink className="size-3 text-zinc-400 shrink-0" />
        </p>
        <p className="text-[11px] text-zinc-300 leading-snug">{plat.description}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {plat.tags.map(t => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              {t}
            </span>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default function JobsPage() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQueryParam = searchParams.get('query');

  const [profile, setProfile] = useState<any>(null);

  // Format initial search title from URL or default
  const getFormattedTitle = (q: string | null) => {
    if (!q) return 'Full Stack Developer';
    return q.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };
  
  // Search & Query state (input state is local to avoid keystroke API calls)
  const [searchInput, setSearchInput] = useState(getFormattedTitle(urlQueryParam));
  const [activeQuery, setActiveQuery] = useState(urlQueryParam || 'full-stack-developer');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  // Job Data State
  const [jobsData, setJobsData] = useState<any>(null);
  const [jobsLoading, setJobsLoading] = useState<boolean>(true);
  const [loadingStepMessage, setLoadingStepMessage] = useState<string>('Checking cached jobs...');
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [forceRefreshTrigger, setForceRefreshTrigger] = useState<number>(0);
  const [isForcedRefresh, setIsForcedRefresh] = useState<boolean>(false);
  const [staleWarning, setStaleWarning] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Selected Job Details Modal State
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Groq Analysis State
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Redesign state variables for Dialog
  const [showAllMatched, setShowAllMatched] = useState<boolean>(false);
  const [showAllMissing, setShowAllMissing] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    about: true,
    responsibilities: true,
    requirements: true,
    preferred: false,
    benefits: false,
    other: false
  });
  const [loadingStageIndex, setLoadingStageIndex] = useState<number>(0);
  const [expandedSkillCategories, setExpandedSkillCategories] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSkillCategory = (category: string) => {
    setExpandedSkillCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Simulated progressive loading stage timer
  useEffect(() => {
    if (!analysisLoading) {
      setLoadingStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStageIndex(prev => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 850);
    return () => clearInterval(interval);
  }, [analysisLoading]);

  // Client-side Filter States
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([]);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([]);
  const [minSalaryLpa, setMinSalaryLpa] = useState<number>(0);

  // Sync URL search params to active query
  useEffect(() => {
    if (urlQueryParam) {
      setSearchInput(getFormattedTitle(urlQueryParam));
      setActiveQuery(urlQueryParam);
      setPage(1);
    }
  }, [urlQueryParam]);

  // Read Profile Snapshot
  useEffect(() => {
    const rawDraft = localStorage.getItem(DRAFT_KEY);
    if (rawDraft) {
      try {
        const parsed = JSON.parse(rawDraft);
        setProfile(parsed);
        // Default search to top recommended role title if available and no URL param present
        if (!urlQueryParam && parsed.topMatch?.roleTitle) {
          setSearchInput(parsed.topMatch.roleTitle);
          setActiveQuery(parsed.topMatch.roleTitle.toLowerCase().replace(/[\s/]+/g, '-'));
          setPage(1);
        }
      } catch (e) {}
    }
  }, [urlQueryParam]);

  // Fetch Jobs Effect (Triggers ONLY on search click, initial load, or refresh)
  useEffect(() => {
    let active = true;

    const fetchJobs = async () => {
      setJobsLoading(true);
      setPage(1);
      setLoadingStepMessage('Checking cached jobs...');

      const t1 = setTimeout(() => {
        if (active) setLoadingStepMessage('Searching job listings...');
      }, 300);

      const t2 = setTimeout(() => {
        if (active) setLoadingStepMessage('Processing results...');
      }, 800);

      if (!isForcedRefresh) setJobsError(null);

      try {
        const currentProfile = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
        const userSkillsQuery = currentProfile?.skills
          ? currentProfile.skills.map((s: any) => `${s.name}:${s.proficiency || 'beginner'}`).join(',')
          : '';
        const userRole = currentProfile?.topMatch?.roleTitle || '';

        const res = await api.getJobs({
          query: activeQuery,
          location: selectedLocation,
          country: 'India',
          skillsQuery: userSkillsQuery,
          role: userRole,
          page: 1,
          forceRefresh: isForcedRefresh
        });

        if (active) {
          setJobsData(res.data);
          setHasMore(res.data?.hasMore ?? false);
          setJobsError(null);
          setStaleWarning(false);
        }
      } catch (err: any) {
        if (active) {
          console.error('[JOBS ERROR]', err);
          if (isForcedRefresh && jobsData) {
            setStaleWarning(true);
          } else {
            setJobsError(err.message || 'Job search failed. Please try again.');
          }
        }
      } finally {
        clearTimeout(t1);
        clearTimeout(t2);
        if (active) {
          setJobsLoading(false);
          setIsForcedRefresh(false);
        }
      }
    };

    fetchJobs();

    return () => {
      active = false;
    };
  }, [activeQuery, selectedLocation, forceRefreshTrigger]);

  // Handle Load More Jobs (Paginated API request)
  const handleLoadMoreJobs = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const currentProfile = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
      const userSkillsQuery = currentProfile?.skills
        ? currentProfile.skills.map((s: any) => `${s.name}:${s.proficiency || 'beginner'}`).join(',')
        : '';
      const userRole = currentProfile?.topMatch?.roleTitle || '';

      const res = await api.getJobs({
        query: activeQuery,
        location: selectedLocation,
        country: 'India',
        skillsQuery: userSkillsQuery,
        role: userRole,
        page: nextPage,
        forceRefresh: false
      });

      const newJobs = res.data?.jobs || [];
      if (newJobs.length === 0) {
        setHasMore(false);
      } else {
        // Merge and deduplicate
        setJobsData((prev: any) => {
          if (!prev) return res.data;
          const existingIds = new Set(prev.jobs.map((j: any) => j.id));
          const existingUrls = new Set(prev.jobs.map((j: any) => j.sourceUrl).filter(Boolean));
          const existingKeys = new Set(prev.jobs.map((j: any) => `${j.company.toLowerCase()}|${j.title.toLowerCase()}|${j.location.toLowerCase()}`));

          const filteredNew = newJobs.filter((j: any) => {
            const key = `${j.company.toLowerCase()}|${j.title.toLowerCase()}|${j.location.toLowerCase()}`;
            if (existingIds.has(j.id)) return false;
            if (j.sourceUrl && existingUrls.has(j.sourceUrl)) return false;
            if (existingKeys.has(key)) return false;
            return true;
          });

          if (filteredNew.length === 0) {
            setHasMore(false);
            return prev;
          }

          return {
            ...prev,
            jobs: [...prev.jobs, ...filteredNew]
          };
        });
        setPage(nextPage);
        setHasMore(res.data?.hasMore ?? false);
      }
    } catch (err) {
      console.warn('[LOAD MORE ERROR]', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle Opening Job Details with on-demand Groq AI Analysis
  const handleOpenJobDetails = async (job: any) => {
    setSelectedJob(job);
    sessionStorage.setItem('cm_current_job', JSON.stringify({ job, analysis: null }));
    setDetailModalOpen(true);
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisData(null);

    try {
      const currentProfile = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
      const userSkills = currentProfile?.skills || [];
      const userRole = currentProfile?.topMatch?.roleTitle || '';

      const res = await api.analyzeJob({
        jobId: job.id,
        description: job.description,
        jobTitle: job.title,
        userSkills,
        userRole
      });

      if (res.status === 'success' && res.data) {
        setAnalysisData(res.data);
        sessionStorage.setItem('cm_current_job', JSON.stringify({ job, analysis: res.data }));
      } else {
        setAnalysisError(res.error || 'Failed to analyze job.');
      }
    } catch (err: any) {
      console.warn('[GROQ ANALYSIS ERROR]', err);
      setAnalysisError(err.message || 'Failed to analyze job.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const normalized = searchInput.toLowerCase().trim().replace(/[\s/]+/g, '-');
    setActiveQuery(normalized);
  };

  const handleManualRefresh = () => {
    if (jobsLoading) return;
    setIsForcedRefresh(true);
    setForceRefreshTrigger(prev => prev + 1);
  };

  const handleImproveSkillsClick = () => {
    setDetailModalOpen(false);
    navigate('/skills');
  };

  // Toggle filter handlers
  const toggleWorkMode = (mode: string) => {
    setSelectedWorkModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
  };

  const toggleExperience = (exp: string) => {
    setSelectedExperienceLevels(prev => prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]);
  };

  const toggleEmploymentType = (type: string) => {
    setSelectedEmploymentTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const clearAllFilters = () => {
    setSelectedWorkModes([]);
    setSelectedExperienceLevels([]);
    setSelectedEmploymentTypes([]);
    setMinSalaryLpa(0);
  };

  // Apply client-side filters on loaded jobs
  const allJobsList: any[] = jobsData?.jobs || [];
  const filteredJobs = allJobsList.filter(job => {
    // Work mode filter
    if (selectedWorkModes.length > 0 && !selectedWorkModes.includes(job.workMode)) {
      return false;
    }
    // Experience filter
    if (selectedExperienceLevels.length > 0 && !selectedExperienceLevels.includes(job.experience)) {
      return false;
    }
    // Employment type filter
    if (selectedEmploymentTypes.length > 0 && !selectedEmploymentTypes.includes(job.employmentType)) {
      return false;
    }
    // Salary filter (Min LPA)
    if (minSalaryLpa > 0) {
      const maxLpa = job.salaryMax ? job.salaryMax / 100000 : (job.salaryMin / 100000);
      if (maxLpa > 0 && maxLpa < minSalaryLpa) return false;
    }
    return true;
  });

  const recommendedRoleTitle = profile?.topMatch?.roleTitle || 'Full Stack Developer';
  const recommendedJobs = allJobsList.filter(j => j.matchScore >= 75).slice(0, 3);

  // Helper for match score color badge
  const getMatchScoreBadge = (job: any) => {
    if (!job || job.matchAvailable === false || job.matchScore == null) {
      return { label: 'Match unavailable', color: 'bg-zinc-900 text-zinc-500 border-zinc-800' };
    }
    const score = job.matchScore;
    if (score >= 80) return { label: `${score}% Match`, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if (score >= 60) return { label: `${score}% Match`, color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    return { label: `${score}% Match`, color: 'bg-zinc-900 text-zinc-400 border-zinc-800' };
  };

  // Render Filter Section Component
  const renderFilterPanel = () => (
    <div className="space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Filter className="size-3.5 text-zinc-400" />
          Filter Jobs
        </h3>
        {(selectedWorkModes.length > 0 || selectedExperienceLevels.length > 0 || selectedEmploymentTypes.length > 0 || minSalaryLpa > 0) && (
          <button onClick={clearAllFilters} className="text-[10px] text-zinc-500 hover:text-white transition-colors cursor-pointer">
            Reset all
          </button>
        )}
      </div>

      <Separator className="bg-zinc-900" />

      {/* Work Mode */}
      <div className="space-y-3">
        <label className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] block">Work Mode</label>
        <div className="space-y-2">
          {['Remote', 'Hybrid', 'On-site'].map((mode) => (
            <label key={mode} className="flex items-center gap-2.5 text-zinc-300 cursor-pointer hover:text-white">
              <Checkbox 
                checked={selectedWorkModes.includes(mode)}
                onCheckedChange={() => toggleWorkMode(mode)}
                className="border-zinc-800 data-[state=checked]:bg-white data-[state=checked]:text-zinc-950"
              />
              <span>{mode}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-900" />

      {/* Experience Level */}
      <div className="space-y-3">
        <label className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] block">Experience Level</label>
        <div className="space-y-2">
          {['Fresher', '1-3 years', '3-5 years', '5+ years'].map((exp) => (
            <label key={exp} className="flex items-center gap-2.5 text-zinc-300 cursor-pointer hover:text-white">
              <Checkbox 
                checked={selectedExperienceLevels.includes(exp)}
                onCheckedChange={() => toggleExperience(exp)}
                className="border-zinc-800 data-[state=checked]:bg-white data-[state=checked]:text-zinc-950"
              />
              <span>{exp}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-900" />

      {/* Employment Type */}
      <div className="space-y-3">
        <label className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] block">Job Type</label>
        <div className="space-y-2">
          {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
            <label key={type} className="flex items-center gap-2.5 text-zinc-300 cursor-pointer hover:text-white">
              <Checkbox 
                checked={selectedEmploymentTypes.includes(type)}
                onCheckedChange={() => toggleEmploymentType(type)}
                className="border-zinc-800 data-[state=checked]:bg-white data-[state=checked]:text-zinc-950"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-900" />

      {/* Minimum Salary LPA */}
      <div className="space-y-3">
        <label className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] block">Minimum Salary</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Any', value: 0 },
            { label: '₹10+ LPA', value: 10 },
            { label: '₹20+ LPA', value: 20 },
            { label: '₹30+ LPA', value: 30 }
          ].map(sal => (
            <button
              key={sal.value}
              onClick={() => setMinSalaryLpa(sal.value)}
              className={`px-2 py-1.5 rounded border text-[10px] font-semibold transition-colors cursor-pointer ${
                minSalaryLpa === sal.value
                  ? 'bg-zinc-900 text-white border-zinc-700'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:border-zinc-800'
              }`}
            >
              {sal.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-[1200px] mx-auto space-y-8">
      
      {/* 1. Header and Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="size-5 text-zinc-400" />
              Job Opportunities
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Real hiring postings normalized and matched against your CareerMapper profile.
            </p>
          </div>

          {/* Refresh Controls */}
          <div className="flex items-center gap-3">
            {jobsData?.generatedAt && (
              <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline-block">
                Jobs · Updated {getRelativeTimeString(jobsData.generatedAt)}
              </span>
            )}

            <Button
              disabled={jobsLoading}
              onClick={handleManualRefresh}
              className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold rounded cursor-pointer"
            >
              <RotateCw className={`size-3.5 mr-1.5 ${jobsLoading ? 'animate-spin' : ''}`} />
              {jobsLoading && isForcedRefresh ? 'Refreshing Jobs...' : 'Refresh Jobs'}
            </Button>
          </div>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-zinc-500" />
            <Input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by role title, technology, or company..."
              className="pl-9 bg-zinc-900/60 border-zinc-900 text-xs text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-700 h-10"
            />
          </div>

          <div className="relative sm:w-48">
            <MapPin className="absolute left-3 top-3 size-4 text-zinc-500" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-zinc-900/60 border border-zinc-900 rounded-md text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer appearance-none"
            >
              <option value="all">All Locations</option>
              <option value="bengaluru">Bengaluru</option>
              <option value="gurugram">Gurugram / NCR</option>
              <option value="mumbai">Mumbai</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
              <option value="chennai">Chennai</option>
              <option value="remote">Remote Only</option>
            </select>
          </div>

          <Button type="submit" className="h-10 px-5 bg-white text-zinc-950 font-bold hover:bg-zinc-200 text-xs rounded cursor-pointer">
            Search Jobs
          </Button>

          {/* Mobile Filter Sheet Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full h-10 border-zinc-900 bg-zinc-900 text-zinc-300 text-xs font-semibold">
                  <SlidersHorizontal className="size-3.5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-zinc-950 border-zinc-900 text-white p-6">
                <SheetHeader className="pb-4 border-b border-zinc-900">
                  <SheetTitle className="text-sm font-bold uppercase text-white">Filter Jobs</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {renderFilterPanel()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </form>

        {/* ── Search This Role On ─────────────────────────── */}
        {(() => {
          const platforms: PlatformDef[] = [
            {
              name: 'LinkedIn',
              logo: 'https://static.cdnlogo.com/logos/l/78/linkedin-icon.svg',
              fallbackLogo: 'https://cdn.simpleicons.org/linkedin/0A66C2',
              initials: 'in',
              bgColor: 'bg-[#0A66C2]',
              description: "World's largest professional network. Great for senior & mid-level roles, networking, and company research.",
              tags: ['Global', 'Professional', 'High Volume'],
              url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchInput)}&location=${encodeURIComponent(selectedLocation === 'all' ? 'India' : selectedLocation)}`
            },
            {
              name: 'Indeed',
              logo: 'https://static.cdnlogo.com/logos/i/64/indeed.svg',
              fallbackLogo: 'https://cdn.simpleicons.org/indeed/003A9B',
              initials: 'i',
              bgColor: 'bg-[#2164F3]',
              description: 'One of the largest global job boards — aggregates listings from thousands of company sites and portals.',
              tags: ['Global', 'High Volume', 'All Roles'],
              url: `https://in.indeed.com/jobs?q=${encodeURIComponent(searchInput)}&l=${encodeURIComponent(selectedLocation === 'all' ? 'India' : selectedLocation)}`
            },
            {
              name: 'Naukri',
              logo: 'https://static.cdnlogo.com/logos/n/66/naukri.svg',
              fallbackLogo: 'https://logo.clearbit.com/naukri.com',
              initials: 'N',
              bgColor: 'bg-[#FF7555]',
              description: "India's #1 job portal. Millions of listings from top companies — best for mid to senior tech roles.",
              tags: ['India #1', 'Tech & IT', 'Mid–Senior'],
              url: `https://www.naukri.com/${searchInput.toLowerCase().replace(/[\s/]+/g, '-')}-jobs${selectedLocation !== 'all' ? '-in-' + selectedLocation.toLowerCase() : ''}`
            },

            {
              name: 'Glassdoor',
              logo: 'https://static.cdnlogo.com/logos/g/26/glassdoor.svg',
              fallbackLogo: 'https://cdn.simpleicons.org/glassdoor/0CAA41',
              initials: 'G',
              bgColor: 'bg-[#0CAA41]',
              description: 'Jobs with real company reviews, salary ranges, and interview experiences from verified employees.',
              tags: ['Reviews & Salaries', 'Insights', 'Global'],
              url: `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encodeURIComponent(searchInput)}`
            },
            {
              name: 'Internshala',
              logo: 'https://play-lh.googleusercontent.com/_LMZfdO7n1s4FkL86Up-LP_lVCZRNT8g9IHNQpS1ICilpz80JS47Ay0iXGQwbWQwmKW_S162xYbWRN-2cLGd=s96-rw',
              fallbackLogo: 'https://logo.clearbit.com/internshala.com',
              initials: 'IS',
              bgColor: 'bg-[#0073CF]',
              description: "India's top platform for internships & entry-level jobs — perfect for students and fresh graduates.",
              tags: ['India', 'Internships', 'Freshers'],
              url: `https://internshala.com/jobs/${searchInput.toLowerCase().replace(/[\s/]+/g, '-')}-jobs`
            }
          ];

          return (
            <div className="py-2.5 px-1 border-t border-b border-zinc-900/80 my-2">
              {/* Header label */}
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <ExternalLink className="size-3 text-zinc-600" />
                Search this role on
              </p>

              {/* Clean horizontal platform selector row */}
              <TooltipProvider delayDuration={200}>
                <div className="flex items-center justify-start sm:justify-around gap-6 sm:gap-8 overflow-x-auto pb-1 scrollbar-none">
                  {platforms.map(plat => (
                    <PlatformButton key={plat.name} plat={plat} />
                  ))}
                </div>
              </TooltipProvider>
            </div>
          );
        })()}

        {/* Context badge if searching a recommended role */}
        {(activeQuery === profile?.topMatch?.roleTitle?.toLowerCase().replace(/[\s/]+/g, '-') || Boolean(urlQueryParam)) && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10 py-1 px-2.5">
              <Sparkles className="size-3 mr-1 text-emerald-400" />
              Recommended for your profile
            </Badge>
          </div>
        )}

        {staleWarning && (
          <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded text-[11px] text-amber-300 flex items-center gap-2">
            <AlertTriangle className="size-3.5 shrink-0" />
            <span>Unable to refresh live job listings right now. Displaying cached results.</span>
          </div>
        )}
      </div>

      {/* 2. Recommended For You Banner */}
      {!jobsLoading && recommendedJobs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Recommended Jobs</h2>
              <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                Target: {recommendedRoleTitle}
              </Badge>
            </div>
            <button 
              onClick={() => navigate(`/jobs?query=${encodeURIComponent(recommendedRoleTitle.toLowerCase().replace(/[\s/]+/g, '-'))}`)}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer font-semibold flex items-center gap-1"
            >
              View Jobs →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => {
              const badge = getMatchScoreBadge(job);
              return (
                <Card 
                  key={`rec-${job.id}`}
                  onClick={() => handleOpenJobDetails(job)}
                  className="bg-zinc-900/20 hover:bg-zinc-900/50 border border-zinc-900 p-4 rounded-lg cursor-pointer transition-all space-y-3 hover:border-zinc-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{job.title}</h4>
                      <p className="text-xs text-zinc-400 truncate">{job.company}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${badge.color}`}>
                      {badge.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                    <span>{job.location}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">{job.salaryText}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Main Workspace Layout (Left Filters + Right Jobs List) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Left Filter Panel */}
        <aside className="hidden md:block md:col-span-1 bg-zinc-900/10 border border-zinc-900 p-5 rounded-lg space-y-6 sticky top-20">
          {renderFilterPanel()}
        </aside>

        {/* Right Job Results List */}
        <main className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-900">
            <span><strong className="text-white font-mono text-sm">{filteredJobs.length} jobs found</strong></span>
            <span className="font-mono text-[10px] text-zinc-500">Sorted by Match Score</span>
          </div>

          {jobsLoading ? (
            /* Loading Skeletons with Step Indicator */
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-zinc-900/40 border border-zinc-800 rounded text-xs text-zinc-300 animate-pulse">
                <RotateCw className="size-3.5 animate-spin text-zinc-400" />
                <span className="font-semibold">{loadingStepMessage}</span>
              </div>
              {[1, 2, 3, 4].map(idx => (
                <Card key={idx} className="bg-zinc-900/20 border-zinc-900 p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="size-10 bg-zinc-900 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-48 bg-zinc-900" />
                      <Skeleton className="h-3 w-32 bg-zinc-900" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full bg-zinc-900" />
                </Card>
              ))}
            </div>
          ) : jobsError ? (
            /* Error Retry State */
            <div className="p-8 text-center bg-zinc-900/20 border border-zinc-900 rounded-lg space-y-3">
              <AlertTriangle className="size-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-sm text-white">Job Search Unavailable</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">{jobsError}</p>
              <Button onClick={() => setForceRefreshTrigger(prev => prev + 1)} className="h-8 px-4 bg-white text-zinc-950 font-bold text-xs rounded">
                Try Again
              </Button>
            </div>
          ) : filteredJobs.length === 0 ? (
            /* Empty Results State */
            <div className="p-12 text-center bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-3">
              <Briefcase className="size-8 text-zinc-600 mx-auto" />
              <h3 className="font-bold text-sm text-white">No Matching Postings Found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No job postings match your active filter combination. Try clearing some filters or searching for another keyword.
              </p>
              <Button onClick={clearAllFilters} variant="outline" className="h-8 px-4 border-zinc-800 text-xs text-zinc-300">
                Clear Filters
              </Button>
            </div>
          ) : (
            /* Render Job Cards */
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const badge = getMatchScoreBadge(job);

                return (
                  <Card
                    key={job.id}
                    className="bg-zinc-900/10 hover:bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 p-5 rounded-lg transition-all space-y-4"
                  >
                    {/* Header: Logo, Title, Company, Match score badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <CompanyLogo 
                          companyName={job.company} 
                          companyLogo={job.companyLogo} 
                          companyDomain={job.companyDomain}
                          className="size-10"
                        />

                        <div className="space-y-1 min-w-0">
                          <h3 className="font-bold text-base text-white hover:text-emerald-400 transition-colors cursor-pointer truncate" onClick={() => handleOpenJobDetails(job)}>
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
                            <span className="font-medium text-zinc-300">{job.company}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3 text-zinc-500" />
                              {job.location}, {job.country}
                            </span>
                            <span>·</span>
                            <Badge variant="outline" className="text-[9px] uppercase font-mono border-zinc-800 text-zinc-400 bg-zinc-900/40">
                              {job.workMode}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Badge variant="outline" className={`text-xs font-bold shrink-0 px-2.5 py-1 ${badge.color}`}>
                        {badge.label}
                      </Badge>
                    </div>

                    {/* Metadata & Salary */}
                    <div className="flex items-center justify-between gap-4 pt-1 text-xs border-t border-zinc-900/80">
                      <div className="flex items-center gap-3 text-zinc-400 flex-wrap">
                        <span className="font-mono text-emerald-400 font-bold text-sm">{job.salaryText}</span>
                        <span>·</span>
                        <span className="text-zinc-400">{job.experience}</span>
                        <span>·</span>
                        <span className="text-zinc-500 font-mono text-[10px]">{job.postedText}</span>
                      </div>

                      <Button 
                        onClick={() => handleOpenJobDetails(job)}
                        className="h-8 px-3.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold border border-zinc-800 rounded cursor-pointer"
                      >
                        View Job
                      </Button>
                    </div>

                    {/* Required Skills Badges */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {job.skills.slice(0, 5).map((skill: any) => {
                          const skillName = typeof skill === 'object' && skill !== null ? skill.display || skill.canonical : skill;
                          const skillKey = typeof skill === 'object' && skill !== null ? skill.canonical || skill.display || skill._id : skill;
                          return (
                            <Badge key={skillKey} variant="secondary" className="bg-zinc-950 text-zinc-300 border border-zinc-900 text-[10px] flex items-center gap-1.5 py-0.5 px-2">
                              <SkillIcon skill={skill} className="size-3 text-zinc-400" />
                              <span>{skillName}</span>
                            </Badge>
                          );
                        })}
                        {job.skills.length > 5 && (
                          <span className="text-[10px] text-zinc-500 font-mono pl-1">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}

              {/* Load More Jobs Footer Button */}
              <div className="pt-4 flex flex-col items-center justify-center space-y-2">
                {hasMore ? (
                  <Button
                    disabled={loadingMore}
                    onClick={handleLoadMoreJobs}
                    className="h-9 px-6 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-bold text-xs rounded cursor-pointer transition-colors"
                  >
                    {loadingMore ? (
                      <>
                        <RotateCw className="size-3.5 mr-2 animate-spin text-zinc-400" />
                        Loading More Jobs...
                      </>
                    ) : (
                      'Load More Jobs'
                    )}
                  </Button>
                ) : (
                  <span className="text-xs text-zinc-500 font-mono italic">No more jobs available</span>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. Detailed Job Modal / Dialog */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="w-[95vw] md:w-[90vw] lg:w-[85vw] max-w-6xl h-[92vh] md:h-[88vh] bg-zinc-950 border-zinc-800 text-white p-0 flex flex-col space-y-0 overflow-hidden rounded-xl">
          {selectedJob && (() => {
            const matchedSkillsToDisplay = analysisData?.matchedSkills ?? selectedJob.matchedSkills ?? [];
            const missingSkillsToDisplay = analysisData?.missingSkills ?? selectedJob.missingSkills ?? [];
            const score = analysisData ? analysisData.matchScore : selectedJob.matchScore || 0;
            
            const matchedCount = matchedSkillsToDisplay.length;
            const missingCount = missingSkillsToDisplay.length;
            const totalSkills = matchedCount + missingCount;

            const chartData = totalSkills > 0 ? [
              { status: "matched", count: matchedCount, fill: "#10b981" },
              { status: "missing", count: missingCount, fill: "#f59e0b" }
            ] : [
              { status: "unavailable", count: 1, fill: "#27272a" }
            ];

            const chartConfig: ChartConfig = {
              matched: {
                label: "Matched Skills",
                color: "#10b981",
              },
              missing: {
                label: "Skills to Strengthen",
                color: "#f59e0b",
              },
              unavailable: {
                label: "No Skills Data",
                color: "#27272a",
              }
            };

            // Group extracted skills by category
            const groupedSkills: Record<string, any[]> = {};
            (analysisData?.extractedSkills || []).forEach((skill: any) => {
              const category = skill.category || 'Technology';
              if (!groupedSkills[category]) {
                groupedSkills[category] = [];
              }
              groupedSkills[category].push(skill);
            });

            // Collapsible items count helper
            const matchedToShow = showAllMatched ? matchedSkillsToDisplay : matchedSkillsToDisplay.slice(0, 8);
            const missingToShow = showAllMissing ? missingSkillsToDisplay : missingSkillsToDisplay.slice(0, 8);

            // Heuristic match explanation
            const getConciseMatchExplanation = () => {
              if (matchedSkillsToDisplay.length > 0) {
                return `Matches your verified expertise in ${matchedSkillsToDisplay.slice(0, 3).map((s: any) => s.display || s).join(', ')}${matchedSkillsToDisplay.length > 3 ? ', and more' : ''}.`;
              }
              return 'This listing matches your broad target industry domain. Build relevant skills to raise your score.';
            };

            return (
              <>
                {/* Fixed Sticky Header */}
                <DialogHeader className="p-5 border-b border-zinc-900 shrink-0 flex flex-row items-center justify-between gap-4 bg-zinc-950/95 backdrop-blur z-10 pr-12">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <CompanyLogo 
                      companyName={selectedJob.company} 
                      companyLogo={selectedJob.companyLogo} 
                      companyDomain={selectedJob.companyDomain}
                      className="size-11 sm:size-14 shrink-0 rounded-lg border border-zinc-900 bg-zinc-900/30 p-1.5"
                    />
                    <div className="min-w-0 space-y-1">
                      <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-white truncate leading-tight pr-4">
                        {selectedJob.title}
                      </DialogTitle>
                      <DialogDescription className="text-[11px] sm:text-xs text-zinc-400 truncate flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-zinc-200">{selectedJob.company}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-zinc-500" />
                          {selectedJob.location}, {selectedJob.country}
                        </span>
                        <span>·</span>
                        <span className="text-[10px] text-zinc-500 font-mono">Via {selectedJob.source || 'JSearch'}</span>
                      </DialogDescription>
                      
                      {/* Badge Metadata Row */}
                      <div className="flex items-center gap-1.5 text-xs flex-wrap font-mono pt-1">
                        <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[9.5px] sm:text-[10.5px] py-0.5 px-2 font-bold">
                          {selectedJob.salaryText || 'Salary Unspecified'}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-900 text-zinc-400 bg-zinc-900/20 text-[9.5px] sm:text-[10.5px] py-0.5 px-2">
                          {selectedJob.workMode}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-900 text-zinc-400 bg-zinc-900/20 text-[9.5px] sm:text-[10.5px] py-0.5 px-2">
                          {selectedJob.employmentType}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-900 text-zinc-400 bg-zinc-900/20 text-[9.5px] sm:text-[10.5px] py-0.5 px-2">
                          {selectedJob.experience}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Indicator Ring */}
                  <div className="flex items-center gap-3 shrink-0 self-center">
                    <div className="relative size-12 flex items-center justify-center">
                      <svg className="size-full -rotate-90">
                        <circle 
                          cx="24" cy="24" r="20" 
                          className="stroke-zinc-900" 
                          strokeWidth="3.5" fill="transparent" 
                        />
                        <circle 
                          cx="24" cy="24" r="20" 
                          className="stroke-emerald-500 transition-all duration-500" 
                          strokeWidth="3.5" fill="transparent" 
                          strokeDasharray="125.6"
                          strokeDashoffset={125.6 - (125.6 * score) / 100}
                        />
                      </svg>
                      <span className="absolute text-[10.5px] font-mono font-black text-emerald-400">
                        {score}%
                      </span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-bold text-white uppercase tracking-wider">Skill Match</div>
                      <div className="text-[9px] text-emerald-400 font-medium font-mono">Alignment</div>
                    </div>
                  </div>
                </DialogHeader>

                {/* Main Interactive Workspace Container */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Sticky Table of Contents (Desktop only) */}
                  <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-zinc-900/60 bg-zinc-950 p-6 space-y-2 sticky top-0 h-full overflow-y-auto custom-scrollbar select-none">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-3 block">Navigation</span>
                    <button 
                      onClick={() => scrollToSection('match-section')} 
                      className="text-left font-mono text-[11px] text-zinc-400 hover:text-emerald-400 hover:pl-1 transition-all py-1.5 border-l border-zinc-800 pl-3 focus:outline-none focus:text-emerald-400 cursor-pointer"
                    >
                      01. WHY YOU MATCH
                    </button>
                    <button 
                      onClick={() => scrollToSection('snapshot-section')} 
                      className="text-left font-mono text-[11px] text-zinc-400 hover:text-emerald-400 hover:pl-1 transition-all py-1.5 border-l border-zinc-800 pl-3 focus:outline-none focus:text-emerald-400 cursor-pointer"
                    >
                      02. ROLE SNAPSHOT
                    </button>
                    <button 
                      onClick={() => scrollToSection('requirements-section')} 
                      className="text-left font-mono text-[11px] text-zinc-400 hover:text-emerald-400 hover:pl-1 transition-all py-1.5 border-l border-zinc-800 pl-3 focus:outline-none focus:text-emerald-400 cursor-pointer"
                    >
                      03. REQUIREMENTS
                    </button>
                    <button 
                      onClick={() => scrollToSection('skills-section')} 
                      className="text-left font-mono text-[11px] text-zinc-400 hover:text-emerald-400 hover:pl-1 transition-all py-1.5 border-l border-zinc-800 pl-3 focus:outline-none focus:text-emerald-400 cursor-pointer"
                    >
                      04. EXTRACTED SKILLS
                    </button>
                    <button 
                      onClick={() => scrollToSection('description-section')} 
                      className="text-left font-mono text-[11px] text-zinc-400 hover:text-emerald-400 hover:pl-1 transition-all py-1.5 border-l border-zinc-800 pl-3 focus:outline-none focus:text-emerald-400 cursor-pointer"
                    >
                      05. JOB DESCRIPTION
                    </button>
                  </aside>

                  {/* Main Scroll Content Area */}
                  <div 
                    id="job-details-scroll-container"
                    className="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-950 custom-scrollbar scroll-smooth"
                  >
                    {analysisLoading ? (
                      /* Interactive Progressive Loading State */
                      <div className="space-y-8 max-w-4xl mx-auto">
                        {/* Loading Progress Checklist Card */}
                        <Card className="bg-zinc-900/10 border-zinc-900 p-5 space-y-4 rounded-xl">
                          <div className="flex items-center gap-2">
                            <RotateCw className="size-4 animate-spin text-emerald-400" />
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">JOB INTELLIGENCE</h4>
                          </div>
                          <p className="text-xs text-zinc-400">Analyzing this opportunity to build your alignment report...</p>
                          
                          <div className="space-y-2.5 pt-2 border-t border-zinc-900/60 font-mono text-[11px]">
                            {[
                              "Reading job description",
                              "Identifying requirements",
                              "Extracting skills",
                              "Calculating skill alignment",
                              "Preparing job insights"
                            ].map((stageText, idx) => {
                              const isDone = idx < loadingStageIndex;
                              const isActive = idx === loadingStageIndex;
                              return (
                                <div key={idx} className="flex items-center gap-3">
                                  {isDone ? (
                                    <span className="text-emerald-400 font-bold">✓</span>
                                  ) : isActive ? (
                                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                  ) : (
                                    <span className="text-zinc-700">○</span>
                                  )}
                                  <span className={isDone ? "text-zinc-300" : isActive ? "text-emerald-400 font-bold" : "text-zinc-600"}>
                                    {stageText}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </Card>

                        {/* Loading Skeletons */}
                        <div className="space-y-6 opacity-60">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-zinc-900" />
                            <Skeleton className="h-28 w-full bg-zinc-900/40 rounded-xl" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-20 bg-zinc-900/30 rounded-xl" />
                            <Skeleton className="h-20 bg-zinc-900/30 rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-28 bg-zinc-900" />
                            <Skeleton className="h-40 w-full bg-zinc-900/20 rounded-xl" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Job Profile Content Flow */
                      <div className="space-y-8 max-w-4xl mx-auto pb-10">
                        {analysisError && (
                          <div className="p-3 bg-amber-950/20 border border-amber-900/60 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
                            <Info className="size-4 shrink-0" />
                            <span>Additional job insights are temporarily unavailable. Showing original description.</span>
                          </div>
                        )}

                        {/* Section 1: Why This Job Matches You */}
                        <section id="match-section" className="space-y-4 scroll-mt-6">
                          <div className="flex items-center gap-2">
                            <Sparkles className="size-4.5 text-emerald-400" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Why This Job Matches You</h3>
                          </div>
                          
                          <Card className="bg-zinc-900/10 border-zinc-900 p-5 md:p-6 rounded-xl">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                              {/* Left Column: Donut Alignment Chart & Badges */}
                              <div className="w-full md:w-56 shrink-0 flex flex-col items-center gap-4 text-center">
                                <ChartContainer config={chartConfig} className="size-40 mx-auto">
                                  <PieChart>
                                    <ChartTooltip
                                      cursor={false}
                                      content={<ChartTooltipContent hideLabel nameKey="status" />}
                                    />
                                    <Pie
                                      data={chartData}
                                      dataKey="count"
                                      nameKey="status"
                                      innerRadius={50}
                                      outerRadius={70}
                                      strokeWidth={0}
                                    >
                                      {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                      ))}
                                      <Label
                                        content={({ viewBox }) => {
                                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                              <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                              >
                                                <tspan
                                                  x={viewBox.cx}
                                                  y={viewBox.cy - 2}
                                                  className="fill-white text-xl font-bold font-mono font-black"
                                                >
                                                  {totalSkills > 0 ? `${score}%` : "0%"}
                                                </tspan>
                                                <tspan
                                                  x={viewBox.cx}
                                                  y={(viewBox.cy || 0) + 16}
                                                  className="fill-zinc-400 text-[9px] uppercase font-bold tracking-widest font-mono"
                                                >
                                                  Skill Match
                                                </tspan>
                                              </text>
                                            )
                                          }
                                        }}
                                      />
                                    </Pie>
                                  </PieChart>
                                </ChartContainer>

                                {/* Badges and status text */}
                                <div className="space-y-2">
                                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-mono font-semibold">
                                      {selectedJob.experience && selectedJob.experience.toLowerCase() !== 'unspecified' ? 'Good Match' : 'High Overlap'}
                                    </Badge>
                                    {selectedJob.salaryText && (
                                      <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[10px] font-mono">
                                        Competitive
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {totalSkills === 0 && (
                                    <span className="text-[10.5px] text-amber-500 font-medium italic block leading-snug">
                                      Skill analysis unavailable
                                    </span>
                                  )}
                                  {totalSkills > 0 && missingCount === 0 && (
                                    <span className="text-[10.5px] text-emerald-400 font-bold block leading-snug">
                                      All required skills covered!
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Right Column: AI Eval + Skills Breakdown */}
                              <div className="flex-1 space-y-5 w-full">
                                {/* AI Eval */}
                                <div className="bg-zinc-900/10 border border-zinc-900/80 rounded-xl p-4 space-y-1.5">
                                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">AI Evaluation</span>
                                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                                    {getConciseMatchExplanation()}
                                  </p>
                                </div>

                                <Separator className="bg-zinc-900/80" />

                                {/* Skills breakdown grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                                  {/* Matched Skills */}
                                  <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                                      <Check className="size-3.5 text-emerald-400" />
                                      Matched Skills ({matchedSkillsToDisplay.length})
                                    </span>
                                    
                                    {matchedSkillsToDisplay.length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5">
                                        {matchedToShow.map((s: any) => {
                                          const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
                                          const sKey = typeof s === 'object' && s !== null ? s.canonical || s.display || s._id : s;
                                          return (
                                            <Badge key={sKey} variant="secondary" className="bg-zinc-900/60 text-emerald-400 border border-zinc-900 text-xs py-1 px-2.5 flex items-center gap-1.5 capitalize font-medium">
                                              <SkillIcon skill={s} className="size-3 text-emerald-400" />
                                              {sName}
                                            </Badge>
                                          );
                                        })}
                                        {matchedSkillsToDisplay.length > 8 && (
                                          <button 
                                            onClick={() => setShowAllMatched(!showAllMatched)}
                                            className="text-[11px] text-zinc-400 hover:text-white hover:underline transition-colors font-semibold self-center pl-1 cursor-pointer"
                                          >
                                            {showAllMatched ? 'Show less' : `+${matchedSkillsToDisplay.length - 8} more`}
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-zinc-500 text-xs italic block">No skills directly matched yet.</span>
                                    )}
                                  </div>

                                  {/* Skills to Strengthen */}
                                  <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                                      <AlertTriangle className="size-3.5 text-amber-500" />
                                      Skills to Strengthen ({missingSkillsToDisplay.length})
                                    </span>
                                    
                                    {missingSkillsToDisplay.length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5">
                                        {missingToShow.map((s: any) => {
                                          const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
                                          const sKey = typeof s === 'object' && s !== null ? s.canonical || s.display || s._id : s;
                                          return (
                                            <Badge key={sKey} variant="outline" className="bg-zinc-950 text-amber-500 border border-zinc-900 border-dashed text-xs py-1 px-2.5 flex items-center gap-1.5 capitalize font-medium">
                                              <SkillIcon skill={s} className="size-3 text-amber-500" />
                                              {sName}
                                            </Badge>
                                          );
                                        })}
                                        {missingSkillsToDisplay.length > 8 && (
                                          <button 
                                            onClick={() => setShowAllMissing(!showAllMissing)}
                                            className="text-[11px] text-zinc-400 hover:text-white hover:underline transition-colors font-semibold self-center pl-1 cursor-pointer"
                                          >
                                            {showAllMissing ? 'Show less' : `+${missingSkillsToDisplay.length - 8} more`}
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      matchedSkillsToDisplay.length > 0 ? (
                                        <span className="text-emerald-400 text-xs font-semibold block">✓ All required skills covered! You are fully aligned!</span>
                                      ) : (
                                        <span className="text-zinc-500 text-xs italic block">No technical skills listed.</span>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                  <Button 
                                    onClick={handleImproveSkillsClick}
                                    variant="outline" 
                                    className="h-8 px-4 text-xs border-zinc-850 text-zinc-300 hover:text-white hover:bg-zinc-900 cursor-pointer"
                                  >
                                    Improve Skills
                                    <ArrowRight className="size-3.5 ml-1.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </section>

                        {/* Section 2: Job Snapshot */}
                        <section id="snapshot-section" className="space-y-4 scroll-mt-6">
                          <div className="flex items-center gap-2">
                            <SlidersHorizontal className="size-4.5 text-zinc-400" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Job Snapshot</h3>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-zinc-900/10 border-zinc-900/80 p-4 space-y-1 rounded-xl">
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono block">Salary Range</span>
                              <p className="text-xs font-bold text-emerald-400">{selectedJob.salaryText || 'Salary Unspecified'}</p>
                            </Card>
                            <Card className="bg-zinc-900/10 border-zinc-900/80 p-4 space-y-1 rounded-xl">
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono block">Work Mode</span>
                              <p className="text-xs font-bold text-zinc-300 capitalize">{selectedJob.workMode}</p>
                            </Card>
                            <Card className="bg-zinc-900/10 border-zinc-900/80 p-4 space-y-1 rounded-xl">
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono block">Job Type</span>
                              <p className="text-xs font-bold text-zinc-300 capitalize">{selectedJob.employmentType}</p>
                            </Card>
                            <Card className="bg-zinc-900/10 border-zinc-900/80 p-4 space-y-1 rounded-xl">
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono block">Experience</span>
                              <p className="text-xs font-bold text-zinc-300">{selectedJob.experience || 'All levels'}</p>
                            </Card>
                          </div>

                          <Card className="bg-zinc-900/10 border-zinc-900/80 p-5 rounded-xl space-y-2">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono block">Summary Snapshot</span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
                              {analysisData?.structuredDescription?.aboutRole || 
                               (selectedJob.description ? `${selectedJob.description.substring(0, 350).trim()}...` : 'No summary details specified.')}
                            </p>
                          </Card>
                        </section>

                        {/* Section 3: Requirements */}
                        <section id="requirements-section" className="space-y-4 scroll-mt-6">
                          <div className="flex items-center gap-2">
                            <Briefcase className="size-4.5 text-zinc-400" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Requirements</h3>
                          </div>
                          
                          {analysisData?.structuredDescription ? (() => {
                            const struct = analysisData.structuredDescription;
                            const hasReqs = struct.experience || struct.education || (struct.requiredSkills && struct.requiredSkills.length > 0);
                            if (!hasReqs) {
                              return (
                                <div className="p-6 text-center bg-zinc-900/10 border border-zinc-900 rounded-xl">
                                  <span className="text-xs text-zinc-500 italic">No structured requirements found. Check full description details below.</span>
                                </div>
                              );
                            }
                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(struct.experience || struct.education) && (
                                  <div className="space-y-4">
                                    {struct.experience && (
                                      <Card className="bg-zinc-900/10 border-zinc-900/80 p-5 rounded-xl space-y-2 h-fit">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block border-b border-zinc-900 pb-1.5">Experience Required</span>
                                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">{struct.experience}</p>
                                      </Card>
                                    )}
                                    {struct.education && (
                                      <Card className="bg-zinc-900/10 border-zinc-900/80 p-5 rounded-xl space-y-2 h-fit">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block border-b border-zinc-900 pb-1.5">Education Requirements</span>
                                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">{struct.education}</p>
                                      </Card>
                                    )}
                                  </div>
                                )}
                                {struct.requiredSkills && struct.requiredSkills.length > 0 && (
                                  <Card className="bg-zinc-900/10 border-zinc-900/80 p-5 rounded-xl space-y-3 h-full">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block border-b border-zinc-900 pb-1.5">Core Qualifications</span>
                                    <ul className="list-disc pl-4 text-xs text-zinc-300 space-y-2 leading-relaxed">
                                      {struct.requiredSkills.map((s: any, idx: number) => {
                                        const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
                                        return <li key={idx} className="font-normal">{sName}</li>;
                                      })}
                                    </ul>
                                  </Card>
                                )}
                              </div>
                            );
                          })() : (
                            <div className="p-6 text-center bg-zinc-900/10 border border-zinc-900 rounded-xl">
                              <span className="text-xs text-zinc-500 italic">Requirements details will load with AI insights...</span>
                            </div>
                          )}
                        </section>

                        {/* Section 4: Extracted Skills */}
                        <section id="skills-section" className="space-y-4 scroll-mt-6">
                          <div className="flex items-center gap-2">
                            <SlidersHorizontal className="size-4.5 text-zinc-400" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Extracted Skills</h3>
                          </div>
                          
                          {analysisData?.extractedSkills && analysisData.extractedSkills.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Object.entries(groupedSkills).map(([category, skills]) => {
                                const isExpanded = !!expandedSkillCategories[category];
                                const skillsToShow = isExpanded ? skills : skills.slice(0, 10);
                                
                                return (
                                  <Card key={category} className="bg-zinc-900/10 border-zinc-900/80 p-5 space-y-4 rounded-xl hover:border-zinc-800 transition-colors">
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block border-b border-zinc-900 pb-2">
                                      {category}
                                    </h4>
                                    
                                    <div className="flex flex-wrap gap-1.5">
                                      {skillsToShow.map((s: any) => {
                                        const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
                                        const sKey = typeof s === 'object' && s !== null ? s.canonical || s.display || s._id : s;
                                        return (
                                          <Badge key={sKey} variant="secondary" className="bg-zinc-950 text-zinc-300 border border-zinc-900/50 text-[10px] flex items-center gap-1.5 py-1 px-2.5 capitalize font-normal">
                                            <SkillIcon skill={s} className="size-3 text-zinc-400" />
                                            <span>{sName}</span>
                                          </Badge>
                                        );
                                      })}
                                      
                                      {skills.length > 10 && (
                                        <button
                                          onClick={() => toggleSkillCategory(category)}
                                          className="text-[11px] text-zinc-400 hover:text-white hover:underline transition-colors font-bold self-center pl-1 cursor-pointer"
                                        >
                                          {isExpanded ? 'Show less' : `+${skills.length - 10} more`}
                                        </button>
                                      )}
                                    </div>
                                  </Card>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-6 text-center bg-zinc-900/10 border border-zinc-900 rounded-xl space-y-2">
                              <Briefcase className="size-6 text-zinc-600 mx-auto" />
                              <span className="text-xs text-zinc-400 block font-medium">Extracted skills will compile with AI insights...</span>
                            </div>
                          )}
                        </section>

                        {/* Section 5: Job Description */}
                        <section id="description-section" className="space-y-4 scroll-mt-6">
                          <div className="flex items-center gap-2">
                            <Info className="size-4.5 text-zinc-400" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Job Description</h3>
                          </div>
                          
                          {(() => {
                            const struct = analysisData?.structuredDescription;
                            const hasStructure = struct && (
                              struct.responsibilities?.length > 0 ||
                              struct.requiredSkills?.length > 0 ||
                              struct.preferredSkills?.length > 0 ||
                              struct.benefits?.length > 0 ||
                              struct.experience ||
                              struct.education ||
                              struct.otherRequirements
                            );

                            if (hasStructure && struct) {
                              return (
                                <div className="space-y-3">
                                  {/* About role */}
                                  {struct.aboutRole && (
                                    <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-900/10">
                                      <button 
                                        onClick={() => toggleSection('about')} 
                                        className="w-full flex items-center justify-between p-4 font-bold text-xs text-white hover:bg-zinc-900/50 transition-all cursor-pointer"
                                      >
                                        <span className="uppercase tracking-wider">About the Role</span>
                                        <ChevronDown className={`size-4 text-zinc-400 transition-transform ${expandedSections['about'] ? 'rotate-180' : ''}`} />
                                      </button>
                                      {expandedSections['about'] && (
                                        <div className="p-4 pt-0 text-xs text-zinc-300 leading-relaxed border-t border-zinc-900/50 whitespace-pre-line font-normal">
                                          {struct.aboutRole}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Responsibilities */}
                                  {struct.responsibilities && struct.responsibilities.length > 0 && (
                                    <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-900/10">
                                      <button 
                                        onClick={() => toggleSection('responsibilities')} 
                                        className="w-full flex items-center justify-between p-4 font-bold text-xs text-white hover:bg-zinc-900/50 transition-all cursor-pointer"
                                      >
                                        <span className="uppercase tracking-wider">Key Responsibilities</span>
                                        <ChevronDown className={`size-4 text-zinc-400 transition-transform ${expandedSections['responsibilities'] ? 'rotate-180' : ''}`} />
                                      </button>
                                      {expandedSections['responsibilities'] && (
                                        <div className="p-4 pt-0 text-xs text-zinc-300 border-t border-zinc-900/50">
                                          <ul className="list-disc pl-4 space-y-2 leading-relaxed pt-2.5 font-normal">
                                            {struct.responsibilities.map((r: string, idx: number) => <li key={idx}>{r}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Preferred qualifications */}
                                  {struct.preferredSkills && struct.preferredSkills.length > 0 && (
                                    <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-900/10">
                                      <button 
                                        onClick={() => toggleSection('preferred')} 
                                        className="w-full flex items-center justify-between p-4 font-bold text-xs text-white hover:bg-zinc-900/50 transition-all cursor-pointer"
                                      >
                                        <span className="uppercase tracking-wider">Preferred Qualifications</span>
                                        <ChevronDown className={`size-4 text-zinc-400 transition-transform ${expandedSections['preferred'] ? 'rotate-180' : ''}`} />
                                      </button>
                                      {expandedSections['preferred'] && (
                                        <div className="p-4 pt-0 text-xs text-zinc-300 border-t border-zinc-900/50">
                                          <ul className="list-disc pl-4 space-y-2 leading-relaxed pt-2.5 font-normal">
                                            {struct.preferredSkills.map((s: any, idx: number) => {
                                              const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
                                              return <li key={idx}>{sName}</li>;
                                            })}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Benefits */}
                                  {struct.benefits && struct.benefits.length > 0 && (
                                    <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-900/10">
                                      <button 
                                        onClick={() => toggleSection('benefits')} 
                                        className="w-full flex items-center justify-between p-4 font-bold text-xs text-white hover:bg-zinc-900/50 transition-all cursor-pointer"
                                      >
                                        <span className="uppercase tracking-wider">Benefits & Perks</span>
                                        <ChevronDown className={`size-4 text-zinc-400 transition-transform ${expandedSections['benefits'] ? 'rotate-180' : ''}`} />
                                      </button>
                                      {expandedSections['benefits'] && (
                                        <div className="p-4 pt-0 text-xs text-zinc-300 border-t border-zinc-900/50">
                                          <ul className="list-disc pl-4 space-y-2 leading-relaxed pt-2.5 font-normal">
                                            {struct.benefits.map((b: string, idx: number) => <li key={idx}>{b}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Other Requirements */}
                                  {struct.otherRequirements && (
                                    <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-900/10">
                                      <button 
                                        onClick={() => toggleSection('other')} 
                                        className="w-full flex items-center justify-between p-4 font-bold text-xs text-white hover:bg-zinc-900/50 transition-all cursor-pointer"
                                      >
                                        <span className="uppercase tracking-wider">Additional Information</span>
                                        <ChevronDown className={`size-4 text-zinc-400 transition-transform ${expandedSections['other'] ? 'rotate-180' : ''}`} />
                                      </button>
                                      {expandedSections['other'] && (
                                        <div className="p-4 pt-0 text-xs text-zinc-300 leading-relaxed border-t border-zinc-900/50 whitespace-pre-line font-normal">
                                          {struct.otherRequirements}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              // Fallback to raw description
                              const rawDescCleaned = (selectedJob.description || '')
                                .replace(/(reputed company\s*)+/gi, 'reputed company')
                                .replace(/(reputed\s*)+/gi, 'reputed')
                                .replace(/(company\s*)+/gi, 'company');

                              return (
                                <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/10 p-5 border border-zinc-900 rounded-xl whitespace-pre-line font-normal">
                                  {rawDescCleaned}
                                </div>
                              );
                            }
                          })()}
                        </section>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticky Footer */}
                <div className="p-4 px-6 border-t border-zinc-900 shrink-0 flex items-center justify-between bg-zinc-950 z-10">
                  <span className="text-[10px] text-zinc-500 font-mono">Source: {selectedJob.source || 'JSearch'}</span>

                  {selectedJob.sourceUrl && (selectedJob.sourceUrl.startsWith('http://') || selectedJob.sourceUrl.startsWith('https://')) ? (
                    <a 
                      href={selectedJob.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-xs rounded transition-colors cursor-pointer"
                    >
                      Apply / View Job
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : (
                    <Button disabled variant="outline" className="text-xs text-zinc-500 border-zinc-800 cursor-not-allowed">
                      Apply Unavailable
                    </Button>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

    </div>
  );
}
