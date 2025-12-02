import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authHeader.replace('Bearer ', '');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    try {
      // First try to get user by Clerk ID
      let user = await convex.query(api.users.getUserByClerkId, { clerkUserId: userId });
      let convexUserId;
      
      // If found, use the Convex user ID
      if (user) {
        convexUserId = user._id;
      } else {
        // Fallback to direct ID lookup (for backward compatibility)
        try {
          user = await convex.query(api.users.getUserById, { userId: userId as Id<"users"> });
          if (user) {
            convexUserId = userId as Id<"users">;
          }
        } catch (error) {
          console.error('Error in getUserById fallback:', error);
        }
      }
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Get URLs for the user using the Convex user ID
      const urls = await convex.query(api.urls.getUrlsByUser, { userId: convexUserId as Id<"users"> });
    
    return NextResponse.json({ urls });
    } catch (error) {
      console.error('Convex query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch URLs' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get user URLs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
}