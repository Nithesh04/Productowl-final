import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { FaEye, FaSearch, FaBell } from 'react-icons/fa';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 3rem 0;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #333333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeaturesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  font-weight: 500;
  
  svg {
    font-size: 1.2rem;
  }
`;

const ProductsSection = styled.section`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ProductsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 0;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
  
  svg {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #333333;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #3b82f6;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
`;

const Home = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/products', {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const validProducts = Array.isArray(data) 
        ? data.filter(product => product && product._id && typeof product._id === 'string')
        : [];
      
      setProducts(validProducts);
    } catch (err) {
      setError(err.message || 'Failed to fetch products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductScraped = (newProduct) => {
    if (newProduct && newProduct._id) {
      setProducts(prev => [newProduct, ...prev]);
    }
  };

  if (loading) {
    return (
      <HomeContainer>
        <HeroSection>
          <HeroTitle>
            <FaEye />
            ProductOwl
          </HeroTitle>
          <HeroSubtitle>
            Track Amazon product prices and get notified when prices drop. Never miss a great deal again!
          </HeroSubtitle>
          <SearchBar onProductScraped={handleProductScraped} user={user} />
          <FeaturesContainer>
            <Feature>
              <FaSearch />
              Smart Price Tracking
            </Feature>
            <Feature>
              <FaBell />
              Email Alerts
            </Feature>
          </FeaturesContainer>
        </HeroSection>
        <LoadingContainer>
          <div className="spinner"></div>
          <p>Loading products...</p>
        </LoadingContainer>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>
          <FaEye />
          ProductOwl
        </HeroTitle>
        <HeroSubtitle>
          Track Amazon product prices and get notified when prices drop. Never miss a great deal again!
        </HeroSubtitle>
        <SearchBar onProductScraped={handleProductScraped} user={user} />
        <FeaturesContainer>
          <Feature>
            <FaSearch />
            Smart Price Tracking
          </Feature>
          <Feature>
            <FaBell />
            Email Alerts
          </Feature>
        </FeaturesContainer>
      </HeroSection>

      <ProductsSection>
        <SectionTitle>Tracked Products</SectionTitle>
        {error ? (
          <EmptyState>
            <FaEye />
            <h3>Error Loading Products</h3>
            <p>{error}</p>
          </EmptyState>
        ) : products.length === 0 ? (
          <EmptyState>
            <FaEye />
            <h3>No Products Yet</h3>
            <p>Start by searching for an Amazon product above to track its price.</p>
          </EmptyState>
        ) : (
          <ProductsContainer>
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
              />
            ))}
          </ProductsContainer>
        )}
      </ProductsSection>
    </HomeContainer>
  );
};

export default Home;