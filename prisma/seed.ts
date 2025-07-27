import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create Tesla cars
    const cars = [
      {
        model: 'Model 3',
        hour_rate: 150.00,
        image_url: '/cars/model-3.webp',
        description: 'Tesla Model 3 - All Electric Sedan',
        year: 2023,
        location: 'Stockholm',
        license_plate: 'ABC123',
        is_available: true
      },
      {
        model: 'Model Y',
        hour_rate: 175.00,
        image_url: '/cars/model-y.webp',
        description: 'Tesla Model Y - Electric SUV',
        year: 2023,
        location: 'Stockholm',
        license_plate: 'XYZ789',
        is_available: true
      },
      {
        model: 'Model S',
        hour_rate: 200.00,
        image_url: '/cars/model-s.webp',
        description: 'Tesla Model S - Premium Sedan',
        year: 2023,
        location: 'Stockholm',
        license_plate: 'DEF456',
        is_available: true
      },
      {
        model: 'Model X',
        hour_rate: 225.00,
        image_url: '/cars/model-x.webp',
        description: 'Tesla Model X - Premium SUV',
        year: 2023,
        location: 'Stockholm',
        license_plate: 'GHI789',
        is_available: true
      },
      {
        model: 'Cybertruck',
        hour_rate: 250.00,
        image_url: '/cars/cybertruck.webp',
        description: 'Tesla Cybertruck - Electric Pickup',
        year: 2023,
        location: 'Stockholm',
        license_plate: 'JKL012',
        is_available: true
      },
      {
        model: 'Roadster',
        hour_rate: 300.00,
        image_url: '/cars/roadster.webp',
        description: 'Tesla Roadster - Sports Car',
        year: 2023,
        location: 'Stockholm',
        license_plate: 'MNO345',
        is_available: true
      }
    ];

    for (const car of cars) {
      await prisma.cars.upsert({
        where: { license_plate: car.license_plate },
        update: car,
        create: car
      });
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 