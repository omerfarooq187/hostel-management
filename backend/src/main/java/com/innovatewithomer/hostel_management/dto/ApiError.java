package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApiError {
    private String message;
    private LocalDateTime timestamp;
}
