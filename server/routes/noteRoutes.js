const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// POST /api/notes
router.post('/', async (req, res) => {
  try {
    const { roadmapId, phaseIndex, stepIndex, content } = req.body;
    if (!roadmapId || phaseIndex == null || stepIndex == null || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const note = await Note.findOneAndUpdate(
      { roadmapId, phaseIndex, stepIndex },
      { content, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// GET /api/notes/:roadmapId
router.get('/:roadmapId', async (req, res) => {
  try {
    const notes = await Note.find({ roadmapId: req.params.roadmapId }).lean();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

module.exports = router;
