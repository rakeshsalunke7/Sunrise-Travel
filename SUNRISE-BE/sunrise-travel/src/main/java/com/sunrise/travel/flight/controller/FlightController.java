package com.sunrise.travel.flight.controller;

import com.sunrise.travel.flight.dto.FlightResponse;
import com.sunrise.travel.flight.dto.FlightSearchRequest;
import com.sunrise.travel.flight.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @PostMapping("/search")
    public ResponseEntity<List<FlightResponse>> searchFlights(
            @Valid @RequestBody FlightSearchRequest request) {

        return ResponseEntity.ok(
                flightService.searchFlights(request)
        );
    }
}