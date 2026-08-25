import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import type { Skill } from '../types';
import { SkillIcon } from '../components/SkillIcon';

const DRAFT_KEY = 'cm_profile_draft';

export default function SkillsInventory() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const rawDraft = localStorage.getItem(DRAFT_KEY);
    if (rawDraft) {
      try {
        const parsed = JSON.parse(rawDraft);
        setSkills(parsed.skills || []);
      } catch (e) {}
    }
  }, []);

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

  const getSkillsByLevel = (level: string) => {
    return skills.filter(s => s.proficiency.toLowerCase() === level.toLowerCase());
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
                      className="bg-zinc-900 text-zinc-300 border-zinc-800 text-[10.5px] px-3 py-1 rounded flex items-center gap-1.5"
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

    </div>
  );
}
