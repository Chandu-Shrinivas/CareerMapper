import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Upload, Plus, Trash2, ChevronRight, ChevronLeft, 
  Check, RefreshCw, AlertCircle, Award, Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { 
  Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem 
} from '../components/ui/command';
import { authService, type OnboardingProfile } from '../services/auth';
import { api } from '../services/api';
import type { Skill, ProficiencyLevel, AnalysisStageId } from '../types';
import { SkillIcon } from '../components/SkillIcon';

const experienceLevels = [
  { value: 'Student', label: 'Student' },
  { value: 'Fresher', label: 'Fresher / Entry Level (0-1 years)' },
  { value: '1–2 years', label: 'Junior (1-2 years)' },
  { value: '3–5 years', label: 'Mid-Level (3-5 years)' },
  { value: '5+ years', label: 'Senior (5+ years)' }
];

const careerObjectives = [
  { value: 'Find my first job', label: 'Find my first job' },
  { value: 'Find an internship', label: 'Find an internship' },
  { value: 'Switch careers', label: 'Switch careers' },
  { value: 'Explore career options', label: 'Explore career options' },
  { value: 'Improve my current career', label: 'Improve my current career' }
];

const interestAreas = [
  'Software Development', 'Data', 'AI / ML', 'Cloud / DevOps', 
  'Design', 'Electronics', 'Mechanical', 'Business', 
  'Finance', 'Marketing', 'Not sure'
];

const SUGGESTED_SKILLS = [
  'React', 'React Native', 'Node.js', 'TypeScript', 'Python', 'SQL', 'Docker', 'AWS',
  'Java', 'C++', 'Project Management', 'UI Design', 'UX Design', 'Statistics', 'Figma'
];

interface OnboardingState {
  profile: {
    fullName: string;
    degree: string;
    specialization: string;
    experienceLevel: string;
    careerObjective: string;
    interests: string[];
  };
  skills: Skill[];
  domain: {
    name: string;
    label: string;
    confidence: number;
  } | null;
  onboardingStep: number;
  method: 'resume' | 'manual' | null;
}

const DRAFT_KEY = 'cm_profile_draft';

