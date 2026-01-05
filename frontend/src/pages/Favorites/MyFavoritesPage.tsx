import { useMyFavorites } from '../../features/favorites';
import { useAuthStore } from '../../features/auth';
import { PropertyCard } from '../../features/properties/components/PropertyCard/PropertyCard';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyFavoritesPage.css';

/**
 * MyFavoritesPage - Pagina cu favorite-urile utilizatorului
 */
export const MyFavoritesPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { data: favorites, isLoading, error, refetch } = useMyFavorites();

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
      <div className="myFavoritesPage">
        <div className="myFavoritesLoading">
          <div className="loadingSpinner"></div>
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myFavoritesPage">
        <div className="myFavoritesError">
          <p>❌ Error loading favorites</p>
          <button className="myFavoritesRetryButton" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Mapare date din API la tipul Property
  const mappedFavorites = favorites
    ? favorites.map((f: any) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        price: f.price,
        address: f.address,
        city: f.city,
        country: f.country,
        bedrooms: f.bedrooms,
        bathrooms: f.bathrooms,
        maxGuests: f.maxGuests,
        facilities: f.facilities || [],
        images: f.images || [],
        status: f.status,
        ownerId: f.userId || f.ownerId || '',
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      }))
    : [];

  return (
    <div className="myFavoritesPage">
      <div className="myFavoritesHeader">
        <div className="myFavoritesHeaderContent">
          <h1 className="myFavoritesTitle">My Favorites</h1>
          <p className="myFavoritesSubtitle">
            Your saved properties for future stays
          </p>
        </div>
      </div>

      <div className="myFavoritesContent">
        <div className="myFavoritesContainer">
          {mappedFavorites.length === 0 ? (
            <div className="myFavoritesEmpty">
              <div className="myFavoritesEmptyIcon">❤️</div>
              <h2>No favorites yet</h2>
              <p>Start exploring properties and add them to your favorites!</p>
              <button
                className="myFavoritesExploreButton"
                onClick={() => navigate('/properties')}
              >
                Explore Properties
              </button>
            </div>
          ) : (
            <>
              <div className="myFavoritesHeaderActions">
                <div className="myFavoritesCount">
                  {mappedFavorites.length} {mappedFavorites.length === 1 ? 'favorite' : 'favorites'}
                </div>
              </div>
              <div className="myFavoritesList">
                {mappedFavorites.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
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

