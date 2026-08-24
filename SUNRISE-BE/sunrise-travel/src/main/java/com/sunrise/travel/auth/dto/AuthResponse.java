package com.sunrise.travel.auth.dto;

public record AuthResponse(
        String token,
        String role,
        String message
) {}
