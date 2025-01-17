'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/teslainforest.png"
          alt="Tesla in Forest"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Welcome to EkoRental
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Sweden&apos;s first eco-conscious Tesla rental service. Experience luxury while protecting our environment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link 
              href="/signin"
              className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg text-lg"
            >
              Get Started
            </Link>
            <Link 
              href="/cars" 
              className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 text-lg"
            >
              Browse Cars
            </Link>
          </div>

          {/* Updated Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-2">Eco-Impact</h3>
              <p className="text-gray-200">Every rental contributes to local green initiatives</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-2">Tesla Fleet</h3>
              <p className="text-gray-200">Premium electric vehicles for a sustainable future</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-2">Swedish Quality</h3>
              <p className="text-gray-200">Local service with Nordic excellence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 