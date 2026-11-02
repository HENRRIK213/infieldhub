const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const assets = path.join(__dirname, '../../assets');
const uploads = path.join(__dirname, '../../uploads');
const margin = 40;
const bodyBottom = 745;
const colors = {
  navy: '#0D2B4E',
  blue: '#1E88E5',
  pale: '#F1F7FC',
  text: '#334155',
  muted: '#64748B',
  line: '#D9E2EC',
};

function imageBuffer(imageUrl) {
  if (!imageUrl) return null;
  const dataUri = imageUrl.match(/^data:image\/(?:jpeg|png|webp);base64,(.+)$/i);
  if (dataUri) return Buffer.from(dataUri[1], 'base64');

  if (imageUrl.startsWith('/uploads/')) {
    const imagePath = path.join(uploads, imageUrl.slice('/uploads/'.length));
    if (fs.existsSync(imagePath)) return imagePath;
  }
  if (path.isAbsolute(imageUrl) && fs.existsSync(imageUrl)) return imageUrl;
  return null;
}

function drawImage(doc, imageUrl, x, y, options) {
  const source = imageBuffer(imageUrl);
  if (!source) return false;
  try {
    doc.image(source, x, y, options);
    return true;
  } catch (error) {
    console.error('Quotation image could not be added:', error.message);
    return false;
  }
}

