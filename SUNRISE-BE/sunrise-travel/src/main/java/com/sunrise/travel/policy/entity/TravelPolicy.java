package com.sunrise.travel.policy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "travel_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String salaryBand;

    @Column(nullable = false)
    private String allowedFlightClass;

    @Column(nullable = false)
    private String allowedHotelCategory;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal maxFlightFare;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal maxHotelPricePerNight;

    @Column(nullable = false)
    private boolean active = true;
}
