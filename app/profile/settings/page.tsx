'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Bell, Lock, Globe, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: true,
    language: 'en',
    currency: 'SEK',
  });

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
      toast.success(`${key} setting updated`);
    }
  };

  const handleChange = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    toast.success(`${key} setting updated`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive booking updates via email</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-500'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">SMS Notifications</p>
                <p className="text-sm text-gray-400">Receive booking updates via SMS</p>
              </div>
              <button
                onClick={() => handleToggle('smsNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-500'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-white">Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full bg-gray-600 text-white rounded px-3 py-2"
              >
                <option value="en">English</option>
                <option value="sv">Swedish</option>
                <option value="no">Norwegian</option>
                <option value="da">Danish</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full bg-gray-600 text-white rounded px-3 py-2"
              >
                <option value="SEK">Swedish Krona (SEK)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Lock className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <button
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500"
              onClick={() => toast.success('Password reset email sent')}
            >
              Change Password
            </button>
            
            <button
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500"
              onClick={() => toast.success('Two-factor authentication enabled')}
            >
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-white">Payment Methods</h2>
          </div>
          
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => toast.success('Payment method added')}
          >
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
} 