package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomStudentResponse {
    private Long studentId;
    private String name;
    private int bedNumber;
}
