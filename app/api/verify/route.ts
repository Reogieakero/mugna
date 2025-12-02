
import { NextRequest, NextResponse } from 'next/server';
import { validateAndUseCode } from '@/lib/db/verification.model';

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json({ error: 'Missing user ID or verification code' }, { status: 400 });
    }
    
    if (typeof code !== 'string' || code.length !== 6 || !/^\d+$/.test(code)) {
      return NextResponse.json({ error: 'Invalid code format.' }, { status: 400 });
    }

    const isValid = await validateAndUseCode(userId, code);

    if (isValid) {
      return NextResponse.json({ message: 'Verification successful.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid, used, or expired verification code.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Verification API Error:', error);
    return NextResponse.json({ error: 'Server failed to process verification.' }, { status: 500 });
  }
}