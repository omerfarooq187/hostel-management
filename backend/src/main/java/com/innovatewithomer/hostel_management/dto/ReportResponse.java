package com.innovatewithomer.hostel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ReportResponse {
    private long totalStudents;
    private long totalStaff;

    private double totalFeeCollected;
    private double totalInventoryExpense;
    private double totalSalaryExpense;

    private double totalExpense;
    private double netProfit;
    private double expensePerHead;
    private double otherExpense;
}
