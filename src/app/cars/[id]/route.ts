import { NextResponse } from 'next/server';

// Sample car data (this can also be imported from another file if preferred)
let cars = [
    { id: 1, make: "Tesla", model: "Model S", year: 2022, pricePerHour: 20.0, licensePlate: "TES-123", color: "Red", imageUrl: "http://localhost:8085/uploads/model_s.png" },
    { id: 2, make: "Tesla", model: "Model 3", year: 2022, pricePerHour: 18.0, licensePlate: "TES-124", color: "Blue", imageUrl: "http://localhost:8085/uploads/model_3.png" },
    { id: 3, make: "Tesla", model: "Model X", year: 2022, pricePerHour: 22.0, licensePlate: "TES-125", color: "Black", imageUrl: "http://localhost:8085/uploads/model_x.png" },
    { id: 4, make: "Tesla", model: "Model Y", year: 2022, pricePerHour: 19.0, licensePlate: "TES-126", color: "White", imageUrl: "http://localhost:8085/uploads/model_y.png" },
    { id: 5, make: "Tesla", model: "Cybertruck", year: 2022, pricePerHour: 25.0, licensePlate: "TES-127", color: "Silver", imageUrl: "http://localhost:8085/uploads/cybertruck.png" },
    { id: 6, make: "Tesla", model: "Roadster", year: 2022, pricePerHour: 30.0, licensePlate: "TES-128", color: "Red", imageUrl: "http://localhost:8085/uploads/roadster.png" },
];

// Get a car by ID
const getCarById = (id: number) => {
    return cars.find(car => car.id === id);
};

// Update a car by ID
const updateCarById = (id: number, updatedCar: any) => {
    const index = cars.findIndex(car => car.id === id);
    if (index !== -1) {
        cars[index] = { ...cars[index], ...updatedCar };
        return cars[index];
    }
    return null;
};

// Delete a car by ID
const deleteCarById = (id: number) => {
    const index = cars.findIndex(car => car.id === id);
    if (index !== -1) {
        const deletedCar = cars[index];
        cars.splice(index, 1); // Remove the car from the array
        return deletedCar;
    }
    return null;
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const carId = parseInt(params.id);
    const car = getCarById(carId);

    if (car) {
        return NextResponse.json(car);
    } else {
        return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const carId = parseInt(params.id);
    const updatedCar = await request.json();

    const car = updateCarById(carId, updatedCar);

    if (car) {
        return NextResponse.json(car);
    } else {
        return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const carId = parseInt(params.id);
    const deletedCar = deleteCarById(carId);

    if (deletedCar) {
        return NextResponse.json({ message: 'Car deleted successfully' });
    } else {
        return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
}
