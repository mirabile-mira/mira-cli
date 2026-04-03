import { useState, useEffect } from 'react';
import { roadmapApi } from '../api/roadmapApi';

function NotesSection({ roadmapId, phaseIndex, stepIndex }) {
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    roadmapApi.getNotes(roadmapId).then(notes => {
      const found = notes.find(
        n => n.phaseIndex === phaseIndex && n.stepIndex === stepIndex
      );
      if (found) setSavedNote(found);
    });
  }, [roadmapId, phaseIndex, stepIndex]);

  const handleSave = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      const saved = await roadmapApi.saveNote(roadmapId, phaseIndex, stepIndex, note);
      setSavedNote(saved);
      setNote('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="notes-section">
      {savedNote && (
        <div className="saved-note">
          <p>{savedNote.content}</p>
          <small>Updated: {new Date(savedNote.updatedAt).toLocaleString()}</small>
        </div>
      )}
      <textarea
        placeholder="Add a note about this step..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />
      <button onClick={handleSave} disabled={saving || !note.trim()}>
        {saving ? 'Saving...' : 'Save Note'}
      </button>
    </div>
  );
}

export default NotesSection;
