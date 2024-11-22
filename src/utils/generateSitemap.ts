import fs from 'fs';
import { API_BASE_URL } from '../config';

const SITE_URL = 'https://adityasblogs.netlify.app';

interface BlogPost {
  _id: string;
  title: string;
  date: string;
}

async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

function generateSitemapXML(posts: BlogPost[]): string {
  const staticPages = [
    '',
    '/about',
    '/newsletter',
    '/privacy-policy',
    '/terms-of-service',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${SITE_URL}/blog/${post._id}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return sitemap;
}

async function generateSitemap() {
  try {
    const posts = await fetchAllPosts();
    const sitemap = generateSitemapXML(posts);
    
    fs.writeFileSync('public/sitemap.xml', sitemap);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

export default generateSitemap;
