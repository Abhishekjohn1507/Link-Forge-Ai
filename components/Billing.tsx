'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useConvexUser } from '@/lib/useConvexUser';

export default function Billing() {
  const { user: clerkUser } = useUser();
  const { convexUserId } = useConvexUser();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (priceId: string) => {
    setLoading(true);
    try {
      // Redirect to Clerk's billing portal
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: clerkUser?.id, // Use Clerk ID for billing
          convexUserId, // Also send Convex ID for reference
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Choose Your Plan</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Free</h3>
          <p className="text-gray-300 mb-4">Perfect for getting started</p>
          <ul className="text-sm text-gray-400 space-y-2 mb-6">
            <li>• 100 links per month</li>
            <li>• Basic analytics</li>
            <li>• Standard support</li>
          </ul>
          <button className="w-full bg-gray-700 text-gray-300 py-2 rounded-lg">
            Current Plan
          </button>
        </div>

        <div className="bg-purple-900/20 border border-purple-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Pro</h3>
          <p className="text-gray-300 mb-4">For power users</p>
          <ul className="text-sm text-gray-400 space-y-2 mb-6">
            <li>• Unlimited links</li>
            <li>• Advanced analytics</li>
            <li>• Priority support</li>
            <li>• Custom domains</li>
          </ul>
          <button 
            onClick={() => handleUpgrade('price_pro')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-lg transition-all duration-300"
          >
            {loading ? 'Processing...' : '$9/month'}
          </button>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Enterprise</h3>
          <p className="text-gray-300 mb-4">For teams and businesses</p>
          <ul className="text-sm text-gray-400 space-y-2 mb-6">
            <li>• Everything in Pro</li>
            <li>• Team management</li>
            <li>• API access</li>
            <li>• Dedicated support</li>
          </ul>
          <button 
            onClick={() => handleUpgrade('price_enterprise')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-2 rounded-lg transition-all duration-300"
          >
            {loading ? 'Processing...' : '$29/month'}
          </button>
        </div>
      </div>
    </div>
  );
}