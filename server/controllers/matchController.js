const db = require('../models/db');

exports.getMatches = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [matches] = await db.query(
      `SELECT 
         u.id, u.username
       FROM matches m
       JOIN users u ON u.id = m.matched_user_id
       WHERE m.user_id = ? AND m.status = 'matched'
       UNION
       SELECT 
         u.id, u.username
       FROM matches m
       JOIN users u ON u.id = m.user_id
       WHERE m.matched_user_id = ? AND m.status = 'matched'`,
      [userId, userId]
    );

    res.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Error fetching matches' });
  }
};
