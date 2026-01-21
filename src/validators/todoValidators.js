const { check, param } = require('express-validator');

const createTodoValidator = [
  check('title').trim().notEmpty().withMessage('El título es requerido'),
];

const idParamValidator = [
  param('id').isMongoId().withMessage('Id inválido'),
];

module.exports = { createTodoValidator, idParamValidator };

