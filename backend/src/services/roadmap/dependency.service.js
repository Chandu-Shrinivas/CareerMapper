import SkillDependency from '../../models/skillDependency.model.js';
import mongoose from 'mongoose';

/**
 * Feeds seed prerequisites into the database for cold start domain coverage
 */
export const seedPrerequisites = async () => {
  if (mongoose.connection.readyState !== 1) return;

  const seedDeps = [
    // Software Engineering
    { skillId: 'react', prerequisiteSkillId: 'javascript', relationshipType: 'requires' },
    { skillId: 'typescript', prerequisiteSkillId: 'javascript', relationshipType: 'requires' },
    { skillId: 'javascript', prerequisiteSkillId: 'html', relationshipType: 'requires' },
    { skillId: 'javascript', prerequisiteSkillId: 'css', relationshipType: 'requires' },
    { skillId: 'node', prerequisiteSkillId: 'javascript', relationshipType: 'requires' },
    { skillId: 'express', prerequisiteSkillId: 'node', relationshipType: 'requires' },
    { skillId: 'docker', prerequisiteSkillId: 'linux', relationshipType: 'requires' },
    { skillId: 'kubernetes', prerequisiteSkillId: 'docker', relationshipType: 'requires' },

    // Data Science / AI
    { skillId: 'machine learning', prerequisiteSkillId: 'python', relationshipType: 'requires' },
    { skillId: 'machine learning', prerequisiteSkillId: 'statistics', relationshipType: 'requires' },
    { skillId: 'deep learning', prerequisiteSkillId: 'machine learning', relationshipType: 'requires' },
    { skillId: 'tensorflow', prerequisiteSkillId: 'python', relationshipType: 'requires' },
    { skillId: 'pytorch', prerequisiteSkillId: 'python', relationshipType: 'requires' },

    // Mechanical Engineering
    { skillId: 'solidworks', prerequisiteSkillId: 'cad', relationshipType: 'requires' },
    { skillId: 'autocad', prerequisiteSkillId: 'cad', relationshipType: 'requires' },
    { skillId: 'gd&t', prerequisiteSkillId: 'cad', relationshipType: 'requires' },
    { skillId: 'fea', prerequisiteSkillId: 'solidworks', relationshipType: 'requires' },

    // Civil Engineering
    { skillId: 'structural design', prerequisiteSkillId: 'autocad', relationshipType: 'requires' },

    // Finance / Business
    { skillId: 'financial modeling', prerequisiteSkillId: 'financial analysis', relationshipType: 'requires' },
    { skillId: 'financial modeling', prerequisiteSkillId: 'excel', relationshipType: 'requires' }
  ];

  try {
    for (const dep of seedDeps) {
      await SkillDependency.findOneAndUpdate(
        { skillId: dep.skillId, prerequisiteSkillId: dep.prerequisiteSkillId },
        { ...dep, validated: true },
        { upsert: true }
      );
    }
    console.log('[DEPENDENCY] Completed seeding default skill prerequisites.');
  } catch (err) {
    console.warn('[WARNING] Failed to seed default skill prerequisites:', err.message);
  }
};

/**
 * Returns all prerequisites for a specific skill from database
 */
export const getPrerequisitesForSkill = async (skillId) => {
  if (mongoose.connection.readyState !== 1) return [];
  try {
    const list = await SkillDependency.find({ skillId });
    return list.map(d => d.prerequisiteSkillId);
  } catch {
    return [];
  }
};

/**
 * Sorts an array of skill gap items topologically so that prerequisites are learned first.
 * Graph nodes represent the skills that must be learned.
 */
export const topologicalSortSkills = async (skillGaps) => {
  const skillsToLearn = skillGaps.filter(g => g.gap);
  const skillIds = new Set(skillsToLearn.map(g => g.skill.canonicalId));

  // Build dependency mappings
  const adjList = {};
  const inDegree = {};

  // Initialize
  skillIds.forEach(id => {
    adjList[id] = [];
    inDegree[id] = 0;
  });

  // Fetch all dependencies between our subset of skills
  if (mongoose.connection.readyState === 1) {
    try {
      const deps = await SkillDependency.find({
        skillId: { $in: Array.from(skillIds) },
        prerequisiteSkillId: { $in: Array.from(skillIds) }
      });

      deps.forEach(dep => {
        const u = dep.prerequisiteSkillId; // prereq must be learned first
        const v = dep.skillId;
        
        adjList[u].push(v);
        inDegree[v] = (inDegree[v] || 0) + 1;
      });
    } catch (err) {
      console.warn('[WARNING] Failed to fetch skill dependencies for topological sort:', err.message);
    }
  }

  // Kahn's algorithm topological sort
  const queue = [];
  skillIds.forEach(id => {
    if (inDegree[id] === 0) {
      queue.push(id);
    }
  });

  const sortedIds = [];
  while (queue.length > 0) {
    const curr = queue.shift();
    sortedIds.push(curr);

    const neighbors = adjList[curr] || [];
    neighbors.forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }

  // Handle cycles or missing items (safety check)
  const remainingIds = Array.from(skillIds).filter(id => !sortedIds.includes(id));
  sortedIds.push(...remainingIds);

  // Map sorted IDs back to original skill gap objects
  const gapMap = {};
  skillsToLearn.forEach(g => {
    gapMap[g.skill.canonicalId] = g;
  });

  const sortedGaps = sortedIds.map(id => gapMap[id]).filter(Boolean);
  const nonGaps = skillGaps.filter(g => !g.gap);

  return [...sortedGaps, ...nonGaps];
};
