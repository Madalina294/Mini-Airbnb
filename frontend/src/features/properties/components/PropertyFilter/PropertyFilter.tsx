import { useState } from 'react';
import type { PropertyFilters } from '../../types/property.types';
import './PropertyFilter.css';

interface PropertyFilterProps {
  onFilterChange: (filters: PropertyFilters) => void;
  initialFilters?: PropertyFilters;
}

/**
 * PropertyFilter Component
 * Componentă pentru filtrarea proprietăților
 */
export const PropertyFilter = ({ onFilterChange, initialFilters = {} }: PropertyFilterProps) => {
  const [filters, setFilters] = useState<PropertyFilters>({
    city: initialFilters.city || '',
    country: initialFilters.country || '',
    minPrice: initialFilters.minPrice,
    maxPrice: initialFilters.maxPrice,
    bedrooms: initialFilters.bedrooms,
    status: initialFilters.status,
  });

  const handleChange = (field: keyof PropertyFilters, value: string | number | undefined) => {
    const newFilters = {
      ...filters,
      [field]: value === '' ? undefined : value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: PropertyFilters = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="propertyFilter">
      <h3 className="propertyFilterTitle">Search Filters</h3>
      
      <div className="propertyFilterGrid">
        <div className="propertyFilterGroup">
          <label htmlFor="city" className="propertyFilterLabel">City</label>
          <input
            type="text"
            id="city"
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Enter city"
            className="propertyFilterInput"
          />
        </div>

        <div className="propertyFilterGroup">
          <label htmlFor="country" className="propertyFilterLabel">Country</label>
          <input
            type="text"
            id="country"
            value={filters.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Enter country"
            className="propertyFilterInput"
          />
        </div>

        <div className="propertyFilterGroup">
          <label htmlFor="minPrice" className="propertyFilterLabel">Min Price (€)</label>
          <input
            type="number"
            id="minPrice"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            min="0"
            className="propertyFilterInput"
          />
        </div>

        <div className="propertyFilterGroup">
          <label htmlFor="maxPrice" className="propertyFilterLabel">Max Price (€)</label>
          <input
            type="number"
            id="maxPrice"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="1000"
            min="0"
            className="propertyFilterInput"
          />
        </div>

        <div className="propertyFilterGroup">
          <label htmlFor="bedrooms" className="propertyFilterLabel">Bedrooms</label>
          <input
            type="number"
            id="bedrooms"
            value={filters.bedrooms || ''}
            onChange={(e) => handleChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Any"
            min="1"
            className="propertyFilterInput"
          />
        </div>

        <div className="propertyFilterGroup">
          <label htmlFor="status" className="propertyFilterLabel">Status</label>
          <select
            id="status"
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value as PropertyFilters['status'])}
            className="propertyFilterSelect"
          >
            <option value="">All</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="propertyFilterReset"
      >
        Reset Filters
      </button>
    </div>
  );
};