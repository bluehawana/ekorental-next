import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tesla_rental',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get all cars
export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM cars');
    connection.release();
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}

// Create a new car
export async function POST(request: Request) {
  try {
    const newCar = await request.json();
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO cars (price, description, imageUrl, available, licensePlate, location, name, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newCar.price, newCar.description, newCar.imageUrl, newCar.available, newCar.licensePlate, newCar.location, newCar.name, newCar.year]
    );
    
    connection.release();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create car' },
      { status: 500 }
    );
  }
}

