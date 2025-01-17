'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Github } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  // Show error toast if there's an error in URL
  if (error) {
    toast.error(
      error === 'AccessDenied' 
        ? 'Access denied. Please try again.' 
        : `Authentication error: ${error}`
    )
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true)
      const result = await signIn(provider, {
        callbackUrl: '/dashboard',
        redirect: true, // Changed to true for direct redirect
      })
      
      // This will only run if redirect is false
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error(`Failed to sign in with ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    if (!email) return
    try {
      setIsLoading(true)
      const result = await signIn('email', {
        email,
        callbackUrl: '/dashboard',
        redirect: false,
      })
      
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Check your email for the login link!')
      }
    } catch (error) {
      toast.error('Failed to send login email')
    } finally {
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
