import { CarList } from '@/components/cars/CarList';

export default function CarsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Available Tesla Models</h1>
        <p className="text-gray-600 mb-8">Choose from our premium selection of Tesla vehicles</p>
        <CarList />
      </div>
    </main>
  );
} 