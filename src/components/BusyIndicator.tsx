'use client';

import { useState, useEffect, useCallback } from 'react';
import { PersonFill } from 'react-bootstrap-icons';

interface SpotBusynessIndicatorProps {
  spotId: string;
  onUpdate?: () => void;
}

interface BusynessData {
  currentBusyness: string;
  activeCheckIns: number;
}

const defaultProps = {
  onUpdate: () => undefined,
};

const SpotBusynessIndicator = ({
  spotId,
  onUpdate = defaultProps.onUpdate,
}: SpotBusynessIndicatorProps) => {
  const [busynessData, setBusynessData] = useState<BusynessData>({
    currentBusyness: 'unknown',
    activeCheckIns: 0,
  });

  const fetchBusynessData = useCallback(async () => {
    console.log('Fetching busyness data for spot:', spotId); // Add logging
    try {
      console.log('Fetching busyness data for spot:', spotId);
      const response = await fetch(`/api/spots/busyness?spotId=${spotId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received busyness data:', data);

      // Only update state if we have valid data
      if (data && typeof data.currentBusyness === 'string' && typeof data.activeCheckIns === 'number') {
        setBusynessData({
          currentBusyness: data.currentBusyness,
          activeCheckIns: data.activeCheckIns,
        });
        onUpdate();
      }
    } catch (error) {
      console.error('Error fetching busyness:', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [spotId, onUpdate]);

  useEffect(() => {
    fetchBusynessData();
    const interval = setInterval(fetchBusynessData, 60000);
    return () => clearInterval(interval);
  }, [fetchBusynessData]);

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
      <span className="text-capitalize">
        {busynessData.currentBusyness}
      </span>
      <span className="text-muted small">
        (
        {busynessData.activeCheckIns}
        people here)
      </span>
    </div>
  );
};

SpotBusynessIndicator.defaultProps = defaultProps;

export default SpotBusynessIndicator;
