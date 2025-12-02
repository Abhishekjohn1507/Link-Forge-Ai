'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { UrlData } from '@/lib/types';
import { Id } from '@/convex/_generated/dataModel';

export default function Dashboard() {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    clerkUser ? { clerkUserId: clerkUser.id } : 'skip'
  );

  // Extract just the ID from the user object
  const convexUserId = convexUser?._id;

  const userUrls = useQuery(
    api.urls.getUrlsByUser,
    convexUserId ? { userId: convexUserId } : 'skip'
  );

  const deleteUrlMutation = useMutation(api.urls.deleteUrl);
  const saveUser = useMutation(api.users.createUserMutation);

  const [copied, setCopied] = useState<string | null>(null);
  const loading = !userLoaded || userUrls === undefined;

  useEffect(() => {
    if (clerkUser && convexUserId) {
      saveUser({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || '',
        // billingInfo: {
        //   clerkUserId: clerkUser.id,
        //   passwordHash: '',
        // },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }, [clerkUser, convexUserId, saveUser]);

  const handleDeleteUrl = async (urlId: Id<'urls'>) => {
    if (confirm('Are you sure you want to delete this URL?')) {
      try {
        await deleteUrlMutation({ urlId });
      } catch (error) {
        console.error('Error deleting URL:', error);
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!clerkUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to view your dashboard</h1>
          <p className="text-gray-400">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome back, {clerkUser.fullName || 'User'}!
            </h1>
            <p className="text-gray-300 text-lg">
              Manage your forged links and track their performance.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total Links" value={userUrls?.length || 0} />
            <StatCard
              title="Total Clicks"
              value={userUrls?.reduce((total, url) => total + url.clicks, 0) || 0}
            />
            <StatCard
              title="Active Links"
              value={userUrls?.filter(url => url.clicks > 0).length || 0}
            />
            <StatCard
              title="Avg Clicks"
              value={
                userUrls?.length
                  ? Math.round(
                      userUrls.reduce((total, url) => total + url.clicks, 0) /
                        userUrls.length
                    )
                  : 0
              }
            />
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">Your Forged Links</h2>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : userUrls?.length ? (
              <UrlTable
                urls={userUrls?.map(url => ({
                  ...url,
                  updatedAt: url.createdAt
                }))}
                copied={copied}
                copyToClipboard={copyToClipboard}
                handleDeleteUrl={handleDeleteUrl}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="p-12 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent mx-auto mb-4" />
      <p className="text-gray-400">Loading your links...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No links yet</h3>
      <p className="text-gray-400 mb-6">Start forging your first link to see it here.</p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-medium"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Your First Link
      </Link>
    </div>
  );
}

function UrlTable({
  urls,
  copied,
  copyToClipboard,
  handleDeleteUrl,
}: {
  urls: UrlData[];
  copied: string | null;
  copyToClipboard: (text: string) => void;
  handleDeleteUrl: (urlId: Id<'urls'>) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="text-left p-6 text-gray-300 font-medium">Original URL</th>
            <th className="text-left p-6 text-gray-300 font-medium">Short Code</th>
            <th className="text-center p-6 text-gray-300 font-medium">Clicks</th>
            <th className="text-center p-6 text-gray-300 font-medium">Created</th>
            <th className="text-center p-6 text-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url._id} className="border-b border-gray-800">
              <td className="py-4 px-6 max-w-xs truncate">
                <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  {url.originalUrl}
                </a>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <code className="bg-gray-800 px-2 py-1 rounded text-sm">{url.shortCode}</code>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/${url.shortCode}`)}
                    className="text-gray-400 hover:text-gray-300"
                    title="Copy link"
                  >
                    {copied === `${window.location.origin}/${url.shortCode}` ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <td className="py-4 px-6 text-center">
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">{url.clicks}</span>
              </td>
              <td className="py-4 px-6 text-center text-gray-400 text-sm">
                {new Date(url.createdAt).toLocaleDateString()}
              </td>
              <td className="py-4 px-6 text-center">
                <button
                  onClick={() => handleDeleteUrl(url._id)}
                  className="text-red-400 hover:text-red-300"
                  title="Delete link"
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
  );
}