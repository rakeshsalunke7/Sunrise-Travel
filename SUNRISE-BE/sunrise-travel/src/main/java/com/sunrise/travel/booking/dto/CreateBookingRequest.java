package com.sunrise.travel.booking.dto;

import com.sunrise.travel.booking.entity.BookingType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateBookingRequest(

        @NotNull
        BookingType bookingType,

        @NotBlank
        String itemReference,

        @NotBlank
        String origin,

        @NotBlank
        String destination,

        @NotNull
        LocalDateTime travelDate,

        @NotNull
        @DecimalMin("0.0")
        BigDecimal amount,

        @NotBlank
        String details,

        @NotBlank
        String cabinOrCategory
) {
}