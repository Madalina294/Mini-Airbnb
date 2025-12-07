import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/Home/HomePage';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { PropertiesPage } from '../pages/Properties/PropertiesPage';
import { CreatePropertyPage } from '../pages/Properties/CreatePropertyPage';
import { PropertyDetailsPage } from '../pages/Properties/PropertyDetailsPage';
import { CreateBookingPage } from '../pages/Bookings/CreateBookingPage';
import { MyBookingsPage } from '../pages/Bookings/MyBookingsPage';
import { EditPropertyPage } from '../pages/Properties/EditPropertyPage';
import { MyPropertiesPage } from '../pages/Properties/MyPropertiesPage';

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
  {
    path: '/properties/create',
    element: <CreatePropertyPage />,
  },
  {
    path: '/properties/:id',
    element: <PropertyDetailsPage />,
  },
  {
    path: '/properties/:id/book',
    element: <CreateBookingPage />,
  },
  {
    path: '/bookings',
    element: <MyBookingsPage />,
  },
  {
    path: '/properties/:id/edit',
    element: <EditPropertyPage />,
  },
  {
  path: '/properties/my',
  element: <MyPropertiesPage />,
},
]);

/**
 * RouterProvider Component
 * Wrapper pentru a face router-ul disponibil în toată aplicația
 */
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

