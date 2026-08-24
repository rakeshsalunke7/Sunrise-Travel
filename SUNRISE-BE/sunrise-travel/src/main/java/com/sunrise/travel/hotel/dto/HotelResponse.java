package com.sunrise.travel.hotel.dto;

import java.math.BigDecimal;

public record HotelResponse(

        String hotelId,
        String hotelName,
        String city,
        String category,
        String address,
        String roomType,
        BigDecimal pricePerNight,
        int availableRooms,
        String amenities
) {
}
