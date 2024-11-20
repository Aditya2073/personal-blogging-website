import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { marked } from 'marked';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { auth } from './middleware/auth.js';
import Post from './models/Post.js';
import Subscriber from './models/Subscriber.js';
import Newsletter from './models/Newsletter.js';
import newsletterRoutes from './routes/newsletterRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({ path: join(dirname(__dirname), '.env') });

// Verify environment variables
const requiredEnvVars = ['MONGODB_URI', 'PORT', 'EMAIL_USER', 'EMAIL_PASS', 'JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create Express app
const app = express();

// Create email transporter with the same configuration as test-gmail.js
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,
  logger: true
});

// Verify transporter configuration on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Configure middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3001',
    process.env.FRONTEND_URL || 'https://your-netlify-app.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie']
}));

// Mount newsletter routes
app.use('/api/newsletters', newsletterRoutes);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Params:', req.params);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Log loaded environment variables (excluding sensitive data)
console.log('Environment variables loaded:');
console.log('- ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
console.log('- JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('- ADMIN_PASSWORD length:', process.env.ADMIN_PASSWORD?.length || 0);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '$2a$10$XQDz5YNPZ5Gg/F3QqhGHr.bfbGZkD5KnzNqVGXfnZ7ULr8FFpxm3e'; // hashed password for 'adminpassword'

// Public routes - no authentication required
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching single post:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/newsletters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to fetch newsletter with ID:', id);

    if (!Types.ObjectId.isValid(id)) {
      console.error('Invalid newsletter ID format:', id);
      return res.status(400).json({ error: 'Invalid newsletter ID format' });
    }

    const newsletter = await Newsletter.findById(id);
    console.log('Found newsletter:', newsletter);
    
    if (!newsletter) {
      console.error('Newsletter not found with ID:', id);
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    res.json(newsletter);
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    res.status(500).json({ error: 'Failed to fetch newsletter' });
  }
});

