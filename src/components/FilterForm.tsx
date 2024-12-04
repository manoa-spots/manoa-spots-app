'use client';

import React, { useState } from 'react';

interface FilterFormProps {
  onApplyFilters: (filters: {
    hasOutlets: boolean;
    hasParking: boolean;
    hasFoodDrinks: boolean;
    maxGroupSize: string;
    type: string;
  }) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    hasOutlets: false,
    hasParking: false,
    hasFoodDrinks: false,
    maxGroupSize: '',
    type: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFilters((prev) => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  return (
    <div className="filter-card">
      <form onSubmit={handleSubmit}>
        <div className="filter-group">
          <label htmlFor="hasOutlets" className="checkbox-label">
            <input
              type="checkbox"
              id="hasOutlets"
              name="hasOutlets"
              checked={filters.hasOutlets}
              onChange={handleChange}
            />
            Outlets
          </label>
          <label htmlFor="hasParking" className="checkbox-label">
            <input
              type="checkbox"
              id="hasParking"
              name="hasParking"
              checked={filters.hasParking}
              onChange={handleChange}
            />
            Parking
          </label>
          <label htmlFor="hasFoodDrinks" className="checkbox-label">
            <input
              type="checkbox"
              id="hasFoodDrinks"
              name="hasFoodDrinks"
              checked={filters.hasFoodDrinks}
              onChange={handleChange}
            />
            Food/Drinks
          </label>
        </div>
        <div className="filter-group">
          <label htmlFor="maxGroupSize" className="form-label">
            Max Group Size:
            <input
              type="number"
              id="maxGroupSize"
              name="maxGroupSize"
              value={filters.maxGroupSize}
              onChange={handleChange}
              className="form-control"
            />
          </label>
        </div>
        <div className="filter-group">
          <label htmlFor="type" className="form-label">
            Type:
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Any</option>
              <option value="library">Library</option>
              <option value="cafe">Cafe</option>
              <option value="park">Park</option>
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default FilterForm;
