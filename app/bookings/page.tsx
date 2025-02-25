'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Booking {
  id: number;
  userId: number;
  carId: number;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  car: {
    make: string;
    model: string;
    hourRate: number;
  };
}

const formatDateForInput = (dateString: string) => {
  try {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

export default function BookingsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [session]);

  useEffect(() => {
    if (highlightId) {
      const element = document.getElementById(`booking-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('ring-2', 'ring-blue-500');
      }
    }
  }, [highlightId, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchCarDetails = async (carId: number) => {
    try {
      const response = await fetch(`/api/cars/${carId}`);
      if (!response.ok) throw new Error('Failed to fetch car details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching car:', error);
      return null;
    }
  };

  const handleEdit = async (booking: Booking) => {
    try {
      if (!booking.car?.hourRate) {
        const carDetails = await fetchCarDetails(booking.carId);
        if (carDetails) {
          booking.car = {
            ...booking.car,
            hourRate: carDetails.hourRate
          };
        }
      }
      setEditingBooking(booking);
    } catch (error) {
      console.error('Error setting up edit:', error);
      toast.error('Failed to load car details');
    }
  };

  const calculatePrice = (startDate: string, endDate: string, hourRate: number) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate difference in milliseconds
    const diffMs = end.getTime() - start.getTime();
    
    // Convert to hours with decimal points (e.g., 1.5 hours)
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Round up to nearest 0.5 hour
    const roundedHours = Math.ceil(diffHours * 2) / 2;
    
    // Calculate total price
    const totalPrice = Math.round(roundedHours * hourRate);

    console.log('Price calculation:', {
      start: start.toISOString(),
      end: end.toISOString(),
      diffMs,
      diffHours,
      roundedHours,
      hourRate,
      totalPrice
    });

    return totalPrice;
  };

  const handleUpdate = async (bookingId: number, updates: Partial<Booking>) => {
    try {
      const currentBooking = bookings.find(b => b.id === bookingId);
      if (!currentBooking) throw new Error('Booking not found');

      // First fetch the car details to ensure we have the hourRate
      const carResponse = await fetch(`/api/cars/${currentBooking.carId}`);
      if (!carResponse.ok) throw new Error('Failed to fetch car details');
      const carData = await carResponse.json();

      if (!carData.hourRate) {
        console.error('Car data:', carData);
        throw new Error('Car hourly rate not found');
      }

      // Calculate the new total price
      const startTime = new Date(updates.startTime as string);
      const endTime = new Date(updates.endTime as string);
      
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new Error('Invalid dates');
      }

      const totalPrice = calculatePrice(
        startTime.toISOString(),
        endTime.toISOString(),
        carData.hourRate
      );

      const formattedUpdates = {
        startTime: startTime.toISOString().split('.')[0],
        endTime: endTime.toISOString().split('.')[0],
        totalPrice,
        status: "PENDING",
        carId: currentBooking.carId,
        userId: currentBooking.userId
      };

      console.log('Sending update request:', formattedUpdates);

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedUpdates),
      });

      const updatedBooking = await response.json();
      console.log('Received updated booking:', updatedBooking);

      // Add field name checking
      if (updatedBooking.start_time && updatedBooking.end_time) {
        // Handle snake_case response
        updatedBooking.startTime = updatedBooking.start_time;
        updatedBooking.endTime = updatedBooking.end_time;
      }

      if (!updatedBooking.startTime || !updatedBooking.endTime) {
        console.error('Invalid booking data received:', updatedBooking);
        throw new Error('Invalid response from server');
      }

      toast.success('Booking updated successfully');
      await fetchBookings();
      setEditingBooking(null);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update booking');
    }
  };

  const handleDelete = async (bookingId: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete booking');
      
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Bookings</h1>
        
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              id={`booking-${booking.id}`}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Booking ID</p>
                    <p className="text-lg font-semibold text-white">#{booking.id}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm text-gray-400">Start Time</p>
                      <p className="text-lg text-white">
                        {new Date(booking.startTime).toLocaleString('sv-SE', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">End Time</p>
                      <p className="text-lg text-white">
                        {new Date(booking.endTime).toLocaleString('sv-SE', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-lg text-blue-400">{booking.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Price</p>
                      <p className="text-lg font-bold text-white">{booking.totalPrice} SEK</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(booking)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Booking</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const startTime = formData.get('startTime') as string;
                const endTime = formData.get('endTime') as string;

                if (new Date(startTime) >= new Date(endTime)) {
                  toast.error('End time must be after start time');
                  return;
                }

                await handleUpdate(editingBooking.id, {
                  startTime,
                  endTime
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm text-gray-400">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  defaultValue={formatDateForInput(editingBooking.startTime)}
                  className="w-full bg-gray-700 text-white rounded p-2"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={async (e) => {
                    const startDate = e.target.value;
                    const endDateInput = e.currentTarget.form?.elements.namedItem('endTime') as HTMLInputElement;
                    if (endDateInput?.value && editingBooking?.car?.hourRate) {
                      const price = calculatePrice(
                        startDate,
                        endDateInput.value,
                        editingBooking.car.hourRate
                      );
                      const priceElement = document.getElementById('newPrice');
                      if (priceElement) {
                        priceElement.textContent = `${price} SEK`;
                      }
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  defaultValue={formatDateForInput(editingBooking.endTime)}
                  className="w-full bg-gray-700 text-white rounded p-2"
                  required
                  min={formatDateForInput(editingBooking.startTime)}
                  onChange={async (e) => {
                    const startDateInput = e.currentTarget.form?.elements.namedItem('startTime') as HTMLInputElement;
                    if (startDateInput?.value && editingBooking?.car?.hourRate) {
                      const newPrice = calculatePrice(
                        startDateInput.value,
                        e.target.value,
                        editingBooking.car.hourRate
                      );
                      const priceElement = document.getElementById('newPrice');
                      if (priceElement) priceElement.textContent = `${newPrice} SEK`;
                    }
                  }}
                />
              </div>
              <div className="mt-4 p-4 bg-gray-700 rounded">
                <p className="text-sm text-gray-400">New Total Price</p>
                <p id="newPrice" className="text-xl font-bold text-white">{editingBooking.totalPrice} SEK</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 