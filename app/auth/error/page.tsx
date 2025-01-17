// app/auth/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/Button"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case '204':
        return 'Failed to fetch user data. Please try again.';
      case 'fetch failed':
        return 'Connection to authentication service failed. Please try again.';
      case 'AccessDenied':
        return 'Access was denied. Please try signing in again.';
      default:
        return 'An error occurred during sign in. Please try again.';
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4">
      <Card className="w-[380px] bg-[#1C1C3A] border-0 text-white shadow-2xl">
        <CardHeader className="flex flex-col items-center space-y-6 px-6 py-12">
          <CardTitle className="text-2xl font-bold">EkoRental</CardTitle>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
            <p className="text-gray-400">
              {getErrorMessage(error || '')}
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <Link href="/signin">
            <Button 
              className="w-full bg-white hover:bg-gray-100 text-gray-900 h-12 text-base"
              variant="secondary"
            >
              Return to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}