package com.innovatewithomer.hostel_management.dto;

import com.innovatewithomer.hostel_management.entities.FeeStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentFeeResponse {
    private Long id;
    private double amount;
    private FeeStatus status;
}

