package com.bluehawana.rentingcarsys.repository;

import com.bluehawana.rentingcarsys.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBookingId(Long bookingId);
    List<Payment> findAllByOrderByCreatedAtDesc();
} 