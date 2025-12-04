import { LoginForm, useAuthStore } from '../features/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage - Pagina de login
 * Similar cu un Angular Component cu routing
 */
export const LoginPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect dacă utilizatorul este deja autentificat
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};