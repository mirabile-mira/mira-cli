require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const roadmapRoutes = require('./routes/roadmapRoutes');
const noteRoutes = require('./routes/noteRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/roadmap', roadmapRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
