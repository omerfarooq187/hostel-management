package com.innovatewithomer.hostel_management.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String email, String token) {

        String link =
                "http://192.168.0.50:5173/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Welcome to Officers Hostel, verify your email");

        message.setText(
                "Welcome to Officers Hostel Management System.\n\n" +
                        "Your account has been created successfully.\n\n" +
                        "Please verify your email by clicking the link below:\n\n" +
                        link + "\n\n" +
                        "This link will expire in 24 hours.\n\n" +
                        "If you did not create this account, you can ignore this email.\n\n" +
                        "Regards,\n" +
                        "Officers Hostel Administration"
        );

        mailSender.send(message);
    }


    public void sendPasswordResetEmail(String email, String token) {

        String link =
                "http://192.168.0.50:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Officers Hostel, password reset request");

        message.setText(
                "We received a request to reset your password.\n\n" +
                        "You can reset your password by clicking the link below:\n\n" +
                        link + "\n\n" +
                        "This link will expire in 30 minutes.\n\n" +
                        "If you did not request a password reset, please ignore this email.\n\n" +
                        "Regards,\n" +
                        "Officers Hostel Administration"
        );

        mailSender.send(message);
    }

    public void sendWelcomeMessage(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Officers Group of hostel");
        message.setText("Welcome to Mandra hostel i hope you enjoy\n\n."+"Regards,\n" +
                "Officers Hostel Administration");
    }
    @Async
    public void sendMail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
