package com.innovatewithomer.hostel_management.controller;

import com.innovatewithomer.hostel_management.dto.InventoryReportData;
import com.innovatewithomer.hostel_management.dto.KitchenInventoryDto;
import com.innovatewithomer.hostel_management.dto.KitchenInventoryRequest;
import com.innovatewithomer.hostel_management.entities.ConsumptionExpense;
import com.innovatewithomer.hostel_management.entities.Hostel;
import com.innovatewithomer.hostel_management.entities.KitchenInventory;
import com.innovatewithomer.hostel_management.entities.PurchaseExpense;
import com.innovatewithomer.hostel_management.repositories.ConsumptionExpenseRepository;
import com.innovatewithomer.hostel_management.repositories.KitchenInventoryRepository;
import com.innovatewithomer.hostel_management.repositories.PurchaseExpenseRepository;
import com.innovatewithomer.hostel_management.services.InventoryExcelReport;
import com.innovatewithomer.hostel_management.services.InventoryPdfReport;
import com.innovatewithomer.hostel_management.services.InventoryReportService;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/inventory")
public class KitchenInventoryController {

    private final KitchenInventoryRepository inventoryRepository;
    private final PurchaseExpenseRepository purchaseExpenseRepository;
    private final ConsumptionExpenseRepository consumptionExpenseRepository;
    private final EntityManager entityManager;

    private final InventoryReportService reportService;
    private final InventoryPdfReport pdfReport;
    private final InventoryExcelReport excelReport;

    public KitchenInventoryController(
            KitchenInventoryRepository inventoryRepository,
            PurchaseExpenseRepository purchaseExpenseRepository,
            ConsumptionExpenseRepository consumptionExpenseRepository,
            EntityManager entityManager, InventoryReportService reportService, InventoryPdfReport pdfReport, InventoryExcelReport excelReport
    ) {
        this.inventoryRepository = inventoryRepository;
        this.purchaseExpenseRepository = purchaseExpenseRepository;
        this.consumptionExpenseRepository = consumptionExpenseRepository;
        this.entityManager = entityManager;
        this.reportService = reportService;
        this.pdfReport = pdfReport;
        this.excelReport = excelReport;
    }

    /* ===================== ITEM MASTER ===================== */

    @PostMapping
    public ResponseEntity<KitchenInventoryDto> addNewItem(
            @RequestBody KitchenInventoryRequest request,
            @RequestParam Long hostelId
    ) {
        if (inventoryRepository.existsByItemNameIgnoreCaseAndHostelId(
                request.getItemName(), hostelId)) {
            throw new RuntimeException("Item already exists");
        }

        Hostel hostel = entityManager.getReference(Hostel.class, hostelId);

        KitchenInventory item = new KitchenInventory();
        item.setItemName(request.getItemName());
        item.setUnit(request.getUnit());
        item.setItemCode(generateNextItemCode(hostelId));
        item.setQuantity(0);
        item.setAverageCost(0);
        item.setHostel(hostel);
        item.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(item);
        return ResponseEntity.ok(toDto(item));
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<KitchenInventoryDto> getItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(toDto(findItem(itemId)));
    }

    @GetMapping("/search")
    public ResponseEntity<List<KitchenInventoryDto>> searchItems(
            @RequestParam String itemName,
            @RequestParam Long hostelId
    ) {
        return ResponseEntity.ok(
                inventoryRepository
                        .findByItemNameContainingIgnoreCaseAndHostelId(itemName, hostelId)
                        .stream()
                        .map(this::toDto)
                        .toList()
        );
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable Long itemId) {
        inventoryRepository.delete(findItem(itemId));
        return ResponseEntity.ok("Item deleted successfully");
    }

    /* ===================== PURCHASE (STOCK IN) ===================== */

    @PostMapping("/{itemId}/purchase")
    public ResponseEntity<?> purchaseStock(
            @PathVariable Long itemId,
            @RequestParam double quantity,
            @RequestParam double pricePerUnit,
            @RequestParam(required = false) String supplier,
            @RequestParam(required = false) String remarks
    ) {
        if (quantity <= 0 || pricePerUnit <= 0) {
            throw new RuntimeException("Invalid quantity or price");
        }

        KitchenInventory item = findItem(itemId);

        double oldQty = item.getQuantity();
        double oldAvgCost = item.getAverageCost();

        double newTotalCost = quantity * pricePerUnit;
        double newAvgCost = (oldQty * oldAvgCost + newTotalCost) / (oldQty + quantity);

        item.setQuantity(oldQty + quantity);
        item.setAverageCost(newAvgCost);
        item.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(item);

        PurchaseExpense expense = new PurchaseExpense();
        expense.setInventory(item);
        expense.setQuantity(quantity);
        expense.setPricePerUnit(pricePerUnit);
        expense.setTotalCost(newTotalCost);
        expense.setSupplier(supplier);
        expense.setDate(LocalDate.now());
        expense.setTime(LocalTime.now());
        expense.setRemarks(remarks);

        purchaseExpenseRepository.save(expense);

        return ResponseEntity.ok("Stock purchased successfully");
    }

    /* ===================== CONSUMPTION (DAILY ISSUE) ===================== */

    @PostMapping("/{itemId}/consume")
    public ResponseEntity<?> consumeStock(
            @PathVariable Long itemId,
            @RequestParam double quantity,
            @RequestParam String purpose,
            @RequestParam(required = false) String remarks
    ) {
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        KitchenInventory item = findItem(itemId);

        if (item.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        double expenseAmount = quantity * item.getAverageCost();

        item.setQuantity(item.getQuantity() - quantity);
        item.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(item);

        ConsumptionExpense expense = new ConsumptionExpense();
        expense.setInventory(item);
        expense.setQuantity(quantity);
        expense.setUnitCost(item.getAverageCost());
        expense.setTotalCost(expenseAmount);
        expense.setPurpose(purpose);
        expense.setDate(LocalDate.now());
        expense.setTime(LocalTime.now());
        expense.setDayName(LocalDate.now().getDayOfWeek().name());
        expense.setRemarks(remarks);

        consumptionExpenseRepository.save(expense);

        return ResponseEntity.ok("Item consumed successfully");
    }

    /* ===================== REPORTS ===================== */

    @GetMapping("/low-stock")
    public ResponseEntity<List<KitchenInventoryDto>> lowStock(
            @RequestParam Long hostelId,
            @RequestParam(defaultValue = "10") double threshold
    ) {
        return ResponseEntity.ok(
                inventoryRepository.findByHostel_Id(hostelId)
                        .stream()
                        .filter(i -> i.getQuantity() <= threshold)
                        .map(this::toDto)
                        .toList()
        );
    }

    @GetMapping("/expenses/daily")
    public ResponseEntity<Map<String, Double>> dailyExpenseReport(
            @RequestParam String date
    ) {
        LocalDate reportDate = LocalDate.parse(date);

        double purchaseTotal = purchaseExpenseRepository
                .sumTotalCostByDate(reportDate)
                .orElse(0.0);

        double consumptionTotal = consumptionExpenseRepository
                .sumTotalCostByDate(reportDate)
                .orElse(0.0);

        return ResponseEntity.ok(
                Map.of(
                        "purchaseExpense", purchaseTotal,
                        "consumptionExpense", consumptionTotal,
                        "total", purchaseTotal + consumptionTotal
                )
        );
    }

    @GetMapping("/expenses/monthly")
    public ResponseEntity<Map<String, Double>> monthlyExpenseReport(
            @RequestParam String month, // Format: "2026-02"
            @RequestParam Long hostelId
    ) {
        YearMonth yearMonth = YearMonth.parse(month);

        Double total = consumptionExpenseRepository
                .sumMonthlyExpense(yearMonth.getMonthValue(), yearMonth.getYear(), hostelId)
                .orElse(0.0);

        return ResponseEntity.ok(Map.of("consumptionExpense", total));
    }

    @GetMapping("/report/daily/pdf")
    public ResponseEntity<byte[]> dailyPdf(
            @RequestParam Long hostelId,
            @RequestParam String date
    ) throws Exception {

        String hostelName = entityManager.getReference(
                Hostel.class,
                hostelId
        ).getName();

        LocalDate d = LocalDate.parse(date);
        InventoryReportData data =
                reportService.generate(hostelId, d, d, hostelName);

        byte[] pdf = pdfReport.generate(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=daily-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/report/weekly/pdf")
    public ResponseEntity<byte[]> weeklyPdf(
            @RequestParam Long hostelId,
            @RequestParam String startDate
    ) throws Exception {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = start.plusDays(6);

        String hostelName = entityManager.getReference(
                Hostel.class,
                hostelId
        ).getName();

        InventoryReportData data =
                reportService.generate(hostelId, start, end, hostelName);

        byte[] pdf = pdfReport.generate(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=weekly-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/report/monthly/pdf")
    public ResponseEntity<byte[]> monthlyPdf(
            @RequestParam Long hostelId,
            @RequestParam int year,
            @RequestParam int month
    ) throws Exception {

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        String hostelName = entityManager.getReference(
                Hostel.class,
                hostelId
        ).getName();

        InventoryReportData data =
                reportService.generate(hostelId, start, end, hostelName);

        byte[] pdf = pdfReport.generate(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=monthly-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/report/daily/excel")
    public ResponseEntity<byte[]> dailyExcel(
            @RequestParam Long hostelId,
            @RequestParam String date
    ) throws Exception {

        LocalDate d = LocalDate.parse(date);
        String hostelName = entityManager.getReference(
                Hostel.class,
                hostelId
        ).getName();

        InventoryReportData data =
                reportService.generate(hostelId, d, d, hostelName);

        byte[] excel = excelReport.generate(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=daily-report.xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excel);
    }

    @GetMapping("/report/weekly/excel")
    public ResponseEntity<byte[]> weeklyExcel(
            @RequestParam Long hostelId,
            @RequestParam String startDate
    ) throws Exception {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = start.plusDays(6);

        String hostelName = entityManager.getReference(
                Hostel.class,
                hostelId
        ).getName();

        InventoryReportData data =
                reportService.generate(hostelId, start, end, hostelName);

        byte[] excel = excelReport.generate(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=weekly-report.xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excel);
    }

    @GetMapping("/report/monthly/excel")
    public ResponseEntity<byte[]> monthlyExcel(
            @RequestParam Long hostelId,
            @RequestParam int year,
            @RequestParam int month
    ) throws Exception {

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        String hostelName = entityManager.getReference(
                Hostel.class,
                hostelId
        ).getName();

        InventoryReportData data =
                reportService.generate(hostelId, start, end, hostelName);

        byte[] excel = excelReport.generate(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=monthly-report.xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excel);
    }



    /* ===================== HELPERS ===================== */

    private KitchenInventory findItem(Long itemId) {
        return inventoryRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    private String generateNextItemCode(Long hostelId) {
        return inventoryRepository
                .findTopByHostel_IdOrderByItemCodeDesc(hostelId)
                .map(last -> String.format("%04d",
                        Integer.parseInt(last.getItemCode()) + 1))
                .orElse("0001");
    }

    private KitchenInventoryDto toDto(KitchenInventory item) {
        return new KitchenInventoryDto(
                item.getId(),
                item.getItemCode(),
                item.getItemName(),
                item.getQuantity(),
                item.getUnit(),
                item.getAverageCost(),
                item.getLastUpdated()
        );
    }
}

