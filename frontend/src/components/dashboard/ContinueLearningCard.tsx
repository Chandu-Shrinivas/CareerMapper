import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { BookOpen, ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { RoadmapProgressStore } from '../../services/RoadmapProgressStore';
import { calculateRoadmapProgress } from '../../utils/roadmapProgressCalculator';
import { getRoadmapDefinitionBySlug } from '../../utils/roadmapNavigation';

interface ContinueLearningCardProps {
  roleSlug: string;
  roleTitle: string;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({ roleSlug, roleTitle }) => {
  const navigate = useNavigate();

  const progressData = useMemo(() => {
    try {
      const definition = getRoadmapDefinitionBySlug(roleSlug);
      const statuses = RoadmapProgressStore.getStatuses(roleSlug);
      const lastUpdated = RoadmapProgressStore.getLastUpdated(roleSlug);
      return calculateRoadmapProgress(definition, statuses, lastUpdated);
    } catch (e) {
      return null;
    }
  }, [roleSlug]);

  const completionPct = progressData?.completionPercentage || 0;
  const nextRecommendation = progressData?.nextRecommendation;
  const isStarted = (progressData?.done || 0) > 0 || (progressData?.learning || 0) > 0;

  const handleContinue = () => {
    navigate(`/role-roadmaps/${roleSlug}`);
  };

  return (
    <Card className="h-full flex flex-col justify-between border-border/60 shadow-sm hover:border-border transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Continue Learning</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs font-normal border-border/60">
            {roleTitle}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Your current active learning path
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {isStarted ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">Progress</span>
                <span className="font-semibold text-foreground">{completionPct}%</span>
              </div>
              <Progress value={completionPct} className="h-2" />
            </div>

            {nextRecommendation && (
              <div className="bg-muted/40 border border-border/40 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  {nextRecommendation.isContinueLearning ? (
                    <PlayCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                  <span>{nextRecommendation.reason}</span>
                </div>
                <p className="text-sm font-semibold text-foreground line-clamp-1">
                  {nextRecommendation.title}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-muted/30 border border-dashed border-border/60 rounded-lg p-4 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Start your roadmap to begin tracking your learning.
            </p>
          </div>
        )}

        <Button 
          onClick={handleContinue} 
          className="w-full h-9 text-xs gap-1.5 font-medium"
          variant="default"
        >
          <span>Continue Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
};
