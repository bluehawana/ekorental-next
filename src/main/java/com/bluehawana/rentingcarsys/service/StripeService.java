package com.bluehawana.rentingcarsys.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {
    private static final Logger log = LoggerFactory.getLogger(StripeService.class);

    @Autowired
    private BookingService bookingService;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    public Map<String, String> createCheckoutSession(String bookingId, Long amount) throws StripeException {
        log.info("Creating Stripe checkout session for booking {} with amount {}", bookingId, amount);
        
        if (stripeSecretKey == null || stripeSecretKey.isEmpty()) {
            log.error("Stripe secret key is not configured");
            throw new IllegalStateException("Stripe secret key is not configured");
        }

        Stripe.apiKey = stripeSecretKey;

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl + "?booking_id=" + bookingId)
                    .setCancelUrl(cancelUrl + "?booking_id=" + bookingId)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("sek")
                                    .setUnitAmount(amount)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Car Booking #" + bookingId)
                                            .build())
                                    .build())
                            .setQuantity(1L)
                            .build())
                    .putMetadata("bookingId", bookingId)
                    .build();

            log.debug("Created session params: {}", params);

            Session session = Session.create(params);
            log.info("Successfully created Stripe session: {}", session.getId());
            
            Map<String, String> responseData = new HashMap<>();
            responseData.put("url", session.getUrl());
            return responseData;
        } catch (StripeException e) {
            log.error("Error creating Stripe session: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void handleWebhookEvent(String payload, String sigHeader) throws StripeException {
        log.info("Handling Stripe webhook event");
        
        try {
            Event event = Event.constructEvent(payload, sigHeader, stripeSecretKey);
            log.info("Webhook event type: {}", event.getType());
            
            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer().getObject().get();
                String bookingId = session.getMetadata().get("bookingId");
                log.info("Payment completed for booking: {}", bookingId);
                
                // Update booking status to confirmed
                bookingService.updateBookingStatus(Long.parseLong(bookingId), "CONFIRMED");
                log.info("Successfully updated booking {} status to CONFIRMED", bookingId);
            }
        } catch (Exception e) {
            log.error("Error handling webhook: {}", e.getMessage(), e);
            throw new StripeException("Error processing webhook", e);
        }
    }
} 