package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentRequest {
    private String name;
    private String cnic;
    private String phone;
    private String guardianName;
    private String guardianPhoneNumber;
}
