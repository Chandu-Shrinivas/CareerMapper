import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Briefcase, ArrowRight } from 'lucide-react';

interface JobMatchesCardProps {
  jobCount?: number;
  roleTitle?: string;
  loading?: boolean;
}

export const JobMatchesCard: React.FC<JobMatchesCardProps> = ({ jobCount = 0, roleTitle, loading = false }) => {
  const navigate = useNavigate();

  return (
    <Card className="border-border/60 shadow-sm hover:border-border transition-colors flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <CardTitle className="text-base font-semibold">Job Matches</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Open positions matching {roleTitle || 'your profile'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="bg-muted/30 border border-border/40 rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-foreground">{loading ? '...' : jobCount}</div>
            <p className="text-xs text-muted-foreground">Matching opportunities ready</p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/jobs')}
          variant="outline"
          className="w-full h-9 text-xs gap-1.5 font-medium border-border/80"
        >
          <span>Explore Jobs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
};
