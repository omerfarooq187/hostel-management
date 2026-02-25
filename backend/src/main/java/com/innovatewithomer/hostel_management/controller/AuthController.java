package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.config.UserPrincipal;
import com.innovatewithomer.hostel_management.dto.*;
import com.innovatewithomer.hostel_management.entities.*;
import com.innovatewithomer.hostel_management.repositories.EmailVerificationTokenRepository;
import com.innovatewithomer.hostel_management.repositories.PasswordResetTokenRepository;
import com.innovatewithomer.hostel_management.repositories.UserRepository;
import com.innovatewithomer.hostel_management.security.JwtUtil;
import com.innovatewithomer.hostel_management.services.MailService;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final MailService mailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            UserRepository userRepository, PasswordEncoder passwordEncoder, EntityManager entityManager, EmailVerificationTokenRepository emailVerificationTokenRepository, MailService mailService, MailSender mailSender, PasswordResetTokenRepository passwordResetTokenRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.mailService = mailService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()->new RuntimeException("User not found"));
        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is disabled");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        Hostel hostel = null;
        if (user.getRole() == Role.STAFF) {
            hostel = user.getHostel();
        }

        return new LoginResponse(token, user.getRole().name(), hostel);
    }

    @PostMapping("/signup")
    public SignupResponse signup(@RequestBody SignupRequest signupRequest) {

        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole(Role.STUDENT);
        user.setActive(true);                 // admin control
        user.setEmailVerified(false);         // email control

        userRepository.save(user);

        String token = UUID.randomUUID().toString();

        EmailVerificationToken verificationToken =
                new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiresAt(
                LocalDateTime.now().plusHours(24)
        );

        emailVerificationTokenRepository.save(verificationToken);

        mailService.sendVerificationEmail(
                user.getEmail(),
                token
        );

        return new SignupResponse(
                "Account created. Please verify your email"
        );
    }

    @GetMapping("/verify-email/{token}")
    public ResponseEntity<?> verifyEmail(@PathVariable String token) {

        EmailVerificationToken verificationToken =
                emailVerificationTokenRepository.findByToken(token)
                        .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Verification token expired")
            );
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        emailVerificationTokenRepository.delete(verificationToken);

        // Return JSON with email
        Map<String, String> response = new HashMap<>();
        response.put("message", "Email verified successfully");
        response.put("email", user.getEmail());

        mailService.sendWelcomeMessage(user.getEmail());

        return ResponseEntity.ok(response);
    }

    // Also update resend-verification to return JSON
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(
            @RequestBody ResendVerificationRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Email already verified")
            );
        }

        // delete old token if exists
        emailVerificationTokenRepository.findByUser(user)
                .ifPresent(emailVerificationTokenRepository::delete);

        String token = UUID.randomUUID().toString();

        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiresAt(LocalDateTime.now().plusHours(24));

        emailVerificationTokenRepository.save(verificationToken);

        mailService.sendVerificationEmail(user.getEmail(), token);

        return ResponseEntity.ok(
                Map.of("message", "Verification email resent")
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // delete old reset token if exists
        passwordResetTokenRepository.findByUser(user)
                .ifPresent(passwordResetTokenRepository::delete);

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token.trim());
        resetToken.setUser(user);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));

        passwordResetTokenRepository.save(resetToken);

        mailService.sendPasswordResetEmail(user.getEmail(), token);

        return ResponseEntity.ok(
                Map.of("message", "Password reset email sent")
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        log.info("Reset password request: {}", request);
        log.info(request.getToken());
        log.info(request.getToken());log.info(request.getToken());
        log.info(request.getToken());
        log.info(request.getToken());
        log.info(request.getToken());
        log.info(request.getToken());


        PasswordResetToken resetToken =
                passwordResetTokenRepository.findByToken(request.getToken())
                        .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Reset token expired")
            );
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(
                Map.of("message", "Password reset successful")
        );
    }
}
