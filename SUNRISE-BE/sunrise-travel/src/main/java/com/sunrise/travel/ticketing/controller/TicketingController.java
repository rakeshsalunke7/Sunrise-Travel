package com.sunrise.travel.ticketing.controller;

import com.sunrise.travel.ticketing.dto.TicketResponse;
import com.sunrise.travel.ticketing.service.TicketingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketingController {

    private final TicketingService ticketingService;

    @PostMapping("/{bookingId}/issue")
    @PreAuthorize("hasRole('TRAVEL_ADMIN')")
    public ResponseEntity<TicketResponse> issueTicket(
            @PathVariable Long bookingId,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketingService.issueTicket(
                        bookingId,
                        authentication.getName()
                )
        );
    }

    @PostMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('TRAVEL_ADMIN')")
    public ResponseEntity<TicketResponse> cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketingService.cancelBooking(
                        bookingId,
                        authentication.getName()
                )
        );
    }
}