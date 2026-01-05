import { useNavigate } from 'react-router-dom';
import type { Property } from '../../types/property.types';
import { useCheckFavorite, useToggleFavorite } from '../../../favorites';
import { useAuthStore } from '../../../auth';
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
  const { isAuthenticated } = useAuthStore();
  
  // Hook pentru verificarea dacă proprietatea este în favorite
  const { data: isFavorite = false } = useCheckFavorite(property.id, isAuthenticated);
  
  // Hook pentru toggle favorite
  const { toggle, isPending } = useToggleFavorite();

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne navigarea la detalii când se dă click pe butonul de favorite
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await toggle(property.id, isFavorite);
    } catch (error: any) {
      // Erorile 409 (Conflict) și 404 (Not Found) sunt deja gestionate în hook-uri
      // Nu mai logăm aceste erori pentru a evita spam-ul în console
      if (error?.response?.status !== 409 && error?.response?.status !== 404) {
        console.error('Error toggling favorite:', error);
      }
    }
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
        {/* Buton Favorite */}
        {isAuthenticated && (
          <button
            className={`propertyCardFavorite ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            disabled={isPending}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}
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