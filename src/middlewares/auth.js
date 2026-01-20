const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendError } = require('../utils/responseHelper');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return sendError(res, 'No token provided', 401, 'NO_TOKEN');
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return sendError(res, 'Usuario no encontrado', 404, 'USER_NOT_FOUND');
    req.user = user;
    return next();
  } catch (error) {
    return sendError(res, 'Token inválido o expirado', 401, 'INVALID_TOKEN');
  }
}

module.exports = authMiddleware;

