import { useState } from 'react';
import { useCreateProperty } from '../../hooks/useProperties';
import { ImageUpload } from '../../../../components/ui/ImageUpload';
import type { CreatePropertyRequest } from '../../api/property.api';
import { useNavigate } from 'react-router-dom';
import './CreatePropertyForm.css';

/**
 * CreatePropertyForm Component
 * Formular pentru crearea unei proprietăți
 */
export const CreatePropertyForm = () => {
  const navigate = useNavigate();
  const createPropertyMutation = useCreateProperty();

  const [formData, setFormData] = useState<CreatePropertyRequest>({
    title: '',
    description: '',
    price: 0,
    address: '',
    city: '',
    country: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 1,
    facilities: [],
    images: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreatePropertyRequest, string>>>({});
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // Lista de facilități disponibile
  const availableFacilities = [
    'WiFi',
    'Parking',
    'Air Conditioning',
    'Heating',
    'Kitchen',
    'Washing Machine',
    'TV',
    'Pool',
    'Gym',
    'Pet Friendly',
    'Smoking Allowed',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Pentru câmpurile numerice, convertește la number
    if (name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'maxGuests') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Șterge eroarea când utilizatorul începe să scrie
    if (errors[name as keyof CreatePropertyRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities((prev) => {
      const newFacilities = prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility];
      
      setFormData((form) => ({ ...form, facilities: newFacilities }));
      return newFacilities;
    });
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, images: urls }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreatePropertyRequest, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (formData.bedrooms < 1) {
      newErrors.bedrooms = 'Bedrooms must be at least 1';
    }

    if (formData.bathrooms < 1) {
      newErrors.bathrooms = 'Bathrooms must be at least 1';
    }

    if (formData.maxGuests < 1) {
      newErrors.maxGuests = 'Max guests must be at least 1';
    }

    if (formData.facilities.length === 0) {
      newErrors.facilities = 'At least one facility is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    createPropertyMutation.mutate(formData, {
      onSuccess: () => {
        // Redirect către pagina de proprietăți după creare reușită
        navigate('/properties');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error?.message || 'Failed to create property';
        setErrors({ title: errorMessage });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="createPropertyForm">
      <div className="createPropertyFormSection">
        <h3 className="createPropertyFormSectionTitle">Basic Information</h3>
        
        <div className="createPropertyFormGroup">
          <label htmlFor="title" className="createPropertyFormLabel">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Beautiful apartment in city center"
            className={`createPropertyFormInput ${errors.title ? 'error' : ''}`}
            required
          />
          {errors.title && (
            <span className="createPropertyFormError">{errors.title}</span>
          )}
        </div>

        <div className="createPropertyFormGroup">
          <label htmlFor="description" className="createPropertyFormLabel">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your property in detail..."
            rows={5}
            className={`createPropertyFormTextarea ${errors.description ? 'error' : ''}`}
            required
          />
          {errors.description && (
            <span className="createPropertyFormError">{errors.description}</span>
          )}
        </div>

        <div className="createPropertyFormRow">
          <div className="createPropertyFormGroup">
            <label htmlFor="price" className="createPropertyFormLabel">
              Price per Night (€) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              className={`createPropertyFormInput ${errors.price ? 'error' : ''}`}
              required
            />
            {errors.price && (
              <span className="createPropertyFormError">{errors.price}</span>
            )}
          </div>
        </div>
      </div>

      <div className="createPropertyFormSection">
        <h3 className="createPropertyFormSectionTitle">Location</h3>
        
        <div className="createPropertyFormGroup">
          <label htmlFor="address" className="createPropertyFormLabel">
            Address <span className="required">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address"
            className={`createPropertyFormInput ${errors.address ? 'error' : ''}`}
            required
          />
          {errors.address && (
            <span className="createPropertyFormError">{errors.address}</span>
          )}
        </div>

        <div className="createPropertyFormRow">
          <div className="createPropertyFormGroup">
            <label htmlFor="city" className="createPropertyFormLabel">
              City <span className="required">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className={`createPropertyFormInput ${errors.city ? 'error' : ''}`}
              required
            />
            {errors.city && (
              <span className="createPropertyFormError">{errors.city}</span>
            )}
          </div>

          <div className="createPropertyFormGroup">
            <label htmlFor="country" className="createPropertyFormLabel">
              Country <span className="required">*</span>
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className={`createPropertyFormInput ${errors.country ? 'error' : ''}`}
              required
            />
            {errors.country && (
              <span className="createPropertyFormError">{errors.country}</span>
            )}
          </div>
        </div>
      </div>

      <div className="createPropertyFormSection">
        <h3 className="createPropertyFormSectionTitle">Property Details</h3>
        
        <div className="createPropertyFormRow">
          <div className="createPropertyFormGroup">
            <label htmlFor="bedrooms" className="createPropertyFormLabel">
              Bedrooms <span className="required">*</span>
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              placeholder="1"
              min="1"
              className={`createPropertyFormInput ${errors.bedrooms ? 'error' : ''}`}
              required
            />
            {errors.bedrooms && (
              <span className="createPropertyFormError">{errors.bedrooms}</span>
            )}
          </div>

          <div className="createPropertyFormGroup">
            <label htmlFor="bathrooms" className="createPropertyFormLabel">
              Bathrooms <span className="required">*</span>
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              placeholder="1"
              min="1"
              className={`createPropertyFormInput ${errors.bathrooms ? 'error' : ''}`}
              required
            />
            {errors.bathrooms && (
              <span className="createPropertyFormError">{errors.bathrooms}</span>
            )}
          </div>

          <div className="createPropertyFormGroup">
            <label htmlFor="maxGuests" className="createPropertyFormLabel">
              Max Guests <span className="required">*</span>
            </label>
            <input
              type="number"
              id="maxGuests"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              placeholder="1"
              min="1"
              className={`createPropertyFormInput ${errors.maxGuests ? 'error' : ''}`}
              required
            />
            {errors.maxGuests && (
              <span className="createPropertyFormError">{errors.maxGuests}</span>
            )}
          </div>
        </div>
      </div>

      <div className="createPropertyFormSection">
        <h3 className="createPropertyFormSectionTitle">
          Facilities <span className="required">*</span>
        </h3>
        <div className="createPropertyFormFacilities">
          {availableFacilities.map((facility) => (
            <label key={facility} className="createPropertyFormFacility">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(facility)}
                onChange={() => handleFacilityToggle(facility)}
              />
              <span>{facility}</span>
            </label>
          ))}
        </div>
        {errors.facilities && (
          <span className="createPropertyFormError">{errors.facilities}</span>
        )}
      </div>

      <div className="createPropertyFormSection">
        <h3 className="createPropertyFormSectionTitle">
          Images <span className="required">*</span>
        </h3>
        <ImageUpload
          onUploadComplete={handleImagesChange}
          maxImages={10}
          existingImages={formData.images}
        />
        {errors.images && (
          <span className="createPropertyFormError">{errors.images}</span>
        )}
      </div>

      {createPropertyMutation.isError && (
        <div className="createPropertyFormErrorBox">
          {createPropertyMutation.error?.message || 'An error occurred. Please try again.'}
        </div>
      )}

      <div className="createPropertyFormActions">
        <button
          type="button"
          onClick={() => navigate('/properties')}
          className="createPropertyFormButtonCancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`createPropertyFormButtonSubmit ${createPropertyMutation.isPending ? 'loading' : ''}`}
          disabled={createPropertyMutation.isPending}
        >
          {createPropertyMutation.isPending ? 'Creating...' : 'Create Property'}
        </button>
      </div>
    </form>
  );
};