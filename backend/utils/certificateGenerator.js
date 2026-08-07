const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const CERT_DIR = path.join(__dirname, '../uploads/certificates');
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR, { recursive: true });
}

const generateCertificatePDF = async ({
  studentName,
  idNumber,
  eventName,
  type,
  eventType,
  issuedDate,
}) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // Border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.39, 0.4, 0.95),
    borderWidth: 3,
  });

  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: height - 80,
    borderColor: rgb(0.79, 0.7, 0.22),
    borderWidth: 1,
  });

  // Title
  page.drawText('CERTIFICATE OF ' + type.toUpperCase(), {
    x: width / 2 - 180,
    y: height - 100,
    size: 28,
    font: helveticaBold,
    color: rgb(0.39, 0.4, 0.95),
  });

  page.drawText('This is to certify that', {
    x: width / 2 - 80,
    y: height - 160,
    size: 14,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(studentName, {
    x: width / 2 - studentName.length * 5,
    y: height - 200,
    size: 26,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(`ID: ${idNumber}`, {
    x: width / 2 - 40,
    y: height - 230,
    size: 12,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });

  const typeLabel = type === 'appreciation' ? 'appreciation for outstanding performance in' : 'participation in';
  page.drawText(`has received this certificate of ${typeLabel}`, {
    x: width / 2 - 160,
    y: height - 280,
    size: 14,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(eventName, {
    x: width / 2 - eventName.length * 4,
    y: height - 320,
    size: 20,
    font: helveticaBold,
    color: rgb(0.39, 0.4, 0.95),
  });

  page.drawText(`(${eventType.charAt(0).toUpperCase() + eventType.slice(1)})`, {
    x: width / 2 - 40,
    y: height - 350,
    size: 12,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  const dateStr = new Date(issuedDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  page.drawText(`Date: ${dateStr}`, {
    x: 80,
    y: 80,
    size: 12,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText('WebApps Club | KL University SAC', {
    x: width - 280,
    y: 80,
    size: 12,
    font: timesItalic,
    color: rgb(0.4, 0.4, 0.4),
  });

  const pdfBytes = await pdfDoc.save();
  const filename = `${idNumber}_${Date.now()}.pdf`;
  const filePath = path.join(CERT_DIR, filename);
  fs.writeFileSync(filePath, pdfBytes);

  return `uploads/certificates/${filename}`;
};

module.exports = { generateCertificatePDF, CERT_DIR };
