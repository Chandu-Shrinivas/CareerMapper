import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Award, ArrowRight } from 'lucide-react';

interface InterviewPrepCardProps {
  questionCount?: number;
  roleTitle?: string;
  loading?: boolean;
}

export const InterviewPrepCard: React.FC<InterviewPrepCardProps> = ({ questionCount = 18, roleTitle, loading = false }) => {
  const navigate = useNavigate();

  return (
    <Card className="border-border/60 shadow-sm hover:border-border transition-colors flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <CardTitle className="text-base font-semibold">Interview Prep</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Role-specific question bank for {roleTitle || 'your target role'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="bg-muted/30 border border-border/40 rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-foreground">{loading ? '...' : questionCount}</div>
            <p className="text-xs text-muted-foreground">Practice questions available</p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/interview-prep')}
          variant="outline"
          className="w-full h-9 text-xs gap-1.5 font-medium border-border/80"
        >
          <span>Practice Interview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
};
