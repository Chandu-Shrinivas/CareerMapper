import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../ui/hover-card';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  Info
} from 'lucide-react';
import { RoadmapProgressDonutChart } from './RoadmapProgressDonutChart';
import { ResetProgressDialog } from './ResetProgressDialog';
import type { CalculatedRoadmapProgress } from '../../utils/roadmapProgressCalculator';

interface RoadmapProgressSummaryProps {
  progress: CalculatedRoadmapProgress;
  roadmapTitle: string;
  roadmapDescription?: string;
  onResetProgress: () => void;
  onSelectNode: (nodeId: string) => void;
}

function formatLastActivity(isoString: string | null): string | null {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  } catch (e) {
    return null;
  }
}

export const RoadmapProgressSummary: React.FC<RoadmapProgressSummaryProps> = ({
  progress,
  roadmapTitle,
  roadmapDescription,
  onResetProgress,
  onSelectNode
}) => {
  const [isResetOpen, setIsResetOpen] = useState(false);
  const lastActivityStr = formatLastActivity(progress.lastUpdated);

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900/90 border-zinc-800/80 p-5 rounded-2xl shadow-sm text-white">
        {/* Title Header with HoverCard info */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              {roadmapTitle}
            </h1>

            {/* HoverCard for description instead of long text paragraph */}
            {roadmapDescription && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="inline-flex items-center justify-center p-1 rounded-full text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors cursor-pointer">
                    <Info className="size-4" />
                    <span className="sr-only">Roadmap Info</span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-zinc-950 border-zinc-800 text-zinc-300 text-xs p-3.5 space-y-1.5 shadow-xl">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-mono">
                      Role Guide
                    </Badge>
                    <span>{roadmapTitle}</span>
                  </div>
                  <p className="leading-relaxed text-zinc-400">
                    {roadmapDescription}
                  </p>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono uppercase">
              Engineering
            </Badge>
            <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-[10px] font-mono">
              Role Roadmap
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Column 1: Donut Chart & Status Breakdown (4 cols) */}
          <div className="md:col-span-4 flex items-center gap-4 sm:gap-5 border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0 md:pr-4">
            <RoadmapProgressDonutChart
              done={progress.done}
              learning={progress.learning}
              skipped={progress.skipped}
              notStarted={progress.notStarted}
              total={progress.total}
              percentage={progress.completionPercentage}
              isComplete={progress.isComplete}
            />

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Progress</span>
                {lastActivityStr && (
                  <span className="text-[10px] text-zinc-500 font-mono">Updated {lastActivityStr}</span>
                )}
              </div>

              {/* Counts Breakdown */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs pt-0.5">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-emerald-400 font-bold">{progress.done}</span>
                  <span className="text-zinc-400 text-[11px]">Done</span>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="size-2 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-purple-400 font-bold">{progress.learning}</span>
                  <span className="text-zinc-400 text-[11px]">Learning</span>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="size-2 rounded-full bg-zinc-500 shrink-0" />
                  <span className="text-zinc-400 font-bold">{progress.skipped}</span>
                  <span className="text-zinc-400 text-[11px]">Skipped</span>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="size-2 rounded-full bg-zinc-800 shrink-0" />
                  <span className="text-zinc-400 font-bold">{progress.notStarted}</span>
                  <span className="text-zinc-500 text-[11px]">Unstarted</span>
                </div>
              </div>

              {progress.formattedRemainingTime && (
                <div className="pt-1.5 flex items-center gap-1 text-[11px] text-zinc-400">
                  <Clock className="size-3 text-zinc-500" />
                  <span>Est. remaining: {progress.formattedRemainingTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Progress Bar & Total Metrics (4 cols) */}
          <div className="md:col-span-4 space-y-3 md:px-2 border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300">Overall Progress</span>
              <span className="font-mono font-bold text-emerald-400">{progress.completionPercentage}%</span>
            </div>

            {/* shadcn Progress Bar */}
            <Progress value={progress.completionPercentage} className="h-2.5 bg-zinc-800" />

            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pt-1">
              <span>{progress.done} / {progress.total} Topics Completed</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResetOpen(true)}
                className="h-6 px-2 text-[11px] text-zinc-400 hover:text-red-400 hover:bg-red-500/10 gap-1 cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </Button>
            </div>
          </div>

          {/* Column 3: Next Topic / Continue Learning Card (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            {progress.isComplete ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="size-4" />
                  <span>Roadmap Completed!</span>
                </div>
                <p className="text-xs text-emerald-300/80">
                  You've completed all eligible topics in this roadmap.
                </p>
              </div>
            ) : progress.nextRecommendation ? (
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/90 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-mono tracking-wider ${
                      progress.nextRecommendation.isContinueLearning
                        ? 'border-purple-500/40 text-purple-400 bg-purple-500/10'
                        : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                    }`}
                  >
                    {progress.nextRecommendation.isContinueLearning ? 'Continue Learning' : 'Next Recommended'}
                  </Badge>
                  <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                    {progress.nextRecommendation.reason}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {progress.nextRecommendation.title}
                    </h4>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onSelectNode(progress.nextRecommendation!.nodeId)}
                    className={`h-7 px-2.5 text-xs font-semibold shrink-0 cursor-pointer gap-1 ${
                      progress.nextRecommendation.isContinueLearning
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <span>{progress.nextRecommendation.isContinueLearning ? 'Continue' : 'Start'}</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-center text-xs text-zinc-400">
                No active learning topic
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Confirmation Dialog for Reset Progress */}
      <ResetProgressDialog
        isOpen={isResetOpen}
        roadmapTitle={roadmapTitle}
        onClose={() => setIsResetOpen(false)}
        onConfirmReset={onResetProgress}
      />
    </div>
  );
};
