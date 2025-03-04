'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, CreditCard, MessageCircle, Settings } from 'lucide-react';

const navigation = [
  { name: 'My Profile', href: '/profile', icon: User },
  { name: 'Payment History', href: '/profile/payments', icon: CreditCard },
  { name: 'Contact Support', href: '/profile/support', icon: MessageCircle },
  { name: 'Settings', href: '/profile/settings', icon: Settings },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-800 rounded-lg p-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-800 rounded-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 