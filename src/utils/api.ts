const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Define types for your booking data
interface BookingRequest {
  userId: number;
  carId: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
}

interface BookingResponse {
  id: number;
  userId: number;
  carId: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  createdAt?: string;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API call failed: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const bookingsApi = {
  create: (bookingData: BookingRequest): Promise<BookingResponse> => 
    fetchApi('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getAll: (): Promise<BookingResponse[]> => 
    fetchApi('/bookings'),

  getOne: (id: string | number): Promise<BookingResponse> => 
    fetchApi(`/bookings/${id}`),

  update: (id: string | number, bookingData: Partial<BookingRequest>): Promise<BookingResponse> => 
    fetchApi(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    }),

  delete: (id: string | number): Promise<void> => 
    fetchApi(`/bookings/${id}`, { method: 'DELETE' }),
};

// Usage example:
/*
try {
  const newBooking = await bookingsApi.create({
    userId: 1,
    carId: car.id,
    startTime: startTime,
    endTime: endTime,
    totalPrice: totalPrice,
    status: 'PENDING'
  });
  console.log('Booking created:', newBooking);
} catch (error) {
  console.error('Error creating booking:', error);
}
*/