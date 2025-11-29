import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export async function POST(request: NextRequest) {
//   try {
//     const { email } = await request.json();

//     if (!email) {
//       return NextResponse.json(
//         { error: 'Email is required' },
//         { status: 400 }
//       );
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: 'Invalid email format' },
//         { status: 400 }
//       );
//     }

//     // Generate password reset token with Convex action
//     // const result = await convex.action(api.actions.passwordReset.generateAndStoreResetToken, { email });
    
//     // In a real application, you would send this token via email
//     // For demo purposes, we'll return it in the response
//     return NextResponse.json({
//       message: 'Password reset token generated successfully',
//       resetToken: result // Remove this in production and send via email instead
//     });
//   } catch (error) {
//     console.error('Forgot password error:', error);
    
//     const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
//     const status = errorMessage.includes('not found') ? 404 : 500;
    
//     return NextResponse.json(
//       { error: errorMessage },
//       { status }
//     );
//   }
// }