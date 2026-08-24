package com.sunrise.travel.flight.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record FlightSearchRequest(

        @NotBlank
        String origin,

        @NotBlank
        String destination,

        @NotNull
        LocalDate departureDate,

        LocalDate returnDate,

        @Min(1)
        int passengers,

        @NotBlank
        String cabinClass
) {
}
