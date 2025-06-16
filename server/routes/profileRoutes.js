const { getProfilesForSwiping, saveMatch, getMessages, sendMessage, unmatch } = require('../controllers/profilesController');
const router = require('express').Router();
const { authenticateToken } = require('../middleware/authMiddleware');


router.get('/swipe', authenticateToken, getProfilesForSwiping);

router.post('/swipe', authenticateToken, saveMatch);

router.get('/chat/:matchId', authenticateToken, getMessages);

router.post('/chat/:matchId', authenticateToken, sendMessage);

router.post("/unmatch", authenticateToken, unmatch);


module.exports = router;
