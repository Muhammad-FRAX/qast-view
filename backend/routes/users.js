const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Register new user (admin only)
router.post('/', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) return res.status(400).json({ error: 'Missing fields' });
    const id = uuidv4();
    const user = await User.create({ id, username, password, role, requiresPasswordChange: true });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.getByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await User.checkPassword(user, password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user (admin only)
router.put('/:id', async (req, res) => {
  try {
    await User.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change password (self or admin)
router.post('/:id/change-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    await User.updatePassword(req.params.id, newPassword);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
