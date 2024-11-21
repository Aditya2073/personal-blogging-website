import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Calendar, Tag, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { Helmet } from 'react-helmet';
import GoogleAd from './GoogleAd';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post from:', `${API_BASE_URL}/posts/${id}`);
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        // Log the response details
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          } catch (e) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const responseText = await response.text();
        console.log('Response text:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse response:', e);
          throw new Error('Invalid response format');
        }

        console.log('Parsed post data:', data);
        setPost(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setError('No post ID provided');
      setLoading(false);
    }
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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto px-4 py-12"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-red-500 dark:text-red-400 text-lg font-medium">
            {error}
          </div>
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | Aditya's Blogs</title>
          <meta name="robots" content="noindex" />
        </Helmet>
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
      </>
    );
  }

  const getMetaDescription = (content: string) => {
    const firstParagraph = content.split('\n')[0];
    return firstParagraph.length > 160 
      ? firstParagraph.substring(0, 157) + '...'
      : firstParagraph;
  };

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
    <>
      <Helmet>
        <title>{post.title} | Aditya's Blogs</title>
        <meta name="description" content={getMetaDescription(post.content)} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={getMetaDescription(post.content)} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:url" content={`https://adityasblogs.netlify.app/blog/${post._id}`} />
        <link rel="canonical" href={`https://adityasblogs.netlify.app/blog/${post._id}`} />
      </Helmet>
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

            {/* Top Ad */}
            <GoogleAd slot="1234567890" />

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

            {/* Bottom Ad */}
            <GoogleAd slot="0987654321" />
          </motion.div>
        </motion.article>
      </AnimatePresence>
    </>
  );
}