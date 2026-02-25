package com.innovatewithomer.hostel_management.dto;

import com.innovatewithomer.hostel_management.entities.Allocation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BedStatusDto {
    private int bedNumber;
    private boolean occupied;
    private Allocation allocation;
}
