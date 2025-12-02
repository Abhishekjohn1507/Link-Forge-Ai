

import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, convexUserId } = await request.json();
    
    // Store the billing information in Convex if we have a Convex user ID
    // if (convexUserId) {
    //   try {
    //     await convex.mutation(api.users.updateUserBilling, {
    //       userId: convexUserId,
    //       billingInfo: {
    //         priceId,
    //         clerkUserId: userId,
    //         updatedAt: new Date().toISOString()
    //       }
    //     });
    //   } catch (error) {
    //     console.error('Error updating user billing info:', error);
    //     // Continue with checkout even if storing billing info fails
    //   }
    // }

    // Create a checkout session with Clerk
    // const session = await clerkClient.users.createCheckoutSession({
    //   userId,
    //   priceId,
    //   successUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}?success=true`,
    //   cancelUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}?canceled=true`,
    // });

    // return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}