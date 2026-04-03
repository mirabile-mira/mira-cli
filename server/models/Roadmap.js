const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  category: String,
}, { _id: false });

const stepSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  resources: [resourceSchema],
  completed: { type: Boolean, default: false },
}, { _id: false });

const phaseSchema = new mongoose.Schema({
  name: String,
  steps: [stepSchema],
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  goal: { type: String, required: true },
  parsedInput: {
    role: String,
    company: String,
    domain: String,
  },
  phases: [phaseSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
