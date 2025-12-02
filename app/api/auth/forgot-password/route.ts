import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate and store token (don't await to prevent timing attacks)
    // convex.action(api.passwordReset.generateAndStoreResetToken, { email })
    //   .catch(err => console.error('Password reset error:', err));

    // Always return the same response to prevent email enumeration
    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a password reset link shortly'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Generic error message
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}
