package com.innovatewithomer.hostel_management.services;

import com.innovatewithomer.hostel_management.entities.Fee;
import com.innovatewithomer.hostel_management.entities.FeeStatus;
import com.innovatewithomer.hostel_management.entities.Student;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfGState;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

@Service
public class FeeReceiptPdfService {

    public byte[] generateFeeReceipt(Fee fee) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        float width = 80f * 2.83f;
        float height = 150f * 2.83f;

        Rectangle pageSize = new Rectangle(width, height);
        Document document = new Document(pageSize, 20, 20, 15, 15);

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 9);

            Paragraph hostelName = new Paragraph("OFFICERS HOSTEL MANDRA", titleFont);
            hostelName.setAlignment(Element.ALIGN_CENTER);
            document.add(hostelName);

            Paragraph receiptTitle = new Paragraph("FEE RECEIPT", sectionFont);
            receiptTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(receiptTitle);

            document.add(new Paragraph("--------------------------------", textFont));

            Student s = fee.getStudent();

            document.add(new Paragraph("Student", sectionFont));
            document.add(new Paragraph("Name: " + s.getUser().getName(), textFont));
            document.add(new Paragraph("Roll: " + s.getRollNo(), textFont));

            document.add(new Paragraph("--------------------------------", textFont));

            document.add(new Paragraph("Fee", sectionFont));
            document.add(new Paragraph("Month: " + fee.getMonth(), textFont));
            document.add(new Paragraph("Amount: Rs " + fee.getAmount(), textFont));
            document.add(new Paragraph("Due: " + fee.getDueDate(), textFont));
            document.add(new Paragraph("Status: " + fee.getStatus(), textFont));
            document.add(new Paragraph("Mode: CASH", textFont));

            document.add(new Paragraph("--------------------------------", textFont));

            document.add(new Paragraph(
                    "Paid on: " + LocalDate.now(), textFont
            ));

            if (fee.getStatus() == FeeStatus.PAID) {
                addPaidStamp(writer);
            }

            Paragraph footer = new Paragraph(
                    "Official receipt. No signature required.", textFont
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }

        return out.toByteArray();
    }

    private void addPaidStamp(PdfWriter writer) throws Exception {

        ClassPathResource resource =
                new ClassPathResource("static/images/stamp.png");

        Image stamp = Image.getInstance(resource.getURL());

        stamp.scaleToFit(100, 100);
        stamp.setAbsolutePosition(40, 120);

        PdfContentByte canvas = writer.getDirectContent();
        PdfGState state = new PdfGState();
        state.setFillOpacity(0.25f);

        canvas.saveState();
        canvas.setGState(state);
        canvas.addImage(stamp);
        canvas.restoreState();
    }
}
