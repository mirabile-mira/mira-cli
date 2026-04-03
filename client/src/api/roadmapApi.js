const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const roadmapApi = {
  generateRoadmap(goal, userId) {
    return request('/api/roadmap/generate', {
      method: 'POST',
      body: JSON.stringify({ goal, userId }),
    });
  },

  getUserRoadmaps(userId) {
    return request(`/api/roadmap/${userId}`);
  },

  getRoadmap(userId, roadmapId) {
    return request(`/api/roadmap/${userId}/${roadmapId}`);
  },

  saveNote(roadmapId, phaseIndex, stepIndex, content) {
    return request('/api/notes', {
      method: 'POST',
      body: JSON.stringify({ roadmapId, phaseIndex, stepIndex, content }),
    });
  },

  getNotes(roadmapId) {
    return request(`/api/notes/${roadmapId}`);
  },

  updateProgress(roadmapId, phaseIndex, stepIndex, completed) {
    return request('/api/progress', {
      method: 'PUT',
      body: JSON.stringify({ roadmapId, phaseIndex, stepIndex, completed }),
    });
  },

  getProgress(roadmapId) {
    return request(`/api/progress/${roadmapId}`);
  },
};
