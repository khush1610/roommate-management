// Register.js (React Component)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // Same CSS file for consistency

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = { username, email, password };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);

      console.log(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error.response.data.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="auth-title">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="auth-input-group">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="auth-input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="auth-input-group">
            <input
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
