import express from 'express';
import Newsletter from '../models/Newsletter.js';
import Subscriber from '../models/Subscriber.js';
import { auth } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Get all newsletters (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ sentDate: -1 });
    res.json(newsletters);
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({ error: 'Failed to fetch newsletters' });
  }
});

// Create a new newsletter draft (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { subject, content } = req.body;
    const newsletter = new Newsletter({
      subject,
      content,
      status: 'draft'
    });
    await newsletter.save();
    res.status(201).json(newsletter);
  } catch (error) {
    console.error('Error creating newsletter:', error);
    res.status(500).json({ error: 'Failed to create newsletter' });
  }
});

// Delete a newsletter (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    await newsletter.deleteOne();
    res.json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    res.status(500).json({ error: 'Failed to delete newsletter' });
  }
});

// Send a newsletter (admin only)
router.post('/:id/send', auth, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    if (newsletter.status !== 'draft') {
      return res.status(400).json({ error: 'Newsletter has already been sent' });
    }

    // Update newsletter status to sending
    newsletter.status = 'sending';
    await newsletter.save();

    // Get all active subscribers
    const subscribers = await Subscriber.find({ active: true });
    if (subscribers.length === 0) {
      newsletter.status = 'failed';
      await newsletter.save();
      return res.status(400).json({ error: 'No active subscribers found' });
    }

    // Create email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send emails to all subscribers
    const emailPromises = subscribers.map(subscriber => {
      return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: newsletter.subject,
        html: newsletter.content
      });
    });

    await Promise.all(emailPromises);

    // Update newsletter status and recipient count
    newsletter.status = 'sent';
    newsletter.sentDate = new Date();
    newsletter.recipientCount = subscribers.length;
    await newsletter.save();

    res.json({ message: 'Newsletter sent successfully', recipientCount: subscribers.length });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    
    // Update newsletter status to failed
    if (req.params.id) {
      try {
        const newsletter = await Newsletter.findById(req.params.id);
        if (newsletter) {
          newsletter.status = 'failed';
          await newsletter.save();
        }
      } catch (updateError) {
        console.error('Error updating newsletter status:', updateError);
      }
    }
    
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});

// Get subscriber count
router.get('/subscribers/count', auth, async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ active: true });
    res.json({ count: subscribers.length });
  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    res.status(500).json({ error: 'Failed to fetch subscriber count' });
  }
});

// Get all subscribers (admin only)
router.get('/subscribers', auth, async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ active: true }).sort({ subscriptionDate: -1 });
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Subscribe to newsletter (public)
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      if (subscriber.active) {
        return res.status(400).json({ error: 'Email already subscribed' });
      } else {
        subscriber.active = true;
        await subscriber.save();
        return res.json({ message: 'Subscription reactivated successfully' });
      }
    }

    // Create new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe from newsletter (public)
router.post('/unsubscribe', async (req, res) => {
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

export default router;
