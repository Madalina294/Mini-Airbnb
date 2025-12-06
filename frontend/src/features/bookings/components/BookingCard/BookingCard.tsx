import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCancelBooking } from '../../hooks/useBookings';
import type { Booking } from '../../types/booking.types';
import { CancelBookingDialog } from '../CancelBookingDialog/CancelBookingDialog';
import './BookingCard.css';

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
}

/**
 * BookingCard Component
 * Card pentru afișarea unei rezervări
 */
export const BookingCard = ({ booking, onCancel }: BookingCardProps) => {
  const navigate = useNavigate();
  const cancelBookingMutation = useCancelBooking();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formattedCheckIn = checkInDate.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedCheckOut = checkOutDate.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedPrice = new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
  }).format(booking.totalPrice);

  const handleCancelClick = () => {
    setIsCancelDialogOpen(true);
  };

  const handleCancelConfirm = async (cancellationReason: string) => {
    try {
      await cancelBookingMutation.mutateAsync({
        id: booking.id,
        cancellationReason,
      });
      setIsCancelDialogOpen(false);
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      // Dialog-ul rămâne deschis în caz de eroare
    }
  };

  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';
  const isPast = checkOutDate < new Date();

  return (
    <div className={`bookingCard ${booking.status.toLowerCase()}`}>
      <div className="bookingCardHeader">
        <div className="bookingCardHeaderLeft">
          <h3 className="bookingCardTitle">Booking #{booking.id.slice(0, 8)}</h3>
          <span className={`bookingCardStatus ${booking.status.toLowerCase()}`}>
            {booking.status}
          </span>
        </div>
        <div className="bookingCardHeaderRight">
          <span className="bookingCardPrice">{formattedPrice}</span>
        </div>
      </div>

      <div className="bookingCardContent">
        <div className="bookingCardDates">
          <div className="bookingCardDateItem">
            <span className="bookingCardDateLabel">Check-in</span>
            <span className="bookingCardDateValue">{formattedCheckIn}</span>
          </div>
          <div className="bookingCardDateArrow">→</div>
          <div className="bookingCardDateItem">
            <span className="bookingCardDateLabel">Check-out</span>
            <span className="bookingCardDateValue">{formattedCheckOut}</span>
          </div>
        </div>

        <div className="bookingCardDetails">
          <div className="bookingCardDetail">
            <span className="bookingCardDetailIcon">🌙</span>
            <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
          </div>
          <div className="bookingCardDetail">
            <span className="bookingCardDetailIcon">👥</span>
            <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
          </div>
        </div>

        {booking.specialRequests && (
          <div className="bookingCardSpecialRequests">
            <span className="bookingCardSpecialRequestsLabel">Special Requests:</span>
            <p>{booking.specialRequests}</p>
          </div>
        )}

        {booking.cancellationReason && (
          <div className="bookingCardCancellation">
            <span className="bookingCardCancellationLabel">Cancellation Reason:</span>
            <p>{booking.cancellationReason}</p>
          </div>
        )}
      </div>

      <div className="bookingCardActions">
        <button
          className="bookingCardViewPropertyButton"
          onClick={() => navigate(`/properties/${booking.propertyId}`)}
        >
          View Property
        </button>
        {canCancel && !isPast && (
          <button
            className="bookingCardCancelButton"
            onClick={handleCancelClick}
            disabled={cancelBookingMutation.isPending}
          >
            Cancel Booking
          </button>
        )}
      </div>

      <CancelBookingDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelConfirm}
        isLoading={cancelBookingMutation.isPending}
      />
    </div>
  );
};