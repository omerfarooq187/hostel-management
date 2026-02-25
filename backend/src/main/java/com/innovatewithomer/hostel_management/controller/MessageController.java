package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.dto.MessageRequest;
import com.innovatewithomer.hostel_management.entities.Student;
import com.innovatewithomer.hostel_management.entities.User;
import com.innovatewithomer.hostel_management.repositories.StudentRepository;
import com.innovatewithomer.hostel_management.repositories.UserRepository;
import com.innovatewithomer.hostel_management.services.MailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/messaging")
public class MessageController {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final MailService mailService;

    public MessageController(UserRepository userRepository, StudentRepository studentRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.mailService = mailService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody MessageRequest request) {

        if (request.getUserId() != null) {

            // 1️⃣ Individual
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            mailService.sendMail(
                    user.getEmail(),
                    request.getSubject(),
                    request.getBody()
            );

            return ResponseEntity.ok("Message sent to user");
        }

        if (request.isActiveOnly()) {

            // 2️⃣ Active Students
            List<Student> students = studentRepository.findByActiveTrue();

            for (Student student : students) {
                if (student.getUser() != null) {
                    mailService.sendMail(
                            student.getUser().getEmail(),
                            request.getSubject(),
                            request.getBody()
                    );
                }
            }

            return ResponseEntity.ok("Message sent to active students");
        }

        if (request.isAllStudents()) {

            // 3️⃣ All Students
            List<Student> students = studentRepository.findAll();

            for (Student student : students) {
                if (student.getUser() != null) {
                    mailService.sendMail(
                            student.getUser().getEmail(),
                            request.getSubject(),
                            request.getBody()
                    );
                }
            }

            return ResponseEntity.ok("Message sent to all students");
        }

        return ResponseEntity.badRequest().body("Invalid message target");
    }
}
