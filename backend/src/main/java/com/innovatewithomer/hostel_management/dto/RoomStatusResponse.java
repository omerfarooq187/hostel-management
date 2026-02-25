package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomStatusResponse {
    private Long roomId;
    private String block;
    private String roomNumber;
    private int capacity;
    private int occupiedBeds;
    private int availableBeds;
}
