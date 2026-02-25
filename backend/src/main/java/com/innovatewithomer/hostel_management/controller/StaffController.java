package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.dto.AdmitStaffRequest;
import com.innovatewithomer.hostel_management.dto.SalaryRequest;
import com.innovatewithomer.hostel_management.entities.*;
import com.innovatewithomer.hostel_management.repositories.HostelRepository;
import com.innovatewithomer.hostel_management.repositories.SalaryRepository;
import com.innovatewithomer.hostel_management.repositories.StaffRepository;
import com.innovatewithomer.hostel_management.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
public class StaffController {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final HostelRepository hostelRepository;
    private final SalaryRepository salaryRepository;

    // -----------------------------
    // 1️⃣ Promote User to Staff
    // -----------------------------
    @PostMapping("/{userId}/make-staff")
    public ResponseEntity<String> makeStaff(
            @PathVariable Long userId,
            @RequestBody AdmitStaffRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin cannot be converted to staff");
        }

        if (staffRepository.findByUser_Id(userId).isPresent()) {
            throw new RuntimeException("User is already staff");
        }

        if (request.getJoiningDate() == null ||
                request.getJoiningDate().isAfter(LocalDate.now())) {
            throw new RuntimeException("Invalid joining date");
        }

        Hostel hostel = hostelRepository.findById(request.getHostelId())
                .orElseThrow(() -> new RuntimeException("Hostel not found"));

        user.setRole(Role.STAFF);
        user.setHostel(hostel);
        user.setActive(true);

        Staff staff = new Staff();
        staff.setUser(user);
        staff.setHostel(hostel);
        staff.setDesignation(request.getDesignation());
        staff.setPhone(request.getPhone());
        staff.setJoiningDate(request.getJoiningDate());

        userRepository.save(user);
        staffRepository.save(staff);

        return ResponseEntity.ok("User promoted to staff successfully");
    }

    // -----------------------------
    // 2️⃣ Get All Staff
    // -----------------------------
    @GetMapping
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // -----------------------------
    // 3️⃣ Remove Staff
    // -----------------------------
    @DeleteMapping("/{staffId}")
    public ResponseEntity<String> removeStaff(@PathVariable Long staffId) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        User user = staff.getUser();
        user.setActive(false);
        user.setRole(Role.STUDENT); // optional fallback

        staffRepository.delete(staff);
        userRepository.save(user);

        return ResponseEntity.ok("Staff removed successfully");
    }

    // ====================================================
    //                SALARY SECTION
    // ====================================================

    // 4️⃣ Add Salary for Staff
    @PostMapping("/{staffId}/salary")
    public ResponseEntity<String> addSalary(
            @PathVariable Long staffId,
            @RequestBody SalaryRequest request
    ) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (request.getAmount() <= 0) {
            throw new RuntimeException("Invalid salary amount");
        }

        Salary salary = new Salary();
        salary.setStaff(staff);
        salary.setAmount(request.getAmount());
        salary.setMonth(request.getMonth()); // first day of month
        salary.setPaidDate(request.getPaidDate());
        salary.setRemarks(request.getRemarks());

        salaryRepository.save(salary);

        return ResponseEntity.ok("Salary added successfully");
    }

    // 5️⃣ Get Salary History of a Staff
    @GetMapping("/{staffId}/salary")
    public List<Salary> getSalaryHistory(@PathVariable Long staffId) {

        return salaryRepository.findByStaff_Id(staffId);
    }

    // 6️⃣ Delete Salary Entry
    @DeleteMapping("/salary/{salaryId}")
    public ResponseEntity<String> deleteSalary(@PathVariable Long salaryId) {

        Salary salary = salaryRepository.findById(salaryId)
                .orElseThrow(() -> new RuntimeException("Salary not found"));

        salaryRepository.delete(salary);

        return ResponseEntity.ok("Salary deleted successfully");
    }
}
