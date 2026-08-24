package com.sunrise.travel.flight.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record FlightResponse(

        String flightNumber,
        String airline,
        String origin,
        String destination,
        LocalDate departureDate,
        LocalTime departureTime,
        LocalTime arrivalTime,
        String cabinClass,
        int availableSeats,
        BigDecimal price
) {
}
