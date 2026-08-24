package com.sunrise.travel.policy.service;

import com.sunrise.travel.policy.entity.TravelPolicy;
import com.sunrise.travel.policy.repository.TravelPolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class PolicyDataInitializer implements CommandLineRunner {

    private final TravelPolicyRepository policyRepository;

    @Override
    public void run(String... args) {

        if (policyRepository.count() > 0) {
            return;
        }

        policyRepository.save(
                TravelPolicy.builder()
                        .salaryBand("B1")
                        .allowedFlightClass("ECONOMY")
                        .allowedHotelCategory("2_STAR")
                        .maxFlightFare(new BigDecimal("8000"))
                        .maxHotelPricePerNight(new BigDecimal("5000"))
                        .active(true)
                        .build()
        );

        policyRepository.save(
                TravelPolicy.builder()
                        .salaryBand("B2")
                        .allowedFlightClass("ECONOMY")
                        .allowedHotelCategory("3_STAR")
                        .maxFlightFare(new BigDecimal("12000"))
                        .maxHotelPricePerNight(new BigDecimal("8000"))
                        .active(true)
                        .build()
        );

        policyRepository.save(
                TravelPolicy.builder()
                        .salaryBand("B3")
                        .allowedFlightClass("BUSINESS")
                        .allowedHotelCategory("5_STAR")
                        .maxFlightFare(new BigDecimal("25000"))
                        .maxHotelPricePerNight(new BigDecimal("15000"))
                        .active(true)
                        .build()
        );
    }
}