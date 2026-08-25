import type { ApiResult, Skill, CareerProfile, AnalysisStageId, DomainId, ProficiencyLevel, CareerMatch } from '../types';

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
  }
};
