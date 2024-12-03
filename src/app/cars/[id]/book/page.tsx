import BookingForm from '@/components/bookings/BookingForm';

export default async function CarBookingPage({ params }: { params: { id: string } }) {
  const id = await params.id;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <BookingForm carId={id} />
    </div>
  );
}
