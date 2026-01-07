package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.config.AuthUtil;
import com.innovatewithomer.hostel_management.dto.StudentProfileResponse;
import com.innovatewithomer.hostel_management.dto.StudentRequest;
import com.innovatewithomer.hostel_management.dto.StudentRoomResponse;
import com.innovatewithomer.hostel_management.entities.Allocation;
import com.innovatewithomer.hostel_management.entities.Student;
import com.innovatewithomer.hostel_management.repositories.AllocationRepository;
import com.innovatewithomer.hostel_management.repositories.StudentRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/me")
public class StudentMeController {
    private final StudentRepository studentRepository;
    private final AllocationRepository allocationRepository;
    private final AuthUtil authUtil;

    public StudentMeController(StudentRepository studentRepository, AllocationRepository allocationRepository, AuthUtil authUtil) {
        this.studentRepository = studentRepository;
        this.allocationRepository = allocationRepository;
        this.authUtil = authUtil;
    }

    @GetMapping
    public StudentProfileResponse getStudentProfile() {
        String email = authUtil.getEmail();
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student with email " + email + " not found"));

        StudentProfileResponse response = new StudentProfileResponse();
        response.setStudentId(student.getId());
        response.setName(student.getUser().getName());
        response.setEmail(student.getUser().getEmail());

        return response;
    }

    @GetMapping("/room")
    public StudentRoomResponse getMyRoom() {
        String email = authUtil.getEmail();
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student with email " + email + " not found"));

        Allocation alloc = allocationRepository.findByStudentIdAndActiveTrue(student.getId())
                .orElseThrow(() -> new RuntimeException("No active allocation"));

        StudentRoomResponse response = new StudentRoomResponse();
        response.setBlock(alloc.getRoom().getBlock());
        response.setRoomNumber(alloc.getRoom().getRoomNumber());
        response.setBedNumber(alloc.getBedNumber());
        response.setAllocatedAt(alloc.getAllocatedAt());

        return response;
    }

}
