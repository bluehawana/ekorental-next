'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Car } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { 
  UserCircleIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  PhoneIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export function Navigation() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              EkoRental
            </Link>
          </div>

          <div className="flex items-center">
            <Link href="/cart" className="relative p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-300" />
              <span className="absolute top-0 right-0 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gray-300 focus:outline-none"
                >
                  <span>{session.user?.name || 'User'}</span>
                  <ChevronDownIcon className="h-5 w-5" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <UserCircleIcon className="h-5 w-5 mr-2" />
                      My Profile
                    </Link>
                    
                    <Link
                      href="/bookings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      My Bookings
                    </Link>
                    
                    <Link
                      href="/payments"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      Payment History
                    </Link>
                    
                    <Link
                      href="/contact"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <PhoneIcon className="h-5 w-5 mr-2" />
                      Contact Support
                    </Link>
                    
                    <div className="border-t border-gray-700 my-1"></div>
                    
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="text-white hover:text-gray-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 