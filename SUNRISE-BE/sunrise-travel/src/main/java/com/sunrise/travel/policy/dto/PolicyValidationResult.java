package com.sunrise.travel.policy.dto;

import java.math.BigDecimal;

public record PolicyValidationResult(

        boolean allowed,

        String message,

        String allowedFlightClass,

        String allowedHotelCategory,

        BigDecimal maxFlightFare,

        BigDecimal maxHotelPricePerNight
) {
}