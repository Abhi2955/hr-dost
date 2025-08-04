const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoService = require('./todoService');
const onboardingService = require('./onboardingService');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Onboarding Flow Endpoints
const FLOW_PATH = path.join(__dirname, 'onboardingFlow.json');
const USER_STATE_PATH = path.join(__dirname, 'onboardingUserStates.json');

// Fetch flow for an organisation
app.get('/api/orgs/:orgId/onboarding-flow', async (req, res) => {
  const { orgId } = req.params;
  try {
    const doc = await onboardingService.getFlow(orgId);
    if (doc) return res.json(doc.flow);
    const data = await fs.promises.readFile(FLOW_PATH, 'utf8');
    let flows = {};
    try { flows = JSON.parse(data); } catch {}
    const flow = flows[orgId] || null;
    if (flow) {
      await onboardingService.saveFlow(orgId, flow);
    }
    res.json(flow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load onboarding flow' });
  }
});

// Save flow for an organisation
app.post('/api/orgs/:orgId/onboarding-flow', async (req, res) => {
  const { orgId } = req.params;
  try {
    await onboardingService.saveFlow(orgId, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save onboarding flow' });
  }
});

// Onboarding User State Endpoints
app.get('/api/orgs/:orgId/onboarding-user-state/:userId', async (req, res) => {
  const { orgId, userId } = req.params;
  try {
    const doc = await onboardingService.getUserState(orgId, userId);
    if (doc) return res.json(doc.state);
    const data = await fs.promises.readFile(USER_STATE_PATH, 'utf8');
    let states = {};
    try { states = JSON.parse(data); } catch {}
    const state = states[orgId]?.[userId] || null;
    if (state) {
      await onboardingService.saveUserState(orgId, userId, state);
    }
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load user state' });
  }
});

app.post('/api/orgs/:orgId/onboarding-user-state/:userId', async (req, res) => {
  const { orgId, userId } = req.params;
  try {
    await onboardingService.saveUserState(orgId, userId, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save user state' });
  }
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
