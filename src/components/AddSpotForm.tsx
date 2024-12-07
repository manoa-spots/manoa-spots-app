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
import { MapPin, ParkingCircle, Coffee, Users, Clock } from 'lucide-react';

type DayHours = {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

type TimeSlot = {
  open: string;
  close: string;
  closed: boolean;
};

type SpotFormData = {
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  zipCode: string;
  hasOutlets: boolean;
  hasParking: string;
  hasFoodDrinks: boolean;
  maxGroupSize: number;
  minGroupSize: number;
  type: string;
  hours?: string;
  rating: number;
  numReviews: number;
};

const defaultHours = {
  monday: { open: '09:00', close: '17:00', closed: false },
  tuesday: { open: '09:00', close: '17:00', closed: false },
  wednesday: { open: '09:00', close: '17:00', closed: false },
  thursday: { open: '09:00', close: '17:00', closed: false },
  friday: { open: '09:00', close: '17:00', closed: false },
  saturday: { open: '09:00', close: '17:00', closed: true },
  sunday: { open: '09:00', close: '17:00', closed: true },
};

const AddSpotSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  imageUrl: yup.string().required('Image URL is required'),
  address: yup.string().required('Address is required'),
  zipCode: yup.string().required('Zip code is required'),
  hasOutlets: yup.boolean().default(false),
  hasParking: yup.string().required('Parking information is required'),
  hasFoodDrinks: yup.boolean().default(false),
  maxGroupSize: yup.number()
    .required('Maximum group size is required')
    .min(1, 'Group size must be at least 1'),
  minGroupSize: yup.number().default(1),
  type: yup.string().required('Type is required'),
  hours: yup.string(),
  rating: yup.number().default(0),
  numReviews: yup.number().default(0),
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
      hasParking: 'No',
      hasFoodDrinks: false,
      maxGroupSize: 1,
      minGroupSize: 1,
      rating: 0,
      numReviews: 0,
    },
  });

  const [operatingHours, setOperatingHours] = React.useState<Record<string, TimeSlot>>(defaultHours);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of ['00', '30']) {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const onSubmit = async (data: SpotFormData) => {
    try {
      const formattedHours: DayHours = Object.entries(operatingHours).reduce((acc, [day, hours]) => ({
        ...acc,
        [day]: hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`,
      }), {} as DayHours);

      const submitData = {
        ...data,
        hours: JSON.stringify(formattedHours),
      };

      const response = await fetch('/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to add spot');
      }

      await response.json();
      swal('Success', 'Your spot has been added', 'success', {
        timer: 2000,
      });
      reset();
      setOperatingHours(defaultHours);
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
    <div className="add-spot-container">
      <Card className="add-spot-card">
        <Card.Body className="add-spot-card-body">
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Information Section */}
            <div className="form-section">
              <h3 className="section-header">Basic Information</h3>
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
                <MapPin size={24} className="me-2" />
                Location Details
              </h3>
              <Row>
                <Col md={6}>
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
                    <Form.Label>Zip Code</Form.Label>
                    <input
                      type="text"
                      {...register('zipCode')}
                      placeholder="e.g., 96822"
                      className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.zipCode?.message}</div>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Operating Hours Section */}
            <div className="form-section">
              <h3 className="section-header">
                <Clock size={24} className="me-2" />
                Operating Hours
              </h3>
              <div className="hours-container p-3 bg-light rounded">
                {Object.entries(operatingHours).map(([day, hours]) => (
                  <Row key={day} className="mb-3 align-items-center">
                    <Col md={2}>
                      <Form.Label className="mb-0 text-capitalize fw-bold">{day}</Form.Label>
                    </Col>
                    <Col md={3}>
                      <Form.Check
                        type="switch"
                        label="Closed"
                        checked={hours.closed}
                        onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                        className="mb-0"
                      />
                    </Col>
                    {!hours.closed && (
                      <>
                        <Col md={3}>
                          <Form.Select
                            value={hours.open}
                            onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                            disabled={hours.closed}
                          >
                            {timeOptions.map(time => (
                              <option key={`${day}-open-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col md={1} className="text-center">
                          <span>to</span>
                        </Col>
                        <Col md={3}>
                          <Form.Select
                            value={hours.close}
                            onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                            disabled={hours.closed}
                          >
                            {timeOptions.map(time => (
                              <option key={`${day}-close-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </>
                    )}
                  </Row>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="form-section">
              <h3 className="section-header">Amenities & Features</h3>
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
                    <Form.Group>
                      <Form.Label>
                        <ParkingCircle size={18} className="me-2" />
                        Parking
                      </Form.Label>
                      <select
                        {...register('hasParking')}
                        className={`form-control ${errors.hasParking ? 'is-invalid' : ''}`}
                      >
                        <option value="No">No Parking</option>
                        <option value="Yes">Parking Available</option>
                        <option value="Street parking only">Street Parking Only</option>
                        <option value="Campus parking pass required">Campus Parking Pass Required</option>
                        <option value="Paid parking available">Paid Parking Available</option>
                      </select>
                      <div className="invalid-feedback">{errors.hasParking?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label={(
                        <span className="checkbox-label">
                          <Coffee size={18} className="me-2" />
                          Has Food/Drinks
                        </span>
                      )}
                      {...register('hasFoodDrinks')}
                    />
                  </Col>
                </Row>
              </div>

              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="d-flex align-items-center">
                        <Users size={18} className="me-2" />
                        Maximum Group Size
                      </span>
                    </Form.Label>
                    <input
                      type="number"
                      {...register('maxGroupSize')}
                      className={`form-control ${errors.maxGroupSize ? 'is-invalid' : ''}`}
                      min="1"
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
                      <option value="LIBRARY">Library</option>
                      <option value="CAFE">Café</option>
                      <option value="COWORKING">Coworking Space</option>
                      <option value="OTHER">Other</option>
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
                <Form.Text className="text-muted">
                  Please provide a direct link to an image (ends with .jpg, .png, etc.)
                </Form.Text>
              </Form.Group>
            </div>

            {/* Submit Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  reset();
                  setOperatingHours(defaultHours);
                }}
                className="reset-button"
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="submit-button"
              >
                Add Spot
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddSpotForm;
