package com.sunrise.travel.policy.service;

import com.sunrise.travel.policy.dto.PolicyValidationResult;
import com.sunrise.travel.policy.entity.TravelPolicy;
import com.sunrise.travel.policy.repository.TravelPolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TravelPolicyService {

    private final TravelPolicyRepository policyRepository;

    public TravelPolicy getPolicy(String salaryBand) {

        return policyRepository
                .findBySalaryBandAndActiveTrue(salaryBand)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No active travel policy found for salary band: "
                                        + salaryBand
                        ));
    }

    public PolicyValidationResult validateFlight(
            String salaryBand,
            String cabinClass,
            BigDecimal fare) {

        TravelPolicy policy = getPolicy(salaryBand);

        boolean classAllowed =
                policy.getAllowedFlightClass()
                        .equalsIgnoreCase(cabinClass);

        boolean fareAllowed =
                fare.compareTo(policy.getMaxFlightFare()) <= 0;

        boolean allowed = classAllowed && fareAllowed;

        String message;

        if (!classAllowed) {
            message = "Flight class is not permitted for this employee";
        } else if (!fareAllowed) {
            message = "Flight fare exceeds the permitted limit";
        } else {
            message = "Flight complies with travel policy";
        }

        return new PolicyValidationResult(
                allowed,
                message,
                policy.getAllowedFlightClass(),
                policy.getAllowedHotelCategory(),
                policy.getMaxFlightFare(),
                policy.getMaxHotelPricePerNight()
        );
    }

    public PolicyValidationResult validateHotel(
            String salaryBand,
            String category,
            BigDecimal pricePerNight) {

        TravelPolicy policy = getPolicy(salaryBand);

        boolean categoryAllowed =
                policy.getAllowedHotelCategory()
                        .equalsIgnoreCase(category);

        boolean priceAllowed =
                pricePerNight.compareTo(
                        policy.getMaxHotelPricePerNight()
                ) <= 0;

        boolean allowed = categoryAllowed && priceAllowed;

        String message;

        if (!categoryAllowed) {
            message = "Hotel category is not permitted for this employee";
        } else if (!priceAllowed) {
            message = "Hotel price exceeds the permitted limit";
        } else {
            message = "Hotel complies with travel policy";
        }

        return new PolicyValidationResult(
                allowed,
                message,
                policy.getAllowedFlightClass(),
                policy.getAllowedHotelCategory(),
                policy.getMaxFlightFare(),
                policy.getMaxHotelPricePerNight()
        );
    }
}