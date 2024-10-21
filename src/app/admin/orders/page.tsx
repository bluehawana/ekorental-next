'use client'; // This component uses client-side functionality

import { useState, useEffect } from 'react';

interface Booking {
    id: number;
    userId: number; // Assuming bookings are linked to users
    carId: number;  // Assuming bookings are linked to cars
    startDate: string; // Use an appropriate type for date
    endDate: string;   // Use an appropriate type for date
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [newBooking, setNewBooking] = useState<{ userId: number; carId: number; startDate: string; endDate: string }>({
        userId: 0,
        carId: 0,
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch('http://localhost:8085/bookings/'); // Updated URL
            const data = await response.json();
            setBookings(data);
        };

        fetchBookings();
    }, []);

    const handleAddBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8085/bookings/', { // Updated URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBooking),
        });
        if (response.ok) {
            const addedBooking = await response.json();
            setBookings([...bookings, addedBooking]);
            setNewBooking({ userId: 0, carId: 0, startDate: '', endDate: '' }); // Reset form
        }
    };

    const handleDeleteBooking = async (id: number) => {
        const response = await fetch(`http://localhost:8085/bookings/${id}`, { // Updated URL
            method: 'DELETE',
        });
        if (response.ok) {
            setBookings(bookings.filter(booking => booking.id !== id));
        }
    };

    return (
        <div>
            <h1>Admin Bookings Management</h1>
            <form onSubmit={handleAddBooking} className="mb-4">
                <input
                    type="number"
                    placeholder="User ID"
                    value={newBooking.userId}
                    onChange={(e) => setNewBooking({ ...newBooking, userId: parseInt(e.target.value) })}
                    required
                />
                <input
                    type="number"
                    placeholder="Car ID"
                    value={newBooking.carId}
                    onChange={(e) => setNewBooking({ ...newBooking, carId: parseInt(e.target.value) })}
                    required
                />
                <input
                    type="date"
                    placeholder="Start Date"
                    value={newBooking.startDate}
                    onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                    required
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={newBooking.endDate}
                    onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                    required
                />
                <button type="submit">Add Booking</button>
            </form>

            <h2>Existing Bookings</h2>
            <ul>
                {bookings.map(booking => (
                    <li key={booking.id}>
                        User ID: {booking.userId}, Car ID: {booking.carId},
                        Start: {booking.startDate}, End: {booking.endDate}
                        <button onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
