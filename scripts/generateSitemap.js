import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://adityasblogs.netlify.app';

function generateSitemapXML() {
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
</urlset>`;

  // Ensure the public directory exists
  const publicDir = join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // Write the sitemap
  fs.writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemapXML();
