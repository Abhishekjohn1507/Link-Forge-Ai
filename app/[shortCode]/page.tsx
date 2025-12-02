'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface PageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default function RedirectPage({ params }: PageProps) {
  const router = useRouter();
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const url = useQuery(api.urls.getUrlByShortCode, { shortCode: shortCode || '' });
  const recordClickMutation = useMutation(api.urls.recordClick);
  
  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        setShortCode(resolvedParams.shortCode);
      } catch (error) {
        console.error('Error resolving params:', error);
        router.push('/');
      }
    };
    
    getParams();
  }, [params, router]);

  useEffect(() => {
    if (!shortCode || isRedirecting) return;
    
    if (url) {
      setIsRedirecting(true);
      // Record the click - no longer sending user-specific data
      recordClickMutation({
        urlId: url._id,
        // Removed user-specific data fields to comply with not saving user data
      });

      // Redirect to the original URL
      window.location.href = url.originalUrl;
    } else if (url === null) {
      // URL not found, redirect to home page
      router.push('/');
    }
  }, [url, shortCode, recordClickMutation, router, isRedirecting]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-purple-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-300 text-lg">Redirecting...</p>
      </div>
    </div>
  );
}