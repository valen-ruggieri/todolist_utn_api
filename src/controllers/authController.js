const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendSuccess, sendError } = require('../utils/responseHelper');

function validatePassword(password) {
  const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return re.test(password);
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!password || !validatePassword(password)) {
      return sendError(
        res,
        'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial',
        422,
        'WEAK_PASSWORD'
      );
    }

    const existe = await User.findOne({ email });
    if (existe) return sendError(res, 'Usuario ya existe', 409, 'USER_ALREADY_EXISTS');

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.location(`/api/users/${user._id}`);
    return sendSuccess(res, { token, user: { id: user._id, name: user.name, email: user.email } }, 201);
  } catch (error) {
    return sendError(res, error.message, 500, 'INTERNAL_ERROR');
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 'Credenciales incorrectas', 401, 'INVALID_CREDENTIALS');

    const match = await user.matchPassword(password);
    if (!match) return sendError(res, 'Credenciales incorrectas', 401, 'INVALID_CREDENTIALS');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return sendSuccess(res, { token, user: { id: user._id, name: user.name, email: user.email } }, 200);
  } catch (error) {
    return sendError(res, error.message, 500, 'INTERNAL_ERROR');
  }
}

async function profile(req, res) {
  try {
    return sendSuccess(res, req.user, 200);
  } catch (error) {
    return sendError(res, error.message, 500, 'INTERNAL_ERROR');
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return sendError(res, 'Faltan campos', 400, 'MISSING_FIELDS');
    if (!validatePassword(newPassword)) {
      return sendError(
        res,
        'La nueva contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial',
        422,
        'WEAK_PASSWORD'
      );
    }

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 'Usuario no encontrado', 404, 'USER_NOT_FOUND');

    const match = await user.matchPassword(currentPassword);
    if (!match) return sendError(res, 'Contraseña actual incorrecta', 401, 'INVALID_CREDENTIALS');

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, { message: 'Contraseña actualizada correctamente' }, 200);
  } catch (error) {
    return sendError(res, error.message, 500, 'INTERNAL_ERROR');
  }
}

module.exports = { register, login, profile, changePassword };

