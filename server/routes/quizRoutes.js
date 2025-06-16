const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { submitQuiz } = require('../controllers/quizController');
const router = express.Router();

router.post('/submit', authenticateToken, submitQuiz);

module.exports = router;
