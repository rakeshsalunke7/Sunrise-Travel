package com.sunrise.travel.hotel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record HotelSearchRequest(

        @NotBlank
        String city,

        @NotNull
        LocalDate checkIn,

        @NotNull
        LocalDate checkOut,

        @Min(1)
        int guests,

        String category
) {
}