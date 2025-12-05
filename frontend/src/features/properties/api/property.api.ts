import axiosInstance from '../../../lib/axios';

// Tipuri pentru request-uri
export interface CreatePropertyRequest {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  facilities: string[];
  images: string[];
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {
  id: string;
}

export interface SearchPropertiesParams {
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  status?: 'AVAILABLE' | 'RESERVED' | 'UNAVAILABLE';
  page?: number;
  limit?: number;
}

// Tipuri pentru response-uri (conform backend)
interface PropertyResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    description: string;
    price: number;
    address: string;
    city: string;
    country: string;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    facilities: string[];
    images: string[];
    status: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface PropertiesListResponse {
  success: boolean;
  data: {
    properties: PropertyResponse['data'][];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API Functions

/**
 * Search Properties - Caută proprietăți (public sau autentificat)
 * GET /api/properties/search
 */
export const searchProperties = async (
  params?: SearchPropertiesParams
): Promise<PropertiesListResponse['data']> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const url = queryString 
    ? `/properties/search?${queryString}` 
    : '/properties/search';

  const response = (await axiosInstance.get(url)) as unknown as PropertiesListResponse;
  return response.data;
};

/**
 * Get Property by ID - Obține detalii despre o proprietate
 * GET /api/properties/:id
 */
export const getPropertyById = async (id: string): Promise<PropertyResponse['data']> => {
  const response = (await axiosInstance.get(`/properties/${id}`)) as unknown as PropertyResponse;
  return response.data;
};

/**
 * Create Property - Creează o proprietate nouă (necesită autentificare)
 * POST /api/properties
 */
export const createProperty = async (
  data: CreatePropertyRequest
): Promise<PropertyResponse['data']> => {
  const response = (await axiosInstance.post('/properties', data)) as unknown as PropertyResponse;
  return response.data;
};

/**
 * Update Property - Actualizează o proprietate (necesită autentificare)
 * PUT /api/properties/:id
 */
export const updateProperty = async (
  data: UpdatePropertyRequest
): Promise<PropertyResponse['data']> => {
  const { id, ...updateData } = data;
  const response = (await axiosInstance.put(`/properties/${id}`, updateData)) as unknown as PropertyResponse;
  return response.data;
};

/**
 * Delete Property - Șterge o proprietate (necesită autentificare)
 * DELETE /api/properties/:id
 */
export const deleteProperty = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/properties/${id}`);
};

/**
 * Get My Properties - Obține proprietățile utilizatorului autentificat
 * GET /api/properties/my-properties
 */
export const getMyProperties = async (): Promise<PropertyResponse['data'][]> => {
  const response = (await axiosInstance.get('/properties/my-properties')) as unknown as {
    success: boolean;
    data: PropertyResponse['data'][];
  };
  return response.data;
};