function ProgressTracker({ percentage }) {
  return (
    <div className="progress-tracker">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="progress-text">{percentage}% complete</span>
    </div>
  );
}

export default ProgressTracker;
