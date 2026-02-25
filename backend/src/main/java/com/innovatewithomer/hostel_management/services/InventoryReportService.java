package com.innovatewithomer.hostel_management.services;

import com.innovatewithomer.hostel_management.dto.InventoryItemSummary;
import com.innovatewithomer.hostel_management.dto.InventoryReportData;
import com.innovatewithomer.hostel_management.entities.ConsumptionExpense;
import com.innovatewithomer.hostel_management.entities.PurchaseExpense;
import com.innovatewithomer.hostel_management.repositories.ConsumptionExpenseRepository;
import com.innovatewithomer.hostel_management.repositories.PurchaseExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class InventoryReportService {

    private final ConsumptionExpenseRepository consumptionRepo;
    private final PurchaseExpenseRepository purchaseRepo;

    public InventoryReportService(
            ConsumptionExpenseRepository consumptionRepo,
            PurchaseExpenseRepository purchaseRepo
    ) {
        this.consumptionRepo = consumptionRepo;
        this.purchaseRepo = purchaseRepo;
    }

    public InventoryReportData generate(
            Long hostelId,
            LocalDate start,
            LocalDate end,
            String hostelName
    ) {

        List<ConsumptionExpense> consumption =
                consumptionRepo.findByDateRange(start, end, hostelId);

        List<PurchaseExpense> purchases =
                purchaseRepo.findByDateRange(start, end, hostelId);

        double totalConsumptionAmount =
                consumption.stream().mapToDouble(ConsumptionExpense::getTotalCost).sum();

        double totalConsumptionQuantity =
                consumption.stream().mapToDouble(ConsumptionExpense::getQuantity).sum();

        double totalPurchaseAmount =
                purchases.stream().mapToDouble(PurchaseExpense::getTotalCost).sum();

        double totalPurchaseQuantity =
                purchases.stream().mapToDouble(PurchaseExpense::getQuantity).sum();

        // ================= ITEM WISE SUMMARY =================

        Map<String, InventoryItemSummary> summaryMap = new LinkedHashMap<>();

        // Purchases summary
        for (PurchaseExpense p : purchases) {
            String item = p.getInventory().getItemName();

            summaryMap.putIfAbsent(
                    item,
                    new InventoryItemSummary(item, 0, 0, 0, 0)
            );

            summaryMap.compute(
                    item,
                    (k, s) -> new InventoryItemSummary(
                            item,
                            s.getPurchasedQuantity() + p.getQuantity(),
                            s.getPurchaseAmount() + p.getTotalCost(),
                            s.getConsumedQuantity(),
                            s.getConsumptionAmount()
                    )
            );
        }

        // Consumption summary
        for (ConsumptionExpense c : consumption) {
            String item = c.getInventory().getItemName();

            summaryMap.putIfAbsent(
                    item,
                    new InventoryItemSummary(item, 0, 0, 0, 0)
            );

            summaryMap.compute(
                    item,
                    (k, s) -> new InventoryItemSummary(
                            item,
                            s.getPurchasedQuantity(),
                            s.getPurchaseAmount(),
                            s.getConsumedQuantity() + c.getQuantity(),
                            s.getConsumptionAmount() + c.getTotalCost()
                    )
            );
        }

        List<InventoryItemSummary> itemSummary =
                new ArrayList<>(summaryMap.values());

        return new InventoryReportData(
                hostelName,
                start,
                end,
                consumption,
                purchases,
                totalConsumptionAmount,
                totalConsumptionQuantity,
                totalPurchaseAmount,
                totalPurchaseQuantity,
                itemSummary
        );
    }
}


