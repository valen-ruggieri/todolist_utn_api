const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.profile);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;