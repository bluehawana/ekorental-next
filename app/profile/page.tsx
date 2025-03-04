'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add API call to update user profile here
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
      
      <div className="bg-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={session?.user?.image || '/placeholder-avatar.png'}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-white">{session?.user?.name}</h2>
            <p className="text-gray-400">{session?.user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="w-full bg-gray-600 text-white rounded px-3 py-2 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full bg-gray-600 text-white rounded px-3 py-2 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full bg-gray-600 text-white rounded px-3 py-2 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              className="w-full bg-gray-600 text-white rounded px-3 py-2 disabled:opacity-50"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 