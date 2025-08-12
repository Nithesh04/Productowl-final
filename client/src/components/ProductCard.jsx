import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaExternalLinkAlt, FaRupeeSign } from 'react-icons/fa';

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  min-width: 280px;
  max-width: 320px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #3b82f6;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f3f4f6;
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #059669;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #6b7280;
  text-decoration: line-through;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const PriceItem = styled.div`
  text-align: center;
  
  span:first-child {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  span:last-child {
    font-weight: 600;
    color: #333333;
  }
`;

const ExternalLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const isDiscounted = product.currentPrice < product.originalPrice;

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
      <Card>
        <ProductImage 
          src={product.imageUrl} 
          alt={product.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/2a2a3e/ffffff?text=Product+Image';
          }}
        />
        
        <ProductTitle>{product.title}</ProductTitle>
        
        <PriceContainer>
          <CurrentPrice>
            <FaRupeeSign />
            {formatPrice(product.currentPrice)}
          </CurrentPrice>
          {isDiscounted && (
            <OriginalPrice>
              <FaRupeeSign />
              {formatPrice(product.originalPrice)}
            </OriginalPrice>
          )}
        </PriceContainer>
        
        <PriceInfo>
          <PriceItem>
            <span>Lowest</span>
            <span>₹{formatPrice(product.lowestPrice)}</span>
          </PriceItem>
          <PriceItem>
            <span>Average</span>
            <span>₹{formatPrice(product.averagePrice)}</span>
          </PriceItem>
          <PriceItem>
            <span>Highest</span>
            <span>₹{formatPrice(product.highestPrice)}</span>
          </PriceItem>
        </PriceInfo>
        
        <ExternalLink href={product.amazonUrl} target="_blank" rel="noopener noreferrer">
          <FaExternalLinkAlt />
          Visit Product
        </ExternalLink>
      </Card>
    </Link>
  );
};

export default ProductCard;