function money(value) {
  return `KES ${Number(value || 0).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function generateQuotationPDF(quotation, featuredProducts = []) {
  return new Promise((resolve, reject) => {
    const filename = `quotation-${String(quotation.serialNumber).replace(/[^a-zA-Z0-9_-]/g, '')}.pdf`;
    const outputPath = path.join(uploads, 'quotations', filename);

    try {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 110, bottom: 58, left: margin, right: margin },
        bufferPages: true,
        info: {
          Title: `Quotation ${quotation.serialNumber}`,
          Author: 'InfieldHub',
          Subject: 'Quotation for supply and installation',
        },
      });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const contentWidth = pageWidth - margin * 2;
      const logoPath = path.join(assets, 'infieldhub-logo.png');
      const panelPath = path.join(assets, 'quotation-solar-panels.png');
      const date = new Date(quotation.createdAt || Date.now()).toLocaleDateString('en-GB');

      function drawPageChrome() {
        doc.save();
        doc.rect(0, 0, pageWidth, 5).fill(colors.navy);
        if (fs.existsSync(logoPath)) {
          drawImage(doc, logoPath, margin, 17, { fit: [100, 54] });
        }
        doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(13)
          .text('INFIELDHUB ENGINEERING', 154, 20, { width: 250 });
        doc.fillColor(colors.muted).font('Helvetica').fontSize(8)
          .text('Solar • Electrical • Water Solutions', 154, 39)
          .text('P.O BOX 62700-19052, Meru Township  |  0701243548', 154, 53);
        drawImage(doc, panelPath, pageWidth - margin - 112, 14, { fit: [112, 68] });
        doc.moveTo(margin, 91).lineTo(pageWidth - margin, 91)
          .lineWidth(0.7).strokeColor(colors.line).stroke();
        doc.moveTo(margin, doc.page.height - 85).lineTo(pageWidth - margin, doc.page.height - 85)
          .lineWidth(0.6).strokeColor(colors.line).stroke();
        doc.fillColor(colors.muted).font('Helvetica').fontSize(7)
          .text(`Quotation ${quotation.serialNumber}  •  InfieldHub  •  All amounts in KES`,
            margin, doc.page.height - 73, { width: contentWidth, align: 'center' });
        doc.restore();
        doc.y = 108;
      }

      function newPage() {
        doc.addPage();
      }

      function ensureSpace(height) {
        if (doc.y + height > bodyBottom) newPage();
      }

      function sectionTitle(title) {
        doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(10)
          .text(title, margin, doc.y, { width: contentWidth });
        doc.moveTo(margin, doc.y + 3).lineTo(pageWidth - margin, doc.y + 3)
          .lineWidth(0.8).strokeColor(colors.line).stroke();
        doc.y += 14;
      }

      function drawTableHeader() {
        const y = doc.y;
        doc.rect(margin, y, contentWidth, 25).fill(colors.navy);
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8);
        doc.text('#', margin + 8, y + 8, { width: 20 });
        doc.text('DESCRIPTION', margin + 30, y + 8, { width: 220 });
        doc.text('QTY', 304, y + 8, { width: 32, align: 'right' });
        doc.text('UNIT PRICE', 344, y + 8, { width: 72, align: 'right' });
        doc.text('VAT', 421, y + 8, { width: 36, align: 'right' });
        doc.text('AMOUNT', 462, y + 8, { width: 90, align: 'right' });
        doc.y = y + 25;
      }

      doc.on('pageAdded', drawPageChrome);
      drawPageChrome();

      doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(16)
        .text('QUOTATION FOR SUPPLY AND INSTALLATION', margin, 105, {
          width: contentWidth,
          align: 'center',
          lineBreak: false,
          ellipsis: true,
        });
      doc.fillColor(colors.muted).font('Helvetica').fontSize(8)
        .text(`Serial: ${quotation.serialNumber}     Date: ${date}`, margin, 129, {
          width: contentWidth,
          align: 'center',
        });
      doc.y = 148;

      doc.roundedRect(margin, doc.y, contentWidth, 55, 6).fill(colors.pale);
      doc.fillColor(colors.blue).font('Helvetica-Bold').fontSize(8)
        .text('PREPARED FOR', margin + 12, doc.y + 9);
      doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(12)
        .text(quotation.customerName || 'THE CLIENT', margin + 12, doc.y + 22, { width: 245 });
      doc.fillColor(colors.text).font('Helvetica').fontSize(8)
        .text(quotation.customerEmail || '—', margin + 270, doc.y + 18, { width: 215 })
        .text(quotation.customerPhone || '—', margin + 270, doc.y + 32, { width: 215 });
      doc.y += 70;

      doc.fillColor(colors.text).font('Helvetica').fontSize(9)
        .text('Dear Sir/Madam,', margin, doc.y, { width: contentWidth });
      doc.y += 15;
      doc.text('We are grateful for your inquiry and are pleased to submit our quotation for the products and services listed below.', margin, doc.y, {
        width: contentWidth,
        lineGap: 3,
      });
      doc.y += doc.heightOfString('We are grateful for your inquiry and are pleased to submit our quotation for the products and services listed below.', {
        width: contentWidth,
        lineGap: 3,
      }) + 16;

      sectionTitle('QUOTED ITEMS');
      drawTableHeader();

      const items = Array.isArray(quotation.items) ? quotation.items : [];
      let subtotal = 0;
      let vatAmount = 0;
      items.forEach((item, index) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const lineTotal = price * quantity;
        const vatLine = item.vat ? lineTotal * 0.16 : 0;
        subtotal += lineTotal;
        vatAmount += vatLine;

        doc.font('Helvetica').fontSize(8);
        const description = String(item.name || 'Product');
        const descriptionHeight = doc.heightOfString(description, { width: 214, lineGap: 2 });
        const rowHeight = Math.max(28, descriptionHeight + 12);
        if (doc.y + rowHeight > bodyBottom) {
          newPage();
          drawTableHeader();
        }

        const y = doc.y;
        if (index % 2 === 0) doc.rect(margin, y, contentWidth, rowHeight).fill('#F7FAFC');
        doc.fillColor(colors.text).font('Helvetica').fontSize(8)
          .text(String(index + 1), margin + 8, y + 9, { width: 20 });
        doc.text(description, margin + 30, y + 7, { width: 214, lineGap: 2 });
        doc.text(String(quantity), 304, y + 9, { width: 32, align: 'right' });
        doc.text(price.toLocaleString('en-KE', { minimumFractionDigits: 2 }), 344, y + 9, { width: 72, align: 'right' });
        doc.text(item.vat ? '16%' : '—', 421, y + 9, { width: 36, align: 'right' });
        doc.text(lineTotal.toLocaleString('en-KE', { minimumFractionDigits: 2 }), 462, y + 9, { width: 90, align: 'right' });
        doc.moveTo(margin, y + rowHeight).lineTo(pageWidth - margin, y + rowHeight)
          .lineWidth(0.4).strokeColor(colors.line).stroke();
        doc.y = y + rowHeight;
      });

      ensureSpace(87);
      doc.y += 12;
      const totalsX = 355;
      doc.fillColor(colors.text).font('Helvetica').fontSize(9)
        .text('Subtotal', totalsX, doc.y, { width: 85 })
        .text(money(subtotal), 440, doc.y, { width: 112, align: 'right' });
      doc.y += 15;
      doc.text('VAT (16%)', totalsX, doc.y, { width: 85 })
        .text(money(vatAmount), 440, doc.y, { width: 112, align: 'right' });
      doc.y += 19;
      doc.roundedRect(totalsX, doc.y, 197, 28, 4).fill(colors.navy);
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10)
        .text('TOTAL', totalsX + 10, doc.y + 9, { width: 70 })
        .text(money(subtotal + vatAmount), totalsX + 80, doc.y + 9, { width: 107, align: 'right' });
      doc.y += 42;

      if (featuredProducts.length) {
        ensureSpace(128);
        sectionTitle('FEATURED PRODUCTS');
        const gap = 10;
        const cardWidth = (contentWidth - gap * 2) / 3;
        const cardY = doc.y;
        const cards = featuredProducts.slice(0, 3);
        cards.forEach((product, index) => {
          const x = margin + index * (cardWidth + gap);
          doc.roundedRect(x, cardY, cardWidth, 104, 5).lineWidth(0.7).strokeColor(colors.line).stroke();
          drawImage(doc, product.imageUrl, x + 8, cardY + 6, { fit: [cardWidth - 16, 67], align: 'center', valign: 'center' });
          doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(7)
            .text(String(product.name || 'Featured product'), x + 7, cardY + 78, {
              width: cardWidth - 14,
              height: 19,
              ellipsis: true,
            });
        });
        doc.y = cardY + 115;
      }

      ensureSpace(78);
      sectionTitle('TERMS & CONDITIONS');
      doc.fillColor(colors.text).font('Helvetica').fontSize(8)
        .text('Delivery: Ex stock, subject to prior sales.', margin, doc.y, { width: contentWidth })
        .text('Validity: This quotation is valid for one week from the date of issue.', margin, doc.y + 13, { width: contentWidth })
        .text('Payment: In full prior to supply.', margin, doc.y + 26, { width: contentWidth });
      doc.y += 42;

      ensureSpace(153);
      doc.roundedRect(margin, doc.y, contentWidth, 110, 6).lineWidth(0.8).strokeColor(colors.line).stroke();
      doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(9)
        .text('PAYMENT OPTIONS', margin + 10, doc.y + 9, { width: contentWidth - 20, align: 'center' });
      const paymentY = doc.y + 24;
      const columnWidth = (contentWidth - 28) / 3;
      const methods = [
        {
          logo: 'kcb-mobile.png',
          width: 34,
          title: 'KINGDOM BANK',
          lines: ['Name: InfieldHub Ltd', 'Acc No: 5021964795002', 'Bank Code: 01103043639002'],
        },
        {
          logo: 'co-operative-bank.png',
          width: 36,
          title: 'CO-OPERATIVE BANK (CoopTill)',
          lines: ['Business Name: 1170535', 'Acc No: 400200'],
        },
        {
          logo: 'mpesa.png',
          width: 60,
          title: 'M-PESA',
          lines: ['Paybill: 247247', 'Account: 0701243548'],
        },
      ];
      methods.forEach((method, index) => {
        const x = margin + 10 + index * (columnWidth + 4);
        const logo = path.join(assets, method.logo);
        if (fs.existsSync(logo)) drawImage(doc, logo, x, paymentY, { fit: [method.width, 27] });
        doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(7)
          .text(method.title, x, paymentY + 30, { width: columnWidth - 8 });
        doc.fillColor(colors.text).font('Helvetica').fontSize(7)
          .text(method.lines.join('\n'), x, paymentY + 42, { width: columnWidth - 8, lineGap: 2 });
      });
      doc.y += 124;

      ensureSpace(75);
      doc.fillColor(colors.text).font('Helvetica').fontSize(8)
        .text('We look forward to serving you.', margin, doc.y, { width: 230 });
      doc.fillColor(colors.navy).font('Helvetica-BoldOblique').fontSize(13)
        .text('Alphonce Juma', pageWidth - margin - 170, doc.y - 2, { width: 170, align: 'center' });
      doc.moveTo(pageWidth - margin - 170, doc.y + 17).lineTo(pageWidth - margin, doc.y + 17)
        .lineWidth(0.7).strokeColor(colors.navy).stroke();
      doc.fillColor(colors.muted).font('Helvetica').fontSize(8)
        .text('Authorized Signatory', pageWidth - margin - 170, doc.y + 22, { width: 170, align: 'center' });

      doc.end();
      stream.on('finish', () => resolve(`/uploads/quotations/${filename}`));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

function generateDocumentPDF(documentRecord, featuredProducts = []) {
  return new Promise((resolve, reject) => {
    const serial = String(documentRecord.serialNo).replace(/[^a-zA-Z0-9_-]/g, '');
    const outputPath = path.join(uploads, 'documents', `${serial}.pdf`);
    const logoPath = path.join(assets, 'infieldhub-logo.png');
    const panelPath = path.join(assets, 'quotation-solar-panels.png');
    const type = documentRecord.type;
    const title = type === 'REPORT' ? 'SERVICE REPORT' : type;
    let content;

    try {
      content = typeof documentRecord.content === 'string'
        ? JSON.parse(documentRecord.content || '{}')
        : (documentRecord.content || {});
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 105, bottom: 60, left: margin, right: margin },
        info: { Title: `${title} ${documentRecord.serialNo}`, Author: 'InfieldHub' },
      });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const contentWidth = pageWidth - margin * 2;
      const bodyBottom = doc.page.height - 105;
      const date = new Date(documentRecord.createdAt || Date.now()).toLocaleDateString('en-GB');

      function drawPageChrome() {
        doc.save();
        doc.rect(0, 0, pageWidth, 5).fill(colors.navy);
        if (fs.existsSync(logoPath)) drawImage(doc, logoPath, margin, 16, { fit: [92, 48] });
        doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(12)
          .text('INFIELDHUB ENGINEERING', 145, 19, { width: 240 });
        doc.fillColor(colors.muted).font('Helvetica').fontSize(8)
          .text('Solar • Electrical • Water Solutions', 145, 37)
          .text('P.O BOX 62700-19052, Meru Township  |  0701243548', 145, 50);
        if (type === 'QUOTATION' || type === 'INVOICE' || type === 'REPORT') {
          drawImage(doc, panelPath, pageWidth - margin - 105, 13, { fit: [105, 57] });
        }
        doc.moveTo(margin, 80).lineTo(pageWidth - margin, 80)
          .lineWidth(0.7).strokeColor(colors.line).stroke();
        doc.moveTo(margin, doc.page.height - 82).lineTo(pageWidth - margin, doc.page.height - 82)
          .lineWidth(0.6).strokeColor(colors.line).stroke();
        doc.fillColor(colors.muted).font('Helvetica').fontSize(7)
          .text(`${title} ${documentRecord.serialNo}  •  InfieldHub  •  All amounts in KES`,
            margin, doc.page.height - 69, { width: contentWidth, align: 'center' });
        doc.restore();
        doc.y = 95;
      }

      function newPage() {
        doc.addPage();
      }

      function ensureSpace(height) {
        if (doc.y + height > bodyBottom) newPage();
      }

      function sectionHeading(heading) {
        ensureSpace(32);
        doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(10).text(heading, margin, doc.y, { width: contentWidth });
        doc.moveTo(margin, doc.y + 3).lineTo(pageWidth - margin, doc.y + 3)
          .lineWidth(0.6).strokeColor(colors.line).stroke();
        doc.y += 14;
      }

      doc.on('pageAdded', drawPageChrome);
      drawPageChrome();
      doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(18)
        .text(title, margin, doc.y, { width: contentWidth, align: 'center' });
      doc.y += 24;
      doc.fillColor(colors.muted).font('Helvetica').fontSize(8)
        .text(`Reference: ${documentRecord.serialNo}     Date: ${date}`, margin, doc.y, {
          width: contentWidth,
          align: 'center',
        });
      doc.y += 18;

      doc.roundedRect(margin, doc.y, contentWidth, 43, 5).fill(colors.pale);
      doc.fillColor(colors.blue).font('Helvetica-Bold').fontSize(8)
        .text('PREPARED FOR', margin + 10, doc.y + 7);
      doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(11)
        .text(documentRecord.clientName || 'THE CLIENT', margin + 10, doc.y + 19, {
          width: contentWidth - 20,
          ellipsis: true,
        });
      doc.y += 56;

      if (type === 'REPORT') {
        const sections = [
          ['REPORT SUBJECT', content.reportSubject],
          ['EXECUTIVE SUMMARY', content.reportSummary],
          ['WORK COMPLETED / FINDINGS', content.reportWork],
          ['RECOMMENDATIONS / NEXT STEPS', content.reportRecommendations],
        ].filter(([, value]) => typeof value === 'string' && value.trim());
        sections.forEach(([heading, value]) => {
          sectionHeading(heading);
          doc.fillColor(colors.text).font('Helvetica').fontSize(9)
            .text(value, margin, doc.y, { width: contentWidth, lineGap: 3 });
          doc.y += 12;
        });
      } else if (type === 'POSTER') {
        sectionHeading(documentRecord.title || 'POSTER');
        doc.fillColor(colors.text).font('Helvetica').fontSize(12)
          .text(content.posterTitle || documentRecord.title || '', margin, doc.y, { width: contentWidth, align: 'center' });
        doc.y += 28;
        if (content.posterSub) {
          doc.fontSize(9).text(content.posterSub, margin, doc.y, { width: contentWidth, align: 'center' });
          doc.y += 20;
        }
      } else {
        sectionHeading(type === 'INVOICE' ? 'INVOICED ITEMS' : 'QUOTED ITEMS');
        const items = Array.isArray(content.items) ? content.items : [];
        const x = [margin + 8, margin + 310, margin + 360, margin + 430];
        const widths = [292, 42, 68, 75];
        const headerY = doc.y;
        doc.rect(margin, headerY, contentWidth, 22).fill(colors.navy);
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8)
          .text('DESCRIPTION', x[0], headerY + 7, { width: widths[0] })
          .text('QTY', x[1], headerY + 7, { width: widths[1], align: 'right' })
          .text('UNIT PRICE', x[2], headerY + 7, { width: widths[2], align: 'right' })
          .text('AMOUNT', x[3], headerY + 7, { width: widths[3], align: 'right' });
        doc.y = headerY + 22;

        let subtotal = 0;
        let vatTotal = 0;
        items.forEach((item, index) => {
          const quantity = Math.max(0, Number(item.qty) || 0);
          const price = Math.max(0, Number(item.price) || 0);
          const amount = quantity * price;
          const vat = item.vat ? amount * 0.16 : 0;
          subtotal += amount;
          vatTotal += vat;
          doc.font('Helvetica').fontSize(8);
          const rowHeight = Math.max(26, doc.heightOfString(String(item.name || 'Product'), { width: widths[0] }) + 10);
          ensureSpace(rowHeight);
          const rowY = doc.y;
          if (index % 2 === 0) doc.rect(margin, rowY, contentWidth, rowHeight).fill('#F7FAFC');
          doc.fillColor(colors.text).font('Helvetica').fontSize(8)
            .text(String(item.name || 'Product'), x[0], rowY + 7, { width: widths[0] })
            .text(String(quantity), x[1], rowY + 7, { width: widths[1], align: 'right' })
            .text(money(price), x[2], rowY + 7, { width: widths[2], align: 'right' })
            .text(money(amount + vat), x[3], rowY + 7, { width: widths[3], align: 'right' });
          doc.moveTo(margin, rowY + rowHeight).lineTo(pageWidth - margin, rowY + rowHeight)
            .lineWidth(0.4).strokeColor(colors.line).stroke();
          doc.y = rowY + rowHeight;
        });

        ensureSpace(72);
        doc.y += 12;
        const totalsX = pageWidth - margin - 205;
        doc.fillColor(colors.text).font('Helvetica').fontSize(9)
          .text('Subtotal', totalsX, doc.y, { width: 88 })
          .text(money(subtotal), totalsX + 90, doc.y, { width: 115, align: 'right' });
        doc.y += 15;
        doc.text('VAT (16%)', totalsX, doc.y, { width: 88 })
          .text(money(vatTotal), totalsX + 90, doc.y, { width: 115, align: 'right' });
        doc.y += 20;
        doc.roundedRect(totalsX, doc.y, 205, 26, 4).fill(colors.navy);
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9)
          .text('TOTAL', totalsX + 8, doc.y + 8, { width: 70 })
          .text(money(subtotal + vatTotal), totalsX + 80, doc.y + 8, { width: 117, align: 'right' });
        doc.y += 38;

        if (type === 'QUOTATION' && featuredProducts.length) {
          ensureSpace(120);
          sectionHeading('FEATURED PRODUCTS');
          const gap = 9;
          const cardWidth = (contentWidth - gap * 2) / 3;
          const cardY = doc.y;
          featuredProducts.slice(0, 3).forEach((product, index) => {
            const cardX = margin + index * (cardWidth + gap);
            doc.roundedRect(cardX, cardY, cardWidth, 96, 5).lineWidth(0.7).strokeColor(colors.line).stroke();
            drawImage(doc, product.imageUrl, cardX + 7, cardY + 6, { fit: [cardWidth - 14, 62], align: 'center', valign: 'center' });
            doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(7)
              .text(String(product.name || 'Featured product'), cardX + 7, cardY + 73, { width: cardWidth - 14, height: 16, ellipsis: true });
          });
          doc.y = cardY + 106;
        }

        if (type === 'QUOTATION') {
          ensureSpace(54);
          sectionHeading('TERMS & CONDITIONS');
          doc.fillColor(colors.text).font('Helvetica').fontSize(8)
            .text('Delivery: Ex stock, subject to prior sales.', margin, doc.y, { width: contentWidth })
            .text('Validity: This quotation is valid for one week from the date of issue.', margin, doc.y + 13, { width: contentWidth })
            .text('Payment: In full prior to supply.', margin, doc.y + 26, { width: contentWidth });
          doc.y += 42;
          ensureSpace(114);
          doc.roundedRect(margin, doc.y, contentWidth, 104, 6).lineWidth(0.8).strokeColor(colors.line).stroke();
          doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(9)
            .text('PAYMENT OPTIONS', margin + 10, doc.y + 8, { width: contentWidth - 20, align: 'center' });
          const methodY = doc.y + 23;
          const columnWidth = (contentWidth - 28) / 3;
          const methods = [
            { logo: 'kcb-mobile.png', title: 'KINGDOM BANK', lines: ['Name: InfieldHub Ltd', 'Acc No: 5021964795002', 'Bank Code: 01103043639002'] },
            { logo: 'co-operative-bank.png', title: 'CO-OPERATIVE BANK (CoopTill)', lines: ['Business Name: 1170535', 'Acc No: 400200'] },
            { logo: 'mpesa.png', title: 'M-PESA', lines: ['Paybill: 247247', 'Account: 0701243548'] },
          ];
          methods.forEach((method, index) => {
            const methodX = margin + 10 + index * (columnWidth + 4);
            const logo = path.join(assets, method.logo);
            if (fs.existsSync(logo)) drawImage(doc, logo, methodX, methodY, { fit: [58, 24] });
            doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(7)
              .text(method.title, methodX, methodY + 26, { width: columnWidth - 8 });
            doc.fillColor(colors.text).font('Helvetica').fontSize(7)
              .text(method.lines.join('\n'), methodX, methodY + 37, { width: columnWidth - 8, lineGap: 1 });
          });
          doc.y += 116;
        } else if (type === 'INVOICE') {
          ensureSpace(35);
          doc.fillColor(colors.text).font('Helvetica').fontSize(8)
            .text('Payment is due upon receipt of this invoice. Please use the invoice reference when making payment.', margin, doc.y, { width: contentWidth });
          doc.y += 24;
        }
      }

      ensureSpace(60);
      doc.fillColor(colors.text).font('Helvetica').fontSize(8)
        .text(type === 'REPORT' ? 'Prepared by:' : 'We look forward to serving you.', margin, doc.y, { width: 230 });
      doc.fillColor(colors.navy).font('Helvetica-BoldOblique').fontSize(13)
        .text('Alphonce Juma', pageWidth - margin - 170, doc.y - 2, { width: 170, align: 'center' });
      doc.moveTo(pageWidth - margin - 170, doc.y + 17).lineTo(pageWidth - margin, doc.y + 17)
        .lineWidth(0.7).strokeColor(colors.navy).stroke();
      doc.fillColor(colors.muted).font('Helvetica').fontSize(8)
        .text('Authorized Signatory', pageWidth - margin - 170, doc.y + 22, { width: 170, align: 'center' });

      doc.end();
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateQuotationPDF, generateDocumentPDF };
