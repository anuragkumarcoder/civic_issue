import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import IssueCard from '../../components/IssueCard';
import { AdjustmentsHorizontalIcon, MapPinIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  'ALL',
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
  'ALL',
  'REPORTED',
  'UNDER_REVIEW',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
];

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'ALL',
    status: 'ALL',
    location: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });
  
  const { getAuthHeader } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchIssues();
  }, [filters, pagination.page]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/issues?page=${pagination.page}&limit=${pagination.limit}`;
      
      if (filters.category !== 'ALL') {
        url += `&category=${filters.category}`;
      }
      
      if (filters.status !== 'ALL') {
        url += `&status=${filters.status}`;
      }
      
      if (filters.location) {
        url += `&location=${encodeURIComponent(filters.location)}`;
      }

      const response = await fetch(url, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }

      const data = await response.json();
      setIssues(data.issues);
      setPagination(prev => ({
        ...prev,
        total: data.total,
      }));
    } catch (error) {
      toast.error('Error fetching issues');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPagination(prev => ({
      ...prev,
      page: 1, // Reset to first page when filters change
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCreateIssue = () => {
    router.push('/issues/create');
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <>
      <Head>
        <title>Issues | Civic Issue Reporting System</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Issues</h1>
            <p className="text-gray-600 mt-2">Browse and track civic issues in your community</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <button 
              onClick={toggleFilters}
              className="btn-secondary flex items-center"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button 
              onClick={handleCreateIssue}
              className="btn-primary"
            >
              Report Issue
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <h2 className="text-lg font-semibold mb-4">Filter Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category === 'ALL' ? 'All Categories' : category.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter location"
                    className="input pl-10 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or be the first to report an issue.</p>
            <button 
              onClick={handleCreateIssue}
              className="btn-primary"
            >
              Report an Issue
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, totalPages) }))}
                    disabled={pagination.page === totalPages}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}