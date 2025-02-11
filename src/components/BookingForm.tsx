'use client';

import { useState } from 'react';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'; // Make sure to install @heroicons/react

// ... other imports

export function BookingForm() {
  // ... existing state and handlers

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Pick-up Time */}
        <div className="relative">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-200 mb-1">
            Pick-up Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                colorScheme: 'dark',
                // Override the calendar icon color
                '::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)',
                },
              }}
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Return Time */}
        <div className="relative">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-200 mb-1">
            Return Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                colorScheme: 'dark',
                // Override the calendar icon color
                '::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)',
                },
              }}
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ... rest of your form */}
    </form>
  );
} 