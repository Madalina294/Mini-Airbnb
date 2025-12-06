import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateBooking } from '../../hooks/useBookings';
import { useProperty } from '../../../properties/hooks/useProperties';
import { useAuthStore } from '../../../auth';
import type { CreateBookingRequest } from '../../types/booking.types';
import type { AxiosError } from 'axios';
import './CreateBookingForm.css';

/**
 * Helper function pentru a extrage mesajul de eroare din AxiosError
 * Backend-ul returnează erorile în formatul: { success: false, error: { message: "...", statusCode: ... } }
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Verifică dacă este un AxiosError
    const axiosError = error as AxiosError<{ success?: boolean; error?: { message?: string; statusCode?: number } }>;
    
    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      
      // Dacă există un mesaj de eroare structurat
      if (errorData.error?.message) {
        return errorData.error.message;
      }
      
      // Dacă există un mesaj direct
      if (typeof errorData === 'object' && 'message' in errorData) {
        return (errorData as { message: string }).message;
      }
    }
    
    // Fallback la mesajul generic al erorii
    return error.message;
  }
  
  return 'An error occurred while creating the booking';
};

/**
 * CreateBookingForm Component
 * Formular pentru crearea unei rezervări
 */
export const CreateBookingForm = () => {
  const { id: propertyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const createBookingMutation = useCreateBooking();

  // Obține detaliile proprietății pentru a calcula prețul
  const { data: propertyData, isLoading: isLoadingProperty } = useProperty(propertyId);

  const [formData, setFormData] = useState<CreateBookingRequest>({
    propertyId: propertyId || '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateBookingRequest, string>>>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [nights, setNights] = useState<number>(0);

  // Actualizează datele utilizatorului când se încarcă
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        guestName: user.name || prev.guestName,
        guestEmail: user.email || prev.guestEmail,
      }));
    }
  }, [user]);

  // Calculează prețul total și numărul de nopți
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && propertyData) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);

      if (checkOutDate > checkInDate) {
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
        setTotalPrice(diffDays * propertyData.price);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [formData.checkIn, formData.checkOut, propertyData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) || 1 : value,
    }));
    // Șterge eroarea pentru câmpul modificat
    if (errors[name as keyof CreateBookingRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateBookingRequest, string>> = {};

    if (!formData.propertyId) {
      newErrors.propertyId = 'Property ID is required';
    }

    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    } else {
      const checkInDate = new Date(formData.checkIn);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkInDate < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    } else if (formData.checkIn) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    }

    if (!formData.guests || formData.guests < 1) {
      newErrors.guests = 'Number of guests must be at least 1';
    } else if (propertyData && formData.guests > propertyData.maxGuests) {
      newErrors.guests = `Maximum ${propertyData.maxGuests} guests allowed`;
    }

    if (!formData.guestName || formData.guestName.trim() === '') {
      newErrors.guestName = 'Guest name is required';
    }

    if (!formData.guestEmail || formData.guestEmail.trim() === '') {
      newErrors.guestEmail = 'Guest email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
      newErrors.guestEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      // Convertim datele la format ISO pentru backend
      const bookingData: CreateBookingRequest = {
        ...formData,
        checkIn: new Date(formData.checkIn).toISOString(),
        checkOut: new Date(formData.checkOut).toISOString(),
      };

      const result = await createBookingMutation.mutateAsync(bookingData);
      
      // Redirect către pagina cu rezervările mele sau pagina de detalii a rezervării
      navigate(`/bookings/${result.id}`, { 
        state: { bookingCreated: true } 
      });
    } catch (error: any) {
      console.error('Error creating booking:', error);
      // Erorile vor fi afișate prin mutation.error
    }
  };

  if (isLoadingProperty || !propertyData) {
    return (
      <div className="createBookingFormLoading">
        <div className="loadingSpinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
  }).format(propertyData.price);

  const formattedTotalPrice = new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
  }).format(totalPrice);

  return (
    <div className="createBookingForm">
      <form onSubmit={handleSubmit} className="createBookingFormContent">
        {/* Property Summary */}
        <div className="createBookingFormPropertySummary">
          <h3 className="createBookingFormPropertyTitle">{propertyData.title}</h3>
          <p className="createBookingFormPropertyLocation">
            📍 {propertyData.address}, {propertyData.city}, {propertyData.country}
          </p>
          <div className="createBookingFormPropertyPrice">
            <span className="createBookingFormPropertyPriceAmount">{formattedPrice}</span>
            <span className="createBookingFormPropertyPricePeriod">/ night</span>
          </div>
        </div>

        {/* Check-in / Check-out */}
        <div className="createBookingFormSection">
          <h3 className="createBookingFormSectionTitle">Select Dates</h3>
          <div className="createBookingFormDateGrid">
            <div className="createBookingFormField">
              <label htmlFor="checkIn" className="createBookingFormLabel">
                Check-in
              </label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className={`createBookingFormInput ${errors.checkIn ? 'error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.checkIn && (
                <span className="createBookingFormError">{errors.checkIn}</span>
              )}
            </div>
            <div className="createBookingFormField">
              <label htmlFor="checkOut" className="createBookingFormLabel">
                Check-out
              </label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className={`createBookingFormInput ${errors.checkOut ? 'error' : ''}`}
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
              />
              {errors.checkOut && (
                <span className="createBookingFormError">{errors.checkOut}</span>
              )}
            </div>
          </div>
          {nights > 0 && (
            <div className="createBookingFormNightsInfo">
              {nights} {nights === 1 ? 'night' : 'nights'}
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="createBookingFormSection">
          <h3 className="createBookingFormSectionTitle">Guests</h3>
          <div className="createBookingFormField">
            <label htmlFor="guests" className="createBookingFormLabel">
              Number of Guests
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              max={propertyData.maxGuests}
              className={`createBookingFormInput ${errors.guests ? 'error' : ''}`}
            />
            {errors.guests && (
              <span className="createBookingFormError">{errors.guests}</span>
            )}
            <p className="createBookingFormHint">
              Maximum {propertyData.maxGuests} guests
            </p>
          </div>
        </div>

        {/* Guest Information */}
        <div className="createBookingFormSection">
          <h3 className="createBookingFormSectionTitle">Guest Information</h3>
          <div className="createBookingFormField">
            <label htmlFor="guestName" className="createBookingFormLabel">
              Full Name *
            </label>
            <input
              type="text"
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              className={`createBookingFormInput ${errors.guestName ? 'error' : ''}`}
              placeholder="John Doe"
            />
            {errors.guestName && (
              <span className="createBookingFormError">{errors.guestName}</span>
            )}
          </div>
          <div className="createBookingFormField">
            <label htmlFor="guestEmail" className="createBookingFormLabel">
              Email *
            </label>
            <input
              type="email"
              id="guestEmail"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleChange}
              className={`createBookingFormInput ${errors.guestEmail ? 'error' : ''}`}
              placeholder="john@example.com"
            />
            {errors.guestEmail && (
              <span className="createBookingFormError">{errors.guestEmail}</span>
            )}
          </div>
          <div className="createBookingFormField">
            <label htmlFor="guestPhone" className="createBookingFormLabel">
              Phone (Optional)
            </label>
            <input
              type="tel"
              id="guestPhone"
              name="guestPhone"
              value={formData.guestPhone}
              onChange={handleChange}
              className="createBookingFormInput"
              placeholder="+40712345678"
            />
          </div>
        </div>

        {/* Special Requests */}
        <div className="createBookingFormSection">
          <h3 className="createBookingFormSectionTitle">Special Requests (Optional)</h3>
          <div className="createBookingFormField">
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="createBookingFormTextarea"
              rows={4}
              placeholder="Any special requests or requirements..."
            />
          </div>
        </div>

        {/* Price Summary */}
        {nights > 0 && (
          <div className="createBookingFormPriceSummary">
            <div className="createBookingFormPriceRow">
              <span>{formattedPrice} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
              <span>{formattedTotalPrice}</span>
            </div>
            <div className="createBookingFormPriceTotal">
              <span>Total</span>
              <span>{formattedTotalPrice}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {createBookingMutation.isError && (
          <div className="createBookingFormErrorMessage">
            <div className="createBookingFormErrorIcon">⚠️</div>
            <div className="createBookingFormErrorContent">
              <strong>Booking Unavailable</strong>
              <p>{getErrorMessage(createBookingMutation.error)}</p>
              <p className="createBookingFormErrorHint">
                Please select different dates or check the property availability.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`createBookingFormSubmit ${createBookingMutation.isPending ? 'loading' : ''}`}
          disabled={createBookingMutation.isPending || nights === 0}
        >
          {createBookingMutation.isPending ? 'Creating Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};