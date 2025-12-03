// /app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmailAndPassword } from '@/lib/db/user.model'; 

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await findUserByEmailAndPassword(email, password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.isVerified === false) { 
      return NextResponse.json({ 
        error: 'Account not verified. Please check your email.',
      }, { status: 403 });
    }
    
    // Successful login
    // TODO: Critical step: Create a secure session (e.g., using 'lucia' or 'next-auth') here 
    // and set a session cookie before returning.

    return NextResponse.json({ 
      message: 'Login successful', 
      user: { 
        id: user.id, 
        name: user.full_name, 
        email: user.email 
      },
      // Tell the client where to go after success (Homepage)
      redirectTo: '/home' 
    }, { status: 200 });

  } catch (error) {
    console.error('Login API Error:', error);

    return NextResponse.json({ error: 'An unexpected server error occurred during login.' }, { status: 500 });
  }
}