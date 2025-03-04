'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Payment } from '@/components/Payment';
import Image from 'next/image';

const BACKEND_URL = 'http://localhost:8080';

interface BookingDetails {
  id: number;
  userId: number;
  carId: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  carModel?: string;
  carImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingUpdateDTO {
  userId: number;
  carId: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
}

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBooking, setEditedBooking] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const bookingId = searchParams.get('id');
    
    if (bookingId) {
      fetchBookingDetails(bookingId);
    } else {
      fetchAllBookings();
    }
  }, [searchParams]);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/${id}`);
      if (!response.ok) throw new Error('Failed to fetch booking details');
      const data = await response.json();
      setSelectedBooking(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to cancel booking');
      
      toast.success('Booking cancelled successfully');
      router.push('/bookings');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const handleUpdateBooking = async (bookingId: number) => {
    if (!editedBooking || !selectedBooking) return;
    
    try {
      const updateDTO: BookingUpdateDTO = {
        userId: selectedBooking.userId,
        carId: selectedBooking.carId,
        startTime: editedBooking.startTime,
        endTime: editedBooking.endTime,
        totalPrice: selectedBooking.totalPrice,
        status: selectedBooking.status
      };

      const response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDTO),
      });

      if (!response.ok) throw new Error('Failed to update booking');
      
      setIsEditing(false);
      toast.success('Booking updated successfully');
      fetchBookingDetails(bookingId.toString());
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update booking');
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/placeholder-car.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show individual booking details if ID is provided
  if (selectedBooking) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/bookings"
              className="text-blue-500 hover:text-blue-400 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Bookings
            </Link>
            <h1 className="text-3xl font-bold text-white">Booking Details</h1>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Car Details Section */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Car Details</h2>
                {selectedBooking.carImage && (
                  <div className="mb-4">
                    <Image
                      src={getImageUrl(selectedBooking.carImage)}
                      alt={selectedBooking.carModel || 'Car'}
                      width={400}
                      height={300}
                      className="rounded-lg"
                    />
                  </div>
                )}
                <div className="space-y-2 text-gray-300">
                  <p>Model: {selectedBooking.carModel}</p>
                </div>
              </div>

              {/* Booking Information Section */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Booking Information</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Start Time</label>
                      <input
                        type="datetime-local"
                        value={editedBooking?.startTime.slice(0, 16)}
                        onChange={(e) => setEditedBooking({
                          ...editedBooking!,
                          startTime: e.target.value,
                        })}
                        className="w-full bg-gray-600 text-white rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">End Time</label>
                      <input
                        type="datetime-local"
                        value={editedBooking?.endTime.slice(0, 16)}
                        onChange={(e) => setEditedBooking({
                          ...editedBooking!,
                          endTime: e.target.value,
                        })}
                        className="w-full bg-gray-600 text-white rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleUpdateBooking(selectedBooking.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedBooking(null);
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-gray-300">
                    <p>Booking ID: {selectedBooking.id}</p>
                    <p>Start Time: {new Date(selectedBooking.startTime).toLocaleString()}</p>
                    <p>End Time: {new Date(selectedBooking.endTime).toLocaleString()}</p>
                    <p>Total Price: {selectedBooking.totalPrice} SEK</p>
                    <p>Status: {selectedBooking.status}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              {selectedBooking.status === 'PENDING' && (
                <>
                  <Payment 
                    bookingId={selectedBooking.id.toString()} 
                    amount={selectedBooking.totalPrice}
                  />
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedBooking(selectedBooking);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isEditing}
                  >
                    Edit Booking
                  </button>
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </>
              )}

              {selectedBooking.status === 'CONFIRMED' && (
                <div className="text-center">
                  <p className="text-green-500 font-semibold mb-4">
                    Payment Completed! Your booking is confirmed.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show list of all bookings if no ID is provided
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-gray-800 rounded-lg shadow-xl p-6">
                {booking.carImage && (
                  <div className="mb-4 relative h-48">
                    <Image
                      src={getImageUrl(booking.carImage)}
                      alt={booking.carModel || 'Car'}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{booking.carModel}</h3>
                <div className="space-y-2 text-gray-400 mb-4">
                  <p>Start: {new Date(booking.startTime).toLocaleString()}</p>
                  <p>End: {new Date(booking.endTime).toLocaleString()}</p>
                  <p>Price: {booking.totalPrice} SEK</p>
                  <p className={`font-semibold ${
                    booking.status === 'CONFIRMED' ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    Status: {booking.status}
                  </p>
                </div>
                <Link
                  href={`/bookings?id=${booking.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 