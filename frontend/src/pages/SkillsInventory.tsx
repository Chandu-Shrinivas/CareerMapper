import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, ShieldAlert, Loader2, RotateCw, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import type { Skill } from '../types';
import { SkillIcon } from '../components/SkillIcon';
import { api } from '../services/api';
import { authService } from '../services/auth';

const DRAFT_KEY = 'cm_profile_draft';

export default function SkillsInventory() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [verification, setVerification] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [verError, setVerError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkillsFromStorage = () => {
      const rawDraft = localStorage.getItem(DRAFT_KEY) || localStorage.getItem('careerProfile');
      if (rawDraft) {
        try {
          const parsed = JSON.parse(rawDraft);
          setSkills(parsed.skills || []);
        } catch (e) {}
      }
    };

    loadSkillsFromStorage();

    window.addEventListener('cm_skills_updated', loadSkillsFromStorage);
    window.addEventListener('careerProfileUpdated', loadSkillsFromStorage);
    window.addEventListener('storage', loadSkillsFromStorage);

    const fetchRoadmap = async () => {
      try {
        const session = authService.getSession();
        const email = session.user?.email || 'test-user@careermapper.app';
        const res = await api.getRoadmaps(email);
        if (res.roadmaps && res.roadmaps.length > 0) {
          setActiveRoadmap(res.roadmaps[0]);
        }
      } catch (err) {
        console.error('Failed to load roadmap:', err);
      }
    };
    fetchRoadmap();

    return () => {
      window.removeEventListener('cm_skills_updated', loadSkillsFromStorage);
      window.removeEventListener('careerProfileUpdated', loadSkillsFromStorage);
      window.removeEventListener('storage', loadSkillsFromStorage);
    };
  }, []);

  useEffect(() => {
    if (sheetOpen && selectedSkill && activeRoadmap) {
      const fetchVerification = async () => {
        setVerifying(true);
        setVerError(null);
        try {
          const res = await api.getSkillVerification(activeRoadmap._id, selectedSkill.name.toLowerCase());
          setVerification(res);
        } catch (err: any) {
          setVerError(err.message || 'Failed to fetch verification.');
        } finally {
          setVerifying(false);
        }
      };
      fetchVerification();
    } else {
      setVerification(null);
    }
  }, [sheetOpen, selectedSkill, activeRoadmap]);

  const handleRecalculate = async () => {
    if (!activeRoadmap || !selectedSkill) return;
    setVerifying(true);
    setVerError(null);
    try {
      const res = await api.verifySkill(activeRoadmap._id, selectedSkill.name.toLowerCase());
      setVerification(res);
    } catch (err: any) {
      setVerError(err.message || 'Failed to recalculate verification.');
    } finally {
      setVerifying(false);
    }
  };

  const handleEditSkills = () => {
    try {
      const draftRaw = localStorage.getItem(DRAFT_KEY);
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        draft.step = 3;
        draft.onboardingStep = 3;
        draft.onboardingCompleted = false;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      }
    } catch (e) {}
    navigate('/onboarding');
  };

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setSheetOpen(true);
  };

  const getSkillsByLevel = (level: string) => {
    return skills.filter(s => s.proficiency.toLowerCase() === level.toLowerCase());
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'STRONG':
        return 'bg-zinc-100 text-zinc-950 border-zinc-200';
      case 'DEMONSTRATED':
        return 'bg-zinc-900 text-zinc-300 border-zinc-800';
      case 'DEVELOPING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const levels = [
    { name: 'Expert', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'Advanced', color: 'bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700' },
    { name: 'Intermediate', color: 'bg-zinc-900 text-zinc-400 border-zinc-800' },
    { name: 'Beginner', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
  ];

  return (
    <div className="flex-1 w-full bg-zinc-950 p-6 sm:p-8 space-y-6 max-w-[1000px] mx-auto animate-fadeUp">
      
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">Skills Inventory</h1>
          <p className="text-xs text-zinc-400">Manage and preview your currently verified skill portfolio.</p>
        </div>
        <Button onClick={handleEditSkills} className="h-9 px-4 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs rounded transition-colors cursor-pointer">
          <Edit2 className="mr-1.5 size-3.5" />
          Edit skills
        </Button>
      </div>

      {skills.length > 0 ? (
        <div className="space-y-6">
          {levels.map((lvl) => {
            const list = getSkillsByLevel(lvl.name);
            if (list.length === 0) return null;
            return (
              <div key={lvl.name} className="space-y-3 p-5 bg-zinc-900/10 border border-zinc-900 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{lvl.name}</h3>
                  <Badge variant="outline" className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded ${lvl.color}`}>
                    {list.length} {list.length === 1 ? 'skill' : 'skills'}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {list.map((skill) => (
                    <Badge 
                      key={skill.id} 
                      variant="secondary" 
                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800 text-[10.5px] px-3 py-1 rounded flex items-center gap-1.5 cursor-pointer transition-colors select-none"
                      onClick={() => handleSelectSkill(skill)}
                    >
                      <SkillIcon skill={skill.name} className="size-3.5" />
                      <span>{skill.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="bg-zinc-900/10 border-zinc-900 rounded-lg">
          <CardContent className="p-8 text-center space-y-3">
            <ShieldAlert className="size-8 text-zinc-500 mx-auto" />
            <h3 className="font-display text-sm font-bold text-white">No skills in profile yet</h3>
            <p className="text-xs text-zinc-400 max-w-[360px] mx-auto">
              Please enter some skills manually or upload a resume to populate your inventory.
            </p>
            <Button onClick={handleEditSkills} className="h-8 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded">
              Add Skills
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Side drawer for detailed skill verification */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="bg-zinc-950 border-l border-zinc-900 text-zinc-50 w-full sm:max-w-md p-6 overflow-y-auto">
          <SheetHeader className="space-y-1.5 border-b border-zinc-900 pb-4">
            <SheetTitle className="text-lg font-bold text-white flex items-center gap-2">
              {selectedSkill && <SkillIcon skill={selectedSkill.name} className="size-5" />}
              <span>{selectedSkill?.name} Verification</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-zinc-400">
              Confidence engine audit and verified credentials checklist.
            </SheetDescription>
          </SheetHeader>

          {verifying ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="size-8 text-emerald-500 animate-spin" />
              <span className="text-xs text-zinc-500">Recalculating confidence score...</span>
            </div>
          ) : verError ? (
            <div className="py-6 text-center space-y-3">
              <ShieldAlert className="size-8 text-destructive mx-auto" />
              <p className="text-xs text-destructive">{verError}</p>
            </div>
          ) : !activeRoadmap ? (
            <div className="py-8 text-center space-y-4">
              <HelpCircle className="size-8 text-zinc-650 mx-auto" />
              <h3 className="text-xs font-bold text-white uppercase">Roadmap Missing</h3>
              <p className="text-xs text-zinc-400 max-w-[280px] mx-auto">
                No active preparation roadmap found. Create a career roadmap from the Career Analysis tab to begin tracking verification credentials.
              </p>
            </div>
          ) : verification ? (
            <div className="space-y-6 pt-6 animate-fadeUp">
              
              {/* Confidence Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Skill Confidence</span>
                  <span className="text-sm font-black text-white">{verification.confidenceScore}%</span>
                </div>
                <Progress value={verification.confidenceScore} className="h-2.5 bg-zinc-900 rounded-full" />
              </div>

              {/* Status Classification */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-900 rounded-lg">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Status Classification</span>
                <Badge variant="outline" className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded ${getStatusBadgeColor(verification.verificationStatus)}`}>
                  {verification.verificationStatus}
                </Badge>
              </div>

              {/* Checklist */}
              <div className="space-y-3 p-4 bg-zinc-900/10 border border-zinc-900 rounded-lg">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-2">Verification Checklist</h3>
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Missions Completed</span>
                    <span className="font-semibold text-white">{verification.missionCompletionPercentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Assessment Score</span>
                    <span className="font-semibold text-white">
                      {verification.bestAssessmentScore > 0 ? `${verification.bestAssessmentScore}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Practical Projects</span>
                    <span className="font-semibold text-white">
                      {verification.completedProjects > 0 ? 'Completed' : 'Not Started'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Evidence Submissions</span>
                    <span className="font-semibold text-white">
                      {verification.totalEvidence > 0 ? `${verification.verifiedEvidence}/${verification.totalEvidence} Verified` : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Recency Status</span>
                    <span className="font-semibold text-white">
                      {verification.confidenceBreakdown?.recency?.score === 100 ? 'Active' : 'Stale'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings Box */}
              {verification.verificationWarnings && verification.verificationWarnings.length > 0 && (
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="size-4 shrink-0" />
                    <span>Audit Warnings</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-red-300/80 space-y-1">
                    {verification.verificationWarnings.map((warn: string, idx: number) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Requirements */}
              {verification.missingRequirements && verification.missingRequirements.length > 0 && (
                <div className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-lg space-y-2">
                  <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    To Achieve Verified Status
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-zinc-300 space-y-1">
                    {verification.missingRequirements.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Next Action */}
              {verification.recommendedNextAction && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg space-y-1">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Recommended Next Action</div>
                  <p className="text-xs text-white font-semibold leading-relaxed">
                    {verification.recommendedNextAction}
                  </p>
                </div>
              )}

              {/* Action Controls */}
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-4">
                <Button 
                  onClick={handleRecalculate}
                  className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded border border-zinc-800 transition-colors"
                >
                  <RotateCw className="mr-2 size-3.5" />
                  Recalculate Score
                </Button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <Loader2 className="size-6 text-zinc-500 animate-spin" />
              <span className="text-xs text-zinc-500">Loading audit history...</span>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}
