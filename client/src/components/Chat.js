import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Chat.css";
import defaultAvatar from "./default-avatar.png";

const Chat = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const storedUser = localStorage.getItem("selectedUser");
    if (storedUser) {
      setSelectedUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatchedUsers(response.data.matches);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      }
    };
    fetchMatches();
  }, [token]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/profiles/chat/${selectedUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched messages:", response.data.messages);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser, token]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/profiles/chat/${selectedUser.id}`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        { sender_id: "me", message: newMessage, timestamp: new Date() },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleUnmatch = async () => {
    if (!selectedUser) return;

    const confirmUnmatch = window.confirm(
      `Are you sure you want to unmatch with ${selectedUser.username}?`
    );
    if (!confirmUnmatch) return;

    try {
      await axios.post(
        "http://localhost:5000/api/profiles/unmatch",
        { targetUserId: selectedUser.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMatchedUsers((prev) =>
        prev.filter((user) => user.id !== selectedUser.id)
      );
      setSelectedUser(null);
      setMessages([]);

      localStorage.removeItem("selectedUser");

      alert("Unmatched successfully.");
    } catch (error) {
      console.error("Unmatch failed:", error);
      alert("Failed to unmatch.");
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        {matchedUsers.map((user) => (
          <div
            key={user.id}
            className={`user-tile ${
              selectedUser?.id === user.id ? "active" : ""
            }`}
            onClick={() => handleUserSelect(user)}
          >
            <img src={defaultAvatar} alt="Avatar" className="avatar" />

            <span>
              {user.username.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </span>
          </div>
        ))}
      </div>

      <div className="chat-window">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <span>
                Chat with{" "}
                {selectedUser.username.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </span>{" "}
              &nbsp;
              <button className="unmatch-button" onClick={handleUnmatch}>
                Unmatch
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-bubble ${
                    msg.sender_id === selectedUser.id ? "received" : "sent"
                  }`}
                >
                  {msg.message}
                  <small className="timestamp">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString()
                      : ""}
                  </small>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
