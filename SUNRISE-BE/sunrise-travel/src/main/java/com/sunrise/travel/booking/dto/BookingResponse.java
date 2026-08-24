package com.sunrise.travel.booking.dto;

import com.sunrise.travel.booking.entity.BookingStatus;
import com.sunrise.travel.booking.entity.BookingType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponse(

        Long id,

        String bookingReference,

        BookingType bookingType,

        String itemReference,

        String origin,

        String destination,

        LocalDateTime travelDate,

        BigDecimal amount,

        BookingStatus status,

        String details,

        LocalDateTime createdAt,

        String employeeName,

        String employeeEmail
) {
}