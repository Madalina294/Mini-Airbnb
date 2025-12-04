import axiosInstance from '../../../lib/axios';
import type { User } from '../stores/useAuthStore';

// Tipuri pentru request-uri
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Tipuri pentru response-uri (conform backend)
interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    token: string;
  };
}

interface ValidateResponse {
  success: boolean;
  data: {
    userId: string;
    email: string;
    role: string;
  };
}

// API Functions

/**
 * Register - Creează un cont nou
 * POST /api/auth/register
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse['data']> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', data) as unknown as AuthResponse;
  // Axios interceptor returnează doar response.data, deci avem direct { success, data }
  return response.data;
};

/**
 * Login - Autentifică un utilizator
 * POST /api/auth/login
 */
export const login = async (data: LoginRequest): Promise<AuthResponse['data']> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data) as unknown as AuthResponse;
  return response.data;
};

/**
 * Validate Token - Validează token-ul curent
 * POST /api/auth/validate
 * Necesită token în header (adăugat automat de interceptor)
 */
export const validateToken = async (): Promise<ValidateResponse['data']> => {
  const response = await axiosInstance.post<ValidateResponse>('/auth/validate') as unknown as ValidateResponse;
  return response.data;
};

/**
 * Helper function - Convertește user-ul din backend la formatul nostru
 */
export const mapBackendUserToUser = (backendUser: AuthResponse['data']['user']): User => {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: `${backendUser.firstName} ${backendUser.lastName}`,
  };
};