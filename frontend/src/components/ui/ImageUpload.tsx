import { useState } from 'react';
import './ImageUpload.css';

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

/**
 * ImageUpload Component
 * Încarcă imagini pe Cloudinary și returnează URL-urile
 * Similar cu un Angular Component cu file upload
 */
export const ImageUpload = ({
  onUploadComplete,
  maxImages = 5,
  existingImages = [],
}: ImageUploadProps) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Validare variabile de mediu
  if (!cloudName || !uploadPreset) {
    return (
      <div className="imageUploadError">
        ⚠️ Cloudinary configuration missing. Please check your .env file.
      </div>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Verifică numărul maxim de imagini
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);
          // Pentru Unsigned preset, nu trebuie cloud_name în FormData
          // Cloudinary îl extrage din URL

          fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
              }
              return response.json();
            })
            .then((data) => {
              if (data.secure_url) {
                resolve(data.secure_url);
              } else {
                reject(new Error(data.error?.message || 'Upload failed'));
              }
            })
            .catch(reject);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onUploadComplete(newImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images. Please try again.';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUploadComplete(newImages);
  };

  return (
    <div className="imageUpload">
      <div className="imageUploadGrid">
        {images.map((url, index) => (
          <div key={index} className="imageUploadItem">
            <img src={url} alt={`Upload ${index + 1}`} />
            <button
              type="button"
              className="imageUploadRemove"
              onClick={() => handleRemoveImage(index)}
            >
              ×
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="imageUploadAdd">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            {uploading ? (
              <div className="imageUploadLoading">Uploading...</div>
            ) : (
              <div className="imageUploadPlaceholder">
                <span>+</span>
                <span>Add Image</span>
              </div>
            )}
          </label>
        )}
      </div>

      {error && <div className="imageUploadError">{error}</div>}
      <p className="imageUploadHint">
        {images.length} / {maxImages} images
      </p>
    </div>
  );
};