/**
 * Favorite Types
 */

import type { Property } from '../../properties/types/property.types';

/**
 * Favorite Property - Proprietate cu informații despre când a fost adăugată la favorite
 */
export interface FavoriteProperty extends Property {
  favoritedAt: string; // Data când a fost adăugată la favorite
}

/**
 * Check Favorite Response - Răspuns pentru verificarea dacă o proprietate este în favorite
 */
export interface CheckFavoriteResponse {
  isFavorite: boolean;
}

