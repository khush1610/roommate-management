import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('selectedUser');
    navigate('/login');
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <li><Link to="/dashboard">Home</Link></li>
            <li><Link to="/quiz">Take Quiz</Link></li>
            <li><Link to="/expenses">Manage Expenses</Link></li>
            <li><Link to="/chores">Manage Chores</Link></li>
            <li><button onClick={handleLogout} className="nav-logout">Logout</button></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet /> 
      </main>
    </>
  );
};

export default Header;
