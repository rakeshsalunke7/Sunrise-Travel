package com.sunrise.travel.policy.repository;

import com.sunrise.travel.policy.entity.TravelPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TravelPolicyRepository
        extends JpaRepository<TravelPolicy, Long> {

    Optional<TravelPolicy> findBySalaryBandAndActiveTrue(
            String salaryBand
    );
}