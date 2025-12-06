import { useState } from 'react';
import './PropertyGallery.css';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/**
 * PropertyGallery Component
 * Galerie de imagini cu lightbox
 */
export const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="propertyGalleryEmpty">
        <p>No images available</p>
      </div>
    );
  }

  const mainImage = images[selectedImageIndex] || images[0];
  const thumbnailImages = images.slice(0, 5); // Primele 5 imagini ca thumbnails

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="propertyGallery">
      <div className="propertyGalleryMain">
        <img
          src={mainImage}
          alt={title}
          className="propertyGalleryMainImage"
          onClick={() => setIsLightboxOpen(true)}
        />
        {images.length > 1 && (
          <>
            <button
              className="propertyGalleryNav propertyGalleryNavPrev"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="propertyGalleryNav propertyGalleryNavNext"
              onClick={handleNext}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
        <div className="propertyGalleryCounter">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="propertyGalleryThumbnails">
          {thumbnailImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} ${index + 1}`}
              className={`propertyGalleryThumbnail ${
                selectedImageIndex === index ? 'active' : ''
              }`}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
          {images.length > 5 && (
            <div className="propertyGalleryThumbnailMore">
              +{images.length - 5} more
            </div>
          )}
        </div>
      )}

      {/* Lightbox (simplificat) */}
      {isLightboxOpen && (
        <div
          className="propertyGalleryLightbox"
          onClick={() => setIsLightboxOpen(false)}
        >
          <img
            src={mainImage}
            alt={title}
            className="propertyGalleryLightboxImage"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="propertyGalleryLightboxClose"
            onClick={() => setIsLightboxOpen(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}; 