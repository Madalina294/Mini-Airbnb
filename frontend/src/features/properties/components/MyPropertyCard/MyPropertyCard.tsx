import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteProperty } from '../../hooks/useProperties';
import type { Property } from '../../types/property.types';
import './MyPropertyCard.css';

interface MyPropertyCardProps {
  property: Property;
  onDelete?: () => void;
}

/**
 * MyPropertyCard Component
 * Card pentru proprietățile utilizatorului cu acțiuni de editare/ștergere
 * Reutilizează stilurile de la PropertyCard
 */
export const MyPropertyCard = ({ property, onDelete }: MyPropertyCardProps) => {
  const navigate = useNavigate();
  const deletePropertyMutation = useDeleteProperty();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Nu naviga dacă click-ul este pe buton
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/properties/${property.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/properties/${property.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePropertyMutation.mutate(property.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        if (onDelete) {
          onDelete();
        }
      },
    });
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
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
    <div className="myPropertyCard" onClick={handleCardClick}>
      <div className="myPropertyCardImage">
        <img src={mainImage} alt={property.title} />
        <div className={`myPropertyCardStatus ${property.status.toLowerCase()}`}>
          {property.status}
        </div>
      </div>
      
      <div className="myPropertyCardContent">
        <div className="myPropertyCardHeader">
          <h3 className="myPropertyCardTitle">{property.title}</h3>
          <div className="myPropertyCardPrice">{formattedPrice}/night</div>
        </div>
        
        <p className="myPropertyCardLocation">
          📍 {property.city}, {property.country}
        </p>
        
        <p className="myPropertyCardDescription">
          {property.description.length > 100
            ? `${property.description.substring(0, 100)}...`
            : property.description}
        </p>
        
        <div className="myPropertyCardDetails">
          <span className="myPropertyCardDetail">🛏️ {property.bedrooms} bedrooms</span>
          <span className="myPropertyCardDetail">🚿 {property.bathrooms} bathrooms</span>
          <span className="myPropertyCardDetail">👥 {property.maxGuests} guests</span>
        </div>
        
        {property.facilities && property.facilities.length > 0 && (
          <div className="myPropertyCardFacilities">
            {property.facilities.slice(0, 3).map((facility, index) => (
              <span key={index} className="myPropertyCardFacility">
                {facility}
              </span>
            ))}
            {property.facilities.length > 3 && (
              <span className="myPropertyCardFacility">
                +{property.facilities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Acțiuni */}
        <div className="myPropertyCardActions">
          <button
            className="myPropertyCardEditButton"
            onClick={handleEdit}
            disabled={deletePropertyMutation.isPending}
          >
            ✏️ Edit
          </button>
          {!showDeleteConfirm ? (
            <button
              className="myPropertyCardDeleteButton"
              onClick={handleDelete}
              disabled={deletePropertyMutation.isPending}
            >
              🗑️ Delete
            </button>
          ) : (
            <div className="myPropertyCardDeleteConfirm">
              <span className="myPropertyCardDeleteConfirmText">Are you sure?</span>
              <button
                className="myPropertyCardConfirmButton"
                onClick={confirmDelete}
                disabled={deletePropertyMutation.isPending}
              >
                {deletePropertyMutation.isPending ? 'Deleting...' : 'Yes'}
              </button>
              <button
                className="myPropertyCardCancelButton"
                onClick={cancelDelete}
                disabled={deletePropertyMutation.isPending}
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};