app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ active: true });
    res.json({ 
      count: subscribers.length,
      subscribers: subscribers.map(s => ({ email: s.email, active: s.active }))
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

app.get('/api/subscribers/count', async (req, res) => {
  try {
    console.log('Counting active subscribers...');
    const count = await Subscriber.countDocuments({ active: true });
    console.log('Active subscriber count:', count);
    res.setHeader('Content-Type', 'application/json');
    res.json({ count });
  } catch (error) {
    console.error('Error counting subscribers:', error);
    res.status(500).json({ error: 'Failed to count subscribers' });
  }
});

// Protected routes - require authentication
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login attempt - Body:', req.body);
    const { username, password } = req.body;
    
    if (username !== process.env.ADMIN_USERNAME) {
      console.log('Username mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username: process.env.ADMIN_USERNAME },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/posts', auth, async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.put('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

app.delete('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.use('/api/posts', auth);

// Mount newsletter routes
app.use('/api/newsletters', newsletterRoutes);

app.post('/api/newsletters', auth, async (req, res) => {
  try {
    console.log('Creating newsletter:', req.body);
    const { subject, content } = req.body;
    const newsletter = new Newsletter({ 
      subject, 
      content,
      sentDate: new Date(), // Set initial date when creating
      status: 'draft',
      recipientCount: 0
    });
    await newsletter.save();
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(newsletter);
  } catch (error) {
    console.error('Error creating newsletter:', error);
    res.status(500).json({ error: 'Failed to create newsletter' });
  }
});

app.post('/api/newsletters/:id/send', auth, async (req, res) => {
  try {
    console.log('\n=== Starting Newsletter Send Process ===');
    
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    if (newsletter.status === 'sent') {
      return res.status(400).json({ error: 'Newsletter has already been sent' });
    }

    const subscribers = await Subscriber.find({ active: true });
    console.log(`Found ${subscribers.length} active subscribers`);
    
    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'No active subscribers found' });
    }

    let sentCount = 0;
    let errors = [];

    // Send to each subscriber using exact same configuration as test-gmail.js
    for (const subscriber of subscribers) {
      try {
        console.log(`\nSending to ${subscriber.email}`);
        
        // Use exact same mail options structure as test-gmail.js
        const info = await transporter.sendMail({
          from: {
            name: 'Personal Blog Newsletter',
            address: process.env.EMAIL_USER
          },
          to: subscriber.email,
          subject: newsletter.subject,
          text: newsletter.content.replace(/<[^>]*>/g, ''),
          html: newsletter.content
        });

        console.log('Message sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        
        sentCount++;
        
        // Same delay as test-gmail.js
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error sending to', subscriber.email, ':', error);
        if (error.code === 'EAUTH') {
          console.error('Authentication failed. Please check your Gmail credentials.');
        }
        errors.push(`${subscriber.email}: ${error.message}`);
      }
    }

    if (sentCount === 0) {
      throw new Error(`Failed to send newsletter. Errors: ${errors.join(', ')}`);
    }

    newsletter.status = 'sent';
    newsletter.sentDate = new Date();
    newsletter.recipientCount = sentCount;
    await newsletter.save();

    console.log(`Successfully sent to ${sentCount}/${subscribers.length} subscribers`);

    res.json({ 
      message: `Newsletter sent successfully to ${sentCount} subscribers`,
      recipientCount: sentCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ 
      error: 'Failed to send newsletter', 
      details: error.message
    });
  }
});

app.get('/api/newsletters/subscribers', auth, async (req, res) => {
  try {
    const count = await Subscriber.countDocuments({ active: true });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    res.status(500).json({ error: 'Failed to fetch subscriber count' });
  }
});

app.delete('/api/newsletters/:id', auth, async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    res.json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    res.status(500).json({ error: 'Failed to delete newsletter' });
  }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: 'This email is already subscribed to our newsletter.' });
    }

    // Create new subscriber (active by default)
    const subscriber = new Subscriber({
      email,
      active: true,
      subscribeDate: new Date()
    });
    await subscriber.save();

    // Send welcome email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Our Newsletter!',
        html: `
          <h1>Welcome to Our Newsletter! 🎉</h1>
          <p>Thank you for subscribing to our newsletter. We're excited to have you join our community!</p>
          <p>You'll now receive our latest updates, articles, and insights directly in your inbox.</p>
          <p>If you ever want to unsubscribe, you can click the unsubscribe link at the bottom of any newsletter.</p>
          <br>
          <p>Best regards,</p>
          <p>Your Blog Team</p>
        `
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Continue even if email fails
    }

    res.status(201).json({ 
      message: 'Successfully subscribed to the newsletter!',
      status: 'success'
    });
  } catch (error) {
    console.error('Error in subscription process:', error);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

app.get('/api/subscribers/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find subscriber with this token
    const subscriber = await Subscriber.findOne({ confirmationToken: token });
    
    if (!subscriber) {
      return res.status(404).json({ error: 'Invalid or expired confirmation link' });
    }

    // Update subscriber to active and remove token
    subscriber.active = true;
    subscriber.confirmationToken = undefined;
    await subscriber.save();

    // Send welcome email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: 'Welcome to Our Newsletter!',
        html: `
          <h1>Subscription Confirmed!</h1>
          <p>Thank you for confirming your subscription to our newsletter.</p>
          <p>You'll now receive our latest updates and news directly in your inbox.</p>
          <p>If you ever want to unsubscribe, you can click the unsubscribe link at the bottom of any newsletter.</p>
        `
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }

    res.json({ 
      message: 'Subscription confirmed successfully!',
      email: subscriber.email
    });
  } catch (error) {
    console.error('Error confirming subscription:', error);
    res.status(500).json({ error: 'Failed to confirm subscription' });
  }
});

app.post('/api/subscribers/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    subscriber.active = false;
    await subscriber.save();
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Check auth status
app.get('/api/auth-status', auth, (req, res) => {
  res.json({ 
    authenticated: true,
    user: req.user,
    message: 'Authentication valid'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});