import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { FiPlus, FiEdit2, FiTrash2, FiMail, FiX } from 'react-icons/fi';
import NewsletterManager from './NewsletterManager';
import './AdminPanel.css';

interface Post {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  tags: string[];
  date: string;
}

const AdminPanel: React.FC = () => {
  // Authentication and loading states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Post management states
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  
  // Newsletter state
  const [showNewsletter, setShowNewsletter] = useState(false);
  
  const navigate = useNavigate();

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts');
    }
  }, []);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const response = await fetch('/api/auth-status', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          console.error('Auth check failed:', response.status, response.statusText);
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        console.log('Auth check successful:', data);
        setIsAuthenticated(true);
        fetchPosts();
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, fetchPosts]);

  // Post management functions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          coverImage,
          tags,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      await fetchPosts();
      resetForm();
      setIsCreating(false);
      setError('');
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${editingPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          coverImage,
          tags,
          date: editingPost.date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post');
      }

      await fetchPosts();
      resetForm();
      setError('');
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to update post');
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }

      await fetchPosts();
      setError('');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete post');
    }
  };

  // Tag management
  const addTag = () => {
    // Not needed in this version
  };

  const removeTag = (tagToRemove: string) => {
    // Not needed in this version
  };

  const startEditing = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setTags(post.tags);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCoverImage('');
    setTags([]);
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Blog Admin</h1>
        <div className="admin-actions">
          <button 
            className="primary-button"
            onClick={() => setIsCreating(true)}
          >
            <FiPlus /> New Post
          </button>
          <button 
            className="secondary-button"
            onClick={() => setShowNewsletter(true)}
          >
            <FiMail /> Newsletter
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError('')}>
            <FiX />
          </button>
        </div>
      )}

      {(isCreating || editingPost) && (
        <div className="post-form-container">
          <div className="post-form">
            <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
            <form onSubmit={editingPost ? handleEdit : handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="coverImage">Cover Image URL</label>
                <input
                  type="url"
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Enter cover image URL"
                  required
                />
                {coverImage && (
                  <div className="image-preview">
                    <img src={coverImage} alt="Cover preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (comma-separated)</label>
                <input
                  type="text"
                  id="tags"
                  value={tags.join(', ')}
                  onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                  placeholder="Enter tags, separated by commas"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content (Markdown)</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content in Markdown"
                  rows={15}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={() => {
                    resetForm();
                    setIsCreating(false);
                    setEditingPost(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <div className="post-image">
              <img src={post.coverImage} alt={post.title} />
            </div>
            <div className="post-content">
              <h3>{post.title}</h3>
              <div className="post-meta">
                <span className="post-date">
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="post-actions">
                <button
                  className="icon-button edit"
                  onClick={() => startEditing(post)}
                >
                  <FiEdit2 /> Edit
                </button>
                <button
                  className="icon-button delete"
                  onClick={() => deletePost(post._id)}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewsletter && (
        <div className="modal-overlay">
          <div className="modal-content newsletter-modal">
            <div className="modal-header">
              <h2>Newsletter Manager</h2>
              <button 
                className="close-button"
                onClick={() => setShowNewsletter(false)}
              >
                <FiX />
              </button>
            </div>
            <NewsletterManager />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;