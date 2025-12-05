import { useState, useEffect } from 'react';
import { useSearchProperties } from '../../features/properties/hooks/useProperties';
import { PropertyList } from '../../features/properties/components/PropertyList/PropertyList';
import { PropertyFilter } from '../../features/properties/components/PropertyFilter/PropertyFilter';
import type { PropertyFilters, Property } from '../../features/properties/types/property.types';
import { useAuthStore } from '../../features/auth';
import { useNavigate } from 'react-router-dom';
import './PropertiesPage.css';

/**
 * PropertiesPage - Pagina principală pentru afișarea proprietăților
 * Similar cu un Angular Component cu routing și data fetching
 */
export const PropertiesPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchParams, setSearchParams] = useState<{
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    status?: 'AVAILABLE' | 'RESERVED' | 'UNAVAILABLE';
    page?: number;
    limit?: number;
  }>({
    page: 1,
    limit: 12,
  });

  // Hook pentru căutare proprietăți
  const { data, isLoading, error, refetch } = useSearchProperties(searchParams);

  // Actualizează searchParams când se schimbă filtrele
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      ...filters,
      page: 1, // Reset la prima pagină când se schimbă filtrele
    }));
  }, [filters]);

  // Mapare date din API la tipul Property
  // Backend returnează array direct, nu obiect cu properties
  const properties: Property[] = Array.isArray(data) 
    ? data.map((prop: any) => ({
        id: prop.id,
        title: prop.title,
        description: prop.description,
        price: prop.price,
        address: prop.address,
        city: prop.city,
        country: prop.country,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        maxGuests: prop.maxGuests,
        facilities: prop.facilities || [],
        images: prop.images || [],
        status: prop.status as Property['status'],
        ownerId: prop.userId || prop.ownerId,
        createdAt: prop.createdAt,
        updatedAt: prop.updatedAt,
      }))
    : data?.properties?.map((prop: any) => ({
        id: prop.id,
        title: prop.title,
        description: prop.description,
        price: prop.price,
        address: prop.address,
        city: prop.city,
        country: prop.country,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        maxGuests: prop.maxGuests,
        facilities: prop.facilities || [],
        images: prop.images || [],
        status: prop.status as Property['status'],
        ownerId: prop.userId || prop.ownerId,
        createdAt: prop.createdAt,
        updatedAt: prop.updatedAt,
      })) || [];

  return (
    <div className="propertiesPage">
      <div className="propertiesPageHeader">
        <div className="propertiesPageHeaderContent">
          <h1 className="propertiesPageTitle">Find Your Perfect Stay</h1>
          <p className="propertiesPageSubtitle">
            Discover amazing places to stay around the world
          </p>
          {isAuthenticated && (
            <button
              className="propertiesPageCreateButton"
              onClick={() => navigate('/properties/create')}
            >
              + Create Property
            </button>
          )}
        </div>
      </div>

      <div className="propertiesPageContent">
        <div className="propertiesPageContainer">
          <PropertyFilter onFilterChange={setFilters} initialFilters={filters} />
          
          <div className="propertiesPageResults">
            {properties.length > 0 && (
              <div className="propertiesPageResultsHeader">
                <p className="propertiesPageResultsCount">
                  {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                </p>
              </div>
            )}
            
            <PropertyList
              properties={properties}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};