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
import CheckInButton from '@/components/CheckInButton';

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
  const [spot, setSpot] = React.useState<Spot | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isFavorited, setIsFavorited] = React.useState(false);

  const toggleFavorite = () => {
    setIsFavorited((prev) => !prev);
    // Optional: Save favorite state to a backend or localStorage
    // Example:
    // await fetch(`/api/favorites/${spot.id}`, { method: isFavorited ? 'DELETE' : 'POST' });
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSpot();
    }
  }, [params.id]);

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
        <StarFill key={`${uniqueKey}-full`} className="text-warning me-1" />,
      );
    } else if (i === fullStars && halfStars > 0) {
      starElements.push(
        <StarHalf key={`${uniqueKey}-half`} className="text-warning me-1" />,
      );
    } else {
      starElements.push(
        <Star key={`${uniqueKey}-empty`} className="text-warning me-1" />,
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
              <Badge className="location-badge me-3" bg="var(--secondary-green)" text="var(--primary-white)">
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
                reviews)
              </span>
            </div>
          </div>

          {/* Styled address */}
          <div className="d-flex align-items-center text-muted mb-3 bg-light rounded-pill px-3 py-2">
            <GeoAlt className="me-2" color="var(--secondary-green)" />
            {spot.address}
          </div>

          {/* Check-in button */}
          <div className="mb-4">
            <CheckInButton spotId={spot.id} />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <div className="mb-4 position-relative">
            <Image
              src={spot.imageUrl}
              alt={spot.name}
              className="w-100 rounded shadow-sm"
              style={{
                maxHeight: '500px',
                objectFit: 'cover',
                border: '1px solid var(--primary-light)',
              }}
            />
          </div>

          <section className="mb-4 p-4 bg-light rounded shadow-sm">
            <h3 className="h4 mb-3 d-flex align-items-center">
              <ExclamationCircle className="me-2 text-primary-dark" />
              About this spot
            </h3>
            <p className="text-muted mb-0">{spot.description}</p>
          </section>

          <section className="mb-4 p-4 bg-light rounded shadow-sm">
            <h3 className="h4 mb-3">Amenities</h3>
            <div className="d-flex flex-wrap gap-3">
              {spot.hasOutlets && (
                <Badge
                  className="amenities-badge d-flex align-items-center"
                  bg="var(--primary-light)"
                  text="var(--primary-dark)"
                >
                  <Plug className="me-2" />
                  Power outlets available
                </Badge>
              )}
              {spot.hasParking && (
                <Badge
                  className="amenities-badge d-flex align-items-center"
                  bg="var(--primary-light)"
                  text="var(--primary-dark)"
                >
                  <CarFront className="me-2" />
                  {spot.hasParking}
                </Badge>
              )}
              {spot.hasFoodDrinks && (
                <Badge
                  className="amenities-badge d-flex align-items-center"
                  bg="var(--primary-light)"
                  text="var(--primary-dark)"
                >
                  <Cup className="me-2" />
                  Food/Drinks Allowed
                </Badge>
              )}
              <Badge
                className="amenities-badge d-flex align-items-center"
                bg="var(--primary-light)"
                text="var(--primary-dark)"
              >
                <People className="me-2" />
                {`Up to ${spot.maxGroupSize} people`}
              </Badge>
            </div>
          </section>
        </Col>

        <Col md={4}>
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body p-4">
              <h3 className="h5 mb-3 d-flex align-items-center text-primary-dark">
                <Clock className="me-2" />
                Hours of Operation
              </h3>
              <div className="mb-4">
                {(Object.entries(hours) as [keyof HoursType, string][]).map(([day, time]) => (
                  <div
                    key={`hours-${day}`}
                    className="d-flex justify-content-between mb-2 py-2 border-bottom border-light"
                  >
                    <span className="text-capitalize fw-medium">{day}</span>
                    <span className="text-muted">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
