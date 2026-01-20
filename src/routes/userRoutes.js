const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

