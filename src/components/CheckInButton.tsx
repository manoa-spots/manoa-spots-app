import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MapPin, Clock } from 'lucide-react';

interface CheckInButtonProps {
  spotId: string;
  spotName: string;
  userId: string;
}

interface CheckIn {
  id: string;
  userId: string;
  spotId: string;
  status: string;
  createdAt: string;
}

const CheckInButton = ({ spotId, spotName, userId }: CheckInButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCheckIn, setCurrentCheckIn] = useState<CheckIn | null>(null);

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          spotId,
        }),
      });

      if (response.ok) {
        const checkIn = await response.json();
        setCurrentCheckIn(checkIn);
        setIsCheckedIn(true);
        setShowModal(true);
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
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error checking out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return 'Processing...';
    }
    return isCheckedIn ? 'Check Out' : 'Check In';
  };

  return (
    <>
      <Button
        variant={isCheckedIn ? 'danger' : 'primary'}
        onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
        disabled={isLoading}
        className="d-flex align-items-center gap-2"
      >
        <MapPin size={18} />
        {getButtonText()}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Checked In!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <MapPin size={40} className="text-primary" />
            </div>
            <h4>
              You&apos;re checked in at
              {spotName}
            </h4>
            <p className="text-muted">
              <Clock size={16} className="me-1" />
              {new Date().toLocaleTimeString()}
            </p>
            <p className="mt-3">
              Don&apos;t forget to check out when you leave!
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCheckOut}>
            Check Out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CheckInButton;
