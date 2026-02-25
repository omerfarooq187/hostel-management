package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AdmitStaffRequest {

    private Long hostelId;
    private String designation;
    private String phone;
    private LocalDate joiningDate;
}
