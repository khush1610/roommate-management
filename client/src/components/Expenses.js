import React, { useState, useEffect } from "react";
import "./Expenses.css";

const Expenses = () => {
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseDate, setExpenseDate] = useState("");

  const token = localStorage.getItem("authToken");
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/expenses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch expenses");

        const data = await res.json();

        const normalized = data.map((exp) => ({
          id: exp.id,
          expenseName: exp.expense_name,
          amount: exp.amount,
          category: exp.category,
          description: exp.description,
          expenseDate: exp.expense_date,
        }));

        setExpenses(normalized);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpenses();
  }, [token, API_BASE]);

  const handleAddExpense = async (e) => {
    e.preventDefault();

    const newExpense = {
      amount,
      description,
      category,
      expenseName,
      expense_date: expenseDate,
    };

    try {
      const response = await fetch(`${API_BASE}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) throw new Error("Failed to add expense");

      const saved = await response.json();

      const normalizedSaved = {
        id: saved.id,
        expenseName: saved.expense_name,
        amount: saved.amount,
        category: saved.category,
        description: saved.description,
        expenseDate: saved.expense_date,
      };

      setExpenses([...expenses, normalizedSaved]);

      setExpenseName("");
      setAmount("");
      setCategory("");
      setDescription("");
      setExpenseDate("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete expense");

      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="expenses-container">
        <h1>Manage Expenses</h1>
        <br />
        <form onSubmit={handleAddExpense} className="expenses-form">
          <div>
            <label>Expense Name</label>
            <input
              type="text"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label>Date of Expense</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit">Add Expense</button>
        </form>
      </div>

      <div className="expense-list">
        <h2>Expense List</h2>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          expenses.map((expense) => (
            <div className="expense-item" key={expense.id}>
              <h3>{expense.expenseName}</h3>
              <p>
                <strong>Amount:</strong> Rs.{expense.amount}
              </p>
              <p>
                <strong>Category:</strong> {expense.category}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {expense.expenseDate
                  ? new Date(expense.expenseDate).toLocaleDateString()
                  : "Not specified"}
              </p>
              <p>
                <strong>Description:</strong> {expense.description}
              </p>
              <button
                onClick={() => handleDelete(expense.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Expenses;
