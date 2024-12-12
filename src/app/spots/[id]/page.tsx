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
} from 'react-bootstrap-icons';
import type { Spot } from '@prisma/client';
import LoadingSpinner from '@/components/LoadingSpinner';

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
          <h1 className="mb-3">{spot.name}</h1>
          <div className="d-flex align-items-center mb-3 gap-3">
            <div className="d-flex align-items-center">
              {starElements}
              <span className="fw-bold ms-2">{spot.rating.toFixed(1)}</span>
              <span className="text-muted ms-1">
                (
                <span>{spot.numReviews}</span>
                <span> reviews</span>
                )
              </span>
            </div>
            <Badge className="location-badge">{spot.type}</Badge>
          </div>
          <div className="d-flex align-items-center text-muted mb-3">
            <GeoAlt className="me-2" color="red" />
            {spot.address}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <div className="mb-4">
            <Image
              src={spot.imageUrl}
              alt={spot.name}
              className="w-100 rounded"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>

          <section className="mb-4">
            <h3 className="h4 mb-3">About this spot</h3>
            <p>{spot.description}</p>
          </section>

          <section className="mb-4">
            <h3 className="h4 mb-3">Amenities</h3>
            <div className="d-flex flex-wrap gap-3">
              {spot.hasOutlets && (
                <div className="d-flex align-items-center">
                  <Plug className="me-2" />
                  <span>Power outlets available</span>
                </div>
              )}
              {spot.hasParking && (
                <div className="d-flex align-items-center">
                  <CarFront className="me-2" />
                  <span>{spot.hasParking}</span>
                </div>
              )}
              {spot.hasFoodDrinks && (
                <div className="d-flex align-items-center">
                  <Cup className="me-2" />
                  <span>Food and drinks allowed</span>
                </div>
              )}
              <div className="d-flex align-items-center">
                <People className="me-2" />
                <span>
                  Group size:
                  {' '}
                  <span>{spot.minGroupSize}</span>
                  {' - '}
                  <span>{spot.maxGroupSize}</span>
                  {' '}
                  people
                </span>
              </div>
            </div>
          </section>
        </Col>

        <Col md={4}>
          <div className="card shadow-sm p-3">
            <h3 className="h5 mb-3">
              <Clock className="me-2" />
              Hours of Operation
            </h3>
            <div className="mb-4">
              {(Object.entries(hours) as [keyof HoursType, string][]).map(([day, time]) => (
                <div key={`hours-${day}`} className="d-flex justify-content-between mb-2">
                  <span className="text-capitalize">{day}</span>
                  <span>{time}</span>
                </div>
              ))}
            </div>

            <h3 className="h5 mb-3">
              <ExclamationCircle className="me-2" />
              Additional Information
            </h3>
            <div className="mb-3">
              <strong>Type: </strong>
              <span>{spot.type}</span>
            </div>
            <div className="mb-3">
              <strong>Zip Code: </strong>
              <span>{spot.zipCode}</span>
            </div>
            {spot.amenities && Array.isArray(spot.amenities) && (
              <div>
                <strong>Available Amenities:</strong>
                <ul className="list-unstyled mt-2">
                  {spot.amenities.map((amenity: string) => (
                    <li key={`amenity-${amenity}`}>
                      <span>• </span>
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
