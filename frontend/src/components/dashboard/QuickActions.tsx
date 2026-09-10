import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { BookOpen, Award, Briefcase, Compass } from 'lucide-react';

interface QuickActionsProps {
  roleSlug: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ roleSlug }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Quick Actions
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button
          onClick={() => navigate(`/role-roadmaps/${roleSlug}`)}
          variant="secondary"
          className="h-10 text-xs font-medium justify-start gap-2.5 bg-muted/60 hover:bg-muted"
        >
          <BookOpen className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">Continue Roadmap</span>
        </Button>

        <Button
          onClick={() => navigate('/interview-prep')}
          variant="secondary"
          className="h-10 text-xs font-medium justify-start gap-2.5 bg-muted/60 hover:bg-muted"
        >
          <Award className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="truncate">Practice Interview</span>
        </Button>

        <Button
          onClick={() => navigate('/jobs')}
          variant="secondary"
          className="h-10 text-xs font-medium justify-start gap-2.5 bg-muted/60 hover:bg-muted"
        >
          <Briefcase className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="truncate">Explore Jobs</span>
        </Button>

        <Button
          onClick={() => navigate('/skills')}
          variant="secondary"
          className="h-10 text-xs font-medium justify-start gap-2.5 bg-muted/60 hover:bg-muted"
        >
          <Compass className="w-4 h-4 text-sky-500 shrink-0" />
          <span className="truncate">Update Skills</span>
        </Button>
      </div>
    </div>
  );
};
