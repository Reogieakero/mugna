
import nodemailer from 'nodemailer';
import { generate } from 'rand-token';
import { saveVerificationCode } from '@/lib/db/verification.model';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export async function sendVerificationEmail(userId: number, email: string, name: string): Promise<void> {
  const verificationCode = generate(6, '0123456789');
  
  await saveVerificationCode(userId, verificationCode);
  
  const mailOptions = {
    from: `"Mugna Account Services" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Mugna: Verify Your New Account',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <h2>Email Verification for ${name}</h2>
        <p>Thank you for signing up with Mugna. Please use the following 6-digit code to verify your email address:</p>
        <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px 20px; border-radius: 4px; letter-spacing: 5px;">
                ${verificationCode}
            </span>
        </div>
        <p>This code is valid for 30 minutes. If you did not create an account, please ignore this email.</p>
        <p>— The Mugna Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email. Please check server logs.'); 
  }
}