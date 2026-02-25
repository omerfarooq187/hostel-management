package com.innovatewithomer.hostel_management.repositories;

import com.innovatewithomer.hostel_management.entities.EmailVerificationToken;
import com.innovatewithomer.hostel_management.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationTokenRepository
        extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByToken(String token);

    Optional<EmailVerificationToken> findByUser(User user);

    void deleteByUser(User user);
}
