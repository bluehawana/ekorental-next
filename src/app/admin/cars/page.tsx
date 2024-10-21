'use client'; // This component uses client-side functionality

import { useState, useEffect } from 'react';

interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
}

export default function AdminCars() {
    const [cars, setCars] = useState<Car[]>([]);
    const [newCar, setNewCar] = useState<{ make: string; model: string; year: number }>({
        make: '',
        model: '',
        year: new Date().getFullYear(),
    });

    useEffect(() => {
        const fetchCars = async () => {
            const response = await fetch('http://localhost:8085/api/cars'); // Updated URL
            const data = await response.json();
            setCars(data);
        };

        fetchCars();
    }, []);

    const handleAddCar = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8085/api/cars', { // Updated URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCar),
        });
        if (response.ok) {
            const addedCar = await response.json();
            setCars([...cars, addedCar]);
            setNewCar({ make: '', model: '', year: new Date().getFullYear() }); // Reset form
        }
    };

    const handleDeleteCar = async (id: number) => {
        const response = await fetch(`http://localhost:8085/api/cars/${id}`, { // Updated URL
            method: 'DELETE',
        });
        if (response.ok) {
            setCars(cars.filter(car => car.id !== id));
        }
    };

    return (
        <div>
            <h1>Admin Cars Management</h1>
            <form onSubmit={handleAddCar} className="mb-4">
                <input
                    type="text"
                    placeholder="Make"
                    value={newCar.make}
                    onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Model"
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={newCar.year}
                    onChange={(e) => setNewCar({ ...newCar, year: parseInt(e.target.value) })}
                    required
                />
                <button type="submit">Add Car</button>
            </form>

            <h2>Existing Cars</h2>
            <ul>
                {cars.map(car => (
                    <li key={car.id}>
                        {car.make} {car.model} ({car.year})
                        <button onClick={() => handleDeleteCar(car.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
