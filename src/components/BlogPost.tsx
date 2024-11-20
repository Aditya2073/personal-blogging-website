import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Calendar, Tag, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  coverImage: string;
  readingTime: string;
}

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto px-4 py-12"
      >
        <div className="space-y-8 animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!post) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto px-4 py-12 text-center"
      >
        <p className="text-red-500">Post not found</p>
        <Link to="/" className="text-blue-500 hover:text-blue-600 mt-4 inline-block">
          Return to Blog
        </Link>
      </motion.div>
    );
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Check out this blog post: ${post.title}`,
        url: window.location.href,
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.article 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-[#0a0b14] transition-colors"
      >
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"
          />
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 z-20">
            <div className="max-w-5xl mx-auto px-4 h-full flex flex-col justify-end pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link 
                  to="/"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 group transition-colors"
                >
                  <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Blog</span>
                </Link>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl md:text-6xl font-bold text-white mb-6 [text-wrap:balance]"
                >
                  {post.title}
                </motion.h1>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-6 text-white/80"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime}</span>
                  </div>
                  <button 
                    onClick={sharePost}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto px-4 py-16"
        >
          {/* Tags */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {post.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="px-4 py-2 rounded-full text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 hover:scale-105 transition-transform"
              >
                <Tag className="w-3 h-3 inline-block mr-1" />
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Article Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/20
              prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic
              prose-img:rounded-xl prose-img:shadow-lg hover:prose-img:shadow-xl prose-img:transition-shadow
              prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50/50 dark:prose-code:bg-blue-900/20
              prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800"
          >
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 group transition-colors"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Blog</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.article>
    </AnimatePresence>
  );
}