import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Generate reset token
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // try {
    //   // Generate password reset token with Convex action
    //   const result = await convex.action(api.passwordReset.generateAndStoreResetToken, { email });
      
    //   // Don't return the token directly - send via email instead
    //   return NextResponse.json({ 
    //     message: 'If an account exists with this email, you will receive a password reset link shortly' 
    //   });
    // } catch (error) {
    //   console.error('Convex token generation error:', error);
      
    //   // Always return the same message to prevent email enumeration
    //   return NextResponse.json({
    //     message: 'If an account exists with this email, you will receive a password reset link shortly'
    //   });
    // }
  } catch (error) {
    console.error('Reset token generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Reset password with token
export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // try {
    //   // Reset password with Convex action (not mutation)
    //   const result = await convex.action(api.passwordReset.resetPasswordWithToken, { 
    //     token, 
    //     newPassword 
    //   });
      
    //   return NextResponse.json({ 
    //     success: true,
    //     message: 'Password has been reset successfully' 
    //   });
    // } catch (error) {
    //   console.error('Convex password reset error:', error);
      
    //   const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
    //   const status = errorMessage.includes('Invalid or expired token') ? 400 : 500;
      
    //   return NextResponse.json(
    //     { error: errorMessage },
    //     { status }
    //   );
    // }
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}