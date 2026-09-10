import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, MapPin, Clock, 
  ExternalLink, ArrowRight, Kanban, List
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { CompanyLogo } from '../components/CompanyLogo';
import { api } from '../services/api';
import { toast } from 'sonner';

// Reusable detailed Job Details Dialog
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';

const COLUMNS = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

export default function ApplicationTrackerPage() {
  const navigate = useNavigate();
  const [trackerData, setTrackerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected job for modal details view
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);

  const fetchTrackerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTrackerSummary();
      if (res.status === 'success') {
        setTrackerData(res.data);
      } else {
        setError(res.message || 'Failed to retrieve application tracker data.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading tracker data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackerData();
  }, []);

  const handleUpdateStatus = async (savedJobId: string, newStatus: string) => {
    // Optimistic state update across Kanban and List views
    const prevData = { ...trackerData };
    
    // Recalculate summary stats and list items
    const updatedJobs = trackerData.jobs.map((j: any) => {
      if (j._id === savedJobId) {
        // Build updated history
        const hasHistoryEntry = j.statusHistory.some((h: any) => h.status === newStatus);
        const updatedHistory = [...j.statusHistory];
        if (!hasHistoryEntry) {
          updatedHistory.push({ status: newStatus, updatedAt: new Date() });
        }
        return { ...j, status: newStatus, statusHistory: updatedHistory, updatedAt: new Date() };
      }
      return j;
    });

    const newSummary: Record<string, number> = {
      total: updatedJobs.length,
      Saved: 0,
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Withdrawn: 0
    };

    updatedJobs.forEach((j: any) => {
      if (newSummary[j.status] !== undefined) {
        newSummary[j.status]++;
      }
    });

    setTrackerData({
      summary: newSummary,
      jobs: updatedJobs
    });

    toast.success(`Application status updated to ${newStatus}`);

    try {
      await api.updateSavedJobStatus(savedJobId, newStatus);
    } catch (err: any) {
      // Rollback on failure
      setTrackerData(prevData);
      toast.error(err.message || 'Failed to update job status.');
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 70) return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
    if (score >= 50) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-zinc-400 border-zinc-800 bg-zinc-900/40';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Saved': return 'border-zinc-800 text-zinc-400 bg-zinc-900/50';
      case 'Applied': return 'border-blue-500/20 text-blue-400 bg-blue-500/5';
      case 'Assessment': return 'border-purple-500/20 text-purple-400 bg-purple-500/5';
      case 'Interview': return 'border-amber-500/20 text-amber-400 bg-amber-500/5';
      case 'Offer': return 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5';
      case 'Rejected': return 'border-red-500/20 text-red-400 bg-red-500/5';
      case 'Withdrawn': return 'border-zinc-800 text-zinc-500 bg-zinc-900/20';
      default: return 'border-zinc-800 text-zinc-400 bg-zinc-900/50';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const renderModalDetails = () => {
    if (!selectedJob) return null;

    const analysisData = selectedJob.analysisData;
    const score = analysisData ? analysisData.matchScore : selectedJob.matchScore || 0;

    return (
      <DialogContent className="max-w-4xl h-[90vh] md:h-[85vh] bg-zinc-950 border border-zinc-900 text-white flex flex-col p-0 overflow-hidden rounded-xl">
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
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-center">
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
                {COLUMNS.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>

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

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Status Timeline History */}
          <div className="p-4 border border-zinc-900 rounded-lg bg-zinc-950 space-y-3">
            <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Application Journey Log</h4>
            <div className="relative border-l border-zinc-900 pl-4 ml-2 space-y-4 pt-2 pb-1">
              {selectedJob.statusHistory && selectedJob.statusHistory.map((hist: any, index: number) => (
                <div key={index} className="relative flex items-center gap-3">
                  {/* Timeline point */}
                  <span className="absolute -left-[21px] size-2.5 rounded-full bg-emerald-500 border border-zinc-950" />
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs py-0 px-2 font-mono ${getStatusColor(hist.status)}`}>
                      {hist.status}
                    </Badge>
                    <span className="text-xs text-zinc-500 font-mono">
                      {new Date(hist.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-zinc-900 pb-1">About the Job</h3>
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
          </div>
        </div>
      </DialogContent>
    );
  };  const renderKanbanView = () => {
    if (!trackerData) return null;

    return (
      <div className="overflow-x-auto custom-scrollbar pb-4 flex gap-4 items-start select-none w-full">
        {COLUMNS.map(col => {
          const colJobs = trackerData.jobs.filter((j: any) => j.status === col);
          return (
            <div 
              key={col} 
              className="w-72 shrink-0 bg-zinc-900/10 border border-zinc-900/85 rounded-xl p-3 flex flex-col max-h-[70vh] overflow-hidden space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide">{col}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-zinc-900 text-zinc-400 font-mono font-bold">
                    {colJobs.length}
                  </Badge>
                </div>
              </div>

              {/* Column Scrollable Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-0.5">
                {colJobs.length === 0 ? (
                  <div className="p-6 border border-dashed border-zinc-900 rounded-lg text-center text-xs text-zinc-500 italic">
                    No jobs here
                  </div>
                ) : (
                  colJobs.map((job: any) => {
                    const matchColor = getMatchScoreColor(job.matchScore);
                    return (
                      <Card 
                        key={job._id}
                        onClick={() => {
                          setSelectedJob(job);
                          setDetailModalOpen(true);
                        }}
                        className="p-3 bg-zinc-950 hover:bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer rounded-lg space-y-3"
                      >
                        <div className="flex items-start gap-2.5 justify-between">
                          <CompanyLogo 
                            companyName={job.company} 
                            companyLogo={job.companyLogo} 
                            className="size-8 rounded"
                          />
                          <Badge variant="outline" className={`text-xs shrink-0 font-bold font-mono px-1.5 ${matchColor}`}>
                            {job.matchScore}% Match
                          </Badge>
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <h4 className="font-bold text-xs text-white truncate hover:text-emerald-400 leading-tight">
                            {job.title}
                          </h4>
                          <p className="text-xs text-zinc-400 truncate">{job.company}</p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900/60 pt-2 font-mono">
                          <span className="truncate max-w-[120px]">{job.location}</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="size-2.5" />
                            {formatDate(job.updatedAt)}
                          </span>
                        </div>

                        {/* Fast Status Mover */}
                        <div className="pt-1.5 border-t border-zinc-900/60" onClick={e => e.stopPropagation()}>
                          <Select
                            value={job.status}
                            onValueChange={(status) => handleUpdateStatus(job._id, status)}
                          >
                            <SelectTrigger className="h-7 w-full bg-zinc-900/80 border-zinc-850 text-xs text-zinc-400 font-semibold cursor-pointer py-0">
                              <SelectValue placeholder="Move Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-200">
                              {COLUMNS.map(o => (
                                <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    if (!trackerData) return null;

    return (
      <Card className="bg-zinc-900/10 border border-zinc-900 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-400 font-mono uppercase text-xs tracking-wider bg-zinc-950/40">
                <th className="p-4 font-semibold">Job Title & Company</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Match score</th>
                <th className="p-4 font-semibold">Tracking Status</th>
                <th className="p-4 font-semibold">Timeline history</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {trackerData.jobs.map((job: any) => {
                const matchColor = getMatchScoreColor(job.matchScore);
                return (
                  <tr 
                    key={job._id}
                    onClick={() => {
                      setSelectedJob(job);
                      setDetailModalOpen(true);
                    }}
                    className="hover:bg-zinc-900/20 cursor-pointer transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <CompanyLogo companyName={job.company} companyLogo={job.companyLogo} className="size-9 shrink-0 rounded" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white group-hover:text-emerald-400 truncate">{job.title}</h4>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">{job.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300 font-mono truncate max-w-[130px]">{job.location}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={`font-bold font-mono px-2 py-0.5 ${matchColor}`}>
                        {job.matchScore}%
                      </Badge>
                    </td>
                    <td className="p-4" onClick={e => e.stopPropagation()}>
                      <Select
                        value={job.status}
                        onValueChange={(status) => handleUpdateStatus(job._id, status)}
                      >
                        <SelectTrigger className={`h-8 w-28 text-xs font-semibold border rounded cursor-pointer ${getStatusColor(job.status)}`}>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-200">
                          {COLUMNS.map(col => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {job.statusHistory && job.statusHistory.slice(-3).map((h: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
                            <span className="font-semibold text-zinc-400">{h.status}</span>
                            <span>({formatDate(h.updatedAt)})</span>
                            {idx < Math.min(job.statusHistory.length, 3) - 1 && <ArrowRight className="size-2.5 text-zinc-650" />}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {job.sourceUrl && (
                          <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="h-7 w-7 p-0 border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-white rounded cursor-pointer flex items-center justify-center">
                              <ExternalLink className="size-3" />
                            </Button>
                          </a>
                        )}
                        <Button 
                          onClick={() => {
                            setSelectedJob(job);
                            setDetailModalOpen(true);
                          }}
                          className="h-7 px-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs rounded cursor-pointer"
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  const renderStats = () => {
    if (!trackerData) return null;
    const { summary } = trackerData;

    // Active applications combines Applied + Assessment
    const activeApps = (summary.Applied || 0) + (summary.Assessment || 0);

    const mainStats = [
      { label: 'Total Tracked', val: summary.total, color: 'text-white' },
      { label: 'Saved Jobs', val: summary.Saved || 0, color: 'text-zinc-400' },
      { label: 'Active Apps', val: activeApps, color: 'text-blue-400', sub: `Applied: ${summary.Applied || 0} · Test: ${summary.Assessment || 0}` },
      { label: 'Interviews', val: summary.Interview || 0, color: 'text-amber-400' },
      { label: 'Offers', val: summary.Offer || 0, color: 'text-emerald-400' }
    ];

    return (
      <Card className="bg-card border-zinc-900 p-4 sm:p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Main 5 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 flex-1">
          {mainStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col space-y-1 border-r border-zinc-900/60 last:border-r-0 pr-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-zinc-500">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl sm:text-2xl font-bold font-mono leading-none ${stat.color}`}>
                  {stat.val}
                </span>
              </div>
              {stat.sub && (
                <span className="text-xs text-zinc-500 font-mono font-medium truncate">{stat.sub}</span>
              )}
            </div>
          ))}
        </div>

        {/* Secondary status outcomes */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-zinc-900/60 pt-3 md:pt-0 md:pl-5 shrink-0">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider md:mb-1">
            Outcomes
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="size-2 rounded-full bg-red-500" />
              <span>Rejected: <strong className="font-mono text-white">{summary.Rejected || 0}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="size-2 rounded-full bg-zinc-600" />
              <span>Withdrawn: <strong className="font-mono text-white">{summary.Withdrawn || 0}</strong></span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ClipboardList className="size-5 text-emerald-400" />
            Application Tracker
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage status lifecycles, schedule timelines, and visualize your application stages.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <Skeleton key={i} className="h-16 bg-zinc-900 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 bg-zinc-900 w-full rounded-lg" />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-3">
          <p className="text-sm text-red-400 font-mono font-medium">{error}</p>
          <Button onClick={fetchTrackerData} className="h-8 px-4 bg-zinc-900 border border-zinc-800 text-xs text-white">
            Retry Loading
          </Button>
        </div>
      ) : trackerData.jobs.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900/10 border border-zinc-900 rounded-lg space-y-4">
          <ClipboardList className="size-10 text-zinc-700 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">No applications tracked yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Save a job from the search panel and move its tracking state to "Applied" once you submit your resume.
            </p>
          </div>
          <Button onClick={() => navigate('/jobs')} className="h-9 px-6 bg-white text-zinc-950 font-bold hover:bg-zinc-200 text-xs rounded cursor-pointer">
            Browse Jobs
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Application statistics cards */}
          {renderStats()}

          {/* Kanban / List view switcher */}
          <Tabs defaultValue="kanban" className="space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
              <TabsList className="bg-zinc-900 p-0.5 border border-zinc-900 rounded-md">
                <TabsTrigger value="kanban" className="text-xs px-3.5 py-1.5 data-[state=active]:bg-zinc-950 data-[state=active]:text-white rounded flex items-center gap-1 cursor-pointer">
                  <Kanban className="size-3.5" />
                  <span>Kanban Board</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="text-xs px-3.5 py-1.5 data-[state=active]:bg-zinc-950 data-[state=active]:text-white rounded flex items-center gap-1 cursor-pointer">
                  <List className="size-3.5" />
                  <span>List View</span>
                </TabsTrigger>
              </TabsList>
              
              <span className="text-xs text-zinc-500 font-mono">
                Last updated: {formatDate(new Date().toISOString())}
              </span>
            </div>

            <TabsContent value="kanban" className="focus-visible:outline-none">
              {renderKanbanView()}
            </TabsContent>

            <TabsContent value="list" className="focus-visible:outline-none">
              {renderListView()}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Reusable Job Details modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        {renderModalDetails()}
      </Dialog>
    </div>
  );
}
