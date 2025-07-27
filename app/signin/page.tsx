'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Github } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAuth } from '@melody-auth/react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard'
  const { isAuthenticated, isAuthenticating, loginRedirect, loginError } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (loginError) {
      toast.error(`Authentication error: ${loginError}`)
    }
  }, [loginError])

  useEffect(() => {
    if (error) {
      switch (error) {
        case 'OAuthAccountNotLinked':
          toast.error('This email is already associated with another account')
          break
        case 'AccessDenied':
          toast.error('Access denied. Please try again')
          break
        default:
          toast.error(`Authentication error: ${error}`)
      }
    }
  }, [error])

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true)
      // For social login, we'll redirect to melody-auth server with the provider
      loginRedirect({
        state: JSON.stringify({ provider, callbackUrl }),
        locale: 'en'
      })
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error(`Failed to sign in with ${provider}`)
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    if (!email) return
    try {
      setIsLoading(true)
      // For email login, redirect to melody-auth server
      loginRedirect({
        state: JSON.stringify({ email, callbackUrl }),
        locale: 'en'
      })
    } catch (error) {
      toast.error('Failed to initiate email login')
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      loginRedirect({
        state: JSON.stringify({ provider: 'google', callbackUrl: '/dashboard' }),
        locale: 'en'
      })
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in with Google')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4">
      <Card className="w-[380px] bg-[#1C1C3A] border-0 text-white shadow-2xl">
        <CardHeader className="flex flex-col items-center space-y-6 px-6 py-12">
          <div className="text-center space-y-6">
            <CardTitle>Quick Sign In, Drive Green</CardTitle>
            <p className="text-lg text-gray-400">
              No registration needed - just click and drive green as fast as you can
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col px-6 pb-8">
          <div className="space-y-6 mb-8">
            <Button 
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              variant="secondary" 
              className="w-full bg-[#1C1C3A] hover:bg-[#2A2A4A] text-white border border-gray-700 h-12 text-base"
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with Github
            </Button>
            
            <Button 
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              variant="secondary" 
              className="w-full bg-white hover:bg-gray-100 text-gray-900 h-12 text-base"
            >
              <Image 
                src="/google-logo.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Continue with Google
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-[#1C1C3A] px-3 text-gray-400">Or</span>
            </div>
          </div>

          <div className="space-y-6">
            <Input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-12 !bg-black text-white placeholder:text-gray-500 border-gray-700 text-base"
            />
            
            <Button 
              onClick={handleEmailLogin}
              disabled={isLoading || !email}
              variant="secondary" 
              className="w-full bg-white hover:bg-gray-100 text-gray-900 h-12 text-base"
            >
              Continue with Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
