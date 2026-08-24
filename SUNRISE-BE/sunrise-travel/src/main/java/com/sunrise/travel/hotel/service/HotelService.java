package com.sunrise.travel.hotel.service;

import com.sunrise.travel.hotel.dto.HotelResponse;
import com.sunrise.travel.hotel.dto.HotelSearchRequest;
import com.sunrise.travel.hotel.provider.MockHotelProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final MockHotelProvider hotelProvider;

    public List<HotelResponse> searchHotels(
            HotelSearchRequest request) {

        return hotelProvider.getHotels()
                .stream()
                .filter(hotel ->
                        hotel.city()
                                .equalsIgnoreCase(request.city()))
                .filter(hotel ->
                        hotel.availableRooms() >= request.guests())
                .toList();
    }
}
