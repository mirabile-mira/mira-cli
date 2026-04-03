import { useState } from 'react';
import StepCard from './StepCard';

function PhaseViewer({ phases, progress, roadmapId, onToggleStep }) {
  const [expandedPhases, setExpandedPhases] = useState(new Set([0]));

  const togglePhase = (index) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const isCompleted = (pi, si) =>
    progress.some(s => s.phaseIndex === pi && s.stepIndex === si);

  return (
    <div className="phase-viewer">
      {phases.map((phase, i) => (
        <div key={i} className={`phase ${expandedPhases.has(i) ? 'expanded' : ''}`}>
          <button onClick={() => togglePhase(i)} className="phase-header">
            <h2>{phase.name}</h2>
            <span className="step-count">{phase.steps.length} steps</span>
          </button>
          {expandedPhases.has(i) && (
            <ul className="steps-list">
              {phase.steps.map((step, j) => (
                <StepCard
                  key={j}
                  step={step}
                  completed={isCompleted(i, j)}
                  roadmapId={roadmapId}
                  phaseIndex={i}
                  stepIndex={j}
                  onToggle={(checked) => onToggleStep(i, j, checked)}
                />
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default PhaseViewer;
