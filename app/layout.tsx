import { Navigation } from '@/components/layout/Navigation'
import { Providers } from '@/providers/Providers'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'
import MelodyAuthProvider from '@/providers/MelodyAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EkoRental',
  description: 'Rent eco-friendly vehicles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <MelodyAuthProvider>
          <Providers>
            <div className="main-layout">
              <Navigation />
              <main className="page-container">
                {children}
              </main>
            </div>
            <Toaster
              position="top-center"
              toastOptions={{
                className: '',
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
          </Providers>
        </MelodyAuthProvider>
      </body>
    </html>
  )
}