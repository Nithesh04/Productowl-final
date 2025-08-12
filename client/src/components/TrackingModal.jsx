import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaEnvelope, FaBell, FaSpinner } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    color: #333333;
    background: #f3f4f6;
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  color: #333333;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ModalSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #333333;
  font-weight: 500;
  font-size: 0.9rem;
`;

const EmailInput = styled.input`
  padding: 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #333333;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TrackButton = styled.button`
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background: #2563eb;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

const TrackingModal = ({ isOpen, onClose, productId, productTitle, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to track products');
      }
  
      // Use absolute URL in development
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/tracking/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId,
          email: user.email 
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to subscribe');
      }
  
      const data = await response.json();
      setSuccess('Successfully subscribed to tracking!');
      
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        
        <ModalHeader>
          <ModalTitle>
            <FaBell />
            Stay updated with product pricing alerts right in your inbox!
          </ModalTitle>
          <ModalSubtitle>
            Never miss a bargain again with our timely alerts! We'll notify you when the price drops by 30% or more.
          </ModalSubtitle>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <TrackButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Subscribing...
              </>
            ) : (
              <>
                <FaEnvelope />
                Track This Product
              </>
            )}
          </TrackButton>
        </Form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </ModalContent>
    </ModalOverlay>
  );
};

export default TrackingModal; 