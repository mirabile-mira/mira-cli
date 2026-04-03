import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserId } from '../utils/user';
import { roadmapApi } from '../api/roadmapApi';
import PhaseViewer from '../components/PhaseViewer';
import ProgressTracker from '../components/ProgressTracker';

function RoadmapPage() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    Promise.all([
      roadmapApi.getRoadmap(userId, id),
      roadmapApi.getProgress(id),
    ]).then(([r, p]) => {
      setRoadmap(r);
      setProgress(p);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleToggleStep = async (phaseIndex, stepIndex, completed) => {
    const updated = await roadmapApi.updateProgress(id, phaseIndex, stepIndex, completed);
    setProgress(updated);
  };

  if (loading) return <p>Loading roadmap...</p>;
  if (!roadmap) return <p>Roadmap not found.</p>;

  return (
    <div className="roadmap-page">
      <header>
        <Link to="/">&larr; Home</Link>
        <Link to="/history">History</Link>
      </header>
      <h1>{roadmap.goal}</h1>
      <ProgressTracker percentage={progress?.overallPercentage || 0} />
      <PhaseViewer
        phases={roadmap.phases}
        progress={progress?.completedSteps || []}
        roadmapId={roadmap._id}
        onToggleStep={handleToggleStep}
      />
    </div>
  );
}

export default RoadmapPage;
