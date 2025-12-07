import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '../../features/properties/hooks/useProperties';
import { useAuthStore } from '../../features/auth';
import { CreatePropertyForm } from '../../features/properties/components/CreatePropertyForm/CreatePropertyForm';
import type { Property } from '../../features/properties/types/property.types';
import './EditPropertyPage.css';

/**
 * EditPropertyPage - Pagina pentru editarea unei proprietăți
 */
export const EditPropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const { data, isLoading, error } = useProperty(id);

  // Mapare date din API la tipul Property
  const property: Property | null = data
    ? {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        address: data.address,
        city: data.city,
        country: data.country,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        maxGuests: data.maxGuests,
        facilities: data.facilities || [],
        images: data.images || [],
        status: data.status as Property['status'],
        ownerId: (data as any).userId || (data as any).ownerId || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
    : null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (property && user && property.ownerId !== user.id) {
      navigate(`/properties/${property.id}`);
    }
  }, [property, user, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="editPropertyPage">
        <div className="editPropertyPageLoading">
          <div className="loadingSpinner"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="editPropertyPage">
        <div className="editPropertyPageError">
          <p>❌ Property not found</p>
          <button
            className="editPropertyPageBackButton"
            onClick={() => navigate('/properties')}
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === property.ownerId;
  if (!isOwner) {
    return (
      <div className="editPropertyPage">
        <div className="editPropertyPageError">
          <p>❌ You are not authorized to edit this property</p>
          <button
            className="editPropertyPageBackButton"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            Back to Property Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editPropertyPage">
      <div className="editPropertyPageHeader">
        <div className="editPropertyPageHeaderContent">
          <h1 className="editPropertyPageTitle">Edit Property</h1>
          <p className="editPropertyPageSubtitle">
            Update your property information
          </p>
        </div>
      </div>

      <div className="editPropertyPageContent">
        <div className="editPropertyPageContainer">
          <CreatePropertyForm property={property} />
        </div>
      </div>
    </div>
  );
};