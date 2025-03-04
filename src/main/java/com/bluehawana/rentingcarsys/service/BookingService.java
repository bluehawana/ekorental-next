package com.bluehawana.rentingcarsys.service;

import com.bluehawana.rentingcarsys.model.Booking;
import com.bluehawana.rentingcarsys.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import lombok.extern.slf4j.Slf4j;
import com.bluehawana.rentingcarsys.model.Car;
import java.util.List;
import java.time.Duration;

@Slf4j
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarService carService;

    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        
        // Fetch car details for each booking
        for (Booking booking : bookings) {
            Car car = carService.getCar(booking.getCarId());
            booking.setCarModel(car.getMake() + " " + car.getModel());
            booking.setCarImage(car.getImageUrl());
        }
        
        return bookings;
    }

    public Booking getBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
        
        // Fetch car details and set them in the booking
        Car car = carService.getCar(booking.getCarId());
        booking.setCarModel(car.getMake() + " " + car.getModel());
        booking.setCarImage(car.getImageUrl());
        
        return booking;
    }

    public Booking updateBookingStatus(Long id, String status) {
        log.info("Updating booking {} status to {}", id, status);
        Booking booking = getBooking(id);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public Booking createBooking(
            Long carId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            Integer totalHours,
            BigDecimal totalPrice,
            String userEmail,
            String userName,
            String status) {
        
        Booking booking = new Booking();
        booking.setCarId(carId);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setTotalHours(totalHours);
        booking.setTotalPrice(totalPrice);
        booking.setUserEmail(userEmail);
        booking.setUserName(userName);
        booking.setStatus(status);
        
        return bookingRepository.save(booking);
    }

    public Booking updateBookingTimes(Long id, LocalDateTime newStartTime, LocalDateTime newEndTime) {
        log.info("Updating booking {} times: start={}, end={}", id, newStartTime, newEndTime);
        
        Booking booking = getBooking(id);
        
        // Validate the new times
        if (newStartTime.isAfter(newEndTime)) {
            throw new IllegalArgumentException("Start time cannot be after end time");
        }
        
        // Calculate new duration and price
        Duration duration = Duration.between(newStartTime, newEndTime);
        int totalHours = (int) Math.ceil(duration.toHours());
        
        // Get car hourly rate to calculate new total price
        Car car = carService.getCar(booking.getCarId());
        BigDecimal hourlyRate = car.getHourRate();
        BigDecimal newTotalPrice = hourlyRate.multiply(BigDecimal.valueOf(totalHours));
        
        // Update booking
        booking.setStartTime(newStartTime);
        booking.setEndTime(newEndTime);
        booking.setTotalHours(totalHours);
        booking.setTotalPrice(newTotalPrice);
        
        return bookingRepository.save(booking);
    }
} 