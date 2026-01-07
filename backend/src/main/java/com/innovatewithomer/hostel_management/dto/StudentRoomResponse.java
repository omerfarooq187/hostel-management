package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class StudentRoomResponse {
    private String block;
    private String roomNumber;
    private int bedNumber;
    private LocalDateTime allocatedAt;
}
