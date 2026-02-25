package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class KitchenInventoryRequest {
    private String itemName;
    private String unit;
    private int quantity;
}
