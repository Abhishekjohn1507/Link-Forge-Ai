// lib/convex-server.ts
import { ConvexHttpClient } from "convex/browser";


export function getConvexClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  if (!convexUrl) {
    throw new Error(
      'NEXT_PUBLIC_CONVEX_URL environment variable is not set. ' +
      'Please add it to your environment variables.'
    );
  }
  
  return new ConvexHttpClient(convexUrl);
}

