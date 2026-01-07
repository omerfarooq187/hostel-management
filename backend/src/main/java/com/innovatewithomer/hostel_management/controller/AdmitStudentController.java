package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.dto.StudentRequest;
import com.innovatewithomer.hostel_management.entities.Student;
import com.innovatewithomer.hostel_management.entities.User;
import com.innovatewithomer.hostel_management.repositories.StudentRepository;
import com.innovatewithomer.hostel_management.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
public class AdmitStudentController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public AdmitStudentController(UserRepository userRepository, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/{userId}")
    public Student admitStudent(
            @PathVariable Long userId,
            @RequestBody StudentRequest request
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User not found"));

        if (studentRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Student profile already exists");
        }

        Student student = new Student();
        student.setUser(user);
        student.setRollNo(request.getRollNo());
        student.setPhone(request.getPhoneNumber());
        student.setGuardianName(request.getGuardianName());
        student.setGuardianPhone(request.getGuardianPhoneNumber());

        return studentRepository.save(student);
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
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
        student.setPhone(request.getPhoneNumber());
        student.setGuardianName(request.getGuardianName());
        student.setGuardianPhone(request.getGuardianPhoneNumber());

        return studentRepository.save(student);
    }

    @DeleteMapping("/{studentId}")
    public String deleteStudent(@PathVariable Long studentId) {
        studentRepository.deleteById(studentId);
        return "Student profile deleted Successfully";
    }

}
