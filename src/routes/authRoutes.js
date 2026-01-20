const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ error: "Usuario ya existe" });

    const user = await User.create({ name, email, password });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Credenciales incorrectas" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
