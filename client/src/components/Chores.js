import React, { useState, useEffect } from "react";
import "./Chores.css";

const Chores = () => {
  const [choreName, setChoreName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [chores, setChores] = useState([]);

  useEffect(() => {
    fetchChores();
  }, []);

  const fetchChores = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chores");
      const data = await res.json();
      setChores(data);
    } catch (error) {
      console.error("Failed to fetch chores:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/chores/${id}`, {
        method: "DELETE",
      });
      setChores((prev) => prev.filter((chore) => chore.id !== id));
    } catch (err) {
      console.error("Failed to delete chore:", err);
    }
  };

  const handleAddChore = async (e) => {
    e.preventDefault();

    const newChore = {
      chore_name: choreName,
      assigned_to: assignedTo,
      due_date: dueDate,
    };

    try {
      const res = await fetch("http://localhost:5000/api/chores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChore),
      });

      if (!res.ok) throw new Error("Failed to add chore");
      await fetchChores(); 
      setChoreName("");
      setAssignedTo("");
      setDueDate("");
    } catch (error) {
      console.error("Error adding chore:", error);
    }
  };

  const toggleChoreStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      await fetch(`http://localhost:5000/api/chores/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setChores((prev) =>
        prev.map((chore) =>
          chore.id === id ? { ...chore, status: newStatus } : chore
        )
      );
    } catch (err) {
      console.error("Failed to update chore status:", err);
    }
  };

  return (
    <div className="chores-page-wrapper">
    <div className="chores-container">
      <div className="chore-form-container">
        <h1>Chores</h1>
        <form onSubmit={handleAddChore}>
          <div>
            <label>Chore Name</label>
            <input
              type="text"
              value={choreName}
              onChange={(e) => setChoreName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Assign to</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Chore</button>
        </form>
      </div>

      <div className="chore-list">
        <h2>Chore List</h2>
        {chores.map((chore) => (
          <div className="chore-item" key={chore.id}>
            <h3>{chore.chore_name}</h3>
            <p>
              <strong>Assigned To:</strong> {chore.assigned_to}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(chore.due_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {chore.status}
            </p>
            <label>
              <input
                type="checkbox"
                checked={chore.status === "Completed"}
                onChange={() => toggleChoreStatus(chore.id, chore.status)}
              />{" "}
              Mark as Completed
            </label>
            <button
              className="delete-btn"
              onClick={() => handleDelete(chore.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Chores;
