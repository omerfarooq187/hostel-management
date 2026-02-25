package com.innovatewithomer.hostel_management.services;

import com.innovatewithomer.hostel_management.dto.InventoryReportData;
import com.innovatewithomer.hostel_management.entities.ConsumptionExpense;
import com.innovatewithomer.hostel_management.entities.PurchaseExpense;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class InventoryExcelReport {

    public byte[] generate(InventoryReportData data) throws Exception {

        Workbook wb = new XSSFWorkbook();

        createConsumptionSheet(wb, data);
        createPurchaseSheet(wb, data);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        wb.write(out);
        wb.close();

        return out.toByteArray();
    }

    /* ================= CONSUMPTION SHEET ================= */

    private void createConsumptionSheet(Workbook wb, InventoryReportData data) {

        boolean isDaily = data.getStart().equals(data.getEnd());

        Sheet sheet = wb.createSheet("Consumption");
        CellStyle titleStyle = createTitleStyle(wb);

        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue(data.getHostelName() + " - Consumption Report");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

        AtomicInteger rowIdx = new AtomicInteger(2);

        if (isDaily) {
            Row r1 = sheet.createRow(rowIdx.getAndIncrement());
            r1.createCell(0).setCellValue("Total Quantity");
            r1.createCell(1).setCellValue(data.getTotalConsumptionQuantity());

            Row r2 = sheet.createRow(rowIdx.getAndIncrement());
            r2.createCell(0).setCellValue("Total Amount");
            r2.createCell(1).setCellValue(data.getTotalConsumptionAmount());
        }

        // Header
        rowIdx.getAndIncrement();
        Row header = sheet.createRow(rowIdx.getAndIncrement());
        header.createCell(0).setCellValue("Item");
        header.createCell(1).setCellValue("Quantity");
        header.createCell(2).setCellValue("Unit");
        header.createCell(3).setCellValue("Unit Cost");
        header.createCell(4).setCellValue("Total Cost");
        header.createCell(5).setCellValue("Purpose");
        header.createCell(6).setCellValue("Date");

        for (ConsumptionExpense c : data.getConsumption()) {
            Row row = sheet.createRow(rowIdx.getAndIncrement());
            row.createCell(0).setCellValue(c.getInventory().getItemName());
            row.createCell(1).setCellValue(c.getQuantity());
            row.createCell(2).setCellValue(c.getInventory().getUnit());
            row.createCell(3).setCellValue(c.getUnitCost());
            row.createCell(4).setCellValue(c.getTotalCost());
            row.createCell(5).setCellValue(c.getPurpose());
            row.createCell(6).setCellValue(c.getDate().toString());
        }

        if (!isDaily) {
            rowIdx.addAndGet(2);
            Row sh = sheet.createRow(rowIdx.getAndIncrement());
            sh.createCell(0).setCellValue("Consumption Summary (Item Wise)");

            Row h = sheet.createRow(rowIdx.getAndIncrement());
            h.createCell(0).setCellValue("Item");
            h.createCell(1).setCellValue("Total Qty");
            h.createCell(2).setCellValue("Avg Cost");
            h.createCell(3).setCellValue("Total Amount");

            data.getItemSummary().forEach(s -> {
                if (s.getConsumedQuantity() > 0) {
                    Row r = sheet.createRow(rowIdx.getAndIncrement());
                    r.createCell(0).setCellValue(s.getItemName());
                    r.createCell(1).setCellValue(s.getConsumedQuantity());
                    r.createCell(2).setCellValue(
                            s.getConsumptionAmount() / s.getConsumedQuantity()
                    );
                    r.createCell(3).setCellValue(s.getConsumptionAmount());
                }
            });
        }

        autoSize(sheet, 7);
    }

    /* ================= PURCHASE SHEET ================= */

    private void createPurchaseSheet(Workbook wb, InventoryReportData data) {

        boolean isDaily = data.getStart().equals(data.getEnd());

        Sheet sheet = wb.createSheet("Purchases");
        CellStyle titleStyle = createTitleStyle(wb);

        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue(data.getHostelName() + " - Purchase Report");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

        AtomicInteger rowIdx = new AtomicInteger(2);

        if (isDaily) {
            Row r1 = sheet.createRow(rowIdx.getAndIncrement());
            r1.createCell(0).setCellValue("Total Quantity");
            r1.createCell(1).setCellValue(data.getTotalPurchaseQuantity());

            Row r2 = sheet.createRow(rowIdx.getAndIncrement());
            r2.createCell(0).setCellValue("Total Amount");
            r2.createCell(1).setCellValue(data.getTotalPurchaseAmount());
        }

        rowIdx.getAndIncrement();
        Row header = sheet.createRow(rowIdx.getAndIncrement());
        header.createCell(0).setCellValue("Item");
        header.createCell(1).setCellValue("Quantity");
        header.createCell(2).setCellValue("Unit Price");
        header.createCell(3).setCellValue("Total Cost");
        header.createCell(4).setCellValue("Supplier");
        header.createCell(5).setCellValue("Date");

        for (PurchaseExpense p : data.getPurchases()) {
            Row row = sheet.createRow(rowIdx.getAndIncrement());
            row.createCell(0).setCellValue(p.getInventory().getItemName());
            row.createCell(1).setCellValue(p.getQuantity());
            row.createCell(2).setCellValue(p.getPricePerUnit());
            row.createCell(3).setCellValue(p.getTotalCost());
            row.createCell(4).setCellValue(
                    p.getSupplier() == null ? "-" : p.getSupplier()
            );
            row.createCell(5).setCellValue(p.getDate().toString());
        }

        if (!isDaily) {
            rowIdx.addAndGet(2);
            Row sh = sheet.createRow(rowIdx.getAndIncrement());
            sh.createCell(0).setCellValue("Purchase Summary (Item Wise)");

            Row h = sheet.createRow(rowIdx.getAndIncrement());
            h.createCell(0).setCellValue("Item");
            h.createCell(1).setCellValue("Total Qty");
            h.createCell(2).setCellValue("Avg Price");
            h.createCell(3).setCellValue("Total Amount");

            data.getItemSummary().forEach(s -> {
                if (s.getPurchasedQuantity() > 0) {
                    Row r = sheet.createRow(rowIdx.getAndIncrement());
                    r.createCell(0).setCellValue(s.getItemName());
                    r.createCell(1).setCellValue(s.getPurchasedQuantity());
                    r.createCell(2).setCellValue(
                            s.getPurchaseAmount() / s.getPurchasedQuantity()
                    );
                    r.createCell(3).setCellValue(s.getPurchaseAmount());
                }
            });
        }

        autoSize(sheet, 6);
    }

    /* ================= HELPERS ================= */

    private CellStyle createTitleStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private void autoSize(Sheet sheet, int cols) {
        for (int i = 0; i < cols; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
