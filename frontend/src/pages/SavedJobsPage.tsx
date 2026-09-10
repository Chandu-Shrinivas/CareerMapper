import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, MapPin, ExternalLink, Trash2, 
  Clock, Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { CompanyLogo } from '../components/CompanyLogo';
import { SkillIcon } from '../components/SkillIcon';
import { api } from '../services/api';
import { toast } from 'sonner';

// Reusable detailed Job Details Dialog from JobsPage.tsx (custom rendered locally)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../components/ui/chart';
import { PieChart, Pie, Cell, Label } from 'recharts';

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected job for modal details view
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSavedJobs();
      if (res.status === 'success') {
        setJobs(res.data || []);
      } else {
        setError(res.message || 'Failed to retrieve saved jobs.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleRemoveSavedJob = async (savedJobId: string) => {
    // Optimistic UI update
    const previousJobs = [...jobs];
    setJobs(prev => prev.filter(j => j._id !== savedJobId));
    toast.success('Job removed from saved list');

    try {
      await api.deleteSavedJob(savedJobId);
      if (selectedJob && selectedJob._id === savedJobId) {
        setDetailModalOpen(false);
      }
    } catch (err: any) {
      // Rollback on failure
      setJobs(previousJobs);
      toast.error(err.message || 'Failed to remove job.');
    }
  };

  const handleUpdateStatus = async (savedJobId: string, newStatus: string) => {
    // Optimistic UI update
    const previousJobs = [...jobs];
    setJobs(prev => prev.map(j => j._id === savedJobId ? { ...j, status: newStatus } : j));
    toast.success(`Application status updated to ${newStatus}`);

    try {
      await api.updateSavedJobStatus(savedJobId, newStatus);
    } catch (err: any) {
      // Rollback on failure
      setJobs(previousJobs);
      toast.error(err.message || 'Failed to update job status.');
    }
  };

  const handlePrepareJob = async (jobItem: any) => {
    try {
      toast.loading('Generating job preparation roadmap...');
      const targetJobId = jobItem.jobId || jobItem.id || jobItem._id;
      const res = await api.prepareJob(targetJobId);
      toast.dismiss();
      toast.success('Job preparation roadmap ready!');
      const prepId = res.data?._id || res.data?.id;
      if (prepId) {
        navigate(`/job-preparation/${prepId}`);
      } else {
        navigate('/my-roadmaps');
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || 'Failed to initialize job preparation.');
    }
  };

  const getMatchScoreBadge = (job: any) => {
    const score = job.matchScore || 0;
    if (score >= 85) return { color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5', label: 'Strong Match' };
    if (score >= 70) return { color: 'border-blue-500/20 text-blue-400 bg-blue-500/5', label: 'Good Match' };
    if (score >= 50) return { color: 'border-amber-500/20 text-amber-400 bg-amber-500/5', label: 'Fair Match' };
    return { color: 'border-zinc-800 text-zinc-400 bg-zinc-900/40', label: 'Low Match' };
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Saved':
        return 'border-zinc-800 text-zinc-400 bg-zinc-900/50';
      case 'Applied':
        return 'border-blue-500/20 text-blue-400 bg-blue-500/5';
      case 'Assessment':
        return 'border-purple-500/20 text-purple-400 bg-purple-500/5';
      case 'Interview':
        return 'border-amber-500/20 text-amber-400 bg-amber-500/5';
      case 'Offer':
        return 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5';
      case 'Rejected':
        return 'border-red-500/20 text-red-400 bg-red-500/5';
      case 'Withdrawn':
        return 'border-zinc-800 text-zinc-500 bg-zinc-900/20';
      default:
        return 'border-zinc-800 text-zinc-400 bg-zinc-900/50';
    }
  };

  const getRelativeTimeString = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return 'recently';
    const date = new Date(dateInput);
    const diffMs = Date.now() - date.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'recently';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  };

  const renderModalDetails = () => {
    if (!selectedJob) return null;

    const analysisData = selectedJob.analysisData;
    const score = analysisData ? analysisData.matchScore : selectedJob.matchScore || 0;

    const matchedSkillsToDisplay = analysisData?.matchedSkills ?? selectedJob.matchedSkills ?? [];
    const missingSkillsToDisplay = analysisData?.missingSkills ?? selectedJob.missingSkills ?? [];

    const chartData = [
      { status: "matched", value: matchedSkillsToDisplay.length, fill: "#10b981" },
      { status: "missing", value: missingSkillsToDisplay.length, fill: "#f59e0b" }
    ];

    if (matchedSkillsToDisplay.length === 0 && missingSkillsToDisplay.length === 0) {
      chartData.push({ status: "unavailable", value: 1, fill: "#27272a" });
    }

    const chartConfig: ChartConfig = {
      matched: { label: "Matched Skills", color: "#10b981" },
      missing: { label: "Skills to Strengthen", color: "#f59e0b" },
      unavailable: { label: "No Skills Data", color: "#27272a" }
    };

    return (
      <DialogContent className="max-w-4xl h-[90vh] md:h-[85vh] bg-zinc-950 border border-zinc-900 text-white flex flex-col p-0 overflow-hidden rounded-xl">
        {/* Modal Sticky Header */}
        <DialogHeader className="p-5 border-b border-zinc-900 shrink-0 flex flex-row items-center justify-between gap-4 bg-zinc-950/95 backdrop-blur z-10 pr-12">
          <div className="flex items-start gap-3.5 min-w-0">
            <CompanyLogo 
              companyName={selectedJob.company} 
              companyLogo={selectedJob.companyLogo} 
              className="size-11 sm:size-14 shrink-0 rounded-lg border border-zinc-900 bg-zinc-900/30 p-1.5"
            />
            <div className="min-w-0 space-y-1">
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-white truncate pr-4 leading-tight">
                {selectedJob.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 truncate flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-zinc-200">{selectedJob.company}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-zinc-500" />
                  {selectedJob.location}, {selectedJob.country}
                </span>
                <span>·</span>
                <span className="text-xs text-zinc-500 font-mono">Via {selectedJob.source || 'JSearch'}</span>
              </DialogDescription>

              <div className="flex items-center gap-1.5 text-xs flex-wrap font-mono pt-1">
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-xs py-0.5 px-2 font-bold">
                  {selectedJob.salaryText || 'Salary Unspecified'}
                </Badge>
                <Badge variant="outline" className="border-zinc-900 text-zinc-400 bg-zinc-900/20 text-xs py-0.5 px-2">
                  {selectedJob.workMode}
                </Badge>
                <Badge variant="outline" className="border-zinc-900 text-zinc-400 bg-zinc-900/20 text-xs py-0.5 px-2">
                  {selectedJob.employmentType}
                </Badge>
                <Badge variant="outline" className="border-zinc-900 text-zinc-400 bg-zinc-900/20 text-xs py-0.5 px-2">
                  {selectedJob.experience}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-center">
            {/* Status Selector */}
            <Select
              value={selectedJob.status}
              onValueChange={(status) => {
                handleUpdateStatus(selectedJob._id, status);
                setSelectedJob((prev: any) => ({ ...prev, status }));
              }}
            >
              <SelectTrigger className="h-9 w-[110px] bg-zinc-900/60 border-zinc-850 text-xs text-zinc-300 hover:text-white rounded cursor-pointer font-bold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-200">
                <SelectItem value="Saved">Saved</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Assessment">Assessment</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>

            {/* Unsave Button */}
            <Button
              onClick={() => handleRemoveSavedJob(selectedJob._id)}
              variant="outline"
              className="h-9 px-3 border-zinc-800 bg-zinc-900 hover:bg-red-950/20 hover:border-red-900/50 hover:text-red-400 rounded cursor-pointer"
            >
              <Trash2 className="size-4 mr-1.5" />
              <span className="hidden sm:inline">Remove</span>
            </Button>

            {/* Match Circle */}
            <div className="relative size-12 flex items-center justify-center shrink-0">
              <svg className="size-full -rotate-90">
                <circle cx="24" cy="24" r="20" className="stroke-zinc-900" strokeWidth="3.5" fill="transparent" />
                <circle 
                  cx="24" cy="24" r="20" 
                  className="stroke-emerald-500 transition-all duration-500" 
                  strokeWidth="3.5" fill="transparent" 
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (125.6 * score) / 100}
                />
              </svg>
              <span className="absolute text-xs font-mono font-bold text-emerald-400">{score}%</span>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Scroll Workspace */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Match analysis details card */}
          {analysisData && (
            <div className="p-5 border border-zinc-900 rounded-lg bg-zinc-900/10 space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-400 animate-pulse" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-300">Skill Alignment Analysis</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Donut Chart block */}
                <div className="md:col-span-1 flex flex-col items-center">
                  <ChartContainer config={chartConfig} className="size-[140px]">
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="status" hideLabel />} />
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="status"
                        innerRadius={45}
                        outerRadius={60}
                        strokeWidth={2}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                  <tspan x={viewBox.cx} y={viewBox.cy} className="fill-white text-xl font-bold font-mono">
                                    {score}%
                                  </tspan>
                                  <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} className="fill-zinc-500 text-xs uppercase font-bold tracking-wider">
                                    Match
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>

                {/* Lists block */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <h4 className="text-xs text-zinc-400 font-medium">Matched Skills ({matchedSkillsToDisplay.length})</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {matchedSkillsToDisplay.slice(0, 8).map((s: any) => (
                        <Badge key={s} variant="secondary" className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 text-xs py-0.5 px-2">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {missingSkillsToDisplay.length > 0 && (
                    <div>
                      <h4 className="text-xs text-zinc-400 font-medium">Skills to Strengthen ({missingSkillsToDisplay.length})</h4>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {missingSkillsToDisplay.slice(0, 8).map((s: any) => (
                          <Badge key={s} variant="secondary" className="bg-amber-950/20 text-amber-400 border border-amber-900/30 text-xs py-0.5 px-2">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Job description section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-zinc-900 pb-1">About the Job</h3>
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
          </div>

          {/* Skills Required Section */}
          {selectedJob.skills && selectedJob.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white border-b border-zinc-900 pb-1">Key Technologies & Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.skills.map((skill: any) => {
                  const skillName = typeof skill === 'object' && skill !== null ? skill.display || skill.canonical : skill;
                  return (
                    <Badge key={skillName} variant="secondary" className="bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs py-1 px-2.5 flex items-center gap-1.5">
                      <SkillIcon skill={skill} className="size-3.5 text-zinc-500" />
                      <span>{skillName}</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prepare & Apply Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 flex-wrap">
            <Button 
              onClick={() => handlePrepareJob(selectedJob)}
              className="h-10 px-5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded flex items-center gap-2 cursor-pointer shadow"
            >
              <span>Prepare for this Role →</span>
            </Button>
            {selectedJob.sourceUrl && (
              <a href={selectedJob.sourceUrl} target="_blank" rel="noopener noreferrer">
                <Button className="h-10 px-6 bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 text-xs rounded flex items-center gap-2 cursor-pointer">
                  <span>Apply on Publisher Site</span>
                  <ExternalLink className="size-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Bookmark className="size-5 text-emerald-400 fill-emerald-500/10" />
            Saved Jobs
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Track, scope, and analyze career opportunities you've bookmarked.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/jobs')}
          className="h-9 px-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-bold text-xs rounded shrink-0 self-start sm:self-center cursor-pointer transition-colors"
        >
          Browse Jobs
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-zinc-900/10 border border-zinc-900 p-5 rounded-lg space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 bg-zinc-900 rounded-lg" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 bg-zinc-900 w-2/3" />
                  <Skeleton className="h-3.5 bg-zinc-900 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-10 bg-zinc-900 w-full" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-3">
          <p className="text-sm text-red-400 font-mono font-medium">{error}</p>
          <Button onClick={fetchJobs} className="h-8 px-4 bg-zinc-900 border border-zinc-800 text-xs text-white">
            Retry Loading
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-4">
          <Bookmark className="size-10 text-zinc-700 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">No saved jobs yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Save jobs you are interested in and they'll appear here for status tracking and analysis.
            </p>
          </div>
          <Button onClick={() => navigate('/jobs')} className="h-9 px-6 bg-white text-zinc-950 font-bold hover:bg-zinc-200 text-xs rounded cursor-pointer">
            Browse Jobs
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const badge = getMatchScoreBadge(job);
            return (
              <Card 
                key={job._id}
                className="bg-zinc-900/10 hover:bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 p-5 rounded-lg transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <CompanyLogo 
                        companyName={job.company} 
                        companyLogo={job.companyLogo} 
                        className="size-10"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <h3 
                          onClick={() => {
                            setSelectedJob(job);
                            setDetailModalOpen(true);
                          }}
                          className="font-bold text-sm text-white hover:text-emerald-400 cursor-pointer transition-colors truncate"
                        >
                          {job.title}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate font-semibold">{job.company}</p>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={`text-xs font-bold shrink-0 ${badge.color}`}>
                      {badge.label} (Score: {job.matchScore}%)
                    </Badge>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-2.5 text-xs text-zinc-400 flex-wrap font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-zinc-500" />
                      {job.location}
                    </span>
                    <span>·</span>
                    <span className="text-zinc-500 capitalize">{job.workMode}</span>
                    <span>·</span>
                    <span className="text-zinc-500 capitalize">{job.employmentType}</span>
                    <span>·</span>
                    <span className="text-zinc-500">{job.experience}</span>
                  </div>

                  {/* Date details */}
                  <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900/60 pt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      Saved {getRelativeTimeString(job.savedAt)}
                    </span>
                    <span>Posted {getRelativeTimeString(job.postedAt)}</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-zinc-900/60">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono uppercase font-bold">Status:</span>
                    <Select
                      value={job.status}
                      onValueChange={(val) => handleUpdateStatus(job._id, val)}
                    >
                      <SelectTrigger className={`h-8 w-28 text-xs font-semibold border rounded cursor-pointer ${getStatusBadgeStyle(job.status)}`}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-200">
                        <SelectItem value="Saved">Saved</SelectItem>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Assessment">Assessment</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 justify-end">
                    {/* Delete */}
                    <Button
                      onClick={() => handleRemoveSavedJob(job._id)}
                      variant="outline"
                      className="h-8 size-8 p-0 border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-red-400 hover:border-red-950/40 rounded cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                    
                    {/* External Link */}
                    {job.sourceUrl && (
                      <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          className="h-8 px-2.5 border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs rounded cursor-pointer"
                        >
                          <ExternalLink className="size-3 mr-1" />
                          Apply
                        </Button>
                      </a>
                    )}

                    {/* View Details */}
                    <Button
                      onClick={() => {
                        setSelectedJob(job);
                        setDetailModalOpen(true);
                      }}
                      className="h-8 px-2.5 bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs rounded cursor-pointer"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reusable Job Details modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        {renderModalDetails()}
      </Dialog>
    </div>
  );
}
