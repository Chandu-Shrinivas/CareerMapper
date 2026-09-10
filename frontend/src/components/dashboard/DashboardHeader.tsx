import React from 'react';
import { useActiveTargetRole } from '../../hooks/useActiveTargetRole';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Sparkles, Target, Award } from 'lucide-react';

const AVAILABLE_ROLES = [
  { slug: 'frontend', title: 'Frontend Developer' },
  { slug: 'backend', title: 'Backend Developer' },
  { slug: 'fullstack', title: 'Full Stack Developer' },
  { slug: 'devops', title: 'DevOps Engineer' },
  { slug: 'android', title: 'Android Developer' },
  { slug: 'ai-engineer', title: 'AI Engineer' },
  { slug: 'data-analyst', title: 'Data Analyst' },
  { slug: 'devsecops', title: 'DevSecOps Engineer' },
  { slug: 'data-engineer', title: 'Data Engineer' },
  { slug: 'postgresql-dba', title: 'PostgreSQL DBA' },
  { slug: 'machine-learning', title: 'Machine Learning Engineer' },
  { slug: 'data-scientist', title: 'Data Scientist' },
  { slug: 'ios', title: 'iOS Developer' },
  { slug: 'blockchain', title: 'Blockchain Developer' }
];

interface DashboardHeaderProps {
  userName?: string;
  onRoleChange?: (roleTitle: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, onRoleChange }) => {
  const { activeTargetRole, setActiveTargetRole } = useActiveTargetRole();

  const currentRoleTitle = activeTargetRole?.roleTitle || 'Frontend Developer';
  const matchScore = activeTargetRole?.matchScore ?? 75;

  const handleSelectRole = (newTitle: string) => {
    setActiveTargetRole({
      ...activeTargetRole,
      roleTitle: newTitle
    });
    if (onRoleChange) {
      onRoleChange(newTitle);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/60 rounded-xl p-5 md:p-6 shadow-sm">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            Welcome back{userName ? `, ${userName}` : ''}
          </h1>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <p className="text-sm text-muted-foreground">
          Command Center for your career roadmap, skill progression, and readiness.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Target Role Selector */}
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary shrink-0" />
          <div className="w-[220px]">
            <Select value={currentRoleTitle} onValueChange={handleSelectRole}>
              <SelectTrigger className="w-full h-9 bg-background border-border/80 text-sm font-medium">
                <SelectValue placeholder="Select Target Role" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROLES.map((r) => (
                  <SelectItem key={r.slug} value={r.title}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Readiness Badge */}
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-lg">
          <Award className="w-4 h-4 text-primary shrink-0" />
          <div className="text-xs font-medium text-muted-foreground">Readiness:</div>
          <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold text-xs px-2 py-0.5">
            {matchScore}%
          </Badge>
        </div>
      </div>
    </div>
  );
};
