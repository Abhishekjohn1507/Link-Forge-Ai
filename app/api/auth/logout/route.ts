import { NextResponse } from 'next/server';

export async function POST() {
  // This API route is no longer needed as logout is now handled client-side with Convex
  return NextResponse.json(
    { message: 'Logout is now handled client-side with Convex' }
  );
}