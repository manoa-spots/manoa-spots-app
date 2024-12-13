// src/components/BusyIndicator.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { PersonFill } from 'react-bootstrap-icons';

interface SpotBusynessIndicatorProps {
  spotId: string;
  onUpdate?: () => void;
}

const defaultProps = {
  onUpdate: () => undefined,
};

const SpotBusynessIndicator = ({
  spotId,
  onUpdate = defaultProps.onUpdate,
}: SpotBusynessIndicatorProps) => {
  const [busynessData, setBusynessData] = useState({
    currentBusyness: 'unknown',
    activeCheckIns: 0,
  });

  const fetchBusynessData = useCallback(async () => {
    try {
      const response = await fetch(`/api/spots/busyness?spotId=${spotId}`);

      if (response.ok) {
        const errorText = await response.text();
        console.error('Busyness API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        return;
      }

      const data = await response.json();
      console.log('Received busyness data:', data); // Add logging
      setBusynessData(data);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error fetching busyness:', error);
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
      <span className="text-capitalize">{busynessData.currentBusyness}</span>
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
