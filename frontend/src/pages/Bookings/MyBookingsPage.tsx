import { useMyBookings } from '../../features/bookings';
import { useAuthStore } from '../../features/auth';
import { BookingCard } from '../../features/bookings/components/BookingCard/BookingCard';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBookingsPage.css';

/**
 * MyBookingsPage - Pagina cu rezervările utilizatorului
 */
export const MyBookingsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { data: bookings, isLoading, error, refetch } = useMyBookings();

  // Redirect dacă utilizatorul nu este autentificat
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="myBookingsPage">
        <div className="myBookingsLoading">
          <div className="loadingSpinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myBookingsPage">
        <div className="myBookingsError">
          <p>❌ Error loading bookings</p>
          <button className="myBookingsRetryButton" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const sortedBookings = bookings
    ? [...bookings].sort((a, b) => {
        const dateA = new Date(a.checkIn).getTime();
        const dateB = new Date(b.checkIn).getTime();
        return dateB - dateA; // Cele mai recente primele
      })
    : [];

  const upcomingBookings = sortedBookings.filter(
    (booking) => new Date(booking.checkIn) >= new Date()
  );
  const pastBookings = sortedBookings.filter(
    (booking) => new Date(booking.checkIn) < new Date()
  );

  return (
    <div className="myBookingsPage">
      <div className="myBookingsHeader">
        <div className="myBookingsHeaderContent">
          <h1 className="myBookingsTitle">My Bookings</h1>
          <p className="myBookingsSubtitle">
            Manage and view all your reservations
          </p>
        </div>
      </div>

      <div className="myBookingsContent">
        <div className="myBookingsContainer">
          {sortedBookings.length === 0 ? (
            <div className="myBookingsEmpty">
              <div className="myBookingsEmptyIcon">📅</div>
              <h2>No bookings yet</h2>
              <p>Start exploring properties and make your first reservation!</p>
              <button
                className="myBookingsExploreButton"
                onClick={() => navigate('/properties')}
              >
                Explore Properties
              </button>
            </div>
          ) : (
            <>
              {upcomingBookings.length > 0 && (
                <div className="myBookingsSection">
                  <h2 className="myBookingsSectionTitle">Upcoming Bookings</h2>
                  <div className="myBookingsList">
                    {upcomingBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancel={() => refetch()}
                      />
                    ))}
                  </div>
                </div>
              )}

              {pastBookings.length > 0 && (
                <div className="myBookingsSection">
                  <h2 className="myBookingsSectionTitle">Past Bookings</h2>
                  <div className="myBookingsList">
                    {pastBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancel={() => refetch()}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};