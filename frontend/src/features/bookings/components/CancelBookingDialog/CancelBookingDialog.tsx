import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './CancelBookingDialog.css';

interface CancelBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cancellationReason: string) => void;
  isLoading?: boolean;
}

/**
 * CancelBookingDialog Component
 * Dialog pentru anularea unei rezervări cu motiv
 */
export const CancelBookingDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelBookingDialogProps) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [error, setError] = useState('');

  // Blochează scroll-ul paginii când dialog-ul este deschis
  useEffect(() => {
    if (isOpen) {
      // Salvează valoarea curentă a overflow-ului
      const originalOverflow = document.body.style.overflow;
      // Blochează scroll-ul
      document.body.style.overflow = 'hidden';
      
      // Cleanup: restaurează scroll-ul când componenta se dezactivează
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cancellationReason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    if (cancellationReason.trim().length < 10) {
      setError('Cancellation reason must be at least 10 characters');
      return;
    }

    onConfirm(cancellationReason.trim());
  };

  const handleClose = () => {
    if (!isLoading) {
      setCancellationReason('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="cancelBookingDialogOverlay">
      <div className="cancelBookingDialog">
        <div className="cancelBookingDialogHeader">
          <h2 className="cancelBookingDialogTitle">Cancel Booking</h2>
          <button
            className="cancelBookingDialogCloseButton"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cancelBookingDialogForm">
          <div className="cancelBookingDialogContent">
            <p className="cancelBookingDialogMessage">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>

            <div className="cancelBookingDialogField">
              <label htmlFor="cancellationReason" className="cancelBookingDialogLabel">
                Cancellation Reason <span className="cancelBookingDialogRequired">*</span>
              </label>
              <textarea
                id="cancellationReason"
                value={cancellationReason}
                onChange={(e) => {
                  setCancellationReason(e.target.value);
                  if (error) setError('');
                }}
                className={`cancelBookingDialogTextarea ${error ? 'error' : ''}`}
                rows={4}
                placeholder="Please provide a reason for cancelling this booking (minimum 10 characters)..."
                disabled={isLoading}
                required
              />
              {error && (
                <span className="cancelBookingDialogError">{error}</span>
              )}
              <p className="cancelBookingDialogHint">
                Minimum 10 characters required
              </p>
            </div>
          </div>

          <div className="cancelBookingDialogActions">
            <button
              type="button"
              className="cancelBookingDialogCancelButton"
              onClick={handleClose}
              disabled={isLoading}
            >
              Keep Booking
            </button>
            <button
              type="submit"
              className="cancelBookingDialogConfirmButton"
              disabled={isLoading || !cancellationReason.trim()}
            >
              {isLoading ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Renderizează modalul direct în body folosind Portal
  return createPortal(modalContent, document.body);
};

