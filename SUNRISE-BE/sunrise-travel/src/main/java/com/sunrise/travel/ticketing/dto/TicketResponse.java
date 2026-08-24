package com.sunrise.travel.ticketing.dto;

import com.sunrise.travel.booking.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TicketResponse(
        Long bookingId,
        String bookingReference,
        BookingStatus status,
        BigDecimal amount,
        String processedBy,
        LocalDateTime processedAt,
        String message
) {
}