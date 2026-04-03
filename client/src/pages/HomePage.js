import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/user';
import { roadmapApi } from '../api/roadmapApi';

function HomePage() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setLoading(true);
    setError('');
    try {
      const userId = getUserId();
      const result = await roadmapApi.generateRoadmap(goal.trim(), userId);
      navigate(`/roadmap/${result.roadmapId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <header>
        <h1>Mirabile</h1>
        <p>Describe your dream career, and we&apos;ll build your roadmap.</p>
      </header>

      <form onSubmit={handleSubmit} className="career-input-form">
        <input
          type="text"
          placeholder='e.g. "Software Engineer at Google"'
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="career-input"
        />
        <button type="submit" disabled={loading || !goal.trim()}>
          {loading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default HomePage;
