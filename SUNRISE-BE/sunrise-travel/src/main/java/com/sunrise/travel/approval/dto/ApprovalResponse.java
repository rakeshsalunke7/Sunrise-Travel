package com.sunrise.travel.approval.dto;

import com.sunrise.travel.booking.entity.BookingStatus;

import java.time.LocalDateTime;

public record ApprovalResponse(

        Long bookingId,

        String bookingReference,

        BookingStatus status,

        String processedBy,

        String comment,

        LocalDateTime processedAt,

        String message
) {
}