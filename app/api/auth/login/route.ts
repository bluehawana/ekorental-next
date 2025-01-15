import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Mailjet from 'node-mailjet';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EMAIL_FROM = process.env.EMAIL_FROM;

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY
});

async function sendEmail(to: string, subject: string, body: string) {
  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: EMAIL_FROM,
            Name: "Eko Rental"
          },
          To: [
            {
              Email: to,
              Name: to
            }
          ],
          Subject: subject,
          HTMLPart: body
        }
      ]
    });
    console.log('Email sent successfully:', result.body);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  const { email } = await request.json();
  
  // Generate a JWT token
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  
  // Create login link
  const loginLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${token}`;

  const subject = 'Login to Eko Rental';
  const body = `
    <h1>Welcome to Eko Rental</h1>
    <p>Click <a href="${loginLink}">here</a> to log in to your Eko Rental account.</p>
    <p>If you didn't request this login link, please ignore this email.</p>
  `;

  try {
    await sendEmail(email, subject, body);
    
    // Set cookies for email login
    cookies().set('auth_method', 'email');
    cookies().set('user_email', email);
    
    return NextResponse.json({ message: 'Login link sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send login link' }, { status: 500 });
  }
}
