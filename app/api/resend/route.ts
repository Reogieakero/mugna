
import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email/email.service'; // NEW IMPORT

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing user ID or email.' }, { status: 400 });
    }
    
    await sendVerificationEmail(userId, email, 'New User'); 

    return NextResponse.json({ message: 'New verification code sent.' }, { status: 200 });

  } catch (error) {
    console.error('Resend API Error:', error);
    return NextResponse.json({ error: 'Failed to resend verification code due to a server error.' }, { status: 500 });
  }
}