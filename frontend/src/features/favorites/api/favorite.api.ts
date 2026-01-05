import axiosInstance from '../../../lib/axios';
import type { FavoriteProperty, CheckFavoriteResponse } from '../types/favorite.types';

/**
 * Favorite API Functions
 * Toate funcțiile comunică cu API Gateway care proxy către Property Service
 */

/**
 * Add to Favorites - Adaugă o proprietate la favorite
 * POST /api/properties/favorites/:propertyId
 */
export const addToFavorites = async (propertyId: string): Promise<void> => {
  try {
    await axiosInstance.post(`/properties/favorites/${propertyId}`);
  } catch (error: any) {
    // Dacă primim 409 Conflict, înseamnă că proprietatea este deja în favorite
    // Nu aruncăm eroarea - considerăm că operația a reușit
    if (error?.response?.status === 409) {
      return; // Operația a reușit (proprietatea este deja în favorite)
    }
    // Pentru alte erori, le propagăm
    throw error;
  }
};

/**
 * Remove from Favorites - Șterge o proprietate din favorite
 * DELETE /api/properties/favorites/:propertyId
 */
export const removeFromFavorites = async (propertyId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/properties/favorites/${propertyId}`);
  } catch (error: any) {
    // Dacă primim 404 Not Found, înseamnă că proprietatea nu este în favorite
    // Nu aruncăm eroarea - considerăm că operația a reușit
    if (error?.response?.status === 404) {
      return; // Operația a reușit (proprietatea nu este în favorite)
    }
    // Pentru alte erori, le propagăm
    throw error;
  }
};

/**
 * Get My Favorites - Obține toate favorite-urile utilizatorului autentificat
 * GET /api/properties/favorites
 */
export const getMyFavorites = async (): Promise<FavoriteProperty[]> => {
  try {
    // Axios interceptor returnează response.data direct
    // Backend returnează: { success: true, data: FavoriteProperty[] }
    const response = (await axiosInstance.get('/properties/favorites')) as unknown as {
      success: boolean;
      data: FavoriteProperty[];
    };
    
    // Verifică dacă răspunsul are structura așteptată
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data || [];
    }
    
    // Dacă răspunsul este direct un array (caz neașteptat)
    if (Array.isArray(response)) {
      return response;
    }
    
    // Fallback: returnează array gol
    return [];
  } catch (error: any) {
    // Dacă primim 404, înseamnă că nu există favorite-uri (sau ruta nu există)
    // Returnează array gol în loc să arunce eroarea
    if (error?.response?.status === 404) {
      return [];
    }
    // Pentru alte erori, le propagăm
    throw error;
  }
};

/**
 * Check Favorite - Verifică dacă o proprietate este în favorite
 * GET /api/properties/favorites/:propertyId/check
 */
export const checkFavorite = async (propertyId: string): Promise<boolean> => {
  try {
    // Axios interceptor returnează response.data direct
    // Backend returnează: { success: true, data: { isFavorite: boolean } }
    const response = (await axiosInstance.get(`/properties/favorites/${propertyId}/check`)) as unknown as {
      success: boolean;
      data: CheckFavoriteResponse;
    };
    
    // Verifică dacă răspunsul are structura așteptată
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data?.isFavorite || false;
    }
    
    // Fallback: returnează false
    return false;
  } catch (error: any) {
    // Dacă primim 404 sau alte erori, returnează false
    return false;
  }
};

