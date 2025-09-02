import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { useAuth } from './AuthContext';

// Create the issue context
const IssueContext = createContext();

/**
 * IssueProvider component for managing issues state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [currentIssue, setCurrentIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: '',
  });
  
  const toast = useToast();
  const { user } = useAuth();

  /**
   * Fetch issues with pagination and filters
   */
  const fetchIssues = useCallback(async (page = 1, limit = 10, newFilters = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      // Apply filters
      const appliedFilters = newFilters || filters;
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await api.get(`/issues?${queryParams.toString()}`);
      
      setIssues(response.data.items);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
      });
      
      // Update filters if new ones were provided
      if (newFilters) {
        setFilters(newFilters);
      }
      
      return response.data;
    } catch (error) {
      setError(error.message || 'Failed to fetch issues');
      toast.error('Failed to load issues. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  /**
   * Fetch a single issue by ID
   */
  const fetchIssueById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/issues/${id}`);
      setCurrentIssue(response.data);
      return response.data;
    } catch (error) {
      setError(error.message || `Failed to fetch issue #${id}`);
      toast.error(`Failed to load issue details. Please try again.`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new issue
   */
  const createIssue = async (issueData, images = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/issues', issueData, images);
      toast.success('Issue created successfully!');
      
      // Refresh the issues list
      fetchIssues(pagination.page, pagination.limit);
      
      return response.data;
    } catch (error) {
      setError(error.message || 'Failed to create issue');
      toast.error('Failed to create issue. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing issue
   */
  const updateIssue = async (id, issueData, images = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/issues/${id}`, issueData, images);
      
      // Update current issue if it's the one being edited
      if (currentIssue && currentIssue.id === id) {
        setCurrentIssue(response.data);
      }
      
      // Refresh the issues list
      fetchIssues(pagination.page, pagination.limit);
      
      toast.success('Issue updated successfully!');
      return response.data;
    } catch (error) {
      setError(error.message || `Failed to update issue #${id}`);
      toast.error('Failed to update issue. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete an issue
   */
  const deleteIssue = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/issues/${id}`);
      
      // Remove from issues list
      setIssues(prevIssues => prevIssues.filter(issue => issue.id !== id));
      
      // Clear current issue if it's the one being deleted
      if (currentIssue && currentIssue.id === id) {
        setCurrentIssue(null);
      }
      
      toast.success('Issue deleted successfully!');
      return true;
    } catch (error) {
      setError(error.message || `Failed to delete issue #${id}`);
      toast.error('Failed to delete issue. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vote on an issue
   */
  const voteIssue = async (id, voteType = 'upvote') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(`/issues/${id}/vote`, { type: voteType });
      
      // Update current issue if it's the one being voted on
      if (currentIssue && currentIssue.id === id) {
        setCurrentIssue(response.data);
      }
      
      // Update in issues list
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === id ? response.data : issue
        )
      );
      
      toast.success(`Vote recorded successfully!`);
      return response.data;
    } catch (error) {
      setError(error.message || `Failed to vote on issue #${id}`);
      toast.error('Failed to record vote. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a comment to an issue
   */
  const addComment = async (issueId, commentData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(`/issues/${issueId}/comments`, commentData);
      
      // Update current issue if it's the one being commented on
      if (currentIssue && currentIssue.id === issueId) {
        setCurrentIssue({
          ...currentIssue,
          comments: [...currentIssue.comments, response.data],
        });
      }
      
      toast.success('Comment added successfully!');
      return response.data;
    } catch (error) {
      setError(error.message || 'Failed to add comment');
      toast.error('Failed to add comment. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a comment
   */
  const deleteComment = async (issueId, commentId) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/issues/${issueId}/comments/${commentId}`);
      
      // Update current issue if it's the one with the comment
      if (currentIssue && currentIssue.id === issueId) {
        setCurrentIssue({
          ...currentIssue,
          comments: currentIssue.comments.filter(comment => comment.id !== commentId),
        });
      }
      
      toast.success('Comment deleted successfully!');
      return true;
    } catch (error) {
      setError(error.message || 'Failed to delete comment');
      toast.error('Failed to delete comment. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch issues reported by the current user
   */
  const fetchMyIssues = async (page = 1, limit = 10) => {
    if (!user) {
      toast.error('You must be logged in to view your issues');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      const response = await api.get(`/issues/my-issues?${queryParams.toString()}`);
      
      setIssues(response.data.items);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
      });
      
      return response.data;
    } catch (error) {
      setError(error.message || 'Failed to fetch your issues');
      toast.error('Failed to load your issues. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change the status of an issue
   */
  const changeIssueStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/issues/${id}/status`, { status });
      
      // Update current issue if it's the one being updated
      if (currentIssue && currentIssue.id === id) {
        setCurrentIssue(response.data);
      }
      
      // Update in issues list
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === id ? response.data : issue
        )
      );
      
      toast.success(`Issue status updated to ${status}!`);
      return response.data;
    } catch (error) {
      setError(error.message || `Failed to update issue status`);
      toast.error('Failed to update issue status. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get issue statistics
   */
  const getIssueStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/issues/stats');
      return response.data;
    } catch (error) {
      setError(error.message || 'Failed to fetch issue statistics');
      toast.error('Failed to load issue statistics. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load issues on initial render
  useEffect(() => {
    fetchIssues(1, 10);
  }, [fetchIssues]);

  return (
    <IssueContext.Provider
      value={{
        issues,
        currentIssue,
        loading,
        error,
        pagination,
        filters,
        setFilters,
        fetchIssues,
        fetchIssueById,
        createIssue,
        updateIssue,
        deleteIssue,
        voteIssue,
        addComment,
        deleteComment,
        fetchMyIssues,
        changeIssueStatus,
        getIssueStats,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

/**
 * Hook for using issue context
 * @returns {Object} Issue context value
 */
export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};