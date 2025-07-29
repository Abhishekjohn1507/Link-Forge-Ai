'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ClerkResetPassword from '@/components/ClerkResetPassword';

export default function Page() {
  const router = useRouter();
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ClerkResetPassword onCancel={() => router.push('/')} />
        </div>
      </div>
    </Suspense>
  );
}
