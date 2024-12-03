'use client'

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white"> {/* Dark background */}
      <h1 className="text-5xl font-bold mb-4">Welcome to EkoRental</h1>
      <p className="text-xl mb-8">Find and rent your dream Tesla today!</p>

<div className="space-y-4">
  <div className="mb-4"> 
    <div className="flex justify-center space-x-6">
  <Link 
    href="/signin" 
    className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300" // White button with dark text
  >
    Sign In
  </Link>
  <Link 
    href="/about" 
    className="text-white border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition duration-300" // White hover effect
  >
    Learn More
  </Link>
</div>

          </div>
        </div>
    </div>
  );
}
//