import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (user, token) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <AppContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: '#333333'
        }}>
          Loading...
        </div>
      </AppContainer>
    );
  }

  return (
    <Router>
      <AppContainer>
        <Header user={user} onLogout={handleLogout} />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/product/:id" element={<ProductDetail user={user} />} />
            <Route path="/login" element={
              user ? <Navigate to="/" replace /> : <Auth onAuthSuccess={handleAuthSuccess} />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/" replace /> : <Auth onAuthSuccess={handleAuthSuccess} />
            } />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 