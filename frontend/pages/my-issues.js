import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });
  
  const { user, getAuthHeader, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error('You must be logged in to view your issues');
        router.push('/login');
      } else {
        fetchMyIssues();
      }
    }
  }, [user, authLoading, pagination.page]);

  const fetchMyIssues = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/issues?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch your issues');
      }

      const data = await response.json();
      setIssues(data.issues);
      setPagination(prev => ({
        ...prev,
        total: data.total,
      }));
    } catch (error) {
      toast.error('Error fetching your issues');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading || authLoading) {
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
        <title>My Issues | Civic Issue Reporting System</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Reported Issues</h1>
            <p className="text-gray-600 mt-2">Track and manage the issues you've reported</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/issues/create" className="btn-primary">
              Report New Issue
            </Link>
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No issues reported yet</h3>
            <p className="text-gray-600 mb-4">You haven't reported any civic issues yet.</p>
            <Link href="/issues/create" className="btn-primary">
              Report Your First Issue
            </Link>
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