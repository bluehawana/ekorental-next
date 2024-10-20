import BookingForm from '@/components/bookings/BookingForm';

export default function CarBookingPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Car</h1>
      <BookingForm carId={params.id} />
    </div>
  );
}
