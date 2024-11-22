export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://personal-blogging-website.onrender.com/api';

// Add a helper function to check if we're in production
export const isProduction = import.meta.env.PROD;
