package com.bluehawana.rentingcarsys.service;

import com.bluehawana.rentingcarsys.model.Payment;
import com.bluehawana.rentingcarsys.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class PaymentService {
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        log.info("Fetching all payments");
        return paymentRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        log.info("Fetching payments for booking ID: {}", bookingId);
        return paymentRepository.findByBookingId(bookingId);
    }

    public Payment getPaymentById(Long id) {
        log.info("Fetching payment with ID: {}", id);
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    }

    public Payment savePayment(Payment payment) {
        log.info("Saving payment for booking ID: {}", payment.getBookingId());
        return paymentRepository.save(payment);
    }

    public void deletePayment(Long id) {
        log.info("Deleting payment with ID: {}", id);
        paymentRepository.deleteById(id);
    }
} 