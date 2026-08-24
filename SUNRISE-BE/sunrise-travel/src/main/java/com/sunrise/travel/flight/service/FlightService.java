package com.sunrise.travel.flight.service;

import com.sunrise.travel.flight.dto.FlightResponse;
import com.sunrise.travel.flight.dto.FlightSearchRequest;
import com.sunrise.travel.flight.provider.MockFlightProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final MockFlightProvider flightProvider;

    public List<FlightResponse> searchFlights(
            FlightSearchRequest request) {

        return flightProvider.getFlights()
                .stream()
                .filter(flight ->
                        flight.origin().equalsIgnoreCase(request.origin()))
                .filter(flight ->
                        flight.destination()
                                .equalsIgnoreCase(request.destination()))
                .filter(flight ->
                        flight.departureDate()
                                .equals(request.departureDate()))
                .filter(flight ->
                        flight.cabinClass()
                                .equalsIgnoreCase(request.cabinClass()))
                .filter(flight ->
                        flight.availableSeats() >= request.passengers())
                .toList();
    }
}
