import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import Header from './components/Header';
import Home from './views/Home';
import Cart from './views/Cart';
import Profile from './views/Profile';
import Register from './views/Register';
import Login from './views/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axiosInstance.get('/client/profile');
        setUser(response.data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogin = () => {
    checkLoginStatus();
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/products" /> : <Navigate to="/login" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/products" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
