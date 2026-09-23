import { getSemanticNode } from './roadmapHierarchy';
import { FRONTEND_SEMANTIC_NODES } from '../data/frontendSemanticModel';
import { BACKEND_SEMANTIC_NODES } from '../data/backendSemanticModel';
import type { NodeStatus } from '../services/RoadmapProgressStore';

export function syncRoleSkillsToProfile(
  roadmapId: string,
  nodeId: string,
  newStatus: NodeStatus,
  allStatuses: Record<string, NodeStatus>
) {
  const activeModel = roadmapId === 'backend' ? BACKEND_SEMANTIC_NODES : FRONTEND_SEMANTIC_NODES;
  const nodeMeta = getSemanticNode(nodeId, roadmapId);
  if (!nodeMeta) return;

  // Skipped topics must NOT be added to profile skills!
  if (newStatus === 'skipped') return;

  // 1. Direct Skill Handling
  if (nodeMeta.skillMapping?.type === 'direct' && nodeMeta.skillMapping.canonicalSkillId) {
    if (newStatus === 'done') {
      addOrUpdateProfileSkill(nodeMeta.skillMapping.canonicalSkillId, nodeId, roadmapId);
    } else if (newStatus === 'default') {
      removeOrUnverifyProfileSkill(nodeMeta.skillMapping.canonicalSkillId, nodeId, roadmapId);
    }
  }

  // 2. Parent Group Competency Check
  for (const [pId, pNode] of Object.entries(activeModel)) {
    if (
      pNode.kind === 'group' &&
      pNode.childNodeIds?.includes(nodeId) &&
      pNode.skillMapping?.type === 'group' &&
      pNode.skillMapping.canonicalSkillId
    ) {
      const children = pNode.childNodeIds;
      const allChildrenDone = children.length > 0 && children.every(cId => allStatuses[cId] === 'done');
      if (allChildrenDone) {
        addOrUpdateProfileSkill(pNode.skillMapping.canonicalSkillId, pId, roadmapId);
      } else {
        removeOrUnverifyProfileSkill(pNode.skillMapping.canonicalSkillId, pId, roadmapId);
      }
    }
  }
}

export function syncFrontendSkillsToProfile(
  nodeId: string,
  newStatus: NodeStatus,
  allStatuses: Record<string, NodeStatus>
) {
  syncRoleSkillsToProfile('frontend', nodeId, newStatus, allStatuses);
}

function addOrUpdateProfileSkill(skillName: string, nodeId: string, roadmapId: string = 'frontend') {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  try {
    const profileRaw = localStorage.getItem('cm_profile_draft') || localStorage.getItem('careerProfile');
    let profile = profileRaw ? JSON.parse(profileRaw) : { skills: [] };

    if (!Array.isArray(profile.skills)) {
      profile.skills = [];
    }

    const normName = skillName.trim().toLowerCase();
    const existingIndex = profile.skills.findIndex((s: any) => {
      const sName = typeof s === 'string' ? s : s.name;
      return sName && sName.trim().toLowerCase() === normName;
    });

    if (existingIndex >= 0) {
      // Update existing skill entry without creating duplicate!
      if (typeof profile.skills[existingIndex] === 'object') {
        profile.skills[existingIndex] = {
          ...profile.skills[existingIndex],
          source: profile.skills[existingIndex].source || 'roadmap',
          roadmapId,
          roadmapNodeId: nodeId,
          verified: true
        };
      }
    } else {
      // Add new skill entry
      profile.skills.push({
        id: normName,
        name: skillName,
        proficiency: 'intermediate',
        source: 'roadmap',
        roadmapId,
        roadmapNodeId: nodeId,
        verified: true
      });
    }

    localStorage.setItem('cm_profile_draft', JSON.stringify(profile));
    localStorage.setItem('careerProfile', JSON.stringify(profile));

    // Dispatch global events for live UI updates across components
    window.dispatchEvent(new CustomEvent('cm_skills_updated', { detail: { skillName } }));
    window.dispatchEvent(new Event('careerProfileUpdated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('[frontendSkillMapper] Error syncing skill to profile:', e);
  }
}

function removeOrUnverifyProfileSkill(skillName: string, _nodeId: string, _roadmapId: string = 'frontend') {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  try {
    const profileRaw = localStorage.getItem('cm_profile_draft') || localStorage.getItem('careerProfile');
    if (!profileRaw) return;
    let profile = JSON.parse(profileRaw);
    if (!Array.isArray(profile.skills)) return;

    const normName = skillName.trim().toLowerCase();
    const existingIndex = profile.skills.findIndex((s: any) => {
      const sName = typeof s === 'string' ? s : s.name;
      return sName && sName.trim().toLowerCase() === normName;
    });

    if (existingIndex >= 0) {
      const existingSkill = profile.skills[existingIndex];
      // Only remove if created exclusively from roadmap
      if (typeof existingSkill === 'object' && existingSkill.source === 'roadmap') {
        profile.skills.splice(existingIndex, 1);
        localStorage.setItem('cm_profile_draft', JSON.stringify(profile));
        localStorage.setItem('careerProfile', JSON.stringify(profile));

        window.dispatchEvent(new CustomEvent('cm_skills_updated', { detail: { skillName } }));
        window.dispatchEvent(new Event('careerProfileUpdated'));
        window.dispatchEvent(new Event('storage'));
      }
    }
  } catch (e) {
    console.error('[frontendSkillMapper] Error removing skill from profile:', e);
  }
}


