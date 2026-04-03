const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true, unique: true },
  completedSteps: [{
    phaseIndex: Number,
    stepIndex: Number,
  }],
  overallPercentage: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Progress', progressSchema);
