package com.sunrise.travel.dashboard.service;

import com.sunrise.travel.booking.entity.Booking;
import com.sunrise.travel.booking.entity.BookingStatus;
import com.sunrise.travel.booking.repository.BookingRepository;
import com.sunrise.travel.dashboard.dto.DashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;

    public DashboardResponse getSummary() {

        List<Booking> bookings = bookingRepository.findAll();

        long total = bookings.size();

        // Today's bookings
        LocalDate today = LocalDate.now();

        long todayBookings = bookings.stream()
                .filter(booking ->
                        booking.getCreatedAt() != null &&
                                booking.getCreatedAt()
                                        .toLocalDate()
                                        .equals(today)
                )
                .count();

        // Booking status counts
        long pending = countByStatus(
                bookings,
                BookingStatus.PENDING
        );

        long approved = countByStatus(
                bookings,
                BookingStatus.APPROVED
        );

        long rejected = countByStatus(
                bookings,
                BookingStatus.REJECTED
        );

        long ticketed = countByStatus(
                bookings,
                BookingStatus.TICKETED
        );

        long cancelled = countByStatus(
                bookings,
                BookingStatus.CANCELLED
        );

        // Total travel spend
        BigDecimal totalSpend = bookings.stream()
                .filter(booking ->
                        booking.getStatus() != BookingStatus.REJECTED
                )
                .map(Booking::getAmount)
                .filter(Objects::nonNull)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        // Most travelled city
        String mostTravelledCity = findMostTravelledCity(bookings);

        return new DashboardResponse(
                total,
                todayBookings,
                pending,
                approved,
                rejected,
                ticketed,
                cancelled,
                totalSpend,
                mostTravelledCity
        );
    }

    private long countByStatus(
            List<Booking> bookings,
            BookingStatus status) {

        return bookings.stream()
                .filter(booking ->
                        booking.getStatus() == status)
                .count();
    }

    private String findMostTravelledCity(
            List<Booking> bookings) {

        Map<String, Long> cityCounts = bookings.stream()
                .map(Booking::getDestination)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(
                        Function.identity(),
                        Collectors.counting()
                ));

        return cityCounts.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");
    }
}