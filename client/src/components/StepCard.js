import { useState } from 'react';
import ResourcePanel from './ResourcePanel';
import NotesSection from './NotesSection';

function StepCard({ step, completed, roadmapId, phaseIndex, stepIndex, onToggle }) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <li className={`step-card ${completed ? 'completed' : ''}`}>
      <div className="step-header">
        <label>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <h3>{step.title}</h3>
        </label>
        <span className="step-duration">{step.duration}</span>
      </div>
      <p className="step-description">{step.description}</p>

      <ResourcePanel resources={step.resources} />

      <button className="notes-toggle" onClick={() => setShowNotes(p => !p)}>
        {showNotes ? 'Hide Notes' : 'Add Notes'}
      </button>
      {showNotes && <NotesSection roadmapId={roadmapId} phaseIndex={phaseIndex} stepIndex={stepIndex} />}
    </li>
  );
}

export default StepCard;
