import { useNavigate } from 'react-router-dom';
import type { Property } from '../../types/property.types';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
}

/**
 * PropertyCard Component
 * Afișează un card cu informații despre o proprietate
 */
export const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  // Formatare preț
  const formattedPrice = new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
  }).format(property.price);

  // Prima imagine sau placeholder
  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="propertyCard" onClick={handleClick}>
      <div className="propertyCardImage">
        <img src={mainImage} alt={property.title} />
        <div className={`propertyCardStatus ${property.status.toLowerCase()}`}>
          {property.status}
        </div>
      </div>
      
      <div className="propertyCardContent">
        <div className="propertyCardHeader">
          <h3 className="propertyCardTitle">{property.title}</h3>
          <div className="propertyCardPrice">{formattedPrice}/night</div>
        </div>
        
        <p className="propertyCardLocation">
          📍 {property.city}, {property.country}
        </p>
        
        <p className="propertyCardDescription">
          {property.description.length > 100
            ? `${property.description.substring(0, 100)}...`
            : property.description}
        </p>
        
        <div className="propertyCardDetails">
          <span className="propertyCardDetail">🛏️ {property.bedrooms} bedrooms</span>
          <span className="propertyCardDetail">🚿 {property.bathrooms} bathrooms</span>
          <span className="propertyCardDetail">👥 {property.maxGuests} guests</span>
        </div>
        
        {property.facilities && property.facilities.length > 0 && (
          <div className="propertyCardFacilities">
            {property.facilities.slice(0, 3).map((facility, index) => (
              <span key={index} className="propertyCardFacility">
                {facility}
              </span>
            ))}
            {property.facilities.length > 3 && (
              <span className="propertyCardFacility">
                +{property.facilities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};