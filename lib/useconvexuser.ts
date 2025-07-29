'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from './authContext';

export function useConvexUser() {
  const { user } = useAuth();
  
  // Get the Convex user by Clerk ID
  const { data: convexUser, isLoading } = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user._id } : 'skip'
  );

  return {
    convexUser,
    convexUserId: convexUser?._id,
    isLoading,
    clerkUser: user,
  };
}