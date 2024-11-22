import React, { useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { MessageSquare, ThumbsUp, Flag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { darkMode } = React.useContext(ThemeContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to save comment
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Anonymous', // TODO: Replace with actual user name
        content: newComment,
        date: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      };

      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    setComments(
      comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
          : comment
      )
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    // TODO: Implement API call to delete comment
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`mt-8 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className={`w-full p-4 rounded-lg border ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-gray-200'
              : 'bg-white border-gray-200 text-gray-800'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className={`px-4 py-2 rounded-lg font-medium ${
              isSubmitting || !newComment.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-6 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  {comment.author[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium">{comment.author}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatDate(comment.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    comment.isLiked
                      ? 'text-blue-500'
                      : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp size={18} />
                </button>
                <button
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <Flag size={18} />
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? 'text-gray-400 hover:text-red-500 hover:bg-gray-700'
                      : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="mt-4">{comment.content}</p>
            {comment.likes > 0 && (
              <div className="mt-4 flex items-center gap-1 text-sm text-gray-500">
                <ThumbsUp size={14} />
                <span>{comment.likes}</span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {comments.length === 0 && (
        <div
          className={`text-center py-12 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No comments yet</p>
          <p className="text-sm mt-1">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default Comments;
