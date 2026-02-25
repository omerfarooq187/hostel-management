package com.innovatewithomer.hostel_management.services;

import com.innovatewithomer.hostel_management.dto.InventoryReportData;
import com.innovatewithomer.hostel_management.entities.ConsumptionExpense;
import com.innovatewithomer.hostel_management.entities.PurchaseExpense;
import com.lowagie.text.Document;
import com.lowagie.text.Header;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class InventoryPdfReport {

    public byte[] generate(InventoryReportData data) throws Exception {

        boolean isDaily = data.getStart().equals(data.getEnd());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);

        document.open();

        document.add(new Paragraph(data.getHostelName()));
        document.add(new Paragraph("Kitchen Inventory Report"));
        document.add(new Paragraph(
                "From: " + data.getStart() + " To: " + data.getEnd()
        ));
        document.add(new Paragraph(" "));

        /* ================= CONSUMPTION ================= */

        document.add(new Paragraph("Consumption Details"));
        document.add(new Paragraph(" "));

        document.add(buildConsumptionTable(data));

        document.add(new Paragraph(" "));
        document.add(new Paragraph(
                "Total Consumption Amount: " + data.getTotalConsumptionAmount()
        ));

        if (!isDaily) {
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Consumption Summary (Item Wise)"));
            document.add(buildConsumptionSummaryTable(data));
        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph("--------------------------------------------------"));
        document.add(new Paragraph(" "));

        /* ================= PURCHASE ================= */

        document.add(new Paragraph("Purchase Details"));
        document.add(new Paragraph(" "));

        document.add(buildPurchaseTable(data));

        document.add(new Paragraph(" "));
        document.add(new Paragraph(
                "Total Purchase Amount: " + data.getTotalPurchaseAmount()
        ));

        if (!isDaily) {
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Purchase Summary (Item Wise)"));
            document.add(buildPurchaseSummaryTable(data));
        }

        document.close();
        return out.toByteArray();
    }

    /* ================= DETAIL TABLES ================= */

    private PdfPTable buildConsumptionTable(InventoryReportData data) {

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);

        table.addCell("Item");
        table.addCell("Qty");
        table.addCell("Unit");
        table.addCell("Unit Cost");
        table.addCell("Total");
        table.addCell("Purpose");

        for (ConsumptionExpense c : data.getConsumption()) {
            table.addCell(c.getInventory().getItemName());
            table.addCell(String.valueOf(c.getQuantity()));
            table.addCell(c.getInventory().getUnit());
            table.addCell(String.valueOf(c.getUnitCost()));
            table.addCell(String.valueOf(c.getTotalCost()));
            table.addCell(c.getPurpose());
        }

        return table;
    }

    private PdfPTable buildPurchaseTable(InventoryReportData data) {

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);

        table.addCell("Item");
        table.addCell("Qty");
        table.addCell("Unit Price");
        table.addCell("Total Cost");
        table.addCell("Supplier");
        table.addCell("Date");

        for (PurchaseExpense p : data.getPurchases()) {
            table.addCell(p.getInventory().getItemName());
            table.addCell(String.valueOf(p.getQuantity()));
            table.addCell(String.valueOf(p.getPricePerUnit()));
            table.addCell(String.valueOf(p.getTotalCost()));
            table.addCell(p.getSupplier() == null ? "-" : p.getSupplier());
            table.addCell(String.valueOf(p.getDate()));
        }

        return table;
    }

    /* ================= SUMMARY TABLES ================= */

    private PdfPTable buildConsumptionSummaryTable(InventoryReportData data) {

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        table.addCell("Item");
        table.addCell("Total Qty");
        table.addCell("Avg Cost");
        table.addCell("Total Amount");

        data.getItemSummary().forEach(s -> {
            if (s.getConsumedQuantity() > 0) {
                table.addCell(s.getItemName());
                table.addCell(String.valueOf(s.getConsumedQuantity()));
                table.addCell(
                        String.valueOf(
                                s.getConsumptionAmount() / s.getConsumedQuantity()
                        )
                );
                table.addCell(String.valueOf(s.getConsumptionAmount()));
            }
        });

        return table;
    }

    private PdfPTable buildPurchaseSummaryTable(InventoryReportData data) {

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        table.addCell("Item");
        table.addCell("Total Qty");
        table.addCell("Avg Price");
        table.addCell("Total Amount");

        data.getItemSummary().forEach(s -> {
            if (s.getPurchasedQuantity() > 0) {
                table.addCell(s.getItemName());
                table.addCell(String.valueOf(s.getPurchasedQuantity()));
                table.addCell(
                        String.valueOf(
                                s.getPurchaseAmount() / s.getPurchasedQuantity()
                        )
                );
                table.addCell(String.valueOf(s.getPurchaseAmount()));
            }
        });

        return table;
    }
}
