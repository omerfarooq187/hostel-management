package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.PasswordResetToken;
import com.innovatewithomer.hostel_management.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);
}
