package com.bluehawana.rentingcarsys.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "cars")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String make;
    private String model;
    private Integer year;
    private BigDecimal pricePerHour;
    private String licensePlate;
    private String location;
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    // Custom getter to ensure .png extension
    public String getImageUrl() {
        if (imageUrl != null && imageUrl.endsWith(".jpg")) {
            return imageUrl.replace(".jpg", ".png");
        }
        return imageUrl;
    }
} 