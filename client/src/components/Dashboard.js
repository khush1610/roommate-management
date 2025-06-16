import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';
import Header from './Header';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSwipeProfiles = () => {
    navigate('/swipe');  
  };

  const handleChat = () => {
    navigate('/chat'); 
  };

  return (
    <div className="dashboard-container">
      {user ? (
        <div className="dashboard-content">
          <h2>Welcome, {user.username}!</h2>
          <p>Your dashboard overview...</p>
          <button onClick={handleSwipeProfiles}>Swipe Profiles</button>
          <button onClick={handleChat}>Go to Chat</button>
        </div>
      ) : (
        <p>Unable to fetch user data</p>
      )}
    </div>
  );
};

export default Dashboard;
