import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { ClipboardList, ArrowRight } from 'lucide-react';

interface ApplicationSummaryCardProps {
  activeCount?: number;
  interviewCount?: number;
  loading?: boolean;
}

export const ApplicationSummaryCard: React.FC<ApplicationSummaryCardProps> = ({
  activeCount = 0,
  interviewCount = 0,
  loading = false
}) => {
  const navigate = useNavigate();

  return (
    <Card className="border-border/60 shadow-sm hover:border-border transition-colors flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-emerald-500" />
          <CardTitle className="text-base font-semibold">Application Tracker</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Your active job application status
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="bg-muted/30 border border-border/40 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-lg font-bold text-foreground">{loading ? '...' : activeCount}</div>
              <p className="text-[11px] text-muted-foreground">Active Applications</p>
            </div>
            <div className="h-7 w-[1px] bg-border/60" />
            <div>
              <div className="text-lg font-bold text-emerald-500">{loading ? '...' : interviewCount}</div>
              <p className="text-[11px] text-muted-foreground">Interviews</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate('/tracker')}
          variant="outline"
          className="w-full h-9 text-xs gap-1.5 font-medium border-border/80"
        >
          <span>Open Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
};
