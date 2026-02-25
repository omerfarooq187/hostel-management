package com.innovatewithomer.hostel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OtherExpenseRequest {
    private String title;
    private String category;
    private double amount;
    private String remarks;
}

