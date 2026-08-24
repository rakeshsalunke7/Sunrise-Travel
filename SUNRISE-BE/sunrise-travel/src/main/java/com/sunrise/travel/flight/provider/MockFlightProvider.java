package com.sunrise.travel.flight.provider;

import com.sunrise.travel.flight.dto.FlightResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MockFlightProvider {

    private final ObjectMapper objectMapper;

    public List<FlightResponse> getFlights() {

        try {
            return objectMapper.readValue(
                    new ClassPathResource("mock/flights.json").getInputStream(),
                    new TypeReference<List<FlightResponse>>() {}
            );

        } catch (IOException e) {
            throw new RuntimeException(
                    "Unable to load flight data", e
            );
        }
    }
}