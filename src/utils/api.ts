const API_BASE_URL = '/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
}

export const bookingsApi = {
  create: (bookingData: any) => fetchApi('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  getAll: () => fetchApi('/bookings'),
  getOne: (id: string) => fetchApi(`/bookings/${id}`),
  update: (id: string, bookingData: any) => fetchApi(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookingData),
  }),
  delete: (id: string) => fetchApi(`/bookings/${id}`, { method: 'DELETE' }),
};