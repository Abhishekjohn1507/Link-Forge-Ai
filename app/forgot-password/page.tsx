'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ClerkForgotPassword from '@/components/ClerkForgotPassword';

export default function Page() {
  const router = useRouter();
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ClerkForgotPassword onSwitchToLogin={() => router.push('/')} />
        </div>
      </div>
    </Suspense>
  );
}