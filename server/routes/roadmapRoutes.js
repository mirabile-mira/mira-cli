const express = require('express');
const { parseInput } = require('../services/inputParser');
const { generateRoadmap } = require('../services/roadmapGenerator');
const { enhanceResources } = require('../services/resourceRecommender');
const { enrichForCompany } = require('../services/companyIntelligence');
const Roadmap = require('../models/Roadmap');
const Progress = require('../models/Progress');

const router = express.Router();

// POST /api/roadmap/generate
router.post('/generate', async (req, res) => {
  try {
    const { goal, userId } = req.body;
    if (!goal || !userId) {
      return res.status(400).json({ error: 'goal and userId are required' });
    }

    const parsed = parseInput(goal);
    const aiResult = await generateRoadmap(parsed);
    const enhanced = enhanceResources(aiResult.phases);
    const companyEnriched = enrichForCompany(enhanced, parsed.company);

    const roadmap = await Roadmap.create({
      userId,
      goal,
      parsedInput: parsed,
      phases: companyEnriched,
    });

    await Progress.create({ roadmapId: roadmap._id, completedSteps: [] });

    res.status(201).json({
      roadmapId: roadmap._id,
      phases: companyEnriched,
    });
  } catch (err) {
    console.error('Roadmap generation error:', err.message, err.stack);
    res.status(500).json({ error: `Failed to generate roadmap: ${err.message}` });
  }
});

// GET /api/roadmap/:userId
router.get('/:userId', async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
});

// GET /api/roadmap/:userId/:roadmapId
router.get('/:userId/:roadmapId', async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.roadmapId,
      userId: req.params.userId,
    }).lean();
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

module.exports = router;
