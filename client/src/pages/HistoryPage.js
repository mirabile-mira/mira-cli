import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserId } from '../utils/user';
import { roadmapApi } from '../api/roadmapApi';

function HistoryPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    roadmapApi.getUserRoadmaps(userId)
      .then(setRoadmaps)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="history-page">
      <header>
        <h1>Your Roadmaps</h1>
        <Link to="/">+ New Roadmap</Link>
      </header>
      {roadmaps.length === 0 ? (
        <p>No roadmaps yet. Create one from the home page.</p>
      ) : (
        <ul className="roadmap-list">
          {roadmaps.map(r => (
            <li key={r._id}>
              <Link to={`/roadmap/${r._id}`}>
                <strong>{r.goal}</strong>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistoryPage;
