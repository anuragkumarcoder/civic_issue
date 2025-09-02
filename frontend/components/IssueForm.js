import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api';
import { validateRequired, validateTitle, validateDescription, validateLocation, validateForm } from '../utils/validation';
import { convertToBase64, validateFileType, validateFileSize, formatFileSize } from '../utils/fileUpload';
import Alert from './Alert';

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  location: '',
  category: 'INFRASTRUCTURE',
  priority: 'MEDIUM',
  images: [],
};

const INITIAL_ERRORS_STATE = {
  title: '',
  description: '',
  location: '',
  images: '',
};

const CATEGORIES = [
  { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
  { value: 'WATER', label: 'Water' },
  { value: 'ELECTRICITY', label: 'Electricity' },
  { value: 'SANITATION', label: 'Sanitation' },
  { value: 'PUBLIC_SAFETY', label: 'Public Safety' },
  { value: 'ENVIRONMENT', label: 'Environment' },
  { value: 'PUBLIC_PROPERTY', label: 'Public Property' },
  { value: 'OTHER', label: 'Other' },
];

const PRIORITIES = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGES = 5;

/**
 * IssueForm component for creating and editing issues
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Initial data for editing an existing issue
 * @param {boolean} props.isEditing - Whether the form is for editing an existing issue
 * @param {Function} props.onSuccess - Callback function to call on successful submission
 */
const IssueForm = ({ initialData = null, isEditing = false, onSuccess }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || INITIAL_FORM_STATE);
  const [errors, setErrors] = useState(INITIAL_ERRORS_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [previewImages, setPreviewImages] = useState([]);
  
  // Initialize preview images if editing
  useEffect(() => {
    if (initialData && initialData.images && initialData.images.length > 0) {
      setPreviewImages(initialData.images.map(img => ({ url: img, file: null })));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate number of images
    if (files.length + previewImages.length > MAX_IMAGES) {
      setErrors(prev => ({ 
        ...prev, 
        images: `You can upload a maximum of ${MAX_IMAGES} images` 
      }));
      return;
    }
    
    // Validate each file
    for (const file of files) {
      // Check file type
      if (!validateFileType(file, ALLOWED_FILE_TYPES)) {
        setErrors(prev => ({ 
          ...prev, 
          images: `File type not supported. Allowed types: ${ALLOWED_FILE_TYPES.map(type => type.split('/')[1]).join(', ')}` 
        }));
        return;
      }
      
      // Check file size
      if (!validateFileSize(file, MAX_FILE_SIZE)) {
        setErrors(prev => ({ 
          ...prev, 
          images: `File size exceeds the maximum allowed size (${formatFileSize(MAX_FILE_SIZE)})` 
        }));
        return;
      }
    }
    
    // Clear any previous errors
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
    
    // Create preview URLs and add to state
    const newPreviews = [];
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push({ url: event.target.result, file });
        if (newPreviews.length === files.length) {
          setPreviewImages(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateFormData = () => {
    const newErrors = {
      title: validateTitle(formData.title),
      description: validateDescription(formData.description),
      location: validateLocation(formData.location),
      images: '',
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateFormData()) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please fix the errors in the form before submitting.'
      });
      return;
    }
    
    setIsSubmitting(true);
    setAlert({ show: false, type: '', message: '' });
    
    try {
      // Prepare form data
      const issueData = { ...formData };
      
      // Handle images
      const newImages = previewImages
        .filter(img => img.file) // Only include new files
        .map(img => img.file);
      
      // For editing, we need to track existing images
      if (isEditing) {
        issueData.existingImages = previewImages
          .filter(img => !img.file) // Only include existing URLs
          .map(img => img.url);
      }
      
      // API call
      let response;
      if (isEditing) {
        response = await api.put(`/issues/${initialData.id}`, issueData, newImages);
      } else {
        response = await api.post('/issues', issueData, newImages);
      }
      
      // Handle success
      setAlert({
        show: true,
        type: 'success',
        message: isEditing ? 'Issue updated successfully!' : 'Issue created successfully!'
      });
      
      // Call success callback or redirect
      if (onSuccess) {
        onSuccess(response.data);
      } else {
        // Redirect after a short delay
        setTimeout(() => {
          router.push(isEditing ? `/issues/${initialData.id}` : '/issues');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'An error occurred while submitting the issue. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {alert.show && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}
      
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Brief title describing the issue"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>
      
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Detailed description of the issue"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      
      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.location ? 'border-red-500' : ''}`}
          placeholder="Address or description of the location"
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>
      
      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {PRIORITIES.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Images ({previewImages.length}/{MAX_IMAGES})
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="images"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload images</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={previewImages.length >= MAX_IMAGES}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </div>
        </div>
        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
        
        {/* Image previews */}
        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{isEditing ? 'Update Issue' : 'Create Issue'}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default IssueForm;