package com.sunrise.travel.dashboard.dto;

import java.math.BigDecimal;

public record DashboardResponse(
        long totalBookings,
        long todayBookings,
        long pendingBookings,
        long approvedBookings,
        long rejectedBookings,
        long ticketedBookings,
        long cancelledBookings,
        BigDecimal totalTravelSpend,
        String mostTravelledCity
) {
}