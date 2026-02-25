package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.dto.OtherExpenseRequest;
import com.innovatewithomer.hostel_management.entities.Hostel;
import com.innovatewithomer.hostel_management.entities.OtherExpense;
import com.innovatewithomer.hostel_management.repositories.OtherExpenseRepository;
import jakarta.persistence.EntityManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/other-expenses")
public class OtherExpenseController {

    private final OtherExpenseRepository otherExpenseRepository;
    private final EntityManager entityManager;

    public OtherExpenseController(
            OtherExpenseRepository otherExpenseRepository,
            EntityManager entityManager
    ) {
        this.otherExpenseRepository = otherExpenseRepository;
        this.entityManager = entityManager;
    }

    @PostMapping
    public ResponseEntity<String> addExpense(
            @RequestParam Long hostelId,
            @RequestBody OtherExpenseRequest request
    ) {
        Hostel hostel = entityManager.getReference(Hostel.class, hostelId);

        OtherExpense expense = new OtherExpense();
        expense.setTitle(request.getTitle());
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setDate(LocalDate.now());
        expense.setTime(LocalTime.now());
        expense.setRemarks(request.getRemarks());
        expense.setHostel(hostel);

        otherExpenseRepository.save(expense);
        return ResponseEntity.ok("Expense recorded successfully");
    }

    @GetMapping("/daily")
    public ResponseEntity<Double> dailyExpense(
            @RequestParam Long hostelId,
            @RequestParam String date
    ) {
        double total = otherExpenseRepository
                .sumTotalAmountByDate(hostelId, LocalDate.parse(date))
                .orElse(0.0);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/range")
    public ResponseEntity<List<OtherExpense>> expenseInRange(
            @RequestParam Long hostelId,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        List<OtherExpense> expenses = otherExpenseRepository
                .findByHostel_IdAndDateBetween(hostelId,
                        LocalDate.parse(startDate),
                        LocalDate.parse(endDate));
        return ResponseEntity.ok(expenses);
    }
}

