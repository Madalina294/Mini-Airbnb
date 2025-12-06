import { CreateBookingForm } from '../../features/bookings/components/CreateBookingForm/CreateBookingForm';
import { useAuthStore } from '../../features/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateBookingPage.css';

/**
 * CreateBookingPage - Pagina pentru crearea unei rezervări
 */
export const CreateBookingPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect dacă utilizatorul nu este autentificat
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="createBookingPage">
      <div className="createBookingPageHeader">
        <div className="createBookingPageHeaderContent">
          <h1 className="createBookingPageTitle">Create Booking</h1>
          <p className="createBookingPageSubtitle">
            Complete the form below to make your reservation
          </p>
        </div>
      </div>

      <div className="createBookingPageContent">
        <div className="createBookingPageContainer">
          <CreateBookingForm />
        </div>
      </div>
    </div>
  );
};