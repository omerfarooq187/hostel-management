package com.innovatewithomer.hostel_management.dto;

import com.innovatewithomer.hostel_management.entities.Hostel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentProfileResponse {
    private Long studentId;
    private String name;
    private String email;
    private String phone;
    private Hostel hostel;
    private StudentRequest studentRequest;
}
