import React, { useState, useEffect } from 'react';

type CheckInButtonProps = {
  spotId: string;
};

const CheckInButton: React.FC<CheckInButtonProps> = ({ spotId }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInCount, setCheckInCount] = useState(0);

  // Load check-in state and count from local storage on mount
  useEffect(() => {
    const storedCheckIn = localStorage.getItem(`checkedIn-${spotId}`);
    if (storedCheckIn === 'true') {
      setIsCheckedIn(true);
    }

    const storedCount = localStorage.getItem(`checkInCount-${spotId}`);
    if (storedCount) {
      setCheckInCount(parseInt(storedCount, 10));
    }
  }, [spotId]);

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      localStorage.setItem(`checkedIn-${spotId}`, 'true');

      // Increment the check-in count
      const newCount = checkInCount + 1;
      setCheckInCount(newCount);
      localStorage.setItem(`checkInCount-${spotId}`, newCount.toString());
    }
  };

  const handleCheckOut = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      localStorage.removeItem(`checkedIn-${spotId}`);

      // Decrement the check-in count
      const newCount = Math.max(checkInCount - 1, 0);
      setCheckInCount(newCount);
      localStorage.setItem(`checkInCount-${spotId}`, newCount.toString());
    }
  };

  const getCheckInText = () => {
    if (checkInCount === 1) return '1 person checked in';
    return `${checkInCount} people checked in`;
  };

  return (
    <div>
      <div className="mb-2">
        <span>{getCheckInText()}</span>
      </div>
      {isCheckedIn ? (
        <button type="button" onClick={handleCheckOut} className="btn btn-danger">
          Check Out
        </button>
      ) : (
        <button type="button" onClick={handleCheckIn} className="btn btn-primary">
          Check In
        </button>
      )}
    </div>
  );
};

export default CheckInButton;
