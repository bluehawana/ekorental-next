import { Toaster } from 'react-hot-toast';
import { Navigation } from '@/components/layout/Navigation';
import AuthProvider from '@/components/AuthProvider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A1B]">
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}