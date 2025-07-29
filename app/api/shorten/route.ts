import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { url, alias } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let validUrl: string;
    try {
      const urlObj = new URL(url);
      validUrl = urlObj.toString();
    } catch {
      // If URL doesn't have protocol, add https://
      try {
        const urlObj = new URL(`https://${url}`);
        validUrl = urlObj.toString();
      } catch {
        return NextResponse.json(
          { error: 'Invalid URL format' },
          { status: 400 }
        );
      }
    }

    // No longer getting user information as we're not storing user data
    // This section has been removed to comply with the requirement to not save user data

    // Create URL with Convex - no longer passing userId
    const urlData = await convex.mutation(api.urls.createUrl, {
      originalUrl: validUrl,
      alias
      // userId parameter removed to avoid storing user data
    });
    
    if (!urlData) {
      return NextResponse.json(
        { error: 'Failed to create shortened URL' },
        { status: 500 }
      );
    }
    
    const shortCode = urlData.shortCode;

    const baseUrl = request.nextUrl.origin;
    const shortUrl = `${baseUrl}/${shortCode}`;

    return NextResponse.json({
      originalUrl: validUrl,
      shortUrl,
      shortCode
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}