// dto/StudentResponse.java
package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentResponse {
    private Long id;
    private String rollNo;
    private String phone;
    private String guardianName;
    private String guardianPhone;
    private AllocationInfo allocation; // optional
}
