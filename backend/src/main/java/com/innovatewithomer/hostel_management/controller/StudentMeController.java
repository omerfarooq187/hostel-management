package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.config.AuthUtil;
import com.innovatewithomer.hostel_management.dto.StudentFeeResponse;
import com.innovatewithomer.hostel_management.dto.StudentProfileResponse;
import com.innovatewithomer.hostel_management.dto.StudentRequest;
import com.innovatewithomer.hostel_management.dto.StudentRoomResponse;
import com.innovatewithomer.hostel_management.entities.Allocation;
import com.innovatewithomer.hostel_management.entities.Fee;
import com.innovatewithomer.hostel_management.entities.Student;
import com.innovatewithomer.hostel_management.repositories.AllocationRepository;
import com.innovatewithomer.hostel_management.repositories.FeeRepository;
import com.innovatewithomer.hostel_management.repositories.StudentRepository;
import com.innovatewithomer.hostel_management.services.FeeReceiptPdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student/me")
public class StudentMeController {
    private final StudentRepository studentRepository;
    private final AllocationRepository allocationRepository;
    private final FeeRepository feeRepository;
    private final AuthUtil authUtil;
    private FeeReceiptPdfService  feeReceiptPdfService;

    public StudentMeController(StudentRepository studentRepository, AllocationRepository allocationRepository, FeeRepository feeRepository, AuthUtil authUtil, FeeReceiptPdfService feeReceiptPdfService) {
        this.studentRepository = studentRepository;
        this.allocationRepository = allocationRepository;
        this.feeRepository = feeRepository;
        this.authUtil = authUtil;
        this.feeReceiptPdfService = feeReceiptPdfService;
    }

    @GetMapping
    public StudentProfileResponse getStudentProfile() {
        String email = authUtil.getEmail();

        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student with email " + email + " not found"));

        StudentRequest studentRequest = new StudentRequest();
        studentRequest.setRollNo(student.getRollNo());
        studentRequest.setPhone(student.getPhone());
        studentRequest.setGuardianName(student.getGuardianName());
        studentRequest.setGuardianPhoneNumber(student.getGuardianPhone());

        StudentProfileResponse response = new StudentProfileResponse();
        response.setStudentId(student.getId());
        response.setName(student.getUser().getName());
        response.setEmail(student.getUser().getEmail());
        response.setStudentRequest(studentRequest);

        return response;
    }

    @GetMapping("/room")
    public StudentRoomResponse getMyRoom() {
        String email = authUtil.getEmail();
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student with email " + email + " not found"));

        Allocation alloc = allocationRepository.findByStudentId(student.getId())
                .orElseThrow(() -> new RuntimeException("No active allocation"));

        StudentRoomResponse response = new StudentRoomResponse();
        response.setBlock(alloc.getRoom().getBlock());
        response.setRoomNumber(alloc.getRoom().getRoomNumber());
        response.setBedNumber(alloc.getBedNumber());
        response.setAllocatedAt(alloc.getAllocatedAt());

        return response;
    }

    @GetMapping("/fees")
    public List<StudentFeeResponse> getMyFeeHistory() {

        String email = authUtil.getEmail();

        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return feeRepository.findAllByStudentId(student.getId())
                .stream()
                .map(fee -> {
                    StudentFeeResponse dto = new StudentFeeResponse();
                    dto.setId(fee.getId());
                    dto.setAmount(fee.getAmount());
                    dto.setStatus(fee.getStatus());
                    return dto;
                })
                .toList();
    }

    @GetMapping("/fees/{feeId}/receipt")
    public ResponseEntity<byte[]> downloadMyFeeReceipt(@PathVariable Long feeId) {

        String email = authUtil.getEmail();

        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Fee fee = feeRepository.findByIdAndStudentId(feeId, student.getId())
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        byte[] pdf = feeReceiptPdfService.generateFeeReceipt(fee);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=fee-receipt-" + feeId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

}
