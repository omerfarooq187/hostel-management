package com.innovatewithomer.hostel_management.dto;

import com.innovatewithomer.hostel_management.entities.Hostel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String role;
    private Hostel hostel;
}
