import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

/**
 * Configurarea rutelor aplicației
 * Similar cu routes array în Angular
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);

/**
 * RouterProvider Component
 * Wrapper pentru a face router-ul disponibil în toată aplicația
 */
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

