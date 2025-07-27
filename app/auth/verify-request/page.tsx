'use client';

import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function VerifyRequest() {
  useEffect(() => {
    toast.success('Check your email for the sign in link!');
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4">
      <Card className="w-[380px] bg-[#1C1C3A] border-0 text-white shadow-2xl">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Check your email</h1>
          <p className="text-gray-400 mb-6">
            A sign in link has been sent to your email address.
            Click the link to complete your login.
          </p>

          <div className="space-y-4">
            <Link 
              href="/signin"
              className="block w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
} 