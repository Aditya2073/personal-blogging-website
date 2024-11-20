import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(dirname(__dirname), '.env') });

const newsletterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  content: { type: String, required: true },
  sentDate: { type: Date },
  recipientCount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'sent'], 
    default: 'draft' 
  }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

async function checkNewsletter() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('\nListing all newsletters:');
    const newsletters = await Newsletter.find();
    console.log(JSON.stringify(newsletters, null, 2));

    const targetId = '673df96...'; // Replace with your ID
    console.log(`\nLooking for newsletter with ID: ${targetId}`);
    const newsletter = await Newsletter.findById(targetId);
    console.log('Found newsletter:', newsletter);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkNewsletter();
