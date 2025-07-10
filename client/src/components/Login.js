import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const token = response.data.token;
      console.log('Token:', token);
      localStorage.setItem('authToken', token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="auth-title">Welcome to RoomieMatch</h2>
        <p className="auth-tagline">Swipe, chat, and manage your roommate life!</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p className="auth-footer-text">
          New? <span className="auth-link" onClick={() => navigate('/')}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default Login;