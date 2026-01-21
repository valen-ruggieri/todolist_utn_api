const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');
const { registerValidator, loginValidator, changePasswordValidator } = require('../validators/authValidators');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/profile', authMiddleware, authController.profile);
router.put('/change-password', authMiddleware, changePasswordValidator, validate, authController.changePassword);

module.exports = router;