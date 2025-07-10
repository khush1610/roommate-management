import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = { username, email, password };
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      console.log(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="auth-title">Join RoomieMatch</h2>
        <p className="auth-tagline">Find roommates, swipe profiles, chat, and manage chores & expenses!</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="auth-input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="auth-btn">Register</button>
        </form>
        <p className="auth-footer-text">
          Already a user? <span className="auth-link" onClick={() => navigate('/login')}>Log in here</span>
        </p>
      </div>
    </div>
  );
};

export default Register;