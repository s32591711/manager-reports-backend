const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Схема звіту
const reportSchema = new mongoose.Schema({
  managerName: String,
  region: String,
  reportText: String,
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

// API для створення звіту
app.post('/api/reports', async (req, res) => {
  try {
    const { managerName, region, reportText } = req.body;
    const report = new Report({ managerName, region, reportText });
    await report.save();
    res.status(201).json({ message: 'Report saved successfully', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// API для отримання всіх звітів
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));