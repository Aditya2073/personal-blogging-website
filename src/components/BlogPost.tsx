import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Calendar, Tag, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { Helmet } from 'react-helmet';
import GoogleAd from './GoogleAd';
import { marked } from 'marked';
import hljs from 'highlight.js';
import Comments from './Comments';
import ShareButtons from './ShareButtons';
import TableOfContents from './TableOfContents';

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error(err);
      }
    }
    return code;
  },
  breaks: true,
  gfm: true
});

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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post from:', `${API_BASE_URL}/posts/${id}`);
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

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
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse response:', e);
          throw new Error('Invalid response format');
        }

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

  if (post) {
    return (
      <>
        <Helmet>
          <title>{post.title}</title>
          <meta name="description" content={post.content.slice(0, 160)} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.content.slice(0, 160)} />
          {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        </Helmet>

        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 py-12"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <Link
                to="/blog"
                className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {post.readingTime}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?tag=${tag}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Link>
                  ))}
                </div>

                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-auto rounded-lg shadow-lg mb-8"
                  />
                )}

                <div className="flex items-center justify-between">
                  <ShareButtons
                    url={window.location.href}
                    title={post.title}
                    description={post.content.slice(0, 160)}
                  />
                </div>
              </header>

              <div
                ref={contentRef}
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(post.content) }}
              />

              <GoogleAd />

              <Comments postId={id || ''} />
            </div>

            {/* Sidebar */}
            <div className="lg:w-64">
              <TableOfContents contentRef={contentRef} />
            </div>
          </div>
        </motion.article>
      </>
    );
  }
}
