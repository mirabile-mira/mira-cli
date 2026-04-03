const express = require('express');
const Progress = require('../models/Progress');
const Roadmap = require('../models/Roadmap');
const { calculateProgress } = require('../services/progressCalculator');

const router = express.Router();

// PUT /api/progress
router.put('/', async (req, res) => {
  try {
    const { roadmapId, phaseIndex, stepIndex, completed } = req.body;
    if (!roadmapId || phaseIndex == null || stepIndex == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let progress = await Progress.findOne({ roadmapId });
    if (!progress) {
      return res.status(404).json({ error: 'Progress record not found' });
    }

    const key = `${phaseIndex}-${stepIndex}`;
    const existing = progress.completedSteps.find(
      s => `${s.phaseIndex}-${s.stepIndex}` === key
    );

    if (completed && !existing) {
      progress.completedSteps.push({ phaseIndex, stepIndex });
    } else if (!completed && existing) {
      progress.completedSteps = progress.completedSteps.filter(
        s => `${s.phaseIndex}-${s.stepIndex}` !== key
      );
    }

    const roadmap = await Roadmap.findById(roadmapId);
    progress.overallPercentage = calculateProgress(roadmap.phases, progress.completedSteps);
    progress.updatedAt = new Date();

    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// GET /api/progress/:roadmapId
router.get('/:roadmapId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ roadmapId: req.params.roadmapId }).lean();
    res.json(progress || { completedSteps: [], overallPercentage: 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;
