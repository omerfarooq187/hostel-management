package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.config.UserPrincipal;
import com.innovatewithomer.hostel_management.dto.StudentRequest;
import com.innovatewithomer.hostel_management.entities.Hostel;
import com.innovatewithomer.hostel_management.entities.Student;
import com.innovatewithomer.hostel_management.entities.User;
import com.innovatewithomer.hostel_management.repositories.StudentRepository;
import com.innovatewithomer.hostel_management.repositories.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/students")
public class AdmitStudentController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final EntityManager entityManager;

    public AdmitStudentController(UserRepository userRepository, StudentRepository studentRepository, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.entityManager = entityManager;
    }

    @PostMapping("/{userId}")
    public Student admitStudent(
            @PathVariable Long userId,
            @RequestBody StudentRequest request,
            @RequestParam Long hostelId
            ) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User not found"));

        if (studentRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Student profile already exists");
        }

        Hostel hostel = getHostel(hostelId);
        Student student = new Student();
        student.setUser(user);
        student.setRollNo(request.getRollNo());
        student.setPhone(request.getPhone());
        student.setGuardianName(request.getGuardianName());
        student.setGuardianPhone(request.getGuardianPhoneNumber());
        student.setHostel(hostel);

        return studentRepository.save(student);
    }

    @GetMapping
    public List<Student> getAllStudents(@RequestParam Long hostelId) {
        return studentRepository.findAllByHostel_Id(hostelId);
    }

    @GetMapping("/{studentId}")
    public Student getStudent(@PathVariable Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(()-> new RuntimeException("Student not found"));
    }

    @PutMapping("/{studentId}")
    public Student updateStudent(
            @PathVariable Long studentId,
            @RequestBody StudentRequest request
    ) {
        Student student = getStudent(studentId);

        student.setRollNo(request.getRollNo());
        student.setPhone(request.getPhone());
        student.setGuardianName(request.getGuardianName());
        student.setGuardianPhone(request.getGuardianPhoneNumber());

        return studentRepository.save(student);
    }

    @DeleteMapping("/{studentId}")
    public String deleteStudent(@PathVariable Long studentId) {
        studentRepository.deleteById(studentId);
        return "Student profile deleted Successfully";
    }

    private Hostel getHostel(Long hostelId) {
        return entityManager.getReference(Hostel.class, hostelId);
    }
}
