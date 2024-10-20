"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type BookingDetails = {
  location: string
  pickupTime: string
  returnTime: string
  carModel: string
}

const TESLA_PRICES = {
  model3: 18,
  modelS: 20,
  modelX: 22,
  modelY: 19,
  Cybertruck: 25,
  Roadster: 30
}

export default function BookingForm() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    location: '',
    pickupTime: '',
    returnTime: '',
    carModel: ''
  })
  const [totalPrice, setTotalPrice] = useState(0)
  const [showReview, setShowReview] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  useEffect(() => {
    calculatePrice()
  }, [bookingDetails.pickupTime, bookingDetails.returnTime, bookingDetails.carModel])

  const calculatePrice = () => {
    if (bookingDetails.pickupTime && bookingDetails.returnTime && bookingDetails.carModel) {
      const pickupTime = new Date(bookingDetails.pickupTime);
      const returnTime = new Date(bookingDetails.returnTime);
      
      // Calculate the difference in milliseconds
      let diffMs = returnTime.getTime() - pickupTime.getTime();
      
      // If the difference is negative, add 24 hours worth of milliseconds
      if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000;
      }
      
      // Convert to hours and round up
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      
      // Get the hourly rate for the selected car model
      const hourlyRate = TESLA_PRICES[bookingDetails.carModel as keyof typeof TESLA_PRICES] || 0;
      
      const price = diffHours * hourlyRate;
      console.log(`Calculation: ${diffHours} hours * $${hourlyRate}/hour = $${price}`);
      setTotalPrice(price);
    } else {
      console.log('Missing booking details:', bookingDetails);
      setTotalPrice(0);
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()
    calculatePrice() // Ensure price is calculated before showing review
    setShowReview(true)
  }

  const handleEdit = () => {
    setShowReview(false)
  }

  const handleSubmit = async () => {
    // Here you would typically send the booking details to your backend
    // For this example, we'll just simulate a successful booking
    router.push('/checkout')
  }

  if (showReview) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Review Your Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Location: {bookingDetails.location}</p>
          <p>Pickup Time: {new Date(bookingDetails.pickupTime).toLocaleString()}</p>
          <p>Return Time: {new Date(bookingDetails.returnTime).toLocaleString()}</p>
          <p>Car Model: {bookingDetails.carModel}</p>
          <p className="text-lg font-bold mt-4">Total Price: ${totalPrice}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleEdit} className="mr-2">Edit Booking</Button>
          <Button onClick={handleSubmit}>Proceed to Payment</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Book a Tesla</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReview} className="space-y-4">
            <Select
              name="location"
              value={bookingDetails.location}
              onValueChange={(value) => handleInputChange({ target: { name: 'location', value } } as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chalmers">Chalmers Studentbostäder (Gibraltargatan 82)</SelectItem>
                <SelectItem value="lindholmen">Lindholmen Science Park (Lindholmspiren 3A)</SelectItem>
                <SelectItem value="centralstation">Centralstation (Nils Ericsonplatsen 4)</SelectItem>
      
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="datetime-local"
                name="pickupTime"
                value={bookingDetails.pickupTime}
                onChange={handleInputChange}
                placeholder="Pickup time"
              />
              <Input
                type="datetime-local"
                name="returnTime"
                value={bookingDetails.returnTime}
                onChange={handleInputChange}
                placeholder="Return time"
              />
            </div>
            <Select
              name="carModel"
              value={bookingDetails.carModel}
              onValueChange={(value) => handleInputChange({ target: { name: 'carModel', value } } as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Tesla model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model3">Tesla Model 3 ($18/hour)</SelectItem>
                <SelectItem value="modelS">Tesla Model S ($20/hour)</SelectItem>
                <SelectItem value="modelX">Tesla Model X ($22/hour)</SelectItem>
                <SelectItem value="modelY">Tesla Model Y ($19/hour)</SelectItem>
                <SelectItem value="Cybertruck">Tesla Cybertruck ($25/hour)</SelectItem>
                <SelectItem value="Roadster">Tesla Roadster ($30/hour)</SelectItem>
              </SelectContent>
            </Select>
            {totalPrice > 0 && (
              <p className="text-lg font-bold">Estimated Price: ${totalPrice}</p>
            )}
            <Button type="submit">Review Booking</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}




