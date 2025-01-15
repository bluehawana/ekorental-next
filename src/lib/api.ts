import { API_CONFIG } from './api-config';

export async function fetchCarById(id: string) {
  const response = await fetch(`${API_CONFIG.API_BASE_URL}/cars/${id}`);
  if (!response.ok) throw new Error('Failed to fetch car');
  return response.json();
}

export async function createBooking(bookingData: any) {
  const response = await fetch(`${API_CONFIG.API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) throw new Error('Failed to create booking');
  return response.json();
}
