'use client';

import { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified?: string;
  image?: string;
  createdAt: number;
  updatedAt: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getConvexUserId: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();

  // Convert Clerk user to our User interface
  const user: User | null = useMemo(() => clerkUser ? {
    _id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    emailVerified: clerkUser.primaryEmailAddress?.verification?.status === 'verified' ? 'verified' : undefined,
    image: clerkUser.imageUrl,
    createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).getTime() : Date.now(),
    updatedAt: clerkUser.updatedAt ? new Date(clerkUser.updatedAt).getTime() : Date.now(),
  } : null, [clerkUser]);

  const loading = !isLoaded;
  
  // Save Clerk user to Convex when user is loaded
  useEffect(() => {
    const saveUserToConvex = async () => {
      if (user) {
        try {
          // Import the convex client and api
          const { ConvexHttpClient } = await import('convex/browser');
          const { api } = await import('@/convex/_generated/api');
          
          // Create a client
          const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
          
          // Save the user to Convex (using mutation)
          await convex.mutation(api.users.createUserMutation, {
            id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        } catch (error) {
          console.error('Error saving user to Convex:', error);
        }
      }
    };
    
    if (isLoaded && user) {
      saveUserToConvex();
    }
  }, [isLoaded, user]);

  const signIn = async (_email: string, _password: string): Promise<void> => {
    // Clerk handles sign in through their components
    throw new Error('Use Clerk SignIn component for authentication');
  };

  const signUp = async (_name: string, _email: string, _password: string): Promise<void> => {
    // Clerk handles sign up through their components
    throw new Error('Use Clerk SignUp component for authentication');
  };

  const signOut = async (): Promise<void> => {
    await clerkSignOut();
  };

  const resetPassword = async (_email: string): Promise<void> => {
    // Clerk handles password reset through their components
    throw new Error('Use Clerk password reset component');
  };

  const getConvexUserId = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      // Import the convex client and api
      const { ConvexHttpClient } = await import('convex/browser');
      const { api } = await import('@/convex/_generated/api');
      
      // Create a client
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      
      // Get the Convex user by Clerk ID
      const convexUser = await convex.query(api.users.getUserByClerkId, { clerkUserId: user._id });
      
      if (convexUser) {
        return convexUser._id;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting Convex user ID:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    getConvexUserId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
