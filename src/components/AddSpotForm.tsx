'use client';

import React from 'react';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import * as yup from 'yup';
import LoadingSpinner from '@/components/LoadingSpinner';
import { MapPin, ParkingCircle, Coffee, Users } from 'lucide-react'; // Using available icons

type SpotFormData = {
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  hasOutlets: boolean;
  hasParking: boolean;
  hasFoodDrinks: boolean;
  maxGroupSize: number;
  type: string;
};

const AddSpotSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  imageUrl: yup.string().required('Image URL is required'),
  address: yup.string().required('Address is required'),
  latitude: yup.number()
    .required('Latitude is required')
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: yup.number()
    .required('Longitude is required')
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  hasOutlets: yup.boolean().default(false),
  hasParking: yup.boolean().default(false),
  hasFoodDrinks: yup.boolean().default(false),
  maxGroupSize: yup.number()
    .required('Maximum group size is required')
    .min(1, 'Group size must be at least 1'),
  type: yup.string().required('Type is required'),
});

const AddSpotForm = () => {
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpotFormData>({
    resolver: yupResolver(AddSpotSchema),
    defaultValues: {
      hasOutlets: false,
      hasParking: false,
      hasFoodDrinks: false,
      maxGroupSize: 1,
    },
  });

  const onSubmit = async (data: SpotFormData) => {
    try {
      const response = await fetch('/api/spots', { // Simplified URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add spot');
      }

      const result = await response.json();
      swal('Success', 'Your spot has been added', 'success', {
        timer: 2000,
      });
      reset();
    } catch (error) {
      swal('Error', 'Failed to add spot', 'error');
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Card className="add-spot-card">
      <Card.Body className="add-spot-card-body">

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="section-header">
              Basic Information
            </h3>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Spot Name</Form.Label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="e.g., Hamilton Library Study Room"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <textarea
                    {...register('description')}
                    placeholder="Describe what makes this spot special..."
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows={4}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Location Section */}
          <div className="form-section">
            <h3 className="section-header">
              <MapPin size={24} />
              Location Details
            </h3>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <input
                    type="text"
                    {...register('address')}
                    placeholder="Full address of the spot"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.address?.message}</div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <input
                    type="number"
                    step="any"
                    {...register('latitude')}
                    placeholder="e.g., 21.2989"
                    className={`form-control ${errors.latitude ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.latitude?.message}</div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <input
                    type="number"
                    step="any"
                    {...register('longitude')}
                    placeholder="e.g., -157.8173"
                    className={`form-control ${errors.longitude ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.longitude?.message}</div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Amenities Section */}
          <div className="form-section">
            <h3 className="section-header">Amenities</h3>
            <div className="amenities-container">
              <Row className="g-3">
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    label={<span className="checkbox-label">Has Outlets</span>}
                    {...register('hasOutlets')}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    label={(
                      <span className="checkbox-label">
                        <ParkingCircle size={18} />
                        Has Parking
                      </span>
                    )}
                    {...register('hasParking')}
                  />
                </Col>
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    label={(
                      <span className="checkbox-label">
                        <Coffee size={18} />
                        Has Food/Drinks
                      </span>
                    )}
                    {...register('hasFoodDrinks')}
                  />
                </Col>
              </Row>
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <span className="checkbox-label">
                      <Users size={18} />
                      Maximum Group Size
                    </span>
                  </Form.Label>
                  <input
                    type="number"
                    {...register('maxGroupSize')}
                    className={`form-control ${errors.maxGroupSize ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.maxGroupSize?.message}</div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <select
                    {...register('type')}
                    className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select a type...</option>
                    <option value="library">Library</option>
                    <option value="cafe">Café</option>
                    <option value="coworking">Coworking Space</option>
                    <option value="outdoor">Outdoor Space</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="invalid-feedback">{errors.type?.message}</div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Image Section */}
          <div className="form-section">
            <h3 className="section-header">Image</h3>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <input
                type="text"
                {...register('imageUrl')}
                placeholder="Enter the URL of an image of this spot"
                className={`form-control ${errors.imageUrl ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.imageUrl?.message}</div>
            </Form.Group>
          </div>

          {/* Submit Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => reset()}
              className="reset-button"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="submit-button"
            >
              Add Spot
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddSpotForm;