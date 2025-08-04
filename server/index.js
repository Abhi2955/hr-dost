const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoService = require('./todoService');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Onboarding Flow Endpoints
const FLOW_PATH = path.join(__dirname, 'onboardingFlow.json');
const USER_STATE_PATH = path.join(__dirname, 'onboardingUserStates.json');

app.get('/api/onboarding-flow', (req, res) => {
  fs.readFile(FLOW_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read onboarding flow' });
    res.json(JSON.parse(data));
  });
});

app.post('/api/onboarding-flow', (req, res) => {
  fs.writeFile(FLOW_PATH, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to save onboarding flow' });
    res.json({ success: true });
  });
});

// Onboarding User State Endpoints
app.get('/api/onboarding-user-state/:userId', (req, res) => {
  fs.readFile(USER_STATE_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read user states' });
    const states = JSON.parse(data);
    const userState = states[req.params.userId] || null;
    res.json(userState);
  });
});

app.post('/api/onboarding-user-state/:userId', (req, res) => {
  fs.readFile(USER_STATE_PATH, 'utf8', (err, data) => {
    let states = {};
    if (!err) {
      try { states = JSON.parse(data); } catch {}
    }
    states[req.params.userId] = req.body;
    fs.writeFile(USER_STATE_PATH, JSON.stringify(states, null, 2), err2 => {
      if (err2) return res.status(500).json({ error: 'Failed to save user state' });
      res.json({ success: true });
    });
  });
});

// Connect to local MongoDB
dbUrl = 'mongodb://127.0.0.1:27017/gottadoitnow';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get all items for a user
app.get('/api/items', async (req, res) => {
  try {
    const userId = req.query.userId || 'user1';
    const tag = req.query.tag;
    const items = await todoService.getItems(userId, tag);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new item
app.post('/api/items', async (req, res) => {
  try {
    const userId = req.body.userId || 'user1';
    console.log('POST /api/items body:', req.body);
    const item = await todoService.createItem({ ...req.body, userId });
    console.log('Saved item:', item);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const item = await todoService.updateItem(id, update);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await todoService.deleteItem(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment to item
app.post('/api/items/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const comment = req.body;
    const item = await todoService.addComment(id, comment);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 