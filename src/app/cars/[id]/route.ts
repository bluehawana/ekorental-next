import { NextResponse } from 'next/server';

interface Car {
  id: string | number;
  make: string;
  model: string;
  year: number;
  pricePerHour: number;
  licensePlate: string;
  color: string;
  imageUrl: string;
}

// Sample car data
const cars: Car[] = [
    { id: 1, make: "Tesla", model: "Model S", year: 2022, pricePerHour: 20.0, licensePlate: "TES-123", color: "Red", imageUrl: "http://localhost:8085/uploads/model_s.png" },
    { id: 2, make: "Tesla", model: "Model 3", year: 2022, pricePerHour: 18.0, licensePlate: "TES-124", color: "Blue", imageUrl: "http://localhost:8085/uploads/model_3.png" },
    { id: 3, make: "Tesla", model: "Model X", year: 2022, pricePerHour: 22.0, licensePlate: "TES-125", color: "Black", imageUrl: "http://localhost:8085/uploads/model_x.png" },
    { id: 4, make: "Tesla", model: "Model Y", year: 2022, pricePerHour: 19.0, licensePlate: "TES-126", color: "White", imageUrl: "http://localhost:8085/uploads/model_y.png" },
    { id: 5, make: "Tesla", model: "Cybertruck", year: 2022, pricePerHour: 25.0, licensePlate: "TES-127", color: "Silver", imageUrl: "http://localhost:8085/uploads/cybertruck.png" },
    { id: 6, make: "Tesla", model: "Roadster", year: 2022, pricePerHour: 30.0, licensePlate: "TES-128", color: "Red", imageUrl: "http://localhost:8085/uploads/roadster.png" },
];

// Delete a car by ID - This function is actually used in the DELETE route
const deleteCarById = (id: number) => {
    const index = cars.findIndex(car => car.id === id);
    if (index !== -1) {
        const deletedCar = cars[index];
        cars.splice(index, 1);
        return deletedCar;
    }
    return null;
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const car = cars.find(car => car.id.toString() === id);
    
    if (car) {
        return new Response(JSON.stringify(car), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(null, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const updatedCar: Partial<Car> = await request.json();

    const index = cars.findIndex(car => car.id.toString() === id);
    if (index !== -1) {
        cars[index] = { 
            ...cars[index], 
            ...updatedCar 
        } as Car;
        return new Response(JSON.stringify(cars[index]), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(null, { status: 404 });
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
