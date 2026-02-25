package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SalaryRequest {

    private double amount;
    private LocalDate month;      // 2026-02-01
    private LocalDate paidDate;
    private String remarks;
}
