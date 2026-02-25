package com.innovatewithomer.hostel_management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class InventoryItemSummary {

    private String itemName;

    private double purchasedQuantity;
    private double purchaseAmount;

    private double consumedQuantity;
    private double consumptionAmount;
}
