const db = require('../models/db');

exports.createExpense = async (req, res) => {
  const { amount, description, category, expenseName, expenseDate } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO Expenses (amount, paid_by, category, expense_name, description, expense_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [amount, userId, category, expenseName, description, expenseDate]
    );

    const insertedId = result.insertId;

    const [rows] = await db.query(
      `SELECT id, amount, category, expense_name AS expenseName, description, expense_date AS expenseDate
       FROM Expenses WHERE id = ?`,
      [insertedId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};


exports.getExpenses = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, amount, category, expense_name AS expenseName, description, expense_date AS expenseDate
       FROM Expenses WHERE paid_by = ? ORDER BY expense_date DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};


exports.deleteExpense = async (req, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [result] = await db.query(
      'DELETE FROM Expenses WHERE id = ? AND paid_by = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found or not authorized' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

