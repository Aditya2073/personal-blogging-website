import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, Flag, Trash2, Send } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface Comment {
  _id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  isFlagged: boolean;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: newComment,
          author,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const data = await response.json();
      setComments([...comments, data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
      console.error('Error posting comment:', err);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }

      const updatedComment = await response.json();
      setComments(comments.map(comment => 
        comment._id === commentId ? updatedComment : comment
      ));
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleFlag = async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/flag`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to flag comment');
      }

      const updatedComment = await response.json();
      setComments(comments.map(comment => 
        comment._id === commentId ? updatedComment : comment
      ));
    } catch (err) {
      console.error('Error flagging comment:', err);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-shadow"
            required
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-shadow"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            Post
          </button>
        </div>
      </form>

      <AnimatePresence>
        {comments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{comment.author}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(comment._id)}
                      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        comment.isLiked ? 'text-blue-500 dark:text-blue-400' : ''
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFlag(comment._id)}
                      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        comment.isFlagged ? 'text-red-500 dark:text-red-400' : ''
                      }`}
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                {comment.likes > 0 && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            No comments yet. Be the first to comment!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Comments;
