import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function UserDetail() {
  const [user, setUser] = useState(null);
  const [userIssues, setUserIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  const { user: currentUser, getAuthHeader, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!authLoading && id) {
      if (!currentUser) {
        toast.error('You must be logged in to access this page');
        router.push('/login');
      } else if (!isAdmin()) {
        toast.error('You do not have permission to access this page');
        router.push('/');
      } else {
        fetchUserData();
      }
    }
  }, [currentUser, authLoading, isAdmin, id]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch user details
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Fetch user's issues
      const issuesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/issues`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      if (!issuesResponse.ok) {
        throw new Error('Failed to fetch user issues');
      }

      const issuesData = await issuesResponse.json();
      setUserIssues(issuesData.issues);
    } catch (error) {
      toast.error('Error fetching user data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/role`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }

      // Update the user in the local state
      setUser(prevUser => ({
        ...prevUser,
        role: newRole
      }));

      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error(error.message || 'Error updating user role');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading || authLoading || !user) {
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
        <title>{user.name} | Admin Dashboard | Civic Issue Reporting System</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <UserIcon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <div className="flex items-center mt-1">
                    <EnvelopeIcon className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-600 mr-2">Role:</span>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                      disabled={user.id === currentUser.id} // Can't change own role
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <UserIcon className="h-5 w-5 inline-block mr-1" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('issues')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'issues' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <ClipboardDocumentListIcon className="h-5 w-5 inline-block mr-1" />
                Reported Issues ({userIssues.length})
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1 text-gray-900">{user.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-gray-900">{user.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="mt-1 text-gray-900">{user.role}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <div className="flex items-center mt-1">
                        <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                        <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Total Issues Reported</p>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{userIssues.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Resolved Issues</p>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {userIssues.filter(issue => issue.status === 'RESOLVED').length}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Last Activity</p>
                      <p className="mt-1 text-gray-900">
                        {userIssues.length > 0 
                          ? formatDate(userIssues.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0].updatedAt)
                          : 'No activity'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'issues' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Issues Reported by {user.name}</h3>
                
                {userIssues.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No issues</h3>
                    <p className="mt-1 text-sm text-gray-500">This user hasn't reported any issues yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userIssues.map((issue) => (
                          <tr key={issue.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {issue.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`badge ${issue.status === 'REPORTED' ? 'badge-reported' : issue.status === 'UNDER_REVIEW' ? 'badge-under-review' : issue.status === 'IN_PROGRESS' ? 'badge-in-progress' : issue.status === 'RESOLVED' ? 'badge-resolved' : 'badge-closed'}`}>
                                {issue.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {issue.category.replace('_', ' ')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(issue.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link href={`/issues/${issue.id}`} className="text-primary-600 hover:text-primary-900 mr-3">
                                View
                              </Link>
                              <Link href={`/issues/${issue.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}