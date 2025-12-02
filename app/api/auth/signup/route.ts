import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // try {
    //   // Create user with Convex
    //   const user = await convex.mutation(api.users.createUser, { email, password, name });
      
    //   return NextResponse.json(user);
    // } catch (error) {
    //   console.error('Convex user creation error:', error);
      
    //   // Check if error is due to user already existing
    //   const errorMessage = error instanceof Error ? error.message : 'User creation failed';
    //   const status = errorMessage.includes('already exists') ? 409 : 500;
      
    //   return NextResponse.json(
    //     { error: errorMessage },
    //     { status }
    //   );
    // }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}