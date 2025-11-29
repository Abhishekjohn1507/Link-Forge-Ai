'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from './authContext';

export function useConvexUser() {
  const { user } = useAuth();

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkUserId: user._id } : 'skip'
  );

  const isLoading = !!user && convexUser === undefined;

  return {
    convexUser,
    convexUserId: convexUser?._id,
    isLoading,
    clerkUser: user,
  };
}
