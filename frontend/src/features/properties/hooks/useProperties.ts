import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  searchProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  type CreatePropertyRequest,
  type UpdatePropertyRequest,
  type SearchPropertiesParams,
} from '../api/property.api';

// Query Keys - Identificatori unici pentru cache
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: SearchPropertiesParams) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  myProperties: () => [...propertyKeys.all, 'my-properties'] as const,
};

/**
 * Hook pentru Search Properties
 * Folosește useQuery pentru operații de citire (GET)
 */
export const useSearchProperties = (params?: SearchPropertiesParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyKeys.list(params || {}),
    queryFn: () => searchProperties(params),
    enabled, // Rulează doar dacă enabled=true
    staleTime: 1000 * 60 * 5, // 5 minute - datele sunt "fresh" pentru 5 minute
  });
};

/**
 * Hook pentru Get Property by ID
 */
export const useProperty = (id: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyKeys.detail(id!),
    queryFn: () => getPropertyById(id!),
    enabled: enabled && !!id, // Rulează doar dacă enabled=true și există id
  });
};

/**
 * Hook pentru Get My Properties
 */
export const useMyProperties = () => {
  return useQuery({
    queryKey: propertyKeys.myProperties(),
    queryFn: getMyProperties,
    staleTime: 1000 * 60 * 2, // 2 minute
  });
};

/**
 * Hook pentru Create Property
 * Folosește useMutation pentru operații care modifică date (POST)
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyRequest) => createProperty(data),
    onSuccess: () => {
      // Invalidează cache-ul pentru a forța refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() });
    },
  });
};

/**
 * Hook pentru Update Property
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePropertyRequest) => updateProperty(data),
    onSuccess: (updatedProperty) => {
      // Actualizează cache-ul pentru property-ul specific
      queryClient.setQueryData(propertyKeys.detail(updatedProperty.id), updatedProperty);
      // Invalidează listele
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() });
    },
  });
};

/**
 * Hook pentru Delete Property
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: (_, deletedId) => {
      // Șterge din cache property-ul șters
      queryClient.removeQueries({ queryKey: propertyKeys.detail(deletedId) });
      // Invalidează listele
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myProperties() });
    },
  });
};