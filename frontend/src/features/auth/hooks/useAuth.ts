import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { login, register, validateToken, mapBackendUserToUser as mapUser } from '../api/auth.api';
import type { LoginRequest, RegisterRequest } from '../api/auth.api';

// Query Keys - Identificatori unici pentru cache
export const authKeys = {
  all: ['auth'] as const,
  validate: () => [...authKeys.all, 'validate'] as const,
};

/**
 * Hook pentru Login
 * Folosește useMutation pentru operații care modifică state-ul (POST, PUT, DELETE)
 */
export const useLogin = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      // După login reușit, salvează în store
      const user = mapUser(response.user);
      setAuth(user, response.token);
    },
    // onError este gestionat automat de TanStack Query
  });
};

/**
 * Hook pentru Register
 */
export const useRegister = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (response) => {
      // După register reușit, salvează în store
      const user = mapUser(response.user);
      setAuth(user, response.token);
    },
  });
};

/**
 * Hook pentru Logout
 * Nu face request, doar șterge state-ul local
 */
export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return {
    logout: () => {
      clearAuth();
      // Șterge toate query-urile din cache
      queryClient.clear();
    },
  };
};

/**
 * Hook pentru Validate Token
 * Folosește useQuery pentru operații de citire (GET)
 * Rulează automat când componenta se montează (dacă e enabled)
 */
export const useValidateToken = (enabled: boolean = false) => {
  const { token, setAuth } = useAuthStore();

  const query = useQuery({
    queryKey: authKeys.validate(),
    queryFn: validateToken,
    enabled: enabled && !!token, // Rulează doar dacă enabled=true și există token
    retry: false, // Nu reîncearcă dacă eșuează (token invalid)
  });
    // Folosim useEffect pentru a gestiona succesul (onSuccess nu mai există în v5)
  useEffect(() => {
    if (query.isSuccess && query.data && token) {
      // Actualizează user-ul în store dacă token-ul e valid
      const user = mapUser({
        id: query.data.userId,
        email: query.data.email,
        firstName: '',
        lastName: '',
        role: query.data.role,
      });
      // Nu actualizăm token-ul (e deja în store)
      setAuth(user, token);
    }
  }, [query.isSuccess, query.data, token, setAuth]);

  return query;
};