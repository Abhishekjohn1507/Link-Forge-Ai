import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    const { alias } = await request.json();
    
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
    
    // Verify user exists
    let user;
    let convexUserId;
    
    try {
      // First try to get user by Clerk ID
      user = await convex.query(api.users.getUserByClerkId, { clerkId: userId });
      
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
    } catch (error) {
      console.error('Error verifying user:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!alias) {
      return NextResponse.json(
        { error: 'Alias is required' },
        { status: 400 }
      );
    }

    // Find the URL by shortCode
    const url = await convex.query(api.urls.getUrlByShortCode, { shortCode });
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }
    
    // Check if the URL belongs to the user
    if (url.userId !== convexUserId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Update the URL with the new alias
    let updatedUrl;
    try {
      updatedUrl = await convex.mutation(api.urls.updateUrl, {
        urlId: url._id,
        alias
      });
    } catch (error) {
      console.error('Update alias error:', error);
      return NextResponse.json(
        { error: 'Failed to update alias' },
        { status: 500 }
      );
    }
    
    const success = !!updatedUrl;
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update alias or alias already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: 'Alias updated successfully',
      newShortCode: alias
    });
  } catch (error) {
    console.error('Update alias error:', error);
    return NextResponse.json(
      { error: 'Failed to update alias' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
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
    
    // Verify user exists
    let user;
    let convexUserId;
    
    try {
      // First try to get user by Clerk ID
      user = await convex.query(api.users.getUserByClerkId, { clerkId: userId });
      
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
    } catch (error) {
      console.error('Error verifying user:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find the URL by shortCode
    const url = await convex.query(api.urls.getUrlByShortCode, { shortCode });
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }
    
    // Check if the URL belongs to the user
    if (url.userId !== convexUserId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Delete the URL
    try {
      await convex.mutation(api.urls.deleteUrl, { urlId: url._id });
    } catch (error) {
      console.error('Delete URL error:', error);
      return NextResponse.json(
        { error: 'Failed to delete URL' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Delete URL error:', error);
    return NextResponse.json(
      { error: 'Failed to delete URL' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
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
    
    // Verify user exists
    let user;
    let convexUserId;
    
    try {
      // First try to get user by Clerk ID
      user = await convex.query(api.users.getUserByClerkId, { clerkId: userId });
      
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
    } catch (error) {
      console.error('Error verifying user:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
    
    // Find the URL by shortCode
    const url = await convex.query(api.urls.getUrlByShortCode, { shortCode });
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }
    
    // Check if the URL belongs to the user
    if (url.userId !== convexUserId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Get URL analytics
    const analytics = await convex.query(api.urls.getUrlAnalytics, { urlId: url._id });
    
    if (!analytics) {
      return NextResponse.json(
        { error: 'Failed to get URL analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      stats: {
        clicks: analytics.url.clicks,
        lastClicked: analytics.clicks.length > 0 ? analytics.clicks[0].clickedAt : undefined,
        analytics: analytics
      }
    });
  } catch (error) {
    console.error('Get URL stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get URL stats' },
      { status: 500 }
    );
  }
}