package com.bluehawana.rentingcarsys.controller;

import com.bluehawana.rentingcarsys.service.BookingService;
import com.bluehawana.rentingcarsys.model.Booking;
import com.bluehawana.rentingcarsys.dto.BookingRequest;
import com.bluehawana.rentingcarsys.dto.ErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            log.error("Error fetching all bookings: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            log.error("Error fetching booking: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            log.info("Updating booking {} status to: {}", id, statusUpdate.get("status"));
            Booking booking = bookingService.updateBookingStatus(id, statusUpdate.get("status"));
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            log.error("Error updating booking status: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequest request) {
        try {
            log.info("Creating booking for car: {}", request.getCarId());
            Booking booking = bookingService.createBooking(
                    request.getCarId(),
                    request.getStartTime(),
                    request.getEndTime(),
                    request.getTotalHours(),
                    request.getTotalPrice(),
                    request.getUserEmail(),
                    request.getUserName(),
                    request.getStatus());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            log.error("Error creating booking: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates) {
        try {
            log.info("Updating booking {} with new times: start={}, end={}", 
                    id, updates.get("startTime"), updates.get("endTime"));
            
            Booking booking = bookingService.updateBookingTimes(
                id,
                LocalDateTime.parse(updates.get("startTime")),
                LocalDateTime.parse(updates.get("endTime"))
            );
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            log.error("Error updating booking: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
}