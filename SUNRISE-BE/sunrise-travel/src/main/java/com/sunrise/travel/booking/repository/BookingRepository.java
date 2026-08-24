package com.sunrise.travel.booking.repository;

import com.sunrise.travel.booking.entity.Booking;
import com.sunrise.travel.booking.entity.BookingStatus;
import com.sunrise.travel.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByUserAndStatus(
            User user,
            BookingStatus status
    );
}