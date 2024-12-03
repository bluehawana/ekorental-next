package com.bluehawana.rentingcarsys.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long carId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer totalHours;
    private BigDecimal totalPrice;
    private String userEmail;
    private String userName;
    private String status;
}