package com.sunrise.travel.approval.controller;

import com.sunrise.travel.approval.dto.ApprovalRequest;
import com.sunrise.travel.approval.dto.ApprovalResponse;
import com.sunrise.travel.approval.service.ApprovalService;
import com.sunrise.travel.booking.dto.BookingResponse;
import com.sunrise.travel.booking.entity.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sunrise.travel.booking.dto.BookingResponse;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    @GetMapping("/pending")
    @PreAuthorize("hasRole('TRAVEL_APPROVER')")
    public ResponseEntity<List<BookingResponse>> getPendingBookings() {

        return ResponseEntity.ok(
                approvalService.getPendingBookings()
        );
    }

    @PostMapping("/{bookingId}/approve")
    @PreAuthorize("hasRole('TRAVEL_APPROVER')")
    public ResponseEntity<ApprovalResponse> approveBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) ApprovalRequest request,
            org.springframework.security.core.Authentication authentication) {

        if (request == null) {
            request = new ApprovalRequest(null);
        }

        return ResponseEntity.ok(
                approvalService.approveBooking(
                        bookingId,
                        request,
                        authentication.getName()
                )
        );
    }

    @PostMapping("/{bookingId}/reject")
    @PreAuthorize("hasRole('TRAVEL_APPROVER')")
    public ResponseEntity<ApprovalResponse> rejectBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) ApprovalRequest request,
            org.springframework.security.core.Authentication authentication) {

        if (request == null) {
            request = new ApprovalRequest(null);
        }

        return ResponseEntity.ok(
                approvalService.rejectBooking(
                        bookingId,
                        request,
                        authentication.getName()
                )
        );
    }
}