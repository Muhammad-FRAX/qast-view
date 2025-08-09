const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { v4: uuidv4 } = require('uuid');

// List all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.getAll();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get report by id
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.getById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create report
router.post('/', async (req, res) => {
  try {
    const { templateId, name, data, createdAt, author, department } = req.body;
    if (!templateId || !name || !data || !createdAt || !author || !department) {
      return res.status(400).json({ error: 'Missing required fields for report creation.' });
    }
    const id = uuidv4();
    // Ensure data is properly handled
    const report = { 
      id, 
      templateId, 
      name, 
      data: typeof data === 'string' ? JSON.parse(data) : data,
      createdAt, 
      author, 
      department 
    };
    const created = await Report.create(report);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: err.message || 'Failed to create report.' });
  }
});

// Update report
router.put('/:id', async (req, res) => {
  try {
    await Report.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    await Report.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
