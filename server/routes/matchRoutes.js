const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getMatches } = require('../controllers/matchController'); 

router.get('/matches', authenticateToken, getMatches);

module.exports = router;
