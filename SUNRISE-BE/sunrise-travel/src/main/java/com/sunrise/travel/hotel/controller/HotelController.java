package com.sunrise.travel.hotel.controller;

import com.sunrise.travel.hotel.dto.HotelResponse;
import com.sunrise.travel.hotel.dto.HotelSearchRequest;
import com.sunrise.travel.hotel.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @PostMapping("/search")
    public ResponseEntity<List<HotelResponse>> searchHotels(
            @Valid @RequestBody HotelSearchRequest request) {

        return ResponseEntity.ok(
                hotelService.searchHotels(request)
        );
    }
}