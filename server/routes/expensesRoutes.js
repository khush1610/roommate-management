const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  deleteExpense
} = require('../controllers/expensesController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createExpense);
router.get('/', authenticateToken, getExpenses);
router.delete('/:id', authenticateToken, deleteExpense);

module.exports = router;
