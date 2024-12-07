'use client';

import React, { useState } from 'react';
import { ParkingCircle, Coffee, Users, Library, Power } from 'lucide-react';

interface FilterFormProps {
  onApplyFilters: (filters: {
    hasOutlets: boolean;
    hasParking: string;
    hasFoodDrinks: boolean;
    maxGroupSize: string;
    type: string;
  }) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    hasOutlets: false,
    hasParking: 'No',
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
      <h3 className="section-header">Filter Spots</h3>
      <form onSubmit={handleSubmit}>
        {/* Amenities Section */}
        <div className="form-section">
          <h4 className="section-header">
            <span className="d-flex align-items-center gap-2">Amenities</span>
          </h4>
          <div className="amenities-container">
            <label htmlFor="hasOutlets" className="checkbox-label">
              <input
                type="checkbox"
                id="hasOutlets"
                name="hasOutlets"
                checked={filters.hasOutlets}
                onChange={handleChange}
              />
              <Power size={16} className="me-2" />
              <span>Outlets Available</span>
            </label>

            <label htmlFor="hasFoodDrinks" className="checkbox-label">
              <input
                type="checkbox"
                id="hasFoodDrinks"
                name="hasFoodDrinks"
                checked={filters.hasFoodDrinks}
                onChange={handleChange}
              />
              <Coffee size={16} className="me-2" />
              <span>Food/Drinks Allowed</span>
            </label>
          </div>
        </div>

        {/* Parking Section */}
        <div className="form-section">
          <h4 className="section-header">
            <span className="d-flex align-items-center gap-2">
              <ParkingCircle size={16} />
              Parking Options
            </span>
          </h4>
          <select
            id="hasParking"
            name="hasParking"
            value={filters.hasParking}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Any Parking</option>
            <option value="Yes">Parking Available</option>
            <option value="No">No Parking</option>
            <option value="Street parking only">Street Parking Only</option>
            <option value="Campus parking pass required">Campus Parking Required</option>
            <option value="Paid parking available">Paid Parking</option>
          </select>
        </div>

        {/* Capacity Section */}
        <div className="form-section">
          <h4 className="section-header">
            <span className="d-flex align-items-center gap-2">
              <Users size={16} />
              Group Size
            </span>
          </h4>
          <input
            type="number"
            id="maxGroupSize"
            name="maxGroupSize"
            value={filters.maxGroupSize}
            onChange={handleChange}
            placeholder="Minimum capacity needed"
            className="form-control"
            min="1"
          />
        </div>

        {/* Type Section */}
        <div className="form-section">
          <h4 className="section-header">
            <span className="d-flex align-items-center gap-2">
              <Library size={16} />
              Spot Type
            </span>
          </h4>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Any Type</option>
            <option value="LIBRARY">Library</option>
            <option value="CAFE">Café</option>
            <option value="COWORKING">Coworking Space</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-4">
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default FilterForm;
