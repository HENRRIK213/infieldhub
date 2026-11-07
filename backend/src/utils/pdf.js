const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateDocumentPDF(document, featuredProducts = []) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const filename = `doc-${Date.now()}.pdf`;
      const outPath = path.join(__dirname, '../../uploads/documents', filename);
      
      if (!fs.existsSync(path.dirname(outPath))) {
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
      }

      const stream = fs.createWriteStream(outPath);
      doc.pipe(stream);

      // Header
      doc.fillColor('#0D2B4E').fontSize(16).font('Helvetica-Bold').text('Infield Engineering Company', 40, 40);
      doc.fontSize(9).font('Helvetica').text('P.O BOX 62700-19052, Meru Township', 40, 60);
      doc.text('0701243548', 40, 72);

      // Top Right Solar Image
      const solarImgPath = path.join(__dirname, '../../assets/quotation-solar-panels.png');
      if (fs.existsSync(solarImgPath)) {
          doc.image(solarImgPath, 450, 40, { height: 60 });
      }

      doc.fontSize(10).font('Helvetica-Bold').text(`Date: ${new Date().toLocaleDateString()}`, 400, 40, { align: 'right', width: 150 });
      doc.fontSize(9).font('Helvetica').text(`Serial: ${document.serialNo || 'N/A'}`, 400, 52, { align: 'right', width: 150 });

      doc.moveDown(3);

      // Title
      doc.fillColor('#0D2B4E').fontSize(12).font('Helvetica-Bold').text(`${document.type} FOR SUPPLY AND INSTALLATION`, { align: 'center', underline: true });
      doc.moveDown(2);

      // Client Info
      doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text(`To: ${document.clientName || 'THE CLIENT'}`);
      doc.fontSize(9).font('Helvetica').text('Dear Sir/Madam,');
      doc.fontSize(9).text('We are pleased to submit our quotation for the products and services listed below.');
      doc.moveDown(1);

      // Table Header
      const tableTop = doc.y;
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('DESCRIPTION', 40, tableTop);
      doc.text('QTY', 350, tableTop);
      doc.text('VAT', 400, tableTop);
      doc.text('UNIT PRICE', 440, tableTop);
      doc.text('AMOUNT', 500, tableTop);
      
      doc.moveTo(40, tableTop + 12).lineTo(550, tableTop + 12).stroke();

      // Table Rows
      let y = tableTop + 20;
      const content = JSON.parse(document.content || '{}');
      const items = content.items || [];
      
      doc.font('Helvetica');
      items.forEach(item => {
          doc.text(item.name, 40, y, { width: 300 });
          doc.text(item.qty.toString(), 350, y);
          doc.text('0%', 400, y);
          doc.text(item.price.toLocaleString(), 440, y);
          doc.text((item.price * item.qty).toLocaleString(), 500, y);
          y += 20;
      });

      doc.moveTo(40, y).lineTo(550, y).stroke();
      y += 10;

      // Totals
      const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
      const vat = subtotal * 0.16;
      const total = subtotal + vat;

      doc.font('Helvetica-Bold');
      doc.text('Subtotal', 400, y);
      doc.text(subtotal.toLocaleString(), 500, y, { align: 'right', width: 50 });
      y += 15;
      doc.text('VAT (16%)', 400, y);
      doc.text(vat.toLocaleString(), 500, y, { align: 'right', width: 50 });
      y += 15;
      doc.fontSize(11).text('Total KES', 400, y);
      doc.text(total.toLocaleString(), 500, y, { align: 'right', width: 50 });
      
      y += 40;

      // 3 Images Strip
      const imgY = y;
      let imgX = 100;
      const defaultImgs = [
          path.join(__dirname, '../../assets/quotation-solar-panels.png'),
          path.join(__dirname, '../../assets/default-product-2.png'),
          path.join(__dirname, '../../assets/default-product-3.png')
      ];
      let imagesToShow = [];
      
      items.forEach(item => {
          if (item.imageUrl && imagesToShow.length < 3) {
              imagesToShow.push(path.join(__dirname, '../../', item.imageUrl.replace(/^\//, '')));
          }
      });
      
      defaultImgs.forEach(img => {
          if (imagesToShow.length < 3 && fs.existsSync(img)) {
              imagesToShow.push(img);
          }
      });

      imagesToShow.forEach(imgPath => {
          if (fs.existsSync(imgPath)) {
              doc.image(imgPath, imgX, imgY, { fit: [100, 80], align: 'center' });
              imgX += 130;
          }
      });

      y += 100;
      doc.moveTo(40, y).lineTo(550, y).stroke();
      y += 10;

      // Terms
      doc.fontSize(9).font('Helvetica-Bold').text('TERMS & CONDITIONS:', 40, y);
      y += 12;
      doc.fontSize(8).font('Helvetica');
      doc.text('Delivery: EX STOCK SUBJECT TO PRIOR SALES.', 40, y);
      y += 10;
      doc.text('Validity: THIS PRICE VALID FOR 1 WEEK.', 40, y);
      y += 10;
      doc.text('Payment: IN FULL PRIOR TO SUPPLY.', 40, y);
      
      y += 20;

      // Payment Box
      const boxY = y;
      doc.rect(40, boxY, 510, 90).stroke();
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#0D2B4E').text('PAYMENT OPTIONS', 40, boxY + 10, { align: 'center', width: 510 });
      
      // Payment Icons
      const pY = boxY + 30;
      const kcb = path.join(__dirname, '../../assets/kcb-mobile.png');
      const coop = path.join(__dirname, '../../assets/co-operative-bank.png');
      const mpesa = path.join(__dirname, '../../assets/mpesa.png');
      
      if (fs.existsSync(kcb)) doc.image(kcb, 70, pY, { height: 20 });
      if (fs.existsSync(coop)) doc.image(coop, 240, pY, { height: 20 });
      if (fs.existsSync(mpesa)) doc.image(mpesa, 410, pY, { height: 20 });

      doc.fontSize(7).font('Helvetica').fillColor('#000000');
      doc.text('KINGDOM BANK\nName: Infield Engineering\nAcc: 5021964795002', 60, pY + 25, { align: 'center', width: 100 });
      doc.text('CO-OPERATIVE BANK\nBusiness: 1170535\nAcc: 400200', 230, pY + 25, { align: 'center', width: 100 });
      doc.text('M-PESA\nPaybill: 247247\nAcc: 0701243548', 400, pY + 25, { align: 'center', width: 100 });

      y = boxY + 100;

      // Signatures
      doc.fontSize(8).text('Name_________________________', 40, y);
      doc.text('Date_________________________', 40, y + 30);
      
      doc.fontSize(14).font('Times-Italic').fillColor('#0D2B4E').text('Alphonce Juma', 380, y);
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#000000').text('Authorized Signatory', 400, y + 18);
      doc.moveTo(380, y + 15).lineTo(520, y + 15).stroke();

      doc.end();

      stream.on('finish', () => {
        resolve(`/uploads/documents/${filename}`);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateDocumentPDF };