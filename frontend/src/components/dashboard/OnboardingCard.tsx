import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingCardProps {
  isCompleted: boolean;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({ isCompleted }) => {
  const navigate = useNavigate();

  if (isCompleted) {
    return null;
  }

  return (
    <Card className="border-amber-500/30 bg-amber-500/5 shadow-sm">
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Complete Your Career Profile
            </h3>
            <p className="text-xs text-muted-foreground">
              Add your skills and resume to personalize your readiness score and job recommendations.
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/onboarding')}
          className="h-9 text-xs gap-1.5 font-medium shrink-0 bg-amber-500 hover:bg-amber-600 text-white"
        >
          <span>Complete Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
};
