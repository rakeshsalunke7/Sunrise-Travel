package com.sunrise.travel.approval.service;

import com.sunrise.travel.approval.dto.ApprovalRequest;
import com.sunrise.travel.approval.dto.ApprovalResponse;
import com.sunrise.travel.booking.dto.BookingResponse;
import com.sunrise.travel.booking.entity.Booking;
import com.sunrise.travel.booking.entity.BookingStatus;
import com.sunrise.travel.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sunrise.travel.booking.dto.BookingResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final BookingRepository bookingRepository;

    public List<BookingResponse> getPendingBookings() {

        return bookingRepository.findByStatus(
                        BookingStatus.PENDING
                )
                .stream()
                .map(booking -> new BookingResponse(
                        booking.getId(),
                        booking.getBookingReference(),
                        booking.getBookingType(),
                        booking.getItemReference(),
                        booking.getOrigin(),
                        booking.getDestination(),
                        booking.getTravelDate(),
                        booking.getAmount(),
                        booking.getStatus(),
                        booking.getDetails(),
                        booking.getCreatedAt(),
                        booking.getUser().getFullName(),
                        booking.getUser().getEmail()
                ))
                .toList();
    }

    @Transactional
    public ApprovalResponse approveBooking(
            Long bookingId,
            ApprovalRequest request,
            String approverEmail) {

        Booking booking = getBooking(bookingId);

        validatePendingBooking(booking);

        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovedBy(approverEmail);
        booking.setApprovalComment(request.comment());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        return new ApprovalResponse(
                savedBooking.getId(),
                savedBooking.getBookingReference(),
                savedBooking.getStatus(),
                approverEmail,
                savedBooking.getApprovalComment(),
                savedBooking.getUpdatedAt(),
                "Booking approved successfully"
        );
    }

    @Transactional
    public ApprovalResponse rejectBooking(
            Long bookingId,
            ApprovalRequest request,
            String approverEmail) {

        Booking booking = getBooking(bookingId);

        validatePendingBooking(booking);

        booking.setStatus(BookingStatus.REJECTED);
        booking.setApprovedBy(approverEmail);
        booking.setApprovalComment(request.comment());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        return new ApprovalResponse(
                savedBooking.getId(),
                savedBooking.getBookingReference(),
                savedBooking.getStatus(),
                approverEmail,
                savedBooking.getApprovalComment(),
                savedBooking.getUpdatedAt(),
                "Booking rejected successfully"
        );
    }

    private Booking getBooking(Long bookingId) {

        return bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found: " + bookingId
                        ));
    }

    private void validatePendingBooking(Booking booking) {

        if (booking.getStatus() != BookingStatus.PENDING) {

            throw new IllegalStateException(
                    "Only PENDING bookings can be approved or rejected"
            );
        }
    }
}