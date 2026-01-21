const { validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHelper');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().reduce((acc, err) => {
      acc[err.param] = err.msg;
      return acc;
    }, {});
    return sendError(res, 'Validación fallida', 422, 'VALIDATION_ERROR', details);
  }
  return next();
}

module.exports = validate;

