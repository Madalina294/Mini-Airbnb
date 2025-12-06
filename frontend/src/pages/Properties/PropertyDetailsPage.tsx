import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '../../features/properties/hooks/useProperties';
import { useAuthStore } from '../../features/auth';
import type { Property } from '../../features/properties/types/property.types';
import { PropertyGallery } from '../../features/properties/components/PropertyGallery/PropertyGallery';
import './PropertyDetailsPage.css';

/**
 * PropertyDetailsPage - Pagina cu detalii despre o proprietate
 * Similar cu un Angular Component cu route params
 */
export const PropertyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // Hook pentru obținerea proprietății
  const { data, isLoading, error } = useProperty(id);

  // Mapare date din API la tipul Property
  // Backend-ul returnează 'userId', dar tipul Property folosește 'ownerId'
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
        ownerId: (data as any).userId || (data as any).ownerId || '', // Backend returnează userId
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
    : null;

  // Formatare preț
  const formattedPrice = property
    ? new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'EUR',
      }).format(property.price)
    : '';

  if (isLoading) {
    return (
      <div className="propertyDetailsPage">
        <div className="propertyDetailsLoading">
          <div className="loadingSpinner"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="propertyDetailsPage">
        <div className="propertyDetailsError">
          <p>❌ Property not found</p>
          <button
            className="propertyDetailsBackButton"
            onClick={() => navigate('/properties')}
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === property.ownerId;

  return (
    <div className="propertyDetailsPage">
      <div className="propertyDetailsHeader">
        <button
          className="propertyDetailsBackButton"
          onClick={() => navigate('/properties')}
        >
          ← Back to Properties
        </button>
        {isOwner && (
          <div className="propertyDetailsOwnerActions">
            <button
              className="propertyDetailsEditButton"
              onClick={() => navigate(`/properties/${property.id}/edit`)}
            >
              Edit Property
            </button>
          </div>
        )}
      </div>

      <div className="propertyDetailsContent">
        <div className="propertyDetailsMain">
          {/* Gallery */}
          <PropertyGallery images={property.images} title={property.title} />

          {/* Title and Location */}
          <div className="propertyDetailsInfo">
            <div className="propertyDetailsTitleSection">
              <h1 className="propertyDetailsTitle">{property.title}</h1>
              <div className="propertyDetailsLocation">
                📍 {property.address}, {property.city}, {property.country}
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="propertyDetailsGrid">
              <div className="propertyDetailsDetail">
                <span className="propertyDetailsDetailIcon">🛏️</span>
                <div>
                  <div className="propertyDetailsDetailLabel">Bedrooms</div>
                  <div className="propertyDetailsDetailValue">{property.bedrooms}</div>
                </div>
              </div>
              <div className="propertyDetailsDetail">
                <span className="propertyDetailsDetailIcon">🚿</span>
                <div>
                  <div className="propertyDetailsDetailLabel">Bathrooms</div>
                  <div className="propertyDetailsDetailValue">{property.bathrooms}</div>
                </div>
              </div>
              <div className="propertyDetailsDetail">
                <span className="propertyDetailsDetailIcon">👥</span>
                <div>
                  <div className="propertyDetailsDetailLabel">Max Guests</div>
                  <div className="propertyDetailsDetailValue">{property.maxGuests}</div>
                </div>
              </div>
              <div className="propertyDetailsDetail">
                <span className="propertyDetailsDetailIcon">📊</span>
                <div>
                  <div className="propertyDetailsDetailLabel">Status</div>
                  <div className={`propertyDetailsStatus ${property.status.toLowerCase()}`}>
                    {property.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="propertyDetailsDescription">
              <h2 className="propertyDetailsSectionTitle">About this place</h2>
              <p>{property.description}</p>
            </div>

            {/* Facilities */}
            {property.facilities && property.facilities.length > 0 && (
              <div className="propertyDetailsFacilities">
                <h2 className="propertyDetailsSectionTitle">What this place offers</h2>
                <div className="propertyDetailsFacilitiesGrid">
                  {property.facilities.map((facility, index) => (
                    <div key={index} className="propertyDetailsFacility">
                      <span className="propertyDetailsFacilityIcon">✓</span>
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Card (Sidebar) */}
        <div className="propertyDetailsSidebar">
          <div className="propertyDetailsBookingCard">
            <div className="propertyDetailsBookingPrice">
              <span className="propertyDetailsBookingPriceAmount">{formattedPrice}</span>
              <span className="propertyDetailsBookingPricePeriod">/ night</span>
            </div>
            <div className="propertyDetailsBookingStatus">
              <span className={`propertyDetailsStatusBadge ${property.status.toLowerCase()}`}>
                {property.status}
              </span>
            </div>
            {isAuthenticated && !isOwner && property.status === 'AVAILABLE' && (
              <button
                className="propertyDetailsBookingButton"
                onClick={() => navigate(`/properties/${property.id}/book`)}
              >
                Book Now
              </button>
            )}
            {!isAuthenticated && (
              <button
                className="propertyDetailsBookingButton"
                onClick={() => navigate('/login')}
              >
                Login to Book
              </button>
            )}
            {isOwner && (
              <p className="propertyDetailsOwnerNote">
                This is your property. You cannot book it.
              </p>
            )}
            {property.status !== 'AVAILABLE' && (
              <p className="propertyDetailsUnavailableNote">
                This property is currently {property.status.toLowerCase()}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};