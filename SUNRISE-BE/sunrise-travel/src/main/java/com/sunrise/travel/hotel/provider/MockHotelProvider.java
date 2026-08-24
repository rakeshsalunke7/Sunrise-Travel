package com.sunrise.travel.hotel.provider;

import com.sunrise.travel.hotel.dto.HotelResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MockHotelProvider {

    private final ObjectMapper objectMapper;

    public List<HotelResponse> getHotels() {

        try {
            return objectMapper.readValue(
                    new ClassPathResource("mock/hotels.json")
                            .getInputStream(),
                    new TypeReference<List<HotelResponse>>() {}
            );

        } catch (IOException e) {
            throw new RuntimeException(
                    "Unable to load hotel data", e
            );
        }
    }
}