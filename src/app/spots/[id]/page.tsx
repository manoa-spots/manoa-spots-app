'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import {
  StarFill,
  StarHalf,
  Star,
  Plug,
  CarFront,
  Cup,
  People,
  GeoAlt,
  Clock,
  ExclamationCircle,
  Heart,
  HeartFill,
} from 'react-bootstrap-icons';
import type { Spot } from '@prisma/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSession } from 'next-auth/react';

type HoursType = {
  [key: string]: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

export default function SpotPage() {
  const params = useParams();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || '';
  const [spot, setSpot] = React.useState<Spot | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isFavorited, setIsFavorited] = React.useState(false);

  const toggleFavorite = async () => {
    const endpoint = isFavorited ? '/api/favorites/remove' : '/api/favorites/add';
    const method = isFavorited ? 'DELETE' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, spotId: spot?.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      setIsFavorited(!isFavorited);
    } catch (toggleError) {
      console.error('Error toggling favorite:', toggleError);
    }
  };

  React.useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await fetch(`/api/spots/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch spot details');
        }
        const data = await response.json();
        setSpot(data);

        const favoriteResponse = await fetch(
          `/api/favorites?userId=${currentUserId}`,
        );
        if (favoriteResponse.ok) {
          const favorites = await favoriteResponse.json();
          setIsFavorited(favorites.some((fav: any) => fav.spotId === data.id));
        }
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id && currentUserId) {
      fetchSpot();
    }
  }, [params.id, currentUserId]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="text-center text-danger">{error}</div>
      </Container>
    );
  }

  if (!spot) {
    return (
      <Container className="py-5">
        <div className="text-center">Spot not found</div>
      </Container>
    );
  }

  const fullStars = Math.floor(spot.rating);
  const halfStars = spot.rating - fullStars >= 0.5 ? 1 : 0;
  const hours: HoursType = JSON.parse(spot.hours as string);

  const starElements = [];
  for (let i = 0; i < 5; i++) {
    const uniqueKey = `star-${spot.id}-${i}`;
    if (i < fullStars) {
      starElements.push(
        <StarFill
          key={`${uniqueKey}-full`}
          className="text-warning me-1"
        />,
      );
    } else if (i === fullStars && halfStars > 0) {
      starElements.push(
        <StarHalf
          key={`${uniqueKey}-half`}
          className="text-warning me-1"
        />,
      );
    } else {
      starElements.push(
        <Star
          key={`${uniqueKey}-empty`}
          className="text-warning me-1"
        />,
      );
    }
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1 className="mb-0 text-primary-dark">{spot.name}</h1>
            <div>
              <Badge
                className="location-badge me-3"
                bg="var(--secondary-green)"
                text="var(--primary-white)"
              >
                {spot.type}
              </Badge>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={toggleFavorite}
                aria-label={isFavorited ? 'Unfavorite' : 'Favorite'}
                style={{
                  border: 'none',
                  background: 'transparent',
                }}
              >
                {isFavorited ? (
                  <HeartFill color="red" size={20} />
                ) : (
                  <Heart size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center mb-3">
            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
              {starElements}
              <span className="fw-bold ms-2">{spot.rating.toFixed(1)}</span>
              <span className="text-muted ms-1">
                (
                {spot.numReviews}
                {' '}
                reviews)
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center text-muted mb-3 bg-light rounded-pill px-3 py-2">
            <GeoAlt className="me-2" color="var(--secondary-green)" />
            {spot.address}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
