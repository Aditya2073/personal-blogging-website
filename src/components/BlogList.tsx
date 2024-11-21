import React from 'react';
import { Link } from 'react-router-dom';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ArrowUpRight, Search, Filter, X, ChevronDown } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage: string;
}

type SortOption = 'newest' | 'oldest' | 'title';

function BlogList() {
  const { darkMode } = React.useContext(ThemeContext);
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<SortOption>('newest');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  
  // Get unique tags from all posts
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [posts]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/posts`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Filter and sort remaining posts
  const filteredPosts = React.useMemo(() => {
    // Start with all valid posts
    let filtered = posts.filter(post => post && post.title);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        const title = (post.title || '').toLowerCase();
        const excerpt = (post.excerpt || '').toLowerCase();
        const tags = Array.isArray(post.tags) ? post.tags.map(tag => (tag || '').toLowerCase()) : [];

        return (
          title.includes(query) ||
          excerpt.includes(query) ||
          tags.some(tag => tag.includes(query))
        );
      });
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => {
        if (!Array.isArray(post.tags)) return false;
        return selectedTags.every(selectedTag => 
          post.tags.some(postTag => postTag.toLowerCase() === selectedTag.toLowerCase())
        );
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      try {
        switch (sortBy) {
          case 'oldest':
            return new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
          case 'title':
            return (a.title || '').localeCompare(b.title || '');
          default: // 'newest'
            return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
        }
      } catch (error) {
        console.error('Error sorting posts:', error);
        return 0;
      }
    });
  }, [posts, searchQuery, selectedTags, sortBy]);

  // Get recent posts (only from today or yesterday)
  const recentPosts = React.useMemo(() => {
    if (searchQuery.trim() !== '') return [];

    const validPosts = posts.filter(post => {
      if (!post || !post.title || !post.date) return false;
      
      try {
        const postDate = parseISO(post.date);
        return isToday(postDate) || isYesterday(postDate);
      } catch (error) {
        console.error('Error parsing date:', error);
        return false;
      }
    });
    
    return validPosts
      .sort((a, b) => {
        try {
          return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
        } catch (error) {
          console.error('Error sorting recent posts:', error);
          return 0;
        }
      });
  }, [posts, searchQuery]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-fade-in">
        <h1 className="text-7xl font-bold mb-16 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-glow">
          THE BLOG
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-800 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-7xl font-bold mb-16 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-glow">
          THE BLOG
        </h1>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const PostCard = ({ post, index, featured = false }: { post: BlogPost; index: number; featured?: boolean }) => {
    if (!post || !post.title || !post.date || !post.tags || !Array.isArray(post.tags)) {
      return null;
    }

    return (
      <Link 
        to={`/blog/${post._id}`} 
        key={post._id}
        className={`animate-slide-up ${featured ? 'col-span-full' : ''}`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <article className={`group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${featured ? 'grid md:grid-cols-2 gap-8' : ''}`}>
          <div className={`aspect-video overflow-hidden ${featured ? 'mb-0' : ''}`}>
            <img
              src={post.coverImage || 'https://via.placeholder.com/800x400'}
              alt={post.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x400';
              }}
            />
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <time>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>{post.tags[0]}</span>
            </div>
            
            <h3 className={`${featured ? 'text-3xl' : 'text-2xl'} font-semibold group-hover:text-blue-500 dark:group-hover:text-blue-400 flex items-center gap-2 transition-colors line-clamp-2`}>
              {post.title}
              <ArrowUpRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" size={featured ? 24 : 20} />
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.slice(1).map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </Link>
    );
  };

  return (
    <div className="relative min-h-screen">
      <div className="space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-blue-500/20 -z-10"></div>
          <h1 className="text-5xl sm:text-7xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient-glow">
            THE BLOG
          </h1>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exploring technology, design, and everything in between
          </p>
        </div>

        {/* Recent Posts Section */}
        {recentPosts.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Recent Posts</h2>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  Last 24 hours
                </span>
              </div>
              <div className="h-[2px] flex-1 mx-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
            </div>
            <div className="grid grid-cols-1 gap-12">
              {recentPosts.map((post, index) => (
                <PostCard key={post._id} post={post} index={index} featured={index === 0} />
              ))}
            </div>
          </section>
        )}
        
        {/* All Posts Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">All Posts</h2>
            <div className="h-[2px] flex-1 mx-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-12 space-y-4 animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    if (value.trim()) {
                      setIsFilterOpen(false);
                    }
                  }}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all animate-scale-up"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors animate-fade-in"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group w-full md:w-auto justify-center"
                >
                  <Filter size={20} className="group-hover:text-blue-500 transition-colors" />
                  <span className="group-hover:text-blue-500 transition-colors">Filters</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform group-hover:text-blue-500 ${isFilterOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Filter Panel */}
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-2 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-10 animate-scale-up min-w-[300px]">
                    {/* Sort Options */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Sort by</h3>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title</option>
                      </select>
                    </div>

                    {/* Tags Filter */}
                    <div>
                      <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Filter by tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-4 py-2 rounded-xl text-sm transition-all ${
                              selectedTags.includes(tag)
                                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-2 animate-slide-up">
                {selectedTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm hover:shadow-md transition-all"
                  >
                    {tag}
                    <X size={14} />
                  </button>
                ))}
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.length === 0 ? (
              <div className="col-span-2 text-center py-16 animate-fade-in">
                <p className="text-gray-500 dark:text-gray-400">No posts found matching your criteria.</p>
              </div>
            ) : (
              filteredPosts.map((post, index) => (
                <PostCard key={post._id} post={post} index={index} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default BlogList;