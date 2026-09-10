import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SkillIcon } from '../SkillIcon';

interface SkillGapsCardProps {
  skillsToStrengthen?: string[];
  roleTitle?: string;
}

export const SkillGapsCard: React.FC<SkillGapsCardProps> = ({ skillsToStrengthen = [], roleTitle }) => {
  const navigate = useNavigate();

  // Limit strictly to top 3 skill gaps
  const topSkillGaps = skillsToStrengthen.slice(0, 3);

  return (
    <Card className="h-full flex flex-col justify-between border-border/60 shadow-sm hover:border-border transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-base font-semibold">Top Skill Gaps</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs font-normal border-border/60">
            {topSkillGaps.length} Critical
          </Badge>
        </div>
        <CardDescription className="text-xs">
          High-priority skills to learn for {roleTitle || 'target role'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {topSkillGaps.length > 0 ? (
          <div className="space-y-2">
            {topSkillGaps.map((skillName, idx) => (
              <div
                key={skillName}
                className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-background border border-border/60 flex items-center justify-center shrink-0">
                    <SkillIcon skill={skillName} className="w-3.5 h-3.5" />
                  </div>
                  <span className="capitalize text-foreground font-semibold">{skillName}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                  Priority #{idx + 1}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 border border-dashed border-border/60 rounded-lg p-4 text-center space-y-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
            <p className="text-xs text-muted-foreground">
              Great job! No critical skill gaps identified for your target role.
            </p>
          </div>
        )}

        <Button
          onClick={() => navigate('/skills')}
          variant="outline"
          className="w-full h-9 text-xs gap-1.5 font-medium border-border/80"
        >
          <span>View Skills</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
};
