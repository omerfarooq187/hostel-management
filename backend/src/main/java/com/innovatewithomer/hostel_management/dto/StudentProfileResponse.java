package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentProfileResponse {
    private Long studentId;
    private String name;
    private String email;
    private String phone;
    private StudentRequest studentRequest;
}
