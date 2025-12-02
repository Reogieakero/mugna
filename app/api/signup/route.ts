import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db/user.model';
import { sendVerificationEmail } from '@/lib/email/email.service';

const validatePasswordComplexity = (password: string) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long.';
    }
    if (!hasUppercase) {
        return 'Password must contain at least 1 uppercase letter (A-Z).';
    }
    if (!hasLowercase) {
        return 'Password must contain at least 1 lowercase letter (a-z).';
    }
    if (!hasNumber) {
        return 'Password must contain at least 1 number (0-9).';
    }
    if (!hasSpecialChar) {
        return 'Password must contain at least 1 special character (!@#$...).';
    }
    return null;
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, password, confirmPassword } = data;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const complexityError = validatePasswordComplexity(password);
    if (complexityError) {
        return NextResponse.json({ error: complexityError }, { status: 400 });
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    const userId = await createUser({ name, email, password });
    
    await sendVerificationEmail(userId, email, name);
    
    return NextResponse.json({ 
      message: 'Account created. Verification email sent.', 
      userId,
      redirectTo: `/verify?id=${userId}&email=${encodeURIComponent(email)}`,
    }, { status: 201 });

  } catch (error) {
    console.error('Signup API Error:', error);
    
    if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json({ error: error.message }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to create account due to a server error.' }, { status: 500 });
  }
}