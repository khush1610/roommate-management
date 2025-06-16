import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import SwipeProfiles from './components/SwipeProfiles';
import Header from './components/Header';
import Expenses from './components/Expenses'; 
import Chores from './components/Chores'; 
import Profile from './components/Profile'; 
import Chat from './components/Chat'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<Header />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/swipe" element={<SwipeProfiles />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/chores" element={<Chores />} />
          <Route path="/chat/:matchedUserId" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
