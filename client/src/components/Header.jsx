import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEye, FaUser, FaSignOutAlt } from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333333;
  font-size: 1.5rem;
  font-weight: bold;
  
  svg {
    margin-right: 0.5rem;
    color: #3b82f6;
  }
  
  &:hover {
    color: #3b82f6;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #333333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const LogoutButton = styled.button`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #fee2e2;
    border-color: #fca5a5;
  }
`;

const Header = ({ user, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <HeaderContainer>
      <Logo to="/">
        <FaEye />
        ProductOwl
      </Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        {user ? (
          <UserMenu>
            <UserButton>
              <FaUser />
              {user.name}
            </UserButton>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </LogoutButton>
          </UserMenu>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 