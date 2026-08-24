package com.sunrise.travel.booking.service;

import com.sunrise.travel.booking.dto.BookingResponse;
import com.sunrise.travel.booking.dto.CreateBookingRequest;
import com.sunrise.travel.booking.entity.Booking;
import com.sunrise.travel.booking.entity.BookingStatus;
import com.sunrise.travel.booking.repository.BookingRepository;
import com.sunrise.travel.policy.dto.PolicyValidationResult;
import com.sunrise.travel.policy.service.TravelPolicyService;
import com.sunrise.travel.user.entity.User;
import com.sunrise.travel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sunrise.travel.booking.entity.BookingType;
import com.sunrise.travel.common.exception.PolicyViolationException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TravelPolicyService travelPolicyService;

    @Transactional
    public BookingResponse createBooking(
            CreateBookingRequest request,
            String email) {

        // 1. Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 2. Validate booking against travel policy
        PolicyValidationResult policyResult;

        if ((request.bookingType() == BookingType.FLIGHT)) {

            policyResult = travelPolicyService.validateFlight(
                    user.getSalaryBand(),
                    request.cabinOrCategory(),
                    request.amount()
            );

        } else {

            policyResult = travelPolicyService.validateHotel(
                    user.getSalaryBand(),
                    request.cabinOrCategory(),
                    request.amount()
            );
        }

        // 3. Reject if policy is violated
        if (!policyResult.allowed()) {
            throw new PolicyViolationException(
                    "Booking violates travel policy: "
                            + policyResult.message()
            );
        }

        // 4. Create booking
        Booking booking = Booking.builder()
                .bookingReference(generateBookingReference())
                .user(user)
                .bookingType(request.bookingType())
                .itemReference(request.itemReference())
                .origin(request.origin())
                .destination(request.destination())
                .travelDate(request.travelDate())
                .amount(request.amount())
                .details(request.details())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        return mapToResponse(savedBooking);
    }

    public List<BookingResponse> getMyBookings(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<BookingResponse> getProcessedBookings() {

        return bookingRepository.findAll()
                .stream()
                .filter(booking ->
                        booking.getStatus() != BookingStatus.PENDING)
                .map(this::mapToResponse)
                .toList();
    }

    public List<BookingResponse> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private String generateBookingReference() {

        return "SR-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    private BookingResponse mapToResponse(Booking booking) {

        return new BookingResponse(
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
        );

    }
}