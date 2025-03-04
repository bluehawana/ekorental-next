package com.bluehawana.rentingcarsys.controller;

import com.bluehawana.rentingcarsys.model.Payment;
import com.bluehawana.rentingcarsys.service.PaymentService;
import com.bluehawana.rentingcarsys.service.StripeService;
import com.stripe.exception.StripeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {
    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private StripeService stripeService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody Map<String, Object> payload) {
        try {
            log.info("Received payment request: {}", payload);
            
            String bookingId = payload.get("bookingId").toString();
            Long amount = Long.parseLong(payload.get("amount").toString());

            Map<String, String> sessionData = stripeService.createCheckoutSession(bookingId, amount);
            
            return ResponseEntity.ok(sessionData);
        } catch (Exception e) {
            log.error("Error creating checkout session: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            stripeService.handleWebhookEvent(payload, sigHeader);
            return ResponseEntity.ok().build();
        } catch (StripeException e) {
            log.error("Webhook processing failed: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory() {
        try {
            log.info("Fetching payment history");
            List<Payment> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            log.error("Error fetching payment history", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch payment history: " + e.getMessage()));
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentsByBookingId(@PathVariable Long bookingId) {
        try {
            log.info("Fetching payments for booking ID: {}", bookingId);
            List<Payment> payments = paymentService.getPaymentsByBookingId(bookingId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            log.error("Error fetching payments for booking ID: {}", bookingId, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch payments for booking: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            log.info("Fetching payment with ID: {}", id);
            Payment payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error fetching payment with ID: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch payment: " + e.getMessage()));
        }
    }
} 