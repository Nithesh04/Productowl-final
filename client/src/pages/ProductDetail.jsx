import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaExternalLinkAlt, FaRupeeSign, FaBell, FaTrash } from 'react-icons/fa';
import TrackingModal from '../components/TrackingModal';

// Styled components
const DetailContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  background: #f3f4f6;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333333;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const CurrentPrice = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: #10b981;
  display: flex;
  align-items: center;
`;

const OriginalPrice = styled.span`
  font-size: 1.2rem;
  color: #6b7280;
  text-decoration: line-through;
  display: flex;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
`;

const VisitButton = styled(Button).attrs({ as: 'a' })`
  background: #3b82f6;
  color: white;
  text-decoration: none;
  &:hover {
    background: #2563eb;
  }
`;

const TrackButton = styled(Button)`
  background: #f59e0b;
  color: white;
  &:hover {
    background: #d97706;
  }
`;

const DeleteButton = styled(Button)`
  background: #dc2626;
  color: white;
  &:hover {
    background: #b91c1c;
  }
`;

const PriceCardsSection = styled.section`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333333;
  margin-bottom: 1.5rem;
`;

const PriceCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const PriceCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const PriceCardTitle = styled.h3`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const PriceCardValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem;
  color: #dc2626;
`;

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`/api/products/${id}`, { headers });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data?._id) throw new Error('Invalid product data received');
        
        setProduct(data);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete product');
      }

      alert('Product deleted successfully!');
      navigate('/');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return 'N/A';
    return new Intl.NumberFormat('en-IN').format(price);
  };

  if (loading) {
    return (
      <DetailContainer>
        <LoadingContainer>
          <p>Loading product details...</p>
        </LoadingContainer>
      </DetailContainer>
    );
  }

  if (error) {
    return (
      <DetailContainer>
        <ErrorContainer>
          <h2>Error</h2>
          <p>{error}</p>
          <BackButton to="/">
            <FaArrowLeft /> Back to Products
          </BackButton>
        </ErrorContainer>
      </DetailContainer>
    );
  }

  if (!product) {
    return (
      <DetailContainer>
        <ErrorContainer>
          <h2>Product Not Found</h2>
          <BackButton to="/">
            <FaArrowLeft /> Back to Products
          </BackButton>
        </ErrorContainer>
      </DetailContainer>
    );
  }

  const isDiscounted = product.currentPrice < product.originalPrice;

  return (
    <DetailContainer>
      <BackButton to="/">
        <FaArrowLeft /> Back to Products
      </BackButton>

      <ProductGrid>
        <ProductImage
          src={product.imageUrl || 'https://via.placeholder.com/500x500/2a2a3e/ffffff?text=No+Image'}
          alt={product.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x500/2a2a3e/ffffff?text=No+Image';
          }}
        />

        <ProductInfo>
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

          <ActionButtons>
            <VisitButton
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt /> Visit Product
            </VisitButton>

            <TrackButton onClick={() => setShowModal(true)}>
              <FaBell /> Track Price
            </TrackButton>

            {user && (
              <DeleteButton onClick={handleDelete} disabled={deleting}>
                <FaTrash /> {deleting ? 'Deleting...' : 'Delete Product'}
              </DeleteButton>
            )}
          </ActionButtons>
        </ProductInfo>
      </ProductGrid>

      <PriceCardsSection>
        <SectionTitle>Price Analysis</SectionTitle>
        <PriceCardsGrid>
          <PriceCard>
            <PriceCardTitle>Current Price</PriceCardTitle>
            <PriceCardValue>
              <FaRupeeSign />
              {formatPrice(product.currentPrice)}
            </PriceCardValue>
          </PriceCard>

          <PriceCard>
            <PriceCardTitle>Average Price</PriceCardTitle>
            <PriceCardValue>
              <FaRupeeSign />
              {formatPrice(product.averagePrice || 'N/A')}
            </PriceCardValue>
          </PriceCard>

          <PriceCard>
            <PriceCardTitle>Highest Price</PriceCardTitle>
            <PriceCardValue>
              <FaRupeeSign />
              {formatPrice(product.highestPrice || 'N/A')}
            </PriceCardValue>
          </PriceCard>

          <PriceCard>
            <PriceCardTitle>Lowest Price</PriceCardTitle>
            <PriceCardValue>
              <FaRupeeSign />
              {formatPrice(product.lowestPrice || 'N/A')}
            </PriceCardValue>
          </PriceCard>
        </PriceCardsGrid>
      </PriceCardsSection>

      {showModal && (
        <TrackingModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          productId={product._id}
          productTitle={product.title}
          user={user}
        />
      )}
    </DetailContainer>
  );
};

export default ProductDetail;