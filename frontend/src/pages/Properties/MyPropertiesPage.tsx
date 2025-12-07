import { useMyProperties } from '../../features/properties/hooks/useProperties';
import { useAuthStore } from '../../features/auth';
import { MyPropertyCard } from '../../features/properties/components/MyPropertyCard/MyPropertyCard';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPropertiesPage.css';

/**
 * MyPropertiesPage - Pagina cu proprietățile utilizatorului (host)
 */
export const MyPropertiesPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { data: properties, isLoading, error, refetch } = useMyProperties();

  // Redirect dacă utilizatorul nu este autentificat
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="myPropertiesPage">
        <div className="myPropertiesLoading">
          <div className="loadingSpinner"></div>
          <p>Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myPropertiesPage">
        <div className="myPropertiesError">
          <p>❌ Error loading properties</p>
          <button className="myPropertiesRetryButton" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Mapare date din API la tipul Property
  const mappedProperties = properties
    ? properties.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        address: p.address,
        city: p.city,
        country: p.country,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        maxGuests: p.maxGuests,
        facilities: p.facilities || [],
        images: p.images || [],
        status: p.status,
        ownerId: p.userId || p.ownerId || '',
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }))
    : [];

  return (
    <div className="myPropertiesPage">
      <div className="myPropertiesHeader">
        <div className="myPropertiesHeaderContent">
          <h1 className="myPropertiesTitle">My Properties</h1>
          <p className="myPropertiesSubtitle">
            Manage and edit all your listed properties
          </p>
        </div>
      </div>

      <div className="myPropertiesContent">
        <div className="myPropertiesContainer">
          {mappedProperties.length === 0 ? (
            <div className="myPropertiesEmpty">
              <div className="myPropertiesEmptyIcon">🏠</div>
              <h2>No properties yet</h2>
              <p>Start sharing your space with travelers around the world!</p>
              <button
                className="myPropertiesCreateButton"
                onClick={() => navigate('/properties/create')}
              >
                Create Your First Property
              </button>
            </div>
          ) : (
            <>
              <div className="myPropertiesHeaderActions">
                <div className="myPropertiesCount">
                  {mappedProperties.length} {mappedProperties.length === 1 ? 'property' : 'properties'}
                </div>
                <button
                  className="myPropertiesAddButton"
                  onClick={() => navigate('/properties/create')}
                >
                  + Add New Property
                </button>
              </div>
              <div className="myPropertiesList">
                {mappedProperties.map((property) => (
                  <MyPropertyCard
                    key={property.id}
                    property={property}
                    onDelete={() => refetch()}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};