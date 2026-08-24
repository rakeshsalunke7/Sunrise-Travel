package com.sunrise.travel.policy.controller;

import com.sunrise.travel.policy.dto.PolicyValidationResult;
import com.sunrise.travel.policy.service.TravelPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final TravelPolicyService policyService;

    @GetMapping("/validate/flight")
    public ResponseEntity<PolicyValidationResult> validateFlight(
            @RequestParam String salaryBand,
            @RequestParam String cabinClass,
            @RequestParam BigDecimal fare) {

        return ResponseEntity.ok(
                policyService.validateFlight(
                        salaryBand,
                        cabinClass,
                        fare
                )
        );
    }

    @GetMapping("/validate/hotel")
    public ResponseEntity<PolicyValidationResult> validateHotel(
            @RequestParam String salaryBand,
            @RequestParam String category,
            @RequestParam BigDecimal pricePerNight) {

        return ResponseEntity.ok(
                policyService.validateHotel(
                        salaryBand,
                        category,
                        pricePerNight
                )
        );
    }
}