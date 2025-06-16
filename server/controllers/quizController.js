const db = require('../models/db');

exports.submitQuiz = async (req, res) => {
  const userId = req.user.userId;
  const { cleanliness, social_activities, work_habits, sleep_schedule } = req.body;

  try {
    const [existing] = await db.query(
      'SELECT * FROM roommateprofiles WHERE user_id = ?', 
      [userId]
    );

    if (existing.length > 0) {
      await db.query(`
        UPDATE roommateprofiles 
        SET cleanliness = ?, social_activities = ?, work_habits = ?, sleep_schedule = ? 
        WHERE user_id = ?
      `, [cleanliness, social_activities, work_habits, sleep_schedule, userId]);
    } else {
      await db.query(`
        INSERT INTO roommateprofiles (user_id, cleanliness, social_activities, work_habits, sleep_schedule)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, cleanliness, social_activities, work_habits, sleep_schedule]);
    }

    const averageScore = (cleanliness + social_activities + work_habits + sleep_schedule) / 4;

    let type = '';
    if (averageScore <= 1.75) type = 'Introverted & Structured';
    else if (averageScore <= 2.5) type = 'Balanced';
    else if (averageScore <= 3.25) type = 'Flexible';
    else type = 'Extroverted & Chill';

    res.status(200).json({
      message: 'Quiz submitted successfully.',
      averageScore,
      type
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: 'Failed to save quiz data.' });
  }
};
