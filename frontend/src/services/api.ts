import type { ApiResult, Skill, CareerProfile, AnalysisStageId, DomainId, ProficiencyLevel, CareerMatch } from '../types';
import { authService } from './auth';

export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const ML_URL = import.meta.env.VITE_ML_BASE_URL || 'http://localhost:8000';

async function safeFetch<T>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { status: 'success', data };
  } catch (err: any) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Network request failed.',
    };
  }
}

export const api = {
  /**
   * Upload resume PDF to the backend extraction pipeline
   */
  async uploadResume(
    file: File,
    onStageChange?: (stageId: AnalysisStageId, status: 'pending' | 'active' | 'done' | 'error') => void
  ): Promise<CareerProfile> {
    const stages: AnalysisStageId[] = ['reading', 'extracting', 'proficiency', 'domain', 'matching'];

    // Helper to simulate smooth stage transitions for the extraction pipeline UI
    const triggerStages = async () => {
      for (const stage of stages) {
        if (onStageChange) onStageChange(stage, 'active');
        await new Promise(r => setTimeout(r, 400));
        if (onStageChange) onStageChange(stage, 'done');
      }
    };

    if (onStageChange) {
      onStageChange('reading', 'active');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/extract-skills`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      if (onStageChange) {
        stages.forEach(s => onStageChange(s, 'error'));
      }
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to extract skills from resume');
    }

    // Complete UI stage animation
    await triggerStages();

    const data = await response.json();

    // Map backend capitalized level names to frontend lowercase proficiency enum
    const levelMap: Record<string, ProficiencyLevel> = {
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced',
      'expert': 'expert'
    };

    // Transform flat backend data into frontend interface format
    const transformedProfile: CareerProfile = {
      domain: {
        domain: {
          id: (data.domain || 'Unknown').toLowerCase() as DomainId,
          label: data.domain || 'Unknown'
        },
        confidence: data.confidence || 0
      },
      skills: (data.skills || []).map((s: any, idx: number) => {
        const levelLower = (s.level || 'intermediate').toLowerCase();
        const proficiency: ProficiencyLevel = levelMap[levelLower] || 'intermediate';

        return {
          id: `s-extracted-${idx}-${s.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: s.name,
          proficiency: proficiency,
          source: 'extracted'
        };
      }),
      topMatch: undefined,
      otherMatches: []
    };

    return transformedProfile;
  },

  /**
   * Send user confirmed skills to calculate final recommendations
   */
  async updateSkills(skills: Skill[]): Promise<CareerProfile> {
    // 1. Fetch domain alignment results first
    const domainResponse = await fetch(`${BACKEND_URL}/detect-domain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skills: skills.map(s => ({
          name: s.name,
          level: s.proficiency,
        })),
      }),
    });

    if (!domainResponse.ok) {
      const errBody = await domainResponse.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to compute domain configuration');
    }

    const domainData = await domainResponse.json();

    // 2. Fetch role matches next using identified domain
    const roleResponse = await fetch(`${BACKEND_URL}/match-roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skills: skills.map(s => ({
          name: s.name,
          level: s.proficiency,
        })),
        domain: domainData.domain
      }),
    });

    let recommendations: CareerMatch[] = [];
    if (roleResponse.ok) {
      const roleData = await roleResponse.json();
      const rawRecs = roleData.recommendations || [];
      recommendations = rawRecs.map((r: any, idx: number) => ({
        id: `c-match-${idx}-${r.role.toLowerCase().replace(/\s+/g, '-')}`,
        roleTitle: r.role,
        domain: (r.domain || 'Unknown').toLowerCase() as DomainId,
        matchScore: r.score,
        summary: '',
        matchedSkills: (r.matchedSkills || []).map((s: any) => {
          const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
          const sKey = typeof s === 'object' && s !== null ? s.canonical || s._id : s;
          return {
            skillId: sKey,
            skillName: sName,
            status: 'strong'
          };
        }),
        gaps: (r.missingSkills || []).map((s: any) => {
          const sName = typeof s === 'object' && s !== null ? s.display || s.canonical : s;
          return {
            skillName: sName,
            gapType: 'learn'
          };
        })
      }));
    }

    const levelMap: Record<string, ProficiencyLevel> = {
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced',
      'expert': 'expert'
    };

    // 3. Assemble and return CareerProfile
    const transformedProfile: CareerProfile = {
      domain: {
        domain: {
          id: (domainData.domain || 'Unknown').toLowerCase() as DomainId,
          label: domainData.domain || 'Unknown'
        },
        confidence: domainData.confidence || 0
      },
      skills: (domainData.skills || []).map((s: any, idx: number) => {
        const levelLower = (s.level || 'intermediate').toLowerCase();
        const proficiency: ProficiencyLevel = levelMap[levelLower] || 'intermediate';

        // Preserve user source details if it matches the original skill list
        const matchedOrig = skills.find(orig => orig.name.toLowerCase() === s.name.toLowerCase());
        const source = matchedOrig ? matchedOrig.source : 'manual';

        return {
          id: matchedOrig?.id || `s-detected-${idx}-${s.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: s.name,
          proficiency: proficiency,
          source: source
        };
      }),
      topMatch: recommendations[0],
      otherMatches: recommendations.slice(1)
    };

    // Cache final matches to localStorage for instant dashboard rendering
    localStorage.setItem('careerProfile', JSON.stringify({
      recommendations,
      domain: domainData.domain,
      confidence: domainData.confidence
    }));

    return transformedProfile;
  },

  /**
   * Query backend health status
   */
  checkBackendHealth(): Promise<ApiResult<{ status: string }>> {
    return safeFetch<{ status: string }>(`${BACKEND_URL}/health`);
  },

  /**
   * Query ML service health status
   */
  checkMlHealth(): Promise<ApiResult<{ status: string }>> {
    return safeFetch<{ status: string }>(`${ML_URL}/health`);
  },

  /**
   * Fetch market analysis report for the selected role
   */
  async getMarketAnalysis(roleSlug: string, country: string, skillsQuery: string, forceRefresh: boolean = false): Promise<any> {
    const url = `${BACKEND_URL}/market-analysis/${roleSlug}?country=${encodeURIComponent(country)}&skills=${encodeURIComponent(skillsQuery)}${forceRefresh ? '&refresh=true' : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to load market intelligence.');
    }
    return response.json();
  },

  /**
   * Fetch normalized and matched job listings
   */
  async getJobs(params: {
    query?: string;
    location?: string;
    country?: string;
    skillsQuery?: string;
    role?: string;
    page?: number;
    forceRefresh?: boolean;
  }): Promise<any> {
    const q = params.query || 'full-stack-developer';
    const loc = params.location || 'all';
    const country = params.country || 'India';
    const skills = params.skillsQuery || '';
    const role = params.role || '';
    const page = params.page || 1;
    const refresh = params.forceRefresh ? '&refresh=true' : '';

    const url = `${BACKEND_URL}/jobs?query=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}&country=${encodeURIComponent(country)}&skills=${encodeURIComponent(skills)}&role=${encodeURIComponent(role)}&page=${page}${refresh}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to search job listings.');
    }
    return response.json();
  },

  /**
   * Post a job description to the backend AI analysis engine
   */
  async analyzeJob(params: {
    jobId: string;
    description: string;
    jobTitle: string;
    userSkills: any[];
    userRole: string;
  }): Promise<any> {
    const response = await fetch(`${BACKEND_URL}/jobs/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to analyze job description.');
    }
    return response.json();
  },

  /**
   * Resolve an array of raw skill names to unified metadata objects
   */
  async resolveSkills(skills: string[]): Promise<any> {
    const response = await fetch(`${BACKEND_URL}/skills/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skills }),
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to resolve skills.');
    }
    return response.json();
  },

  /**
   * Send messages and application context to secure backend AI assistant
   */
  async sendChatMessage(messages: any[], context: any): Promise<any> {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, context }),
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to get response from AI Assistant.');
    }
    return response.json();
  },

  /**
   * Save a job snapshot to MongoDB
   */
  async saveJob(job: any): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/jobs/saved`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify(job)
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to save job.');
    }
    return response.json();
  },

  /**
   * Retrieve all saved jobs for current user
   */
  async getSavedJobs(): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/jobs/saved`, {
      method: 'GET',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to retrieve saved jobs.');
    }
    return response.json();
  },

  /**
   * Update tracking status of a saved job
   */
  async updateSavedJobStatus(savedJobId: string, status: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/jobs/saved/${savedJobId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to update job status.');
    }
    return response.json();
  },

  /**
   * Remove a job from saved jobs list
   */
  async deleteSavedJob(savedJobId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/jobs/saved/${savedJobId}`, {
      method: 'DELETE',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to remove saved job.');
    }
    return response.json();
  },

  /**
   * Retrieve Application Tracker summary metrics and lists
   */
  async getTrackerSummary(): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/jobs/tracker`, {
      method: 'GET',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to retrieve application tracker data.');
    }
    return response.json();
  },

  /**
   * Get skill verification for a specific skill gap
   */
  async getSkillVerification(roadmapId: string, skillId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/skills/${encodeURIComponent(skillId)}/verification`, {
      method: 'GET',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to retrieve skill verification.');
    }
    return response.json();
  },

  async verifySkill(roadmapId: string, skillId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/skills/${encodeURIComponent(skillId)}/verify`, {
      method: 'POST',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to verify skill.');
    }
    return response.json();
  },

  async recalculateVerification(roadmapId: string, skillId: string): Promise<any> {
    return this.verifySkill(roadmapId, skillId);
  },

  /**
   * Get authenticated user's active target role from MongoDB
   */
  async getActiveTargetRole(): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/user/target-role`, {
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  },

  /**
   * Single Source of Truth Setter: Persist active target role to MongoDB
   */
  async setActiveTargetRole(payload: {
    roleTitle: string;
    company?: string;
    domain?: string;
    matchScore?: number;
    matchedSkills?: string[];
    skillsToStrengthen?: string[];
    source?: string;
  }): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/user/target-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to save active target role.');
    }
    return response.json();
  },

  /**
   * Generate a roadmap for a target role & company
   */
  async generateRoadmap(payload: { targetRole: string; company?: string; domain?: string; userSkills?: any[] }): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const bodyPayload = {
      targetRole: payload.targetRole,
      company: payload.company || 'Target Company',
      domain: payload.domain || 'Technology',
      userSkills: payload.userSkills || [],
      targetRoleParams: {
        targetRole: payload.targetRole,
        company: payload.company || 'Target Company',
        domain: payload.domain || 'Technology',
        userSkills: payload.userSkills || []
      }
    };
    const response = await fetch(`${BACKEND_URL}/roadmap/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify(bodyPayload)
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to generate roadmap.');
    }
    return response.json();
  },

  /**
   * Get all roadmaps for current user
   */
  async getRoadmaps(userId: string): Promise<any> {
    const response = await fetch(`${BACKEND_URL}/roadmap?userId=${encodeURIComponent(userId)}`);
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to retrieve roadmaps.');
    }
    return response.json();
  },

  /**
   * Get aggregated roadmap experience details (Module 14)
   */
  async getRoadmapExperience(roadmapId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/experience`, {
      method: 'GET',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to retrieve roadmap experience.');
    }
    return response.json();
  },

  /**
   * Get deterministic next action (Module 14)
   */
  async getRoadmapNextAction(roadmapId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/next-action`, {
      method: 'GET',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to retrieve next action.');
    }
    return response.json();
  },

  /**
   * Get progress/gamification summary metrics (Module 14)
   */
  async getRoadmapProgress(roadmapId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/progress`, {
      method: 'GET',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to retrieve roadmap progress.');
    }
    return response.json();
  },

  /**
   * Generate assessment checkpoint on-demand (Module 11)
   */
  async generateAssessment(roadmapId: string, skillIds: string[]): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/assessments/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify({ skillIds, refresh: true })
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to generate assessment checkpoint.');
    }
    return response.json();
  },

  /**
   * Fetch assessment questions and description
   */
  async getAssessmentDetails(assessmentId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/assessments/${assessmentId}`, {
      method: 'GET',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to fetch assessment details.');
    }
    return response.json();
  },

  /**
   * Start a new attempt session for an assessment
   */
  async startAssessmentAttempt(assessmentId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/assessments/${assessmentId}/start`, {
      method: 'POST',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to start assessment attempt.');
    }
    return response.json();
  },

  /**
   * Submit and grade an assessment attempt
   */
  async submitAssessmentAttempt(assessmentId: string, attemptId: string, answers: any[]): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/assessments/${assessmentId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify({ attemptId, answers })
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to grade and submit assessment.');
    }
    return response.json();
  },

  /**
   * Submit link/URL evidence for a project (Module 10)
   */
  async submitProjectEvidence(roadmapId: string, projectId: string, title: string, description: string, url: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/evidence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify({
        projectId,
        type: 'github_repo',
        title,
        description,
        url
      })
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to submit evidence.');
    }
    return response.json();
  },

  /**
   * Update status of a learning mission (REST Mutation)
   */
  async updateMissionStatus(roadmapId: string, missionId: string, status: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/missions/${missionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to update mission status.');
    }
    return response.json();
  },

  /**
   * Recalculate adaptive roadmap layout (Module 13)
   */
  async recalculateRoadmap(roadmapId: string, params?: any): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/recalculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify(params || {})
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to recalculate roadmap.');
    }
    return response.json();
  },

  /**
   * Fetch cached interview prep details (Module 16 - ZERO AI call on load)
   */
  async getInterviewPrep(roadmapId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/interview-prep`, {
      method: 'GET',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to retrieve interview prep.');
    }
    return response.json();
  },

  /**
   * Explicitly generate/refresh interview prep details (Module 16 - AI allowed on explicit action)
   */
  async generateInterviewPrep(roadmapId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/interview-prep/generate`, {
      method: 'POST',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to generate interview prep.');
    }
    return response.json();
  },

  /**
   * Start an adaptive interview simulation session (Module 16)
   */
  async startInterviewSimulation(roadmapId: string, mode: string = 'Mixed'): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/roadmap/${roadmapId}/interview-simulation/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify({ mode })
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to start interview simulation.');
    }
    return response.json();
  },

  /**
   * Submit an answer to a simulation question (Module 16)
   */
  async respondToSimulationQuestion(sessionId: string, questionId: string, userAnswer: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/interview-simulation/${sessionId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify({ questionId, userAnswer })
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to submit simulation response.');
    }
    return response.json();
  },

  /**
   * Complete an interview simulation session (Module 16)
   */
  async completeInterviewSimulation(sessionId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/interview-simulation/${sessionId}/complete`, {
      method: 'POST',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to complete simulation session.');
    }
    return response.json();
  },

  /**
   * Prepare for a Saved Job (Module 16)
   */
  async prepareSavedJob(savedJobId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/saved-jobs/${savedJobId}/prepare`, {
      method: 'POST',
      headers: {
        'X-User-Email': email
      }
    });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to initialize interview prep for saved job.');
    }
    return response.json();
  },

  // ---------------- SYSTEM 1: ROLE-BASED ROADMAPS ----------------
  async getRoleRoadmaps(category?: string): Promise<any> {
    const defaultRoadmaps = [
      {
        slug: 'frontend',
        title: 'Frontend Developer',
        description: 'Step-by-step guide to becoming a modern Frontend developer (HTML, CSS, JavaScript, React, etc.)',
        category: 'Engineering',
        icon: 'Layout',
        nodeCount: 156
      },
      {
        slug: 'backend',
        title: 'Backend Developer',
        description: 'Step-by-step guide to becoming a modern Backend developer (Node.js, PostgreSQL, APIs, Caching, etc.)',
        category: 'Engineering',
        icon: 'Server',
        nodeCount: 225
      },
      {
        slug: 'fullstack',
        title: 'Full Stack Developer',
        description: 'Step-by-step guide to becoming a modern Full Stack developer (Frontend + Backend + DevOps fundamentals)',
        category: 'Engineering',
        icon: 'Layers',
        nodeCount: 79
      },
      {
        slug: 'devops',
        title: 'DevOps Roadmap',
        description: 'Step by step guide for DevOps, SRE or any other Operations Role in 2026',
        category: 'Infrastructure',
        icon: 'Cloud',
        nodeCount: 171
      },
      {
        slug: 'android',
        title: 'Android Developer',
        description: 'Step by step guide to becoming an Android developer in 2026',
        category: 'Mobile',
        icon: 'Smartphone',
        nodeCount: 157
      },
      {
        slug: 'ai-engineer',
        title: 'AI Engineer',
        description: 'Step by step guide to becoming an AI Engineer in 2026',
        category: 'AI & Data',
        icon: 'Cpu',
        nodeCount: 104
      },
      {
        slug: 'data-analyst',
        title: 'Data Analyst',
        description: 'Step by step guide to becoming a Data Analyst in 2026',
        category: 'AI & Data',
        icon: 'BarChart',
        nodeCount: 78
      },
      {
        slug: 'devsecops',
        title: 'DevSecOps',
        description: 'Step by step guide to becoming a DevSecOps Expert in 2026',
        category: 'Security',
        icon: 'Shield',
        nodeCount: 65
      },
      {
        slug: 'data-engineer',
        title: 'Data Engineer',
        description: 'Step by step guide to becoming a Data Engineer in 2026',
        category: 'AI & Data',
        icon: 'Database',
        nodeCount: 26
      },
      {
        slug: 'postgresql-dba',
        title: 'PostgreSQL DBA',
        description: 'Step by step guide to becoming a modern PostgreSQL DB Administrator in 2026',
        category: 'Infrastructure',
        icon: 'Database',
        nodeCount: 45
      },
      {
        slug: 'machine-learning',
        title: 'Machine Learning',
        description: 'Step by step guide to becoming a Machine Learning Engineer in 2026',
        category: 'AI & Data',
        icon: 'Cpu',
        nodeCount: 24
      },
      {
        slug: 'data-scientist',
        title: 'Data Scientist',
        description: 'Step by step guide to becoming a Data Scientist in 2026',
        category: 'AI & Data',
        icon: 'BarChart',
        nodeCount: 20
      },
      {
        slug: 'blockchain',
        title: 'Blockchain Developer',
        description: 'Step by step guide to becoming a blockchain developer in 2026.',
        category: 'Engineering',
        icon: 'Layers',
        nodeCount: 42
      },
      {
        slug: 'ios',
        title: 'iOS Developer',
        description: 'Step by step guide to becoming an iOS developer in 2026',
        category: 'Mobile',
        icon: 'Smartphone',
        nodeCount: 65
      }
    ];

    try {
      const query = category ? `?category=${encodeURIComponent(category)}` : '';
      const response = await fetch(`${BACKEND_URL}/role-roadmaps${query}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('[API] Backend role-roadmaps unavailable, using client-side roadmaps fallback.');
    }

    return {
      status: 'success',
      data: category && category !== 'ALL'
        ? defaultRoadmaps.filter(r => r.category.toUpperCase() === category.toUpperCase())
        : defaultRoadmaps
    };
  },

  async getRoleRoadmapBySlug(slug: string): Promise<any> {
    try {
      const email = authService.getSession().user?.email || '';
      const response = await fetch(`${BACKEND_URL}/role-roadmaps/${slug}`, {
        headers: { 'X-User-Email': email }
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('[API] Backend role-roadmap details unavailable, using client-side fallback.');
    }
    return { status: 'success', data: { slug } };
  },

  // ---------------- SYSTEM 2: JOB PREPARATION ROADMAPS ----------------
  async getJobPreparations(): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/job-prep`, {
      headers: { 'X-User-Email': email }
    });
    if (!response.ok) throw new Error('Failed to fetch job preparations.');
    return response.json();
  },

  async getJobPreparationById(id: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/job-prep/${id}`, {
      headers: { 'X-User-Email': email }
    });
    if (!response.ok) throw new Error('Failed to fetch job preparation detail.');
    return response.json();
  },

  async prepareJob(jobId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/job-prep/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify({ jobId })
    });
    if (!response.ok) throw new Error('Failed to initialize job preparation.');
    return response.json();
  },

  async togglePreparationTask(prepId: string, taskId: string): Promise<any> {
    const email = authService.getSession().user?.email || '';
    const response = await fetch(`${BACKEND_URL}/job-prep/${prepId}/tasks/${taskId}/toggle`, {
      method: 'POST',
      headers: { 'X-User-Email': email }
    });
    if (!response.ok) throw new Error('Failed to toggle task progress.');
    return response.json();
  },

  // Job Interview Prep Aliases
  async getJobInterviewPrep(prepId: string): Promise<any> {
    return this.getInterviewPrep(prepId);
  },

  async startJobInterviewSimulation(prepId: string, mode?: string): Promise<any> {
    return this.startInterviewSimulation(prepId, mode);
  },

  async respondJobInterviewSimulation(sessionId: string, questionId: string, userAnswer: string): Promise<any> {
    return this.respondToSimulationQuestion(sessionId, questionId, userAnswer);
  }
};
