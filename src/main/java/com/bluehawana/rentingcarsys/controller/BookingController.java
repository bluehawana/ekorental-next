package com.bluehawana.rentingcarsys.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/cars")
public class BookingController {

    @PostMapping("/{carId}/book")
    public ResponseEntity<?> createBooking(
            @PathVariable Long carId,
            @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Booking booking = bookingService.createBooking(
                    carId,
                    request.getStartTime(),
                    request.getEndTime(),
                    request.getTotalHours(),
                    request.getTotalPrice(),
                    request.getUserEmail(),
                    request.getUserName(),
                    request.getStatus());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
}