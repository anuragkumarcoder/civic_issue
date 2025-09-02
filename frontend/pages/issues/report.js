import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MapPinIcon, PhotoIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import issueService from '../../services/issues';

export default function ReportIssue() {
  const router = useRouter();
  const { themeMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
    watch
  } = useForm();

  // Redirect if not authenticated
  if (typeof window !== 'undefined' && !isAuthenticated) {
    router.push('/auth/login?redirect=/issues/report');
    return null;
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (images.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }
    
    // Create preview URLs
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);
    
    // Store files for upload
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviewImages = [...previewImages];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index]);
    
    newImages.splice(index, 1);
    newPreviewImages.splice(index, 1);
    
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        
        // Attempt to get address from coordinates using reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => response.json())
          .then(data => {
            if (data.display_name) {
              setValue('location', data.display_name);
            }
          })
          .catch(error => {
            console.error('Error getting address:', error);
          })
          .finally(() => {
            setIsGettingLocation(false);
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to retrieve your location. Please enter it manually.');
        setIsGettingLocation(false);
      }
    );
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add form fields to FormData
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('location', data.location);
      formData.append('category', data.category);
      
      // Add coordinates if available
      if (coordinates) {
        formData.append('latitude', coordinates.latitude);
        formData.append('longitude', coordinates.longitude);
      }
      
      // Add images to FormData
      images.forEach((image, index) => {
        formData.append('images', image);
      });
      
      // Submit the issue
      const response = await issueService.createIssue(formData);
      
      toast.success('Issue reported successfully!');
      
      // Redirect to the issue detail page
      router.push(`/issues/${response.data.id}`);
    } catch (error) {
      console.error('Error submitting issue:', error);
      toast.error(error.response?.data?.message || 'Failed to report issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Report an Issue - Civic Issue Tracker</title>
        <meta name="description" content="Report a civic issue in your community" />
      </Head>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Report an Issue</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Issue Title</label>
            <input
              id="title"
              type="text"
              className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Brief title describing the issue"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.title.message}
              </p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              rows="4"
              className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Detailed description of the issue"
              {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Description should be at least 20 characters' } })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.description.message}
              </p>
            )}
          </div>
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
            <div className="flex">
              <input
                id="location"
                type="text"
                className={`flex-grow p-2 border rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Address or description of location"
                {...register('location', { required: 'Location is required' })}
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="flex items-center justify-center px-4 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <MapPinIcon className="h-5 w-5" />
              </button>
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.location.message}
              </p>
            )}
            {isGettingLocation && (
              <p className="mt-1 text-sm text-gray-500">Getting your location...</p>
            )}
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
            <select
              id="category"
              className={`w-full p-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select a category</option>
              <option value="ROADS">Roads</option>
              <option value="WATER">Water</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="SANITATION">Sanitation</option>
              <option value="PUBLIC_SAFETY">Public Safety</option>
              <option value="ENVIRONMENT">Environment</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.category.message}
              </p>
            )}
          </div>
          
          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1">Images (Optional)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 border-gray-300 dark:border-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <PhotoIcon className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or JPEG (MAX. 5 images)
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={src} 
                      alt={`Preview ${index + 1}`} 
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-2 px-4 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Report Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}