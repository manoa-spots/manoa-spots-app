'use client';

import { useRouter } from 'next/navigation';
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
  HeartFill,
  Heart,
} from 'react-bootstrap-icons';
import type { Spot } from '@prisma/client';
import { useState } from 'react';

interface SpotCardProps {
  spot: Spot & {
    _count?: {
      reviews: number;
    };
  };
  userId: string; // track current user
}

const SpotCard = ({ spot }: SpotCardProps) => {
  const router = useRouter();
  const fullStars = Math.floor(spot.rating);
  const halfStars = spot.rating - fullStars >= 0.5 ? 1 : 0;
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // keep card click from triggering

    const endpoint = isFavorited ? '/api/favorites/remove' : '/api/favorites/add';
    const method = isFavorited ? 'DELETE' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, spotId: spot.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleClick = () => {
    router.push(`/spots/${spot.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // Pre-generate star elements
  const starElements = [];
  for (let i = 0; i < 5; i++) {
    const uniqueKey = `${spot.id}-star-${i}-${fullStars}-${halfStars}`;
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
    <div
      role="button"
      tabIndex={0}
      className="card h-100 shadow-sm hover-shadow transition-all"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ cursor: 'pointer' }}
    >
      <Image
        src={spot.imageUrl}
        alt={spot.name}
        height={200}
        style={{ objectFit: 'cover', width: '100%' }}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{spot.name}</h5>
          <Badge
            className="location-badge"
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

        {/* Rating */}
        <div className="mb-2 text-start">
          {starElements}
          <span className="fw-bold">{spot.rating.toFixed(1)}</span>
          <span className="text-muted ms-1">
            (
            {`${spot.numReviews} reviews`}
            )
          </span>
        </div>

        {/* Description */}
        {spot.description && (
          <p className="text-muted mb-3 text-start">
            {spot.description.length > 100
              ? `${spot.description.slice(0, 100)}...`
              : spot.description}
          </p>
        )}

        {/* Amenities */}
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2">
            {spot.hasOutlets && (
              <Badge
                className="amenities-badge d-flex align-items-center"
                bg="var(--primary-light)"
                text="var(--primary-dark)"
              >
                <Plug className="me-1" />
                Outlets
              </Badge>
            )}
            {spot.hasParking && (
              <Badge
                className="amenities-badge d-flex align-items-center"
                bg="var(--primary-light)"
                text="var(--primary-dark)"
              >
                <CarFront className="me-1" />
                Parking
              </Badge>
            )}
            {spot.hasFoodDrinks && (
              <Badge
                className="amenities-badge d-flex align-items-center"
                bg="var(--primary-light)"
                text="var(--primary-dark)"
              >
                <Cup className="me-1" />
                Food/Drinks
              </Badge>
            )}
            <Badge
              className="amenities-badge d-flex align-items-center"
              bg="var(--primary-light)"
              text="var(--primary-dark)"
            >
              <People className="me-1" />
              Up to
              {spot.maxGroupSize}
            </Badge>
          </div>
        </div>

        {/* Location */}
        <div className="text-muted small d-flex align-items-center">
          <GeoAlt className="me-1" color="red" />
          {spot.address}
        </div>
      </div>
    </div>
  );
};

export default SpotCard;
