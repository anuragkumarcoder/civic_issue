import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ArrowUpIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const categoryIcons = {
  ROADS: '🛣️',
  WATER: '💧',
  ELECTRICITY: '⚡',
  SANITATION: '🗑️',
  PUBLIC_SAFETY: '🚨',
  ENVIRONMENT: '🌳',
  PUBLIC_PROPERTY: '🏢',
  OTHER: '📋',
};

const statusColors = {
  REPORTED: 'badge-reported',
  UNDER_REVIEW: 'badge-under-review',
  IN_PROGRESS: 'badge-in-progress',
  RESOLVED: 'badge-resolved',
  CLOSED: 'badge-closed',
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function IssueDetail() {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { user, getAuthHeader } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchIssue();
      fetchComments();
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
      setIssue(data);
    } catch (error) {
      toast.error('Error fetching issue details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues/${id}/comments`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      toast.error('Error fetching comments');
      console.error(error);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      toast.error('You must be logged in to upvote');
      return;
    }

    setIsUpvoting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues/${id}/upvote`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upvote');
      }

      // Refresh issue data to get updated upvote count
      fetchIssue();
      toast.success('Issue upvoted!');
    } catch (error) {
      toast.error(error.message || 'Error upvoting issue');
      console.error(error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }

    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues/${id}/comments`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      setComment('');
      fetchComments();
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error(error.message || 'Error adding comment');
      console.error(error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!user || (user.id !== issue.reporterId && user.role !== 'ADMIN')) {
      toast.error('You do not have permission to delete this issue');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete issue');
      }

      toast.success('Issue deleted successfully!');
      router.push('/issues');
    } catch (error) {
      toast.error(error.message || 'Error deleting issue');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">Issue not found</h3>
          <p className="text-gray-600 mb-4">The issue you're looking for doesn't exist or has been removed.</p>
          <Link href="/issues" className="btn-primary">
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{issue.title} | Civic Issue Reporting System</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/issues" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Issues
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Issue Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`badge ${statusColors[issue.status]}`}>{issue.status.replace('_', ' ')}</span>
                  <span className="text-2xl">{categoryIcons[issue.category]}</span>
                  <span className="text-gray-600 text-sm">{issue.category.replace('_', ' ')}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{issue.title}</h1>
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{issue.location}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Reported on {formatDate(issue.createdAt)}</span>
                </div>
              </div>
              
              {/* Action buttons for issue owner or admin */}
              {user && (user.id === issue.reporterId || user.role === 'ADMIN') && (
                <div className="flex space-x-2">
                  <Link href={`/issues/${id}/edit`} className="btn-secondary flex items-center">
                    <PencilSquareIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button 
                    onClick={handleDelete} 
                    className="btn-danger flex items-center"
                    disabled={isDeleting}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Issue Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="font-medium text-gray-900">
                  Reported by {issue.reporter.name}
                </div>
              </div>
              <button 
                onClick={handleUpvote} 
                className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
                disabled={isUpvoting}
              >
                <ArrowUpIcon className="h-5 w-5 mr-1" />
                <span className="font-medium">{issue.upvotes}</span>
              </button>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
            </div>

            {issue.imageUrl && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Attached Image</h3>
                <img 
                  src={issue.imageUrl} 
                  alt={issue.title} 
                  className="rounded-lg max-h-96 object-contain"
                />
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="mb-3">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="input w-full"
                    rows={3}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmittingComment}
                >
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
                <p className="text-gray-600 mb-2">You must be logged in to comment</p>
                <Link href="/login" className="btn-primary">
                  Log In
                </Link>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900">{comment.user.name}</div>
                      <div className="text-sm text-gray-500">{formatDate(comment.createdAt)}</div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}