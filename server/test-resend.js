import { Resend } from 'resend';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(dirname(__dirname), '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('Testing Resend configuration...');
  console.log('API Key:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');
  console.log('From Email:', process.env.FROM_EMAIL);
  
  try {
    console.log('Attempting to send test email...');
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.FROM_EMAIL, // Send to yourself for testing
      reply_to: process.env.FROM_EMAIL,
      subject: 'Test Email - Please Ignore',
      html: '<p>This is a test email to verify the Resend configuration.</p>'
    });
    
    console.log('Email sent successfully!');
    console.log('Response:', data);
  } catch (error) {
    console.error('Failed to send email:');
    console.error('Error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
}

testResend();
