# Personal Blogging Website

A full-stack blogging platform with newsletter management capabilities.

## Features

- Blog post management
- Newsletter system
- Subscriber management
- Admin authentication
- Responsive design

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT
- Email: Nodemailer

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```bash
   ./dev.sh
   ```

## Deployment

### Backend (Render)

1. Create an account on [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
5. Add environment variables from `.env`

### Frontend (Netlify)

1. Create an account on [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT
