const db = require("../models/db");

exports.getProfilesForSwiping = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get current user's profile
    const [userRows] = await db.query(
      "SELECT * FROM roommateprofiles WHERE user_id = ?",
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(400).json({ error: "User profile not found." });
    }

    const userProfile = userRows[0];
    const userAvg =
      (userProfile.cleanliness +
        userProfile.social_activities +
        userProfile.work_habits +
        userProfile.sleep_schedule) / 4;

    // Get all other profiles with username
    const [otherProfiles] = await db.query(
      `SELECT rp.*, u.username 
       FROM roommateprofiles rp 
       JOIN users u ON rp.user_id = u.id 
       WHERE rp.user_id != ?`,
      [userId]
    );

    // Calculate compatibility based on average score difference
    const scoredProfiles = otherProfiles.map((profile) => {
      const profileAvg =
        (profile.cleanliness +
          profile.social_activities +
          profile.work_habits +
          profile.sleep_schedule) / 4;
      const compatibilityScore = Math.abs(profileAvg - userAvg); // lower = more compatible

      const compatibilityPercent = Math.round(
        (1 - compatibilityScore / 3) * 100
      );

      return {
        ...profile,
        compatibilityScore: compatibilityScore.toFixed(2),
        compatibilityPercent,
      };
    });

    // Sort by compatibility score
    scoredProfiles.sort((a, b) => a.compatibilityScore - b.compatibilityScore);

    res.status(200).json({ profiles: scoredProfiles });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Failed to fetch profiles." });
  }
};


exports.saveMatch = async (req, res) => {
  const { likedUserId } = req.body; 
  console.log("Received likedUserId:", likedUserId);
  const userId = req.user.userId;
  console.log(userId); 

  try {
    const [receiverExists] = await db.query(
      "SELECT id FROM users WHERE id = ?",
      [likedUserId]
    );

    if (receiverExists.length === 0) {
      return res.status(400).json({ error: "Receiver user does not exist" });
    }

    const [existingMatch] = await db.query(
      "SELECT * FROM matches WHERE (user_id = ? AND matched_user_id = ?) OR (user_id = ? AND matched_user_id = ?)",
      [userId, likedUserId, likedUserId, userId]
    );

    if (existingMatch.length > 0) {
      await db.query(
        "UPDATE matches SET status = ? WHERE user_id = ? AND matched_user_id = ?",
        ["matched", userId, likedUserId]
      );
      res.json({ message: "Match confirmed!" });

      await db.query(
        "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
        [userId, likedUserId, "You are now matched! Start chatting!"]
      );
    } else {
      await db.query(
        "INSERT INTO matches (user_id, matched_user_id, status) VALUES (?, ?, ?)",
        [userId, likedUserId, "pending"]
      );
      res.json({ message: "Match saved as pending" });
    }
  } catch (error) {
    console.error("Error saving match:", error);
    res.status(500).json({ error: "Error saving match" });
  }
};

exports.getMessages = async (req, res) => {
  const userId = req.user.userId;
  const { matchId } = req.params;

  try {
    const [messages] = await db.query(
      `SELECT id, sender_id, receiver_id, message, timestamp
   FROM messages 
   WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
   ORDER BY timestamp ASC`,
      [userId, matchId, matchId, userId]
    );

    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};

exports.sendMessage = async (req, res) => {
  const userId = req.user.userId;
  const { matchId } = req.params;
  const { message } = req.body;

  try {
    await db.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [userId, matchId, message]
    );

    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Error sending message" });
  }
};

exports.getProfileById = async (req, res) => {
  const { userId } = req.params;

  try {
    const [profile] = await db.query(
      "SELECT rp.id, u.username, rp.cleanliness, rp.social_activities, rp.work_habits, rp.sleep_schedule FROM roommateprofiles rp JOIN Users u ON rp.user_id = u.id WHERE rp.user_id = ?",
      [userId]
    );

    if (profile.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ profile: profile[0] });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
};


exports.unmatch = async (req, res) => {
  const userId = req.user.userId;
  const { targetUserId } = req.body;

  try {
    await db.query(
      `DELETE FROM matches 
       WHERE (user_id = ? AND matched_user_id = ?) 
          OR (user_id = ? AND matched_user_id = ?)`,
      [userId, targetUserId, targetUserId, userId]
    );

    await db.query(
      `DELETE FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
          OR (sender_id = ? AND receiver_id = ?)`,
      [userId, targetUserId, targetUserId, userId]
    );

    res.json({ message: "Unmatched successfully" });
  } catch (error) {
    console.error("Error unmatching:", error);
    res.status(500).json({ error: "Failed to unmatch" });
  }
};

