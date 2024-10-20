import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Define a type for order data
type OrderData = {
  // Specify the properties of the order data here
  // For example:
  id?: string;
  item: string;
  quantity: number;
  // Add other relevant fields
}

// Define a type for car data
type CarData = {
  // Specify the properties of the car data here
  id?: string;
  make: string;
  model: string;
  year: number;
  // Add other relevant fields
}

export const fetchCars = () => api.get('/cars')
export const createOrder = (orderData: OrderData) => api.post('/orders', orderData)
export const fetchUserOrders = (userId: string) => api.get(`/users/${userId}/orders`)
export const updateOrder = (orderId: string, orderData: OrderData) => api.put(`/orders/${orderId}`, orderData)
export const deleteOrder = (orderId: string) => api.delete(`/orders/${orderId}`)

// Admin-only functions
export const fetchAllUsers = () => api.get('/admin/users')
export const fetchAllOrders = () => api.get('/admin/orders')
export const createCar = (carData: CarData) => api.post('/admin/cars', carData)
export const updateCar = (carId: string, carData: CarData) => api.put(`/admin/cars/${carId}`, carData)
export const deleteCar = (carId: string) => api.delete(`/admin/cars/${carId}`)

export default api
