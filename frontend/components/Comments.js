import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { formatDate, getRelativeTime } from '../utils/helpers';
import { validateComment } from '../utils/validation';
import api from '../services/api';
import { EmptyComments } from './EmptyState';
import { FormError } from './Error';
import { ButtonLoading } from './Loading';
import toast from 'react-hot-toast';

/**
 * Comment component for displaying a single comment
 * 
 * @param {Object} props
 * @param {Object} props.comment - Comment data
 * @param {Function} props.onDelete - Function to call when comment is deleted
 * @param {boolean} props.isOwner - Whether the current user is the comment owner
 * @param {boolean} props.isAdmin - Whether the current user is an admin
 */
const Comment = ({ comment, onDelete, isOwner, isAdmin }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        setIsDeleting(true);
        await api.delete(`/comments/${comment.id}`);
        toast.success('Comment deleted successfully');
        onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="ml-2">
            <p className="font-medium text-gray-900">{comment.user?.name || 'Anonymous'}</p>
            <p className="text-xs text-gray-500" title={formatDate(comment.createdAt)}>
              {getRelativeTime(comment.createdAt)}
            </p>
          </div>
        </div>
        
        {(isOwner || isAdmin) && (
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 focus:outline-none"
            aria-label="Delete comment"
          >
            {isDeleting ? (
              <ButtonLoading size="sm" color="primary" />
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      <div className="mt-2 text-gray-700 whitespace-pre-line">
        {comment.content}
      </div>
    </div>
  );
};

/**
 * CommentForm component for adding a new comment
 * 
 * @param {Object} props
 * @param {string} props.issueId - ID of the issue to comment on
 * @param {Function} props.onCommentAdded - Function to call when a comment is added
 */
const CommentForm = ({ issueId, onCommentAdded }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate comment
    const validationError = validateComment(content);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await api.post(`/issues/${issueId}/comments`, { content });
      
      // Clear form and notify parent
      setContent('');
      toast.success('Comment added successfully');
      onCommentAdded(response.data);
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-600 mb-2">You need to be logged in to comment.</p>
        <button 
          onClick={() => router.push(`/login?redirect=${router.asPath}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Log In to Comment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Add a comment
        </label>
        <textarea
          id="comment"
          rows="3"
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Write your comment here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          required
        ></textarea>
        <FormError message={error} />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <ButtonLoading size="sm" color="white" />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            'Submit Comment'
          )}
        </button>
      </div>
    </form>
  );
};

/**
 * Comments component for displaying a list of comments and a comment form
 * 
 * @param {Object} props
 * @param {Array} props.comments - List of comments
 * @param {string} props.issueId - ID of the issue
 * @param {Function} props.onCommentAdded - Function to call when a comment is added
 * @param {Function} props.onCommentDeleted - Function to call when a comment is deleted
 */
const Comments = ({ comments = [], issueId, onCommentAdded, onCommentDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  
  const handleCommentAdded = (newComment) => {
    if (onCommentAdded) {
      onCommentAdded(newComment);
    }
  };
  
  const handleCommentDeleted = (commentId) => {
    if (onCommentDeleted) {
      onCommentDeleted(commentId);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>
      
      <CommentForm issueId={issueId} onCommentAdded={handleCommentAdded} />
      
      <div className="mt-6">
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Comment 
                key={comment.id} 
                comment={comment} 
                onDelete={handleCommentDeleted}
                isOwner={isAuthenticated && user?.id === comment.userId}
                isAdmin={isAuthenticated && user?.role === 'ADMIN'}
              />
            ))}
          </div>
        ) : (
          <EmptyComments />
        )}
      </div>
    </div>
  );
};

export default Comments;