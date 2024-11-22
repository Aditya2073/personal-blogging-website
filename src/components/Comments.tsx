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
      const response = await fetch(`${API_BASE_URL}/comments/${postId}`);
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
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: newComment.trim(),
          author: author.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newCommentData = await response.json();
      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewComment('');
      setAuthor('');
    } catch (err) {
      setError('Failed to post comment');
      console.error('Error posting comment:', err);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }

      const updatedComment = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
    } catch (err) {
      setError('Failed to like comment');
      console.error('Error liking comment:', err);
    }
  };

  const handleFlag = async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/flag`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to flag comment');
      }

      const updatedComment = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
    } catch (err) {
      setError('Failed to flag comment');
      console.error('Error flagging comment:', err);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            required
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Post
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4 text-center">{error}</div>
      )}

      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-b dark:border-gray-700 py-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{comment.author}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLike(comment._id)}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    comment.isLiked ? 'text-blue-500' : ''
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFlag(comment._id)}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    comment.isFlagged ? 'text-red-500' : ''
                  }`}
                >
                  <Flag className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            {comment.likes > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {comment.likes} like{comment.likes !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Comments;