export default function Onboarding() {
  const navigate = useNavigate();

  // Unified Single Onboarding State
  const [state, setState] = useState<OnboardingState>(() => {
    const rawUser = authService.getSession().user;
    const defaultState: OnboardingState = {
      profile: {
        fullName: rawUser?.name || '',
        degree: '',
        specialization: '',
        experienceLevel: '',
        careerObjective: '',
        interests: []
      },
      skills: [],
      domain: null,
      onboardingStep: 1,
      method: null
    };

    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        return {
          profile: {
            fullName: draft.profile?.fullName ?? draft.name ?? rawUser?.name ?? '',
            degree: draft.profile?.degree ?? draft.degree ?? '',
            specialization: draft.profile?.specialization ?? draft.specialization ?? '',
            experienceLevel: draft.profile?.experienceLevel ?? draft.experience ?? '',
            careerObjective: draft.profile?.careerObjective ?? draft.careerGoal ?? '',
            interests: draft.profile?.interests ?? draft.interests ?? []
          },
          skills: draft.skills ?? [],
          domain: draft.domain ?? null,
          onboardingStep: draft.onboardingStep ?? draft.step ?? 1,
          method: draft.method ?? null
        };
      }
    } catch {
      // Ignore fallback
    }
    return defaultState;
  });

  // Save State to local storage draft
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  }, [state]);

  // Resume analysis stages & file states
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resumeExtractedCount, setResumeExtractedCount] = useState<number | null>(null);
  const [analysisStages, setAnalysisStages] = useState<Record<AnalysisStageId, 'pending' | 'active' | 'done' | 'error'>>({
    reading: 'pending',
    extracting: 'pending',
    proficiency: 'pending',
    domain: 'pending',
    matching: 'pending'
  });

  // Manual skill add state
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedAddName, setSelectedAddName] = useState<string | null>(null);
  const [addSkillLevel, setAddSkillLevel] = useState<ProficiencyLevel>('intermediate');
  const [addPopoverOpen, setAddPopoverOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterestToggle = (item: string) => {
    setState(prev => {
      const interests = prev.profile.interests.includes(item)
        ? prev.profile.interests.filter(i => i !== item)
        : [...prev.profile.interests, item];
      return {
        ...prev,
        profile: { ...prev.profile, interests }
      };
    });
  };

  const handleLevelChange = (name: string, newLevel: ProficiencyLevel) => {
    setState(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.name.toLowerCase() === name.toLowerCase() ? { ...s, proficiency: newLevel } : s)
    }));
  };

  const handleRemoveSkill = (name: string) => {
    setState(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name.toLowerCase() !== name.toLowerCase())
    }));
  };

  const handleAddSkillSubmit = () => {
    if (!selectedAddName) return;
    const nameCleaned = selectedAddName.trim();
    if (!nameCleaned) return;

    setState(prev => {
      // Case-insensitive deduplication: User selection takes precedence over existing
      const existingIdx = prev.skills.findIndex(s => s.name.toLowerCase() === nameCleaned.toLowerCase());
      const updated = [...prev.skills];
      const newSkill: Skill = {
        id: existingIdx !== -1 ? prev.skills[existingIdx].id : `s-manual-${Date.now()}-${nameCleaned.toLowerCase().replace(/\s+/g, '-')}`,
        name: nameCleaned,
        proficiency: addSkillLevel,
        source: 'manual'
      };

      if (existingIdx !== -1) {
        updated[existingIdx] = newSkill;
      } else {
        updated.push(newSkill);
      }

      return {
        ...prev,
        skills: updated
      };
    });

    // Reset states
    setSelectedAddName(null);
    setSkillSearch('');
    setAddSkillLevel('intermediate');
    setAddPopoverOpen(false);
  };

  // Resume upload flow
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setUploadError('Only PDF format is supported.');
      return;
    }

    setFile(selectedFile);
    setUploadError(null);
    setResumeExtractedCount(null);
    setAnalysisStages({
      reading: 'active',
      extracting: 'pending',
      proficiency: 'pending',
      domain: 'pending',
      matching: 'pending'
    });

    try {
      const profileResult = await api.uploadResume(selectedFile, (stageId, status) => {
        setAnalysisStages(prev => ({ ...prev, [stageId]: status }));
      });

      setState(prev => {
        // Merge extracted skills, manual inputs override extracted inputs
        const combined = [...prev.skills];
        profileResult.skills.forEach(ext => {
          const matchIdx = combined.findIndex(c => c.name.toLowerCase() === ext.name.toLowerCase());
          if (matchIdx === -1) {
            combined.push(ext);
          }
        });

        return {
          ...prev,
          skills: combined,
          domain: {
            name: profileResult.domain.domain.id,
            label: profileResult.domain.domain.label,
            confidence: profileResult.domain.confidence
          }
        };
      });

      setResumeExtractedCount(profileResult.skills.length);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to analyze resume. Please try adding manually.');
      setAnalysisStages(prev => {
        const reset: any = {};
        Object.keys(prev).forEach(k => {
          if (prev[k as AnalysisStageId] === 'active') {
            reset[k] = 'error';
          } else {
            reset[k] = prev[k as AnalysisStageId];
          }
        });
        return reset;
      });
    }
  };

  const handleConfirmProfile = async () => {
    setIsSubmitting(true);
    try {
      const finalProfile = await api.updateSkills(state.skills);

      const onboardingData: OnboardingProfile = {
        name: state.profile.fullName,
        degree: state.profile.degree,
        specialization: state.profile.specialization,
        experience: state.profile.experienceLevel,
        careerGoal: state.profile.careerObjective,
        interests: state.profile.interests,
        skills: state.skills.map(s => ({
          name: s.name,
          proficiency: s.proficiency,
          source: s.source
        })),
        domain: {
          name: finalProfile.domain.domain.id,
          label: finalProfile.domain.domain.label,
          confidence: finalProfile.domain.confidence
        },
        onboardingCompleted: true
      };

      authService.saveProfile(onboardingData);
      authService.completeOnboarding();
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    return (state.onboardingStep / 4) * 100;
  };

  const handleNext = () => {
    setState(prev => ({
      ...prev,
      onboardingStep: prev.onboardingStep + 1
    }));
  };

  const handleBack = () => {
    setState(prev => ({
      ...prev,
      onboardingStep: prev.onboardingStep - 1
    }));
  };

  // Grouped skills selector helper
  const getGroupedSkills = () => {
    const groups: Record<ProficiencyLevel, Skill[]> = {
      expert: [],
      advanced: [],
      intermediate: [],
      beginner: []
    };
    state.skills.forEach(s => {
      groups[s.proficiency].push(s);
    });
    return groups;
  };

  const grouped = getGroupedSkills();

  return (
    <div className="mx-auto max-w-[680px] px-6 py-12 selection:bg-zinc-800 selection:text-white">
      {/* Progress Header */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Step {state.onboardingStep} of 4</span>
          <span>{Math.round(getProgressPercentage())}% Completed</span>
        </div>
        <Progress value={getProgressPercentage()} className="h-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* STEP 1: ABOUT YOU */}
      {state.onboardingStep === 1 && (
        <div className="rounded-xl border border-border bg-card p-8 shadow-soft space-y-6 animate-fadeUp">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight">Let's get to know you</h1>
            <p className="text-[14px] text-muted-foreground">This helps CareerMapper understand your career context.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullname" className="text-[12px] font-semibold">Full Name</Label>
              <Input
                id="fullname"
                type="text"
                placeholder="Chandu S"
                required
                value={state.profile.fullName}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  profile: { ...prev.profile, fullName: e.target.value }
                }))}
                className="h-9 bg-transparent border-input focus-visible:ring-1 focus-visible:ring-ring text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="experience" className="text-[12px] font-semibold">Experience Level</Label>
              <Select 
                value={state.profile.experienceLevel} 
                onValueChange={(val) => setState(prev => ({
                  ...prev,
                  profile: { ...prev.profile, experienceLevel: val }
                }))}
              >
                <SelectTrigger id="experience" className="h-9 w-full bg-transparent border-input text-xs">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {experienceLevels.map((lvl) => (
                    <SelectItem key={lvl.value} value={lvl.value} className="focus:bg-muted cursor-pointer text-xs">
                      {lvl.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="degree" className="text-[12px] font-semibold">Degree</Label>
              <Input
                id="degree"
                type="text"
                placeholder="B.Tech, MBA, etc."
                required
                value={state.profile.degree}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  profile: { ...prev.profile, degree: e.target.value }
                }))}
                className="h-9 bg-transparent border-input focus-visible:ring-1 focus-visible:ring-ring text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="specialization" className="text-[12px] font-semibold">Specialization</Label>
              <Input
                id="specialization"
                type="text"
                placeholder="Computer Science, Finance..."
                value={state.profile.specialization}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  profile: { ...prev.profile, specialization: e.target.value }
                }))}
                className="h-9 bg-transparent border-input focus-visible:ring-1 focus-visible:ring-ring text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="careerGoal" className="text-[12px] font-semibold">What is your primary career objective?</Label>
            <Select 
              value={state.profile.careerObjective} 
              onValueChange={(val) => setState(prev => ({
                ...prev,
                profile: { ...prev.profile, careerObjective: val }
              }))}
            >
              <SelectTrigger id="careerGoal" className="h-9 w-full bg-transparent border-input text-xs">
                <SelectValue placeholder="Select career objective" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {careerObjectives.map((obj) => (
                  <SelectItem key={obj.value} value={obj.value} className="focus:bg-muted cursor-pointer text-xs">
                    {obj.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-semibold">Which areas of interest apply to you?</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {interestAreas.map((item) => {
                const isSelected = state.profile.interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleInterestToggle(item)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-[13px] transition-all cursor-pointer ${
                      isSelected
                        ? 'border-foreground bg-secondary text-secondary-foreground font-semibold'
                        : 'border-border bg-transparent text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && <Check className="size-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="button"
              disabled={!state.profile.fullName.trim() || !state.profile.degree.trim() || !state.profile.experienceLevel || !state.profile.careerObjective}
              onClick={handleNext}
              className="px-5 h-9 bg-primary text-primary-foreground font-medium rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              Continue
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: BUILD SKILLS PROFILE */}
      {state.onboardingStep === 2 && (
        <div className="rounded-xl border border-border bg-card p-8 shadow-soft space-y-6 animate-fadeUp">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight font-bold">Build your skill profile</h1>
            <p className="text-[14px] text-muted-foreground">Start with your resume, add skills manually, or combine both.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* OPTION A: UPLOAD RESUME */}
            <div className="flex flex-col justify-between rounded-xl border border-border p-6 hover:border-foreground transition-all space-y-4 bg-zinc-950/20">
              <div className="space-y-1.5">
                <div className="inline-flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                  <FileText className="size-4.5" />
                </div>
                <h3 className="font-display text-[15px] font-semibold text-white">Upload your resume</h3>
                <p className="text-[12px] text-muted-foreground leading-normal">
                  We'll extract skills and proficiency levels automatically.
                </p>
              </div>

              <div className="space-y-2">
                <label className="relative flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-5 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors group">
                  <Upload className="size-5 text-muted-foreground group-hover:text-foreground transition-colors mb-1.5" />
                  <span className="text-[12px] font-semibold">Upload resume PDF</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">PDF Format</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {uploadError && (
                  <div className="flex items-start gap-2 text-[11px] text-destructive leading-normal">
                    <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* OPTION B: MANUAL ENTRY */}
            <div className="flex flex-col justify-between rounded-xl border border-border p-6 hover:border-foreground transition-all space-y-4 bg-zinc-950/20">
              <div className="space-y-1.5">
                <div className="inline-flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Plus className="size-4.5" />
                </div>
                <h3 className="font-display text-[15px] font-semibold text-white">Add skills manually</h3>
                <p className="text-[12px] text-muted-foreground leading-normal">
                  Add skills that aren't detected or build your profile yourself.
                </p>
              </div>

              {/* Add Skill Popover Trigger */}
              <Popover open={addPopoverOpen} onOpenChange={setAddPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => {
                      setState(prev => ({ ...prev, method: 'manual' }));
                    }}
                    className="w-full h-9 border border-input bg-transparent hover:bg-muted text-foreground font-medium rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Plus className="size-3.5" />
                    Add skills
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0 bg-popover border-border rounded-lg shadow-md" align="center">
                  {selectedAddName ? (
                    /* Level Select Panel */
                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold text-xs text-white">Select proficiency level:</h4>
                      <p className="text-[11px] text-muted-foreground uppercase font-bold">{selectedAddName}</p>
                      
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Proficiency</Label>
                        <Select value={addSkillLevel} onValueChange={(val: ProficiencyLevel) => setAddSkillLevel(val)}>
                          <SelectTrigger className="h-8 text-xs bg-transparent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            {['beginner', 'intermediate', 'advanced', 'expert'].map((lvl) => (
                              <SelectItem key={lvl} value={lvl} className="focus:bg-muted text-xs capitalize">
                                {lvl}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedAddName(null)}
                          className="h-7 text-xs cursor-pointer"
                        >
                          Back
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleAddSkillSubmit}
                          className="h-7 text-xs bg-primary text-primary-foreground hover:opacity-90 font-medium cursor-pointer"
                        >
                          Add Skill
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Command Search Panel */
                    <Command className="bg-transparent border-0">
                      <CommandInput 
                        placeholder="Search or type a skill..." 
                        value={skillSearch}
                        onValueChange={setSkillSearch}
                        className="text-xs"
                      />
                      <CommandList className="max-h-[220px]">
                        <CommandEmpty className="py-3 text-[11px] text-muted-foreground">
                          <button
                            onClick={() => setSelectedAddName(skillSearch)}
                            className="w-full text-center hover:underline font-semibold"
                          >
                            Add "{skillSearch}"
                          </button>
                        </CommandEmpty>
                        <CommandGroup heading="Suggested Skills" className="text-[10px] uppercase font-bold text-muted-foreground">
                          {SUGGESTED_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).map((item) => (
                            <CommandItem
                              key={item}
                              onSelect={() => setSelectedAddName(item)}
                              className="text-xs focus:bg-muted cursor-pointer flex items-center gap-2"
                            >
                              <SkillIcon skill={item} className="size-3.5" />
                              <span>{item}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Upload Status Pipeline */}
          {file && !uploadError && (
            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3 animate-fadeUp">
              <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2">
                <div className="flex items-center gap-1.5 font-medium">
                  {analysisStages.matching !== 'done' ? (
                    <RefreshCw className="size-3.5 text-foreground animate-spin" />
                  ) : (
                    <Check className="size-3.5 text-emerald-500" />
                  )}
                  <span>{analysisStages.matching !== 'done' ? 'Analyzing resume...' : 'Analysis completed'}</span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">PDF Format</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'reading', label: 'Resume uploaded' },
                  { id: 'extracting', label: 'Extracting text' },
                  { id: 'proficiency', label: 'Detecting skills' },
                  { id: 'domain', label: 'Detecting proficiency' },
                  { id: 'matching', label: 'Identifying domain' }
                ].map((stage) => {
                  const status = analysisStages[stage.id as AnalysisStageId];
                  return (
                    <div key={stage.id} className="flex items-center justify-between text-[11px] leading-none">
                      <span className={`${status === 'active' ? 'text-foreground font-semibold' : status === 'done' ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        {status === 'done' ? `✓ ${stage.label}` : status === 'active' ? `● ${stage.label}` : `○ ${stage.label}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {resumeExtractedCount !== null && (
                <div className="pt-2.5 border-t border-border/40 space-y-2 animate-fadeUp">
                  <div className="flex items-center gap-2 text-xs">
                    <Award className="size-4 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-white">Skills found</p>
                      <p className="text-[11px] text-muted-foreground">{resumeExtractedCount} skills detected</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleNext}
                    className="w-full h-8 bg-primary text-primary-foreground hover:opacity-90 font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                  >
                    Continue to review
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Unified list preview bottom */}
          <div className="border-t border-border pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Unified Skills Profile ({state.skills.length})
              </span>
              <span className="text-[10px] text-muted-foreground">
                Your skills will appear below after extraction or manual entry.
              </span>
            </div>
            
            {state.skills.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-6 text-center text-muted-foreground text-xs bg-zinc-950/10">
                No skills added yet. Choose one of the methods above.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {state.skills.map((skill) => (
                  <Badge 
                    key={skill.name} 
                    variant="secondary" 
                    className="bg-zinc-800 text-zinc-300 border-zinc-700 text-[10.5px] px-2 py-0.5 rounded-full flex items-center gap-1.5 hover:border-zinc-500 transition-colors"
                  >
                    <SkillIcon skill={skill.name} className="size-3" />
                    <span>{skill.name}</span>
                    <span className="text-[8px] opacity-70 uppercase font-mono">({skill.proficiency[0]})</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>

            <Button
              type="button"
              disabled={state.skills.length === 0}
              onClick={handleNext}
              className="px-5 h-9 bg-primary text-primary-foreground font-medium rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              Continue
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: SKILLS REVIEW & EDIT */}
      {state.onboardingStep === 3 && (
        <div className="rounded-xl border border-border bg-card p-8 shadow-soft space-y-6 animate-fadeUp">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight font-bold">Review your skills</h1>
            <p className="text-[14px] text-muted-foreground">Check, edit, or add skills before continuing.</p>
          </div>

          {/* Add skill popover command */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Click any skill chip below to edit its proficiency or delete it.</span>
            </div>
            
            <Popover open={addPopoverOpen} onOpenChange={setAddPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  className="h-8 px-3.5 bg-primary text-primary-foreground hover:opacity-90 font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer text-xs"
                >
                  <Plus className="size-3.5" />
                  Add skill
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0 bg-popover border-border rounded-lg shadow-md" align="end">
                {selectedAddName ? (
                  <div className="p-4 space-y-3">
                    <h4 className="font-semibold text-xs text-white">Select proficiency level:</h4>
                    <p className="text-[11px] text-muted-foreground uppercase font-bold">{selectedAddName}</p>
                    
                    <div className="space-y-1">
                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Proficiency</Label>
                      <Select value={addSkillLevel} onValueChange={(val: ProficiencyLevel) => setAddSkillLevel(val)}>
                        <SelectTrigger className="h-8 text-xs bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {['beginner', 'intermediate', 'advanced', 'expert'].map((lvl) => (
                            <SelectItem key={lvl} value={lvl} className="focus:bg-muted text-xs capitalize">
                              {lvl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedAddName(null)}
                        className="h-7 text-xs cursor-pointer"
                      >
                        Back
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleAddSkillSubmit}
                        className="h-7 text-xs bg-primary text-primary-foreground hover:opacity-90 font-medium cursor-pointer"
                      >
                        Add Skill
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Command className="bg-transparent border-0">
                    <CommandInput 
                      placeholder="Search or type a skill..." 
                      value={skillSearch}
                      onValueChange={setSkillSearch}
                      className="text-xs"
                    />
                    <CommandList className="max-h-[220px]">
                      <CommandEmpty className="py-3 text-[11px] text-muted-foreground">
                        <button
                          onClick={() => setSelectedAddName(skillSearch)}
                          className="w-full text-center hover:underline font-semibold"
                        >
                          Add "{skillSearch}"
                        </button>
                      </CommandEmpty>
                      <CommandGroup heading="Suggested Skills" className="text-[10px] uppercase font-bold text-muted-foreground">
                        {SUGGESTED_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).map((item) => (
                          <CommandItem
                            key={item}
                            onSelect={() => setSelectedAddName(item)}
                            className="text-xs focus:bg-muted cursor-pointer flex items-center gap-2"
                          >
                            <SkillIcon skill={item} className="size-3.5" />
                            <span>{item}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Grouped Skills Display */}
          <div className="space-y-4 pt-1">
            {state.skills.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-10 text-center text-muted-foreground text-xs bg-zinc-950/10">
                No skills added yet. Click "Add skill" above to begin.
              </div>
            ) : (
              <div className="space-y-4">
                {(['expert', 'advanced', 'intermediate', 'beginner'] as ProficiencyLevel[]).map((level) => {
                  const filtered = grouped[level];
                  if (filtered.length === 0) return null;

                  return (
                    <div key={level} className="space-y-1.5 pb-2 border-b border-border/20 last:border-b-0">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground">
                        {level} ({filtered.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {filtered.map((skill) => {
                          // Clean visual differentiation
                          let chipClasses = "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700";
                          if (level === 'expert') chipClasses = "bg-white text-zinc-950 border-white hover:bg-zinc-100";
                          if (level === 'advanced') chipClasses = "bg-zinc-100 text-zinc-900 border-zinc-200 hover:bg-zinc-200";
                          if (level === 'intermediate') chipClasses = "bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700";

                          return (
                            <Popover key={skill.name}>
                              <PopoverTrigger asChild>
                                <button 
                                  className={`flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-1 cursor-pointer transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${chipClasses}`}
                                >
                                  <SkillIcon skill={skill.name} className="size-3.5" />
                                  <span>{skill.name}</span>
                                  <span className="text-[8px] font-bold uppercase opacity-60">
                                    · {skill.source === 'extracted' ? 'Resume' : 'Manual'}
                                  </span>
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56 p-3.5 bg-popover border-border rounded-lg shadow-md space-y-3" align="center">
                                <div className="flex justify-between items-center gap-1.5">
                                  <div className="flex items-center gap-1.5 max-w-[70%] overflow-hidden">
                                    <SkillIcon skill={skill.name} className="size-3.5" />
                                    <h4 className="font-semibold text-xs truncate text-white">{skill.name}</h4>
                                  </div>
                                  <span className="text-[9px] text-muted-foreground uppercase px-1.5 py-0.5 bg-muted rounded border border-border shrink-0">
                                    {skill.source}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Proficiency Level</Label>
                                  <Select 
                                    value={skill.proficiency} 
                                    onValueChange={(val: ProficiencyLevel) => handleLevelChange(skill.name, val)}
                                  >
                                    <SelectTrigger className="h-8 text-xs bg-transparent">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                      {['beginner', 'intermediate', 'advanced', 'expert'].map((lvl) => (
                                        <SelectItem key={lvl} value={lvl} className="focus:bg-muted text-xs capitalize">
                                          {lvl}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveSkill(skill.name)}
                                  className="w-full h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="size-3.5" />
                                  Remove skill
                                </Button>
                              </PopoverContent>
                            </Popover>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>

            <Button
              type="button"
              disabled={state.skills.length === 0 || isSubmitting}
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  const domData = await api.updateSkills(state.skills);
                  setState(prev => ({
                    ...prev,
                    domain: {
                      name: domData.domain.domain.id,
                      label: domData.domain.domain.label,
                      confidence: domData.domain.confidence
                    }
                  }));
                  handleNext();
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="px-5 h-9 bg-primary text-primary-foreground font-medium rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 animate-pulse-once"
            >
              {isSubmitting ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : (
                <>
                  Continue
                  <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: FINAL PROFILE CONFIRMATION */}
      {state.onboardingStep === 4 && (
        <div className="rounded-xl border border-border bg-card p-8 shadow-soft space-y-6 animate-fadeUp">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight font-bold">Your profile is ready</h1>
            <p className="text-[14px] text-muted-foreground">Review your profile before we map your career paths.</p>
          </div>

          {/* Domain card alignment */}
          {state.domain && (
            <div className="p-5 rounded-lg border border-border bg-muted/20 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Primary Domain</span>
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <span className="font-display text-lg font-bold text-white uppercase">{state.domain.name}</span>
                <span className="font-mono text-lg font-bold text-white">{state.domain.confidence}% confidence</span>
              </div>
            </div>
          )}

          {/* Profile Overview Table */}
          <div className="border border-border rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-3 border-b border-border bg-muted/10 p-3">
              <span className="font-semibold text-muted-foreground">Field</span>
              <span className="col-span-2 font-semibold text-muted-foreground">Detail</span>
            </div>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-3 p-3">
                <span className="text-muted-foreground font-semibold">Full Name</span>
                <span className="col-span-2 font-semibold text-white">{state.profile.fullName}</span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="text-muted-foreground font-semibold">Education</span>
                <span className="col-span-2 font-semibold text-white">
                  {state.profile.degree}
                  {state.profile.specialization ? ` — ${state.profile.specialization}` : ''}
                </span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="text-muted-foreground font-semibold">Experience</span>
                <span className="col-span-2 font-semibold text-white">{state.profile.experienceLevel}</span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="text-muted-foreground font-semibold">Objective</span>
                <span className="col-span-2 font-semibold text-white">{state.profile.careerObjective}</span>
              </div>
            </div>
          </div>

          {/* Grouped Skills breakdown */}
          <div className="space-y-3">
            <h3 className="font-display text-[14px] font-semibold text-white">Skills Inventory ({state.skills.length})</h3>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {['expert', 'advanced', 'intermediate', 'beginner'].map((level) => {
                const filtered = grouped[level as ProficiencyLevel];
                if (filtered.length === 0) return null;
                
                return (
                  <div key={level} className="p-3.5 rounded-lg border border-border bg-muted/10 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground capitalize">
                      {level} ({filtered.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {filtered.map(skill => (
                        <Badge 
                          key={skill.name} 
                          variant="outline" 
                          className="bg-card text-zinc-300 border-border text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1.5"
                        >
                          <SkillIcon skill={skill.name} className="size-3" />
                          <span>{skill.name}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              onClick={() => setState(prev => ({ ...prev, onboardingStep: 3 }))}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronLeft className="size-4" />
              Edit skills
            </button>

            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmProfile}
              className="px-6 h-9 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : (
                <>
                  Confirm profile
                  <Check className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
