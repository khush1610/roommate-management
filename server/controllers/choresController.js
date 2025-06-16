const db = require('../models/db');

exports.assignChore = async (req, res) => {
  const { chore_name, assigned_to, due_date } = req.body;
  try {
    await db.query(
      'INSERT INTO Chores (chore_name, assigned_to, status, due_date) VALUES (?, ?, ?, ?)',
      [chore_name, assigned_to, 'Pending', due_date]
    );
    res.status(201).json({ message: 'Chore assigned successfully!' });
  } catch (error) {
    console.error('Failed to assign chore:', error);
    res.status(500).json({ error: 'Failed to assign chore' });
  }
};

exports.getChores = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Chores ORDER BY due_date ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Failed to fetch chores:', error);
    res.status(500).json({ error: 'Failed to fetch chores' });
  }
};

exports.updateChoreStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE Chores SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ message: 'Chore status updated' });
  } catch (error) {
    console.error('Failed to update status:', error);
    res.status(500).json({ error: 'Failed to update chore status' });
  }
};


exports.deleteChore = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Chores WHERE id = ?', [id]);
    res.status(200).json({ message: 'Chore deleted successfully' });
  } catch (error) {
    console.error('Failed to delete chore:', error);
    res.status(500).json({ error: 'Failed to delete chore' });
  }
};


