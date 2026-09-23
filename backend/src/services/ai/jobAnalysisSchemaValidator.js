import { getNormalizedSkillName } from '../../utils/skillNormalizer.js';

/**
 * Validates and sanitizes the raw JSON returned by AI for Job Analysis.
 * Ensures strict schema compliance, canonical skill normalization, edge validity, and safety.
 */
export const validateAndSanitizeJobAnalysis = (rawObj) => {
  if (!rawObj || typeof rawObj !== 'object') {
    throw new Error('AI output is not a valid JSON object.');
  }

  const job = {
    title: String(rawObj.job?.title || 'Target Job').trim(),
    company: String(rawObj.job?.company || 'Target Company').trim(),
    seniority: String(rawObj.job?.seniority || 'Unspecified').trim(),
    employmentType: String(rawObj.job?.employmentType || 'Full-time').trim(),
    location: String(rawObj.job?.location || 'Remote').trim()
  };

  const VALID_IMPORTANCE = ['critical', 'required', 'preferred', 'nice-to-have'];
  const VALID_SOURCES = ['job-description', 'inferred'];
  const VALID_CATEGORIES = [
    'REQUIRED', 'PREFERRED', 'NICE_TO_HAVE', 'RESPONSIBILITY',
    'DOMAIN_KNOWLEDGE', 'SOFT_SKILL', 'EDUCATION', 'EXPERIENCE', 'CERTIFICATION'
  ];

  const rawRequirements = Array.isArray(rawObj.requirements) ? rawObj.requirements : [];
  const reqIdSet = new Set();

  const requirements = rawRequirements
    .map((r, index) => {
      const name = String(r.name || r.title || '').trim();
      if (!name) return null;

      const norm = getNormalizedSkillName(name) || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const importance = VALID_IMPORTANCE.includes(r.importance?.toLowerCase()) ? r.importance.toLowerCase() : 'required';
      const source = VALID_SOURCES.includes(r.source?.toLowerCase()) ? r.source.toLowerCase() : 'job-description';
      const category = VALID_CATEGORIES.includes(r.category?.toUpperCase()) ? r.category.toUpperCase() : 'REQUIRED';

      const id = String(r.id || `req-${index + 1}`).trim();
      reqIdSet.add(id);

      return {
        id,
        name,
        canonicalSkillId: norm,
        category,
        importance,
        evidence: String(r.evidence || '').trim(),
        source,
        reason: source === 'inferred' ? String(r.reason || 'Implied by core responsibilities').trim() : '',
        confidence: typeof r.confidence === 'number' ? Math.max(0, Math.min(1, r.confidence)) : undefined
      };
    })
    .filter(Boolean);

  const skills = Array.from(
    new Set((Array.isArray(rawObj.skills) ? rawObj.skills : []).map(s => String(s).trim()).filter(Boolean))
  );

  const concepts = Array.from(
    new Set((Array.isArray(rawObj.concepts) ? rawObj.concepts : []).map(c => String(c).trim()).filter(Boolean))
  );

  const responsibilities = (Array.isArray(rawObj.responsibilities) ? rawObj.responsibilities : [])
    .map(r => String(r).trim()).filter(Boolean);

  const domainKnowledge = (Array.isArray(rawObj.domainKnowledge) ? rawObj.domainKnowledge : [])
    .map(d => String(d).trim()).filter(Boolean);

  const softSkills = (Array.isArray(rawObj.softSkills) ? rawObj.softSkills : [])
    .map(s => String(s).trim()).filter(Boolean);

  const experienceRequirements = (Array.isArray(rawObj.experienceRequirements) ? rawObj.experienceRequirements : [])
    .map(e => String(e).trim()).filter(Boolean);

  const educationRequirements = (Array.isArray(rawObj.educationRequirements) ? rawObj.educationRequirements : [])
    .map(e => String(e).trim()).filter(Boolean);

  const certifications = (Array.isArray(rawObj.certifications) ? rawObj.certifications : [])
    .map(c => String(c).trim()).filter(Boolean);

  const interviewAreas = (Array.isArray(rawObj.interviewAreas) ? rawObj.interviewAreas : [])
    .map((int, i) => ({
      id: String(int.id || `int-${i + 1}`).trim(),
      area: String(int.area || int.topic || 'General Technical').trim(),
      relatedRequirements: Array.isArray(int.relatedRequirements) ? int.relatedRequirements.filter(id => reqIdSet.has(id)) : [],
      importance: String(int.importance || 'medium').trim()
    }));

  const rawNodes = Array.isArray(rawObj.roadmapPlan) ? rawObj.roadmapPlan : [];
  const validNodeTypes = ['skill', 'technology', 'concept', 'revision', 'interview', 'project', 'assessment', 'group'];
  const nodeIdSet = new Set();

  const roadmapPlan = rawNodes
    .map((n, i) => {
      const title = String(n.title || n.name || '').trim();
      if (!title) return null;

      const id = String(n.id || `node-${i + 1}`).trim();
      nodeIdSet.add(id);

      const type = validNodeTypes.includes(n.type?.toLowerCase()) ? n.type.toLowerCase() : 'technology';
      const importance = VALID_IMPORTANCE.includes(n.importance?.toLowerCase()) ? n.importance.toLowerCase() : 'required';
      const canonicalSkillId = getNormalizedSkillName(title) || (n.canonicalSkillId ? String(n.canonicalSkillId).trim() : title.toLowerCase().replace(/[^a-z0-9]/g, '-'));

      // Progress eligibility: Structural groups do NOT double count!
      const progressEligible = type !== 'group';

      return {
        id,
        title,
        description: String(n.description || '').trim(),
        category: String(n.category || 'Core Preparation').trim(),
        type,
        importance,
        canonicalSkillId,
        estimatedMinutes: typeof n.estimatedMinutes === 'number' ? Math.max(10, n.estimatedMinutes) : 120,
        whyRequired: String(n.whyRequired || `Required for ${job.title} role.`).trim(),
        jobEvidence: String(n.jobEvidence || `Explicitly listed in job description.`).trim(),
        preparationGoal: String(n.preparationGoal || `Master ${title} for practical engineering duties.`).trim(),
        resources: Array.isArray(n.resources) ? n.resources.map(r => typeof r === 'string' ? { title: r, url: '' } : r) : [],
        interviewRelevance: String(n.interviewRelevance || 'high').trim(),
        prerequisites: Array.isArray(n.prerequisites) ? n.prerequisites.map(p => String(p).trim()) : [],
        completionMode: String(n.completionMode || 'all').trim() === 'choose-one' ? 'choose-one' : 'all',
        progressEligible,
        status: 'default'
      };
    })
    .filter(Boolean);

  // Validate Edges: both `from` and `to` nodes MUST exist!
  const rawEdges = Array.isArray(rawObj.edges) ? rawObj.edges : [];
  const validRelationTypes = ['main-flow', 'prerequisite', 'child', 'alternative', 'related'];

  const edges = rawEdges
    .map((e, i) => {
      const from = String(e.from || e.source || '').trim();
      const to = String(e.to || e.target || '').trim();
      if (!from || !to || !nodeIdSet.has(from) || !nodeIdSet.has(to) || from === to) {
        return null;
      }
      const relationType = validRelationTypes.includes(e.relationType?.toLowerCase()) ? e.relationType.toLowerCase() : 'prerequisite';
      return {
        id: String(e.id || `edge-${i + 1}`).trim(),
        from,
        to,
        relationType
      };
    })
    .filter(Boolean);

  return {
    job,
    requirements,
    skills,
    concepts,
    responsibilities,
    domainKnowledge,
    softSkills,
    experienceRequirements,
    educationRequirements,
    certifications,
    interviewAreas,
    roadmapPlan,
    edges
  };
};
