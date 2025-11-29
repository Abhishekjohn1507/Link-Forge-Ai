import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     try {
//       // Authenticate user with Convex
//       const user = await convex.mutation(api.users.authenticateUser, { email, password });
      
//       if (!user) {
//         return NextResponse.json(
//           { error: 'Invalid email or password' },
//           { status: 401 }
//         );
//       }

//       return NextResponse.json(user);
//     } catch (error) {
//       console.error('Convex authentication error:', error);
//       return NextResponse.json(
//         { error: 'Authentication failed' },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }