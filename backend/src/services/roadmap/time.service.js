const LEVEL_VALUES = {
  none: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4
};

// Effort in hours to move between consecutive proficiency levels
const LEVEL_TRANSITION_EFFORT = {
  'none-to-beginner': 10,
  'beginner-to-intermediate': 15,
  'intermediate-to-advanced': 25,
  'advanced-to-expert': 40
};

const PRIORITY_ORDER = {
  'CRITICAL': 1,
  'HIGH': 2,
  'MEDIUM': 3,
  'LOW': 4
};

/**
 * Calculates effort required in hours to bridge a specific level gap.
 */
const calculateEffortHours = (currentLevel, requiredLevel) => {
  const currentVal = LEVEL_VALUES[currentLevel] || 0;
  const requiredVal = LEVEL_VALUES[requiredLevel] || 0;
  
  if (currentVal >= requiredVal) return 0;

  let totalHours = 0;
  const levels = ['none', 'beginner', 'intermediate', 'advanced', 'expert'];
  
  for (let i = currentVal; i < requiredVal; i++) {
    const from = levels[i];
    const to = levels[i + 1];
    const key = `${from}-to-${to}`;
    totalHours += LEVEL_TRANSITION_EFFORT[key] || 10;
  }
  
  return totalHours;
};

/**
 * Calculates days remaining, total available preparation hours, and scope boundary.
 * Trims out-of-scope skill gaps if the available time is insufficient.
 */
export const calculateTimePlanning = (params) => {
  const {
    currentDate = new Date(),
    interviewDate,
    deadlineDate,
    hoursPerWeek = 10,
    prioritizedGaps = []
  } = params;

  // Determine target date
  let targetDate = null;
  if (interviewDate) {
    targetDate = new Date(interviewDate);
  } else if (deadlineDate) {
    targetDate = new Date(deadlineDate);
  }

  let daysRemaining = 84; // Default to 12 weeks prep if no dates are provided
  let hasTargetDate = false;

  if (targetDate) {
    const diffMs = targetDate.getTime() - new Date(currentDate).getTime();
    daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    hasTargetDate = true;
  }

  // Calculate available study hours
  const weeksRemaining = daysRemaining / 7;
  const availableHours = Math.round(weeksRemaining * hoursPerWeek);

  // Sort gaps by priority order first, then by role relevance descending
  const sortedGaps = prioritizedGaps.slice().sort((a, b) => {
    const pA = PRIORITY_ORDER[a.priority] || 4;
    const pB = PRIORITY_ORDER[b.priority] || 4;
    if (pA !== pB) return pA - pB;
    return (b.roleRelevance || 0) - (a.roleRelevance || 0);
  });

  let accumulatedHours = 0;
  const inScope = [];
  const outOfScope = [];
  let timeSprintWarning = false;

  sortedGaps.forEach(g => {
    const effort = calculateEffortHours(g.currentLevel, g.requiredLevel);
    g.estimatedHours = effort;

    if (!g.gap) {
      inScope.push(g);
      return;
    }

    if (accumulatedHours + effort <= availableHours) {
      accumulatedHours += effort;
      g.inScope = true;
      inScope.push(g);
    } else {
      g.inScope = false;
      outOfScope.push(g);
      if (g.priority === 'CRITICAL' || g.priority === 'HIGH') {
        timeSprintWarning = true;
      }
    }
  });

  // Calculate planning mode based on days remaining
  let planningMode = 'NORMAL';
  if (hasTargetDate) {
    if (daysRemaining < 3) {
      planningMode = 'FINAL_REVIEW';
    } else if (daysRemaining < 14) {
      planningMode = 'INTERVIEW_SPRINT';
    }
  }

  return {
    daysRemaining,
    availableHours,
    totalRequiredHours: accumulatedHours,
    inScopeSkills: inScope,
    outOfScopeSkills: outOfScope,
    timeSprintWarning,
    planningMode
  };
};
