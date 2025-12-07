import { useState, useEffect } from 'react';
import { useCreateProperty, useUpdateProperty } from '../../hooks/useProperties';
import { ImageUpload } from '../../../../components/ui/ImageUpload';
import type { CreatePropertyRequest, UpdatePropertyRequest } from '../../api/property.api';
import type { Property } from '../../types/property.types';
import { useNavigate } from 'react-router-dom';
import './CreatePropertyForm.css';

interface CreatePropertyFormProps {
  property?: Property; // Prop opțional - dacă există, formularul este în modul "edit"
}

/**
 * CreatePropertyForm Component
 * Formular pentru crearea sau editarea unei proprietăți
 * Dacă property este furnizat, funcționează în modul "edit"
 */
export const CreatePropertyForm = ({ property }: CreatePropertyFormProps = {}) => {
  const navigate = useNavigate();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();

  // Determină dacă suntem în modul "edit"
  const isEditMode = !!property;

  // Tip extins pentru formData care include status pentru edit mode
  type FormData = CreatePropertyRequest & { status?: Property['status'] };

  // Inițializează formData - dacă property există, pre-populează datele
  const [formData, setFormData] = useState<FormData>({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || 0,
    address: property?.address || '',
    city: property?.city || '',
    country: property?.country || '',
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    maxGuests: property?.maxGuests || 1,
    facilities: property?.facilities || [],
    images: property?.images || [],
    status: property?.status,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreatePropertyRequest, string>>>({});
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(property?.facilities || []);

  // Actualizează formData când property se schimbă (pentru edit mode)
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price,
        address: property.address,
        city: property.city,
        country: property.country,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        maxGuests: property.maxGuests,
        facilities: property.facilities || [],
        images: property.images || [],
        status: property.status,
      });
      setSelectedFacilities(property.facilities || []);
    }
  }, [property]);

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

    if (isEditMode && property) {
      // Modul EDIT - trimite doar câmpurile modificate
      const updateData: UpdatePropertyRequest & { status?: Property['status'] } = {
        id: property.id,
      };

      // Adaugă doar câmpurile care au fost modificate
      if (formData.title !== property.title) updateData.title = formData.title;
      if (formData.description !== property.description) updateData.description = formData.description;
      if (formData.price !== property.price) updateData.price = formData.price;
      if (formData.address !== property.address) updateData.address = formData.address;
      if (formData.city !== property.city) updateData.city = formData.city;
      if (formData.country !== property.country) updateData.country = formData.country;
      if (formData.bedrooms !== property.bedrooms) updateData.bedrooms = formData.bedrooms;
      if (formData.bathrooms !== property.bathrooms) updateData.bathrooms = formData.bathrooms;
      if (formData.maxGuests !== property.maxGuests) updateData.maxGuests = formData.maxGuests;
      if (JSON.stringify(formData.facilities) !== JSON.stringify(property.facilities)) {
        updateData.facilities = formData.facilities;
      }
      if (JSON.stringify(formData.images) !== JSON.stringify(property.images)) {
        updateData.images = formData.images;
      }
      if (formData.status !== undefined && formData.status !== property.status) {
        updateData.status = formData.status;
      }

      updatePropertyMutation.mutate(updateData, {
        onSuccess: () => {
          navigate(`/properties/${property.id}`);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.error?.message || 'Failed to update property';
          setErrors({ title: errorMessage });
        },
      });
    } else {
      // Modul CREATE
      createPropertyMutation.mutate(formData, {
        onSuccess: () => {
          navigate('/properties');
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.error?.message || 'Failed to create property';
          setErrors({ title: errorMessage });
        },
      });
    }
  };

  // Folosește mutation-ul corespunzător
  const mutation = isEditMode ? updatePropertyMutation : createPropertyMutation;

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

        {/* Câmp pentru Status - doar în modul EDIT */}
        {isEditMode && property && (
          <div className="createPropertyFormGroup">
            <label htmlFor="status" className="createPropertyFormLabel">
              Status <span className="required">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status || property.status}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, status: e.target.value as Property['status'] }));
              }}
              className={`createPropertyFormInput ${(errors as any).status ? 'error' : ''}`}
              required
            >
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
            {(errors as any).status && (
              <span className="createPropertyFormError">{(errors as any).status}</span>
            )}
          </div>
        )}
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

      {mutation.isError && (
        <div className="createPropertyFormErrorBox">
          {mutation.error?.message || 'An error occurred. Please try again.'}
        </div>
      )}

      <div className="createPropertyFormActions">
        <button
          type="button"
          onClick={() => {
            if (isEditMode && property) {
              navigate(`/properties/${property.id}`);
            } else {
              navigate('/properties');
            }
          }}
          className="createPropertyFormButtonCancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`createPropertyFormButtonSubmit ${mutation.isPending ? 'loading' : ''}`}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Property' : 'Create Property')}
        </button>
      </div>
    </form>
  );
};