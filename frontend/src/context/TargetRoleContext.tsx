import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

export interface ActiveTargetRole {
  roleTitle: string;
  company?: string;
  domain?: string;
  matchScore?: number;
  matchedSkills?: string[];
  skillsToStrengthen?: string[];
  source?: string;
  updatedAt?: string;
}

interface TargetRoleContextType {
  activeTargetRole: ActiveTargetRole | null;
  loading: boolean;
  error: string | null;
  setActiveTargetRole: (roleObj: ActiveTargetRole) => Promise<void>;
  refreshActiveRole: () => Promise<void>;
}

const TargetRoleContext = createContext<TargetRoleContextType | undefined>(undefined);

export const TargetRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTargetRole, setActiveRoleState] = useState<ActiveTargetRole | null>(() => {
    try {
      const stored = localStorage.getItem('cm_target_role');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.roleTitle || parsed.targetRole)) {
          return {
            roleTitle: (parsed.roleTitle || parsed.targetRole).split(',')[0].trim(),
            company: parsed.company || 'Target Company',
            domain: parsed.domain || 'Technology',
            matchScore: parsed.matchScore || 80,
            matchedSkills: parsed.matchedSkills || [],
            skillsToStrengthen: parsed.skillsToStrengthen || []
          };
        }
      }
    } catch {}
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshActiveRole = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getActiveTargetRole();
      if (res && res.activeTargetRole && res.activeTargetRole.roleTitle) {
        const roleObj: ActiveTargetRole = {
          roleTitle: res.activeTargetRole.roleTitle.split(',')[0].trim(),
          company: res.activeTargetRole.company || 'Target Company',
          domain: res.activeTargetRole.domain || 'Technology',
          matchScore: res.activeTargetRole.matchScore || 80,
          matchedSkills: res.activeTargetRole.matchedSkills || [],
          skillsToStrengthen: res.activeTargetRole.skillsToStrengthen || [],
          source: res.activeTargetRole.source || 'mongodb',
          updatedAt: res.activeTargetRole.updatedAt
        };
        setActiveRoleState(roleObj);
        localStorage.setItem('cm_target_role', JSON.stringify(roleObj));
      }
    } catch (err: any) {
      console.warn('[TARGET ROLE CONTEXT] Failed to fetch active role from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshActiveRole();
  }, []);

  const setActiveTargetRole = async (roleObj: ActiveTargetRole) => {
    if (!roleObj || !roleObj.roleTitle) return;
    const cleanTitle = roleObj.roleTitle.split(',')[0].trim();
    const formattedObj: ActiveTargetRole = {
      ...roleObj,
      roleTitle: cleanTitle
    };

    // Optimistic UI update & LocalStorage write
    setActiveRoleState(formattedObj);
    localStorage.setItem('cm_target_role', JSON.stringify(formattedObj));

    // MongoDB Persistence
    try {
      await api.setActiveTargetRole({
        roleTitle: cleanTitle,
        company: formattedObj.company,
        domain: formattedObj.domain,
        matchScore: formattedObj.matchScore,
        matchedSkills: formattedObj.matchedSkills,
        skillsToStrengthen: formattedObj.skillsToStrengthen,
        source: formattedObj.source || 'user_selected'
      });
    } catch (err: any) {
      console.error('[TARGET ROLE CONTEXT] Failed to persist active role to MongoDB:', err);
      setError(err.message || 'Failed to sync target role with server.');
    }
  };

  return (
    <TargetRoleContext.Provider value={{ activeTargetRole, loading, error, setActiveTargetRole, refreshActiveRole }}>
      {children}
    </TargetRoleContext.Provider>
  );
};

export const useActiveTargetRole = (): TargetRoleContextType => {
  const context = useContext(TargetRoleContext);
  if (!context) {
    throw new Error('useActiveTargetRole must be used within a TargetRoleProvider');
  }
  return context;
};
