import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProviderWrapper } from '@/components/ClerkProvider';
import { ConvexProviderWrapper } from '@/components/ConvexProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'LinkForge AI - Next-Generation URL Shortener',
  description: 'Transform your ideas into powerful, shareable links with AI-powered intelligence',
=======
  title: "URL Shortener",
  description: "A simple and efficient URL shortening service",
>>>>>>> c5643b0be1c0b56b4a1db3b390322be4575dfddd
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ClerkProviderWrapper>
          <ConvexProviderWrapper>
            {children}
          </ConvexProviderWrapper>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
