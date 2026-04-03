function calculateProgress(phases, completedSteps) {
  let totalSteps = 0;
  const completedSet = new Set(
    completedSteps.map(s => `${s.phaseIndex}-${s.stepIndex}`)
  );
  let completedCount = 0;

  phases.forEach((phase, pi) => {
    phase.steps.forEach((step, si) => {
      totalSteps++;
      if (completedSet.has(`${pi}-${si}`)) completedCount++;
    });
  });

  return totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
}

module.exports = { calculateProgress };
