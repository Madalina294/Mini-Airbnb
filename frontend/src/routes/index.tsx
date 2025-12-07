import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Layout } from '../components/layout/Layout/Layout';
import { HomePage } from '../pages/Home/HomePage';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { PropertiesPage } from '../pages/Properties/PropertiesPage';
import { CreatePropertyPage } from '../pages/Properties/CreatePropertyPage';
import { EditPropertyPage } from '../pages/Properties/EditPropertyPage';
import { PropertyDetailsPage } from '../pages/Properties/PropertyDetailsPage';
import { CreateBookingPage } from '../pages/Bookings/CreateBookingPage';
import { MyBookingsPage } from '../pages/Bookings/MyBookingsPage';
import { MyPropertiesPage } from '../pages/Properties/MyPropertiesPage';

/**
 * Configurarea rutelor aplicației
 * Similar cu routes array în Angular
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Outlet /></Layout>,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'properties',
        element: <PropertiesPage />,
      },
      {
        path: 'properties/create',
        element: <CreatePropertyPage />,
      },
      {
        path: 'properties/:id/edit',
        element: <EditPropertyPage />,
      },
      {
        path: 'properties/:id',
        element: <PropertyDetailsPage />,
      },
      {
        path: 'properties/:id/book',
        element: <CreateBookingPage />,
      },
      {
        path: 'bookings',
        element: <MyBookingsPage />,
      },
      {
        path: 'properties/my',
        element: <MyPropertiesPage />,
      },
    ],
  },
  // Rute fără header (login, register)
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

