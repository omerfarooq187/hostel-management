package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.config.UserPrincipal;
import com.innovatewithomer.hostel_management.dto.LoginRequest;
import com.innovatewithomer.hostel_management.dto.LoginResponse;
import com.innovatewithomer.hostel_management.dto.SignupRequest;
import com.innovatewithomer.hostel_management.dto.SignupResponse;
import com.innovatewithomer.hostel_management.entities.EmailVerificationToken;
import com.innovatewithomer.hostel_management.entities.Role;
import com.innovatewithomer.hostel_management.entities.User;
import com.innovatewithomer.hostel_management.repositories.EmailVerificationTokenRepository;
import com.innovatewithomer.hostel_management.repositories.UserRepository;
import com.innovatewithomer.hostel_management.security.JwtUtil;
import com.innovatewithomer.hostel_management.services.MailService;
import jakarta.persistence.EntityManager;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final MailService mailService;
    private final MailSender mailSender;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            UserRepository userRepository, PasswordEncoder passwordEncoder, EntityManager entityManager, EmailVerificationTokenRepository emailVerificationTokenRepository, MailService mailService, MailSender mailSender
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.mailService = mailService;
        this.mailSender = mailSender;
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

        if (!user.isActive()) {
            throw new RuntimeException("Account is disabled");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(token, user.getRole().name());
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

    @GetMapping("/test-mail")
    public String testMail() {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("masoodwajhia@gmail.com");
        msg.setSubject("Love Mail");
        msg.setText("Wajiha meri jaan I love you so much");
        mailSender.send(msg);
        return "Mail sent";
    }


}
