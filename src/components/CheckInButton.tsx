'use client';

import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { MapPin } from 'lucide-react';

interface CheckInButtonProps {
  spotId: string;
  spotName: string;
  userId: string;
  onCheckInComplete?: () => void;
}

interface CheckInData {
  duration: string;
  busyness: string;
  notes?: string;
}

const DURATION_OPTIONS = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3 hours' },
  { value: '240', label: '4 hours' },
  { value: 'custom', label: 'Custom' },
];

const BUSYNESS_OPTIONS = [
  { value: 'empty', label: 'Empty' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'busy', label: 'Busy' },
  { value: 'full', label: 'Full' },
];

const defaultProps = {
  onCheckInComplete: () => undefined,
};

const CheckInButton = ({
  spotId,
  spotName,
  userId,
  onCheckInComplete = defaultProps.onCheckInComplete,
}: CheckInButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCheckIn, setCurrentCheckIn] = useState<any>(null);
  const [checkInData, setCheckInData] = useState<CheckInData>({
    duration: '60',
    busyness: 'moderate',
    notes: '',
  });
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCheckInData({
      duration: '60',
      busyness: 'moderate',
      notes: '',
    });
    setCustomDuration('');
    setShowCustomDuration(false);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setShowCustomDuration(value === 'custom');
    setCheckInData({
      ...checkInData,
      duration: value,
    });
  };

  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCustomDuration(value);
    setCheckInData({
      ...checkInData,
      duration: value,
    });
  };

  const getButtonText = () => {
    if (isLoading) {
      return 'Processing...';
    }
    return isCheckedIn ? 'Check Out' : 'Check In';
  };

  // In your CheckInButton component
  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const finalDuration = showCustomDuration ? customDuration : checkInData.duration;

      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          spotId,
          duration: parseInt(finalDuration, 10),
          busyness: checkInData.busyness,
          notes: checkInData.notes,
        }),
      });

      if (response.ok) {
        const checkIn = await response.json();
        setCurrentCheckIn(checkIn);
        setIsCheckedIn(true);
        setShowModal(false);

        // Call the callback to update parent component
        onCheckInComplete();
      } else {
        console.error('Failed to check in');
      }
    } catch (error) {
      console.error('Error checking in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentCheckIn) {
      console.error('No active check-in found');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/checkins', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkInId: currentCheckIn.id,
        }),
      });

      if (response.ok) {
        setCurrentCheckIn(null);
        setIsCheckedIn(false);

        // Call the callback after checkout too
        onCheckInComplete();
      }
    } catch (error) {
      console.error('Error checking out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={isCheckedIn ? 'danger' : 'primary'}
        onClick={isCheckedIn ? handleCheckOut : handleModalOpen}
        disabled={isLoading}
        className="d-flex align-items-center gap-2"
      >
        <MapPin size={18} />
        {getButtonText()}
      </Button>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {'Check In to '}
            {spotName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>How long do you plan to stay?</Form.Label>
              <Form.Select
                value={checkInData.duration}
                onChange={handleDurationChange}
                className="mb-2"
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
              {showCustomDuration && (
                <Form.Control
                  type="number"
                  placeholder="Enter minutes"
                  value={customDuration}
                  onChange={handleCustomDurationChange}
                  min="1"
                  max="480"
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>How busy is it right now?</Form.Label>
              <Form.Select
                value={checkInData.busyness}
                onChange={(e) => setCheckInData({ ...checkInData, busyness: e.target.value })}
              >
                {BUSYNESS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Add any additional notes (e.g., 'Good seating near outlets')"
                value={checkInData.notes}
                onChange={(e) => setCheckInData({ ...checkInData, notes: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCheckIn}
            disabled={isLoading || (showCustomDuration && !customDuration)}
          >
            Check In
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

CheckInButton.defaultProps = defaultProps;

export default CheckInButton;
