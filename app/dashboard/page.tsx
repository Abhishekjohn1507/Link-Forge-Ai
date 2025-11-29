'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Id } from '@/convex/_generated/dataModel';
import { UrlData } from '@/lib/types';

export default function DashboardPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const { user: clerkUser, isLoaded: userLoaded } = useUser();

  // Step 1: Fetch Convex user document
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    clerkUser ? { clerkUserId: clerkUser.id } : 'skip'
  );

  // Step 2: Fetch URLs based on Convex user ID
  const userUrls = useQuery(
    api.urls.getUrlsByUser,
    convexUser ? { userId: convexUser._id } : 'skip'
  );

  const loading = !userLoaded || convexUser === undefined || userUrls === undefined;

  const deleteUrl = useMutation(api.urls.deleteUrl);

  const copyToClipboard = async (text: string) => {
    try {
      const writable = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
      if (writable) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDeleteUrl = async (urlId: Id<'urls'>) => {
    try {
      await deleteUrl({ urlId });
    } catch (err) {
      console.error('Failed to delete URL:', err);
    }
  };

  if (!clerkUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">Please sign in to access your dashboard.</p>
          <Link
            href="/"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, {clerkUser.fullName || clerkUser.firstName || 'User'}</p>
              </div>
              {clerkUser?.imageUrl && (
                <img
                  src={clerkUser.imageUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-white/20"
                />
              )}
            </div>
            <Link
              href="/"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Create New Link
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Your Links</h2>
            <div className="text-gray-300">
              {userUrls ? `${userUrls.length} links` : 'Loading...'}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-300">Loading your links...</p>
            </div>
          ) : userUrls.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No links yet</h3>
              <p className="text-gray-300 mb-6">Create your first short URL to get started.</p>
              <Link
                href="/"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Create Your First Link
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Original URL</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Short URL</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Clicks</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Created</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userUrls.map((url: UrlData) => (
                    <tr key={url._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="max-w-xs truncate">
                          <a 
                            href={url.originalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200 transition-colors"
                          >
                            {url.originalUrl}
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-300 font-mono">
                            {origin}/{url.shortCode}
                          </span>
                          <button
                            onClick={() => copyToClipboard(`${origin}/${url.shortCode}`)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copied === `${origin}/${url.shortCode}` ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{url.clicks ?? 0}</td>
                      <td className="py-4 px-6 text-gray-300 text-sm">{new Date(url.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDeleteUrl(url._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
