import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/Home/HomePage';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { PropertiesPage } from '../pages/Properties/PropertiesPage';

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
  {
    path: '/properties',
    element: <PropertiesPage />,
  },
]);

/**
 * RouterProvider Component
 * Wrapper pentru a face router-ul disponibil în toată aplicația
 */
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

