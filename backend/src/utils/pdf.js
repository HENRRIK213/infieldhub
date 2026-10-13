const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateQuotationPDF(q) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const filename = `quotation-${q.serialNumber}.pdf`;
      const out = path.join(__dirname, '../../uploads/quotations', filename);
      const stream = fs.createWriteStream(out);
      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 40;

      // ============================================================
      // HEADER — Navy bar with logo + company name
      // ============================================================
      doc.rect(0, 0, pageWidth, 120).fill('#0D2B4E');

      // Logo
      const logoPath = path.join(__dirname, '../../uploads/logo.png');
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, margin, 20, { height: 80 });
        } catch (e) {
          console.error('Logo error:', e.message);
        }
      }

      // Company text
      doc.fillColor('#FFFFFF')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('INFIELD ENGINEERING LTD', margin + 100, 30);

      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#4FC3F7')
        .text('Solar • Electrical • Water Solutions', margin + 100, 58);

      doc.fontSize(8)
        .fillColor('#FFFFFF')
        .text('P.O. Box 12345, Nairobi, Kenya', margin + 100, 78)
        .text('Tel: +254 700 000 000  |  Email: info@infieldengineering.co.ke', margin + 100, 92);

      // ============================================================
      // QUOTATION TITLE + SERIAL + DATE
      // ============================================================
      const currentDate = new Date();
      const dateStr = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      doc.fillColor('#0D2B4E').fontSize(22).font('Helvetica-Bold').text('QUOTATION', margin, 145);

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#0D2B4E');
      doc.text('Serial No:', 400, 150);
      doc.font('Helvetica').text(q.serialNumber, 460, 150);

      doc.font('Helvetica-Bold').text('Date:', 400, 165);
      doc.font('Helvetica').text(dateStr, 460, 165);

      // ============================================================
      // CUSTOMER BOX
      // ============================================================
      doc.rect(margin, 185, pageWidth - 2 * margin, 65).fill('#F0F7FF');

      doc.fillColor('#1E88E5').fontSize(9).font('Helvetica-Bold')
        .text('QUOTATION FOR:', margin + 15, 195);

      doc.fillColor('#0D2B4E').fontSize(12).font('Helvetica-Bold')
        .text(q.customerName || 'Walk-in Customer', margin + 15, 210);

      doc.font('Helvetica').fontSize(9).fillColor('#334155')
        .text(q.customerEmail || '—', margin + 15, 228)
        .text(q.customerPhone || '—', margin + 250, 228);

      // ============================================================
      // ITEMS TABLE
      // ============================================================
      let y = 270;

      doc.rect(margin, y, pageWidth - 2 * margin, 28).fill('#1E88E5');

      doc.fillColor('#FFF').fontSize(10).font('Helvetica-Bold')
        .text('#', margin + 10, y + 9)
        .text('Description', margin + 35, y + 9)
        .text('Qty', 330, y + 9)
        .text('Unit Price', 375, y + 9)
        .text('VAT', 455, y + 9)
        .text('Total', 495, y + 9, { width: 60, align: 'right' });
      y += 28;

      const items = q.items || [];
      let subtotal = 0;
      let vatAmount = 0;

      items.forEach((it, i) => {
        const line = it.price * it.quantity;
        subtotal += line;
        const vatLine = it.vat ? line * 0.16 : 0;
        vatAmount += vatLine;

        if (i % 2 === 0) {
          doc.rect(margin, y, pageWidth - 2 * margin, 24).fill('#F7FAFF');
        }

        doc.fillColor('#0D2B4E').font('Helvetica').fontSize(10)
          .text(String(i + 1), margin + 10, y + 7)
          .text(it.name, margin + 35, y + 7, { width: 285 })
          .text(String(it.quantity), 330, y + 7)
          .text(Number(it.price).toFixed(2), 375, y + 7)
          .text(it.vat ? 'Yes' : 'No', 455, y + 7)
          .text(line.toFixed(2), 495, y + 7, { width: 60, align: 'right' });

        y += 24;

        if (y > 700) {
          doc.addPage();
          y = 60;
        }
      });

      // ============================================================
      // TOTALS
      // ============================================================
      y += 15;

      doc.fillColor('#0D2B4E').font('Helvetica').fontSize(11);
      doc.text('Subtotal:', 400, y);
      doc.text(`KES ${subtotal.toFixed(2)}`, 490, y, { width: 60, align: 'right' });

      doc.text('VAT (16%):', 400, y + 18);
      doc.text(`KES ${vatAmount.toFixed(2)}`, 490, y + 18, { width: 60, align: 'right' });

      y += 45;

      doc.rect(margin, y, pageWidth - 2 * margin, 32).fill('#0D2B4E');
      doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold')
        .text('GRAND TOTAL:', 400, y + 10)
        .text(`KES ${(subtotal + vatAmount).toFixed(2)}`, 480, y + 10, { width: 70, align: 'right' });

      // ============================================================
      // RUBBER STAMP — Infield Engineering Ltd
      // ============================================================
      const stampCX = 130;
      const stampCY = y + 90;
      const stampR = 62;

      // Outer circle (red, thick)
      doc.circle(stampCX, stampCY, stampR)
        .lineWidth(3)
        .strokeColor('#DC2626')
        .stroke();

      // Inner circle (red, thin)
      doc.circle(stampCX, stampCY, stampR - 8)
        .lineWidth(1)
        .strokeColor('#DC2626')
        .stroke();

      // Stamp text
      doc.fillColor('#DC2626')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text('INFIELD', stampCX - 35, stampCY - 42, { width: 70, align: 'center' })
        .text('ENGINEERING', stampCX - 40, stampCY - 30, { width: 80, align: 'center' })
        .text('LTD', stampCX - 35, stampCY - 16, { width: 70, align: 'center' });

      // Date inside stamp — always current date
      doc.font('Helvetica').fontSize(7).fillColor('#DC2626')
        .text(dateStr, stampCX - 40, stampCY + 5, { width: 80, align: 'center' });

      // Separator line
      doc.moveTo(stampCX - 40, stampCY + 20).lineTo(stampCX + 40, stampCY + 20)
        .lineWidth(0.5).strokeColor('#DC2626').stroke();

      doc.font('Helvetica-Bold').fontSize(7)
        .text('OFFICIAL', stampCX - 40, stampCY + 26, { width: 80, align: 'center' })
        .text('APPROVED', stampCX - 40, stampCY + 36, { width: 80, align: 'center' });

      // ============================================================
      // AUTHORIZED SIGNATURE
      // ============================================================
      doc.fillColor('#0D2B4E').font('Helvetica-Bold').fontSize(10)
        .text('Authorized By:', 400, stampCY - 30);

      doc.moveTo(400, stampCY + 15).lineTo(540, stampCY + 15)
        .lineWidth(1).strokeColor('#94a3b8').stroke();

      doc.font('Helvetica').fontSize(8).fillColor('#64748b')
        .text('Infield Engineering Ltd', 400, stampCY + 22, { width: 140, align: 'center' });

      // ============================================================
      // FOOTER
      // ============================================================
      doc.fontSize(7).fillColor('#94a3b8')
        .text(
          'This quotation is valid for 30 days from the date of issue.',
          margin,
          pageHeight - 55,
          { width: pageWidth - 2 * margin, align: 'center' }
        )
        .text(
          `Generated ${currentDate.toLocaleString()}  •  InfieldHub  •  All amounts in KES`,
          margin,
          pageHeight - 42,
          { width: pageWidth - 2 * margin, align: 'center' }
        );

      doc.end();

      stream.on('finish', () => resolve(`/uploads/quotations/${filename}`));
      stream.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = { generateQuotationPDF };