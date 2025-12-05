import { PropertyCard } from '../PropertyCard/PropertyCard';
import type { Property } from '../../types/property.types';
import './PropertyList.css';

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * PropertyList Component
 * Afișează o listă de proprietăți
 * Similar cu *ngFor în Angular
 */
export const PropertyList = ({ properties, isLoading, error }: PropertyListProps) => {
  if (isLoading) {
    return (
      <div className="propertyListLoading">
        <div className="loadingSpinner"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="propertyListError">
        <p>❌ Error loading properties: {error.message}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="propertyListEmpty">
        <p>🔍 No properties found</p>
        <p>Try adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div className="propertyList">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};