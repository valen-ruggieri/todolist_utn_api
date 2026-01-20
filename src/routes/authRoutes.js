const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existe = await User.findOne({ email });
    if (existe) return sendError(res, 'Usuario ya existe', 409, 'USER_ALREADY_EXISTS');

    const user = await User.create({ name, email, password });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.location(`/api/users/${user._id}`);
    return sendSuccess(res, { token, user: { id: user._id, name: user.name, email: user.email } }, 201);
  } catch (error) {
    return sendError(res, error.message, 500, 'INTERNAL_ERROR');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return sendError(res, 'Credenciales incorrectas', 401, 'INVALID_CREDENTIALS');

    const match = await user.matchPassword(password);
    if (!match) return sendError(res, 'Credenciales incorrectas', 401, 'INVALID_CREDENTIALS');

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return sendSuccess(res, { token, user: { id: user._id, name: user.name, email: user.email } }, 200);
  } catch (error) {
    return sendError(res, error.message, 500, 'INTERNAL_ERROR');
  }
});

module.exports = router;
