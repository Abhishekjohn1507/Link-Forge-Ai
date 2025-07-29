'use client';

import { SignUp } from '@clerk/nextjs';

interface ClerkSignUpProps {
  onSwitchToSignIn: () => void;
}

export default function ClerkSignUp({ onSwitchToSignIn: _onSwitchToSignIn }: ClerkSignUpProps) {
  return (
    <div className="flex justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
            card: 'bg-gray-900/50 backdrop-blur-sm border border-gray-800',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-400',
            formFieldLabel: 'text-gray-300',
            formFieldInput: 'bg-gray-800 border border-gray-700 text-white',
            footerActionLink: 'text-purple-400 hover:text-purple-300',
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  );
}
