package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.entities.Fee;
import com.innovatewithomer.hostel_management.entities.FeeStatus;
import com.innovatewithomer.hostel_management.entities.Hostel;
import com.innovatewithomer.hostel_management.entities.Student;
import com.innovatewithomer.hostel_management.repositories.FeeRepository;
import com.innovatewithomer.hostel_management.repositories.StudentRepository;
import com.innovatewithomer.hostel_management.services.FeeReceiptPdfService;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/fee")
public class FeeController {
    private final FeeRepository feeRepository;
    private final EntityManager  entityManager;
    private final FeeReceiptPdfService feeReceiptPdfService;

    public FeeController(FeeRepository feeRepository, StudentRepository studentRepository, EntityManager entityManager, FeeReceiptPdfService feeReceiptPdfService) {
        this.feeRepository = feeRepository;
        this.entityManager = entityManager;
        this.feeReceiptPdfService = feeReceiptPdfService;
    }

    @PostMapping
    public Fee save(@RequestBody Fee feeRequest, @RequestParam Long hostelId) {

        Hostel hostel = entityManager.getReference(Hostel.class, hostelId);
        feeRequest.setHostel(hostel);

        Student student = feeRequest.getStudent();
        String month = feeRequest.getMonth();

        // Prevent duplicate fee for same student and month
        boolean exists = feeRepository.existsByStudentAndMonth(student, month);
        if (exists) {
            throw new RuntimeException("Fee already exists for this student for month " + month);
        }

        return feeRepository.save(feeRequest);
    }

    @GetMapping
    public List<Fee> findAllByHostel(@RequestParam Long hostelId) {
        return feeRepository.findByHostel_Id(hostelId);
    }

    @GetMapping("/student/{studentId}")
    public List<Fee> getStudentFees(@PathVariable Long studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    @GetMapping("/status/{status}")
    public List<Fee> getFeeStatus(@PathVariable FeeStatus status) {
        return feeRepository.findByStatus(status);
    }

    @PutMapping("/{feeId}/pay")
    public Fee markAsPaid(@PathVariable Long feeId) {
        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        fee.setStatus(FeeStatus.PAID);
        return feeRepository.save(fee);
    }

    @GetMapping("/student/collection")
    public Double getStudentTotalCollection(@RequestParam Long studentId) {
        return feeRepository.getStudentTotalCollection(studentId);
    }

    @GetMapping("/overdue")
    public List<Fee> getOverdueFees() {
        return feeRepository.findOverdueFees();
    }

    @GetMapping("/total/unpaid")
    public Double getTotalUnpaidAmount(@RequestParam Long hostelId) {
        return feeRepository.getTotalUnpaidAmount(hostelId);
    }

    @DeleteMapping("/{feeId}")
    public void deleteFee(@PathVariable Long feeId) {
        feeRepository.deleteById(feeId);
    }

    @GetMapping("/{feeId}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long feeId) {

        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        byte[] pdf = feeReceiptPdfService.generateFeeReceipt(fee);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=fee-receipt-" + feeId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/total/collection")
    public Double getTotalFeeCollectedByHostel(@RequestParam Long hostelId) {
        return feeRepository.getTotalCollectedByHostel(hostelId);
    }

}
