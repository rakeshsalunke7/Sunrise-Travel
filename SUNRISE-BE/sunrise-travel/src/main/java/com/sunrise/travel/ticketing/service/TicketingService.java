package com.sunrise.travel.ticketing.service;

import com.sunrise.travel.booking.entity.Booking;
import com.sunrise.travel.booking.entity.BookingStatus;
import com.sunrise.travel.booking.repository.BookingRepository;
import com.sunrise.travel.ticketing.dto.TicketResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TicketingService {

    private final BookingRepository bookingRepository;

    @Transactional
    public TicketResponse issueTicket(
            Long bookingId,
            String adminEmail) {

        Booking booking = getBooking(bookingId);

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException(
                    "Only APPROVED bookings can be ticketed"
            );
        }

        booking.setStatus(BookingStatus.TICKETED);
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        return new TicketResponse(
                savedBooking.getId(),
                savedBooking.getBookingReference(),
                savedBooking.getStatus(),
                savedBooking.getAmount(),
                adminEmail,
                savedBooking.getUpdatedAt(),
                "Ticket issued successfully"
        );
    }

    @Transactional
    public TicketResponse cancelBooking(
            Long bookingId,
            String adminEmail) {

        Booking booking = getBooking(bookingId);

        if (booking.getStatus() != BookingStatus.TICKETED) {
            throw new IllegalStateException(
                    "Only TICKETED bookings can be cancelled"
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        return new TicketResponse(
                savedBooking.getId(),
                savedBooking.getBookingReference(),
                savedBooking.getStatus(),
                savedBooking.getAmount(),
                adminEmail,
                savedBooking.getUpdatedAt(),
                "Booking cancelled successfully"
        );
    }

    private Booking getBooking(Long bookingId) {

        return bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found: " + bookingId
                        ));
    }
}