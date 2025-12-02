// MUGNA/app/signup/api/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db/user.model'; // Calls the Model

// Function to validate password complexity
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
    return null; // Validation passed
};

// The Controller's POST handler
export async function POST(request: NextRequest) {
  try {
    // 1. Get and parse data from the request body
    const data = await request.json();
    const { name, email, password, confirmPassword } = data;

    // 2. Input Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check password complexity using the new function
    const complexityError = validatePasswordComplexity(password);
    if (complexityError) {
        return NextResponse.json({ error: complexityError }, { status: 400 });
    }
    
    // Check password match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    // 3. Delegate data handling to the Model
    const userId = await createUser({ name, email, password });

    // 4. Send success response back to the frontend (View)
    return NextResponse.json({ 
      message: 'Account created successfully.', 
      userId 
    }, { status: 201 });

  } catch (error) {
    console.error('Signup API Error:', error);
    
    // Handle specific error from the Model (e.g., email already exists)
    if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json({ error: error.message }, { status: 409 });
    }
    
    // Generic Server Error
    return NextResponse.json({ error: 'Failed to create account due to a server error.' }, { status: 500 });
  }
}