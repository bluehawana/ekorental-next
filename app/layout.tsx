import { AuthProvider } from '@/components/AuthProvider'
import { Navigation } from '@/components/layout/Navigation'
import './globals.css'
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { CarProvider } from '@/contexts/CarContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <CarProvider>
            <Navigation />
            <main>{children}</main>
          </CarProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}