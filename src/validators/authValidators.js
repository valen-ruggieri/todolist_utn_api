const { check } = require('express-validator');

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const registerValidator = [
  check('name').trim().notEmpty().withMessage('El nombre es requerido'),
  check('email').isEmail().withMessage('Email inválido'),
  check('password')
    .matches(passwordRegex)
    .withMessage('La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial'),
];

const loginValidator = [
  check('email').isEmail().withMessage('Email inválido'),
  check('password').notEmpty().withMessage('La contraseña es requerida'),
];

const changePasswordValidator = [
  check('currentPassword').notEmpty().withMessage('currentPassword es requerido'),
  check('newPassword')
    .matches(passwordRegex)
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial'),
];

module.exports = { registerValidator, loginValidator, changePasswordValidator };

