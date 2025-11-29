'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ResetPasswordForm from '@/components/ResetPasswordForm';
import { useAuth } from '@/lib/authContext';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  
  // const token = searchParams.get('token');
  const router = useRouter();
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      router.push('/dashboard');
      return;
    }

    // Get token from URL
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [user, router, searchParams]);

  const handleResetSuccess = () => {
    setResetSuccess(true);
    // Redirect to login page after 3 seconds
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Password Reset Successful
          </h2>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-6">
            <p className="text-green-600 dark:text-green-400 text-sm mb-2">
              Your password has been reset successfully.
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Invalid Reset Link
          </h2>
          
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-6">
            <p className="text-red-600 dark:text-red-400 text-sm">
              The password reset link is invalid or has expired.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
     
      </div>
    </div>
  );
}