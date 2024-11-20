import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(dirname(__dirname), '.env') });

async function testGmail() {
  console.log('Testing Gmail Configuration...');
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Pass Length:', process.env.EMAIL_PASS?.length);

  try {
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

    console.log('Verifying transporter configuration...');
    await transporter.verify();
    console.log('Transporter verification successful!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: {
        name: 'Personal Blog Newsletter',
        address: process.env.EMAIL_USER
      },
      to: process.env.EMAIL_USER,
      subject: 'Gmail Test',
      text: 'This is a test email to verify Gmail configuration.',
      html: '<h1>Gmail Test</h1><p>This is a test email to verify Gmail configuration.</p>'
    });

    console.log('Message sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('Error occurred:', error);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your Gmail credentials.');
    }
  }
}

testGmail();
