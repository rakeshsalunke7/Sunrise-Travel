package com.sunrise.travel.auth.service;

import com.sunrise.travel.auth.dto.AuthResponse;
import com.sunrise.travel.auth.dto.LoginRequest;
import com.sunrise.travel.auth.dto.RegisterRequest;
import com.sunrise.travel.auth.security.JwtService;
import com.sunrise.travel.user.entity.Role;
import com.sunrise.travel.user.entity.User;
import com.sunrise.travel.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already registered");
        }

        String salaryBand = getSalaryBand(request.designation());

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .designation(request.designation())
                .salaryBand(salaryBand)
                .role(Role.EMPLOYEE)
                .active(true)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getRole().name(),
                "Registration successful"
        );
    }

    private String getSalaryBand(String designation) {

        return switch (designation.trim().toUpperCase()) {

            case "JUNIOR EXECUTIVE" -> "B1";

            case "EXECUTIVE" -> "B2";

            case "SENIOR EXECUTIVE" -> "B3";

            default -> throw new RuntimeException(
                    "Invalid designation. Allowed designations: "
                            + "Junior Executive, Executive, Senior Executive"
            );
        };
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getRole().name(),
                "Login successful"
        );
    }
}