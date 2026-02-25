package com.innovatewithomer.hostel_management.dto;

import com.innovatewithomer.hostel_management.entities.ConsumptionExpense;
import com.innovatewithomer.hostel_management.entities.PurchaseExpense;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Getter
public class InventoryReportData {

    private String hostelName;

    private LocalDate start;
    private LocalDate end;

    // Daily detailed data
    private List<ConsumptionExpense> consumption;
    private List<PurchaseExpense> purchases;

    // Overall totals (optional but useful)
    private double totalConsumptionAmount;
    private double totalConsumptionQuantity;
    private double totalPurchaseAmount;
    private double totalPurchaseQuantity;

    // Weekly / Monthly summary (IMPORTANT)
    private List<InventoryItemSummary> itemSummary;
}
