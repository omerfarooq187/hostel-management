package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.dto.ReportResponse;
import com.innovatewithomer.hostel_management.repositories.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportsController {
    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;
    private final FeeRepository feeRepository;
    private final PurchaseExpenseRepository  purchaseExpenseRepository;
    private final SalaryRepository salaryRepository;
    private final OtherExpenseRepository otherExpenseRepository;

    public ReportsController(StudentRepository studentRepository, StaffRepository staffRepository, FeeRepository feeRepository, PurchaseExpenseRepository purchaseExpenseRepository, SalaryRepository salaryRepository, OtherExpenseRepository otherExpenseRepository) {
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
        this.feeRepository = feeRepository;
        this.purchaseExpenseRepository = purchaseExpenseRepository;
        this.salaryRepository = salaryRepository;
        this.otherExpenseRepository = otherExpenseRepository;
    }

    @GetMapping
    public ReportResponse getReports(
            @RequestParam Long hostelId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {

        YearMonth yearMonth;

        if (year == null || month == null) {
            yearMonth = YearMonth.now();
        } else {
            yearMonth = YearMonth.of(year, month);
        }

        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        long students = studentRepository.countByHostel(hostelId);
        long staff = staffRepository.countByHostel(hostelId);

        double totalFeeCollected =
                feeRepository.getTotalCollectedByHostelAndDateRange(hostelId, startDate, endDate);

        double inventory =
                purchaseExpenseRepository.totalInventoryExpenseByDateRange(hostelId, startDate, endDate);

        LocalDate monthDate = yearMonth.atDay(1);
        double salary =
                salaryRepository.totalSalaryExpenseByMonth(hostelId, monthDate);

        double otherExpense = otherExpenseRepository.sumTotalAmountByDateRange(hostelId, startDate, endDate);

        double totalExpense = inventory + salary + otherExpense;
        double netProfit = totalFeeCollected - totalExpense;

        double expensePerHead = 0;

        if (students > 0) {
            expensePerHead = inventory / students;
        }

        return new ReportResponse(
                students,
                staff,
                totalFeeCollected,
                inventory,
                salary,
                totalExpense,
                netProfit,
                expensePerHead,
                otherExpense
        );
    }

}
