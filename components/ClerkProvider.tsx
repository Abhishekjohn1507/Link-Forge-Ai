'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#8b5cf6',
          colorBackground: '#0f0f23',
          colorInputBackground: '#1f2937',
          colorInputText: '#ffffff',
        },
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
          card: 'bg-gray-900/50 backdrop-blur-sm border border-gray-800',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
} 