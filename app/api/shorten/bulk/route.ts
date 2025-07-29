import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (urls.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 URLs can be shortened at once' },
        { status: 400 }
      );
    }

    // Validate URLs
    const validUrls: string[] = [];
    const invalidUrls: string[] = [];

    for (const url of urls) {
      try {
        let validUrl: string;
        try {
          const urlObj = new URL(url);
          validUrl = urlObj.toString();
        } catch {
          try {
            const urlObj = new URL(`https://${url}`);
            validUrl = urlObj.toString();
          } catch {
            invalidUrls.push(url);
            continue;
          }
        }
        validUrls.push(validUrl);
      } catch {
        invalidUrls.push(url);
      }
    }

    // Get user from Authorization header if available
    let userId: string | undefined;
    let clerkId: string | undefined;
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      clerkId = authHeader.replace('Bearer ', '');
      
      // First try to get user by Clerk ID
      try {
        const user = await convex.query(api.users.getUserByClerkId, { clerkId });
        if (user) {
          userId = user._id as Id<"users">;
        } else {
          // Fallback to direct ID lookup (for backward compatibility)
          try {
            const directUser = await convex.query(api.users.getUserById, { userId: clerkId as Id<"users"> });
            if (directUser) {
              userId = clerkId as Id<"users">;
            } else {
              userId = undefined; // Reset if user not found
            }
          } catch {
            userId = undefined;
          }
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        userId = undefined;
      }
    }

    // Create shortened URLs using Convex
    const results = [];
    
    for (const url of validUrls) {
      try {
        const urlData = await convex.mutation(api.urls.createUrl, {
          originalUrl: url,
          userId: userId as Id<"users"> | undefined
        });
        
        if (urlData) {
          results.push({
            originalUrl: url,
            shortCode: urlData.shortCode,
            shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin}/${urlData.shortCode}`
          });
        }
      } catch (error) {
        console.error(`Failed to shorten URL: ${url}`, error);
      }
    }

    return NextResponse.json({
      results,
      invalidUrls,
      totalProcessed: validUrls.length,
      totalInvalid: invalidUrls.length
    });
  } catch (error) {
    console.error('Bulk shorten error:', error);
    return NextResponse.json(
      { error: 'Failed to process URLs' },
      { status: 500 }
    );
  }
}