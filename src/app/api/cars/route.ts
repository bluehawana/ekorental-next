import { NextResponse } from 'next/server';

// Sample car data
let cars = [
  { id: 1, make: "Tesla", model: "Model S", year: 2022, pricePerHour: 20.0, licensePlate: "TES-123", color: "Red", imageUrl: "http://localhost:8085/uploads/model_s.png" },
  { id: 2, make: "Tesla", model: "Model 3", year: 2022, pricePerHour: 18.0, licensePlate: "TES-124", color: "Blue", imageUrl: "http://localhost:8085/uploads/model_3.png" },
  { id: 3, make: "Tesla", model: "Model X", year: 2022, pricePerHour: 22.0, licensePlate: "TES-125", color: "Black", imageUrl: "http://localhost:8085/uploads/model_x.png" },
  { id: 4, make: "Tesla", model: "Model Y", year: 2022, pricePerHour: 19.0, licensePlate: "TES-126", color: "White", imageUrl: "http://localhost:8085/uploads/model_y.png" },
  { id: 5, make: "Tesla", model: "Cybertruck", year: 2022, pricePerHour: 25.0, licensePlate: "TES-127", color: "Silver", imageUrl: "http://localhost:8085/uploads/cybertruck.png" },
  { id: 6, make: "Tesla", model: "Roadster", year: 2022, pricePerHour: 30.0, licensePlate: "TES-128", color: "Red", imageUrl: "http://localhost:8085/uploads/roadster.png" },
];

// Get all cars
export async function GET() {
  return NextResponse.json(cars);
}

// Create a new car
export async function POST(request: Request) {
  const newCar = await request.json();
  newCar.id = cars.length ? Math.max(...cars.map(car => car.id)) + 1 : 1; // Assign a new ID
  cars.push(newCar);
  return NextResponse.json(newCar, { status: 201 });
}

