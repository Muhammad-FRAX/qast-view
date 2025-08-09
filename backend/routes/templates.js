const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const { v4: uuidv4 } = require('uuid');

// List all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.getAll();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get template by id
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.getById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create template
router.post('/', async (req, res) => {
  try {
    const { name, description, pages, createdAt, updatedAt, userId } = req.body;
    if (!name || !pages || !createdAt || !updatedAt) {
      return res.status(400).json({ error: 'Missing required fields for template creation.' });
    }
    const id = uuidv4();
    // Ensure pages is properly stringified when passing to create
    const template = { 
      id, 
      name, 
      description, 
      pages: Array.isArray(pages) ? pages : JSON.parse(pages), 
      createdAt, 
      updatedAt, 
      userId 
    };
    const created = await Template.create(template);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating template:', err);
    res.status(500).json({ error: err.message || 'Failed to create template.' });
  }
});

// Update template
router.put('/:id', async (req, res) => {
  try {
    await Template.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    await Template.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
