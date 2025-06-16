const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/register', register);

router.post('/login', login);

router.get('/user', authenticateToken, getCurrentUser);

module.exports = router;
