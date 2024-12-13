// src/components/SpotBusynessIndicator.tsx

'use client';

import { useState, useEffect } from 'react';
import { PersonFill } from 'react-bootstrap-icons';

interface SpotBusynessIndicatorProps {
  spotId: string;
}

const SpotBusynessIndicator = ({ spotId }: SpotBusynessIndicatorProps) => {
  const [busynessData, setBusynessData] = useState({
    currentBusyness: 'unknown',
    activeCheckIns: 0,
  });

  useEffect(() => {
    const fetchBusynessData = async () => {
      try {
        const response = await fetch(`/api/spots/busyness?spotId=${spotId}`);
        if (response.ok) {
          const data = await response.json();
          setBusynessData(data);
        }
      } catch (error) {
        console.error('Error fetching busyness:', error);
      }
    };

    fetchBusynessData();
    const interval = setInterval(fetchBusynessData, 60000);
    return () => clearInterval(interval);
  }, [spotId]);

  const getBusynessColor = () => {
    const colors = {
      empty: 'text-success',
      quiet: 'text-success',
      moderate: 'text-warning',
      busy: 'text-warning',
      full: 'text-danger',
    };
    return colors[busynessData.currentBusyness as keyof typeof colors] || 'text-muted';
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <PersonFill className={getBusynessColor()} size={18} />
      <span className="text-capitalize">{busynessData.currentBusyness}</span>
      <span className="text-muted small">
        (
        {busynessData.activeCheckIns}
        people here)
      </span>
    </div>
  );
};

export default SpotBusynessIndicator;
