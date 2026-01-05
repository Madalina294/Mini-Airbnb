import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addToFavorites,
  removeFromFavorites,
  getMyFavorites,
  checkFavorite,
} from '../api/favorite.api';
import { propertyKeys } from '../../properties/hooks/useProperties';

/**
 * Query Keys - Identificatori unici pentru cache
 */
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: () => [...favoriteKeys.lists()] as const,
  details: () => [...favoriteKeys.all, 'detail'] as const,
  check: (propertyId: string) => [...favoriteKeys.details(), propertyId, 'check'] as const,
};

/**
 * Hook pentru Get My Favorites
 * Folosește useQuery pentru operații de citire (GET)
 */
export const useMyFavorites = () => {
  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: getMyFavorites,
    staleTime: 1000 * 60 * 2, // 2 minute - favorite-urile se schimbă mai rar
    retry: (failureCount, error: any) => {
      // Nu reîncearcă dacă primim 404 (nu există favorite-uri)
      if (error?.response?.status === 404) {
        return false;
      }
      // Reîncearcă pentru alte erori (max 3 ori)
      return failureCount < 3;
    },
  });
};

/**
 * Hook pentru Check Favorite
 * Verifică dacă o proprietate este în favorite
 */
export const useCheckFavorite = (propertyId: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: favoriteKeys.check(propertyId || ''),
    queryFn: () => checkFavorite(propertyId!),
    enabled: enabled && !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minute
  });
};

/**
 * Hook pentru Add to Favorites
 * Folosește useMutation pentru operații de scriere (POST)
 */
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToFavorites,
    onSuccess: (_, propertyId) => {
      // Invalidate favorite list pentru a reîmprospăta lista
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
      
      // Invalidate check favorite pentru această proprietate
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(propertyId) });
      
      // Invalidate property detail pentru a actualiza UI-ul dacă suntem pe pagina de detalii
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(propertyId) });
    },
    // onSettled nu mai este necesar - eroarea 409 este deja gestionată în API
  });
};

/**
 * Hook pentru Remove from Favorites
 * Folosește useMutation pentru operații de ștergere (DELETE)
 */
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: (_, propertyId) => {
      // Invalidate favorite list pentru a reîmprospăta lista
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
      
      // Invalidate check favorite pentru această proprietate
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(propertyId) });
      
      // Invalidate property detail pentru a actualiza UI-ul dacă suntem pe pagina de detalii
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(propertyId) });
    },
    // onSettled nu mai este necesar - eroarea 404 este deja gestionată în API
  });
};

/**
 * Hook pentru Toggle Favorite
 * Comoditate - adaugă sau șterge în funcție de statusul curent
 */
export const useToggleFavorite = () => {
  const addMutation = useAddToFavorites();
  const removeMutation = useRemoveFromFavorites();

  return {
    toggle: async (propertyId: string, isFavorite: boolean) => {
      try {
        if (isFavorite) {
          await removeMutation.mutateAsync(propertyId);
        } else {
          await addMutation.mutateAsync(propertyId);
        }
      } catch (error: any) {
        // Erorile 409 (Conflict) și 404 (Not Found) sunt deja gestionate în API
        // Dacă ajungem aici, înseamnă că eroarea nu a fost 409 sau 404
        throw error;
      }
    },
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isPending: addMutation.isPending || removeMutation.isPending,
  };
};

