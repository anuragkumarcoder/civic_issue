import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { MapPinIcon, PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  'ROADS',
  'WATER',
  'ELECTRICITY',
  'SANITATION',
  'PUBLIC_SAFETY',
  'ENVIRONMENT',
  'PUBLIC_PROPERTY',
  'OTHER',
];

const STATUSES = [
  'REPORTED',
  'UNDER_REVIEW',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
];

export default function EditIssue() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    status: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, getAuthHeader, isAdmin } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchIssue();
    }
  }, [id]);

  const fetchIssue = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch issue');
      }

      const data = await response.json();
      
      // Check if user has permission to edit
      if (user && (user.id === data.reporterId || isAdmin())) {
        setFormData({
          title: data.title,
          description: data.description,
          location: data.location,
          category: data.category,
          status: data.status,
        });
        
        if (data.imageUrl) {
          setCurrentImage(data.imageUrl);
        }
      } else {
        toast.error('You do not have permission to edit this issue');
        router.push(`/issues/${id}`);
      }
    } catch (error) {
      toast.error('Error fetching issue details');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create form data for multipart/form-data (for image upload)
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      
      if (image) {
        submitData.append('image', image);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          // Don't set Content-Type here, it will be set automatically with the boundary for multipart/form-data
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update issue');
      }

      toast.success('Issue updated successfully!');
      router.push(`/issues/${id}`);
    } catch (error) {
      toast.error(error.message || 'Error updating issue');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Issue | Civic Issue Reporting System</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href={`/issues/${id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Issue
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Issue</h1>
          <p className="text-gray-600 mb-8">Update the details of your reported issue</p>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="input pl-10 w-full"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input w-full"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="input w-full"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image (Optional)
                </label>
                {currentImage && !imagePreview && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 mb-2">Current image:</p>
                    <img
                      src={currentImage}
                      alt="Current issue image"
                      className="h-40 w-auto object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50">
                    <PhotoIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{currentImage ? 'Change Image' : 'Upload Image'}</span>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <div className="relative">
                      <p className="text-sm text-gray-500 mb-2">New image:</p>
                      <img
                        src={imagePreview}
                        alt="New issue image"
                        className="h-40 w-auto object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Issue'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}