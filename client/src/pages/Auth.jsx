import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = (user, token) => {
    if (onAuthSuccess) {
      onAuthSuccess(user, token);
    }
  };

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <>
      {isLogin ? (
        <Login 
          onLogin={handleAuthSuccess}
          onSwitchToRegister={switchToRegister}
        />
      ) : (
        <Register 
          onRegister={handleAuthSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </>
  );
};

export default Auth; 