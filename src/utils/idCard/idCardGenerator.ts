// src/services/idCardGenerator.ts
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

interface IDCardData {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  customerCode: string;
  dateOfBirth: Date | null;
  address: string;
  registration_date: Date;
  expiry_date: Date | null;
  product: {
    name: string;
    price: string;
  };
  officer: {
    name: string;
  };
  profile_image?: string;
}

export const generateIDCard = async (
  customerData: IDCardData
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create output directory if it doesn't exist
      const outputDir = path.join(__dirname, "../../../id-cards");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const fileName = `ID_${customerData.customerCode}_${Date.now()}.pdf`;
      const filePath = path.join(outputDir, fileName);

      // Create PDF document (ID card size: 85.6mm x 53.98mm = 242.65pt x 153pt)
      const doc = new PDFDocument({
        size: [242.65, 153],
        margins: { top: 10, bottom: 10, left: 10, right: 10 },
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const qrString =
  `Code=${customerData.customerCode};` +
  `Name=${customerData.fullname};` +
  `Expiry=${customerData.expiry_date ?? "N/A"};` +
  `RegisteredBy=${customerData.officer?.name ?? "Unknown"}`;

const qrCodeBuffer = await QRCode.toBuffer(qrString, {
  errorCorrectionLevel: "M",
  margin: 1,
  width: 200,
});


      // Background color
      doc.rect(0, 0, 242.65, 153).fill("#10b981");

      // White content area
      doc.rect(5, 5, 232.65, 143).fill("#ffffff");

      // Header with logo/company name
      const logoPath = path.join(__dirname, "../../../assets/logo.png"); // Adjust path to your logo
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 85, 12, { width: 70, height: 20, align: "center" }); // Centered logo
      } else {
        // Fallback to text if logo not found
        doc
          .fillColor("#10b981")
          .fontSize(14)
          .font("Helvetica-Bold")
          .text("EmmaSunny ID CARD", 15, 15, { align: "center" });
      }
      // Profile placeholder (circle)
      doc.circle(40, 55, 25).stroke("#10b981");
      doc
        .fillColor("#10b981")
        .fontSize(20)
        .font("Helvetica-Bold")
        .text(customerData.fullname.charAt(0).toUpperCase(), 30, 45);

      // Customer details
      const leftMargin = 75;
      let yPosition = 35;

      doc
        .fillColor("#000000")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(customerData.fullname.toUpperCase(), leftMargin, yPosition);

      yPosition += 12;
      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor("#374151")
        .text(`Code: ${customerData.customerCode}`, leftMargin, yPosition);

      yPosition += 10;
      doc.text(`Product: ${customerData.product.name}`, leftMargin, yPosition);

      yPosition += 10;
      doc.text(`Phone: ${customerData.phone}`, leftMargin, yPosition);

      yPosition += 10;
      doc.text(`Email: ${customerData.email}`, leftMargin, yPosition);

      // Dates at bottom
      yPosition = 110;
      doc
        .fontSize(6)
        .fillColor("#6b7280")
        .text(
          `Registered: ${new Date(
            customerData.registration_date
          ).toLocaleDateString()}`,
          15,
          yPosition
        );

      yPosition += 8;
      doc.text(
        `Expires: ${
          customerData.expiry_date
            ? new Date(customerData.expiry_date).toLocaleDateString()
            : "N/A"
        }`,
        15,
        yPosition
      );

      // QR Code
      doc.image(qrCodeBuffer, 180, 80, { width: 50, height: 50 });

      // Status badge
      doc.rect(15, 130, 40, 12).fill("#10b981");
      doc
        .fillColor("#ffffff")
        .fontSize(7)
        .font("Helvetica-Bold")
        .text("ACTIVE", 15, 133, { width: 40, align: "center" });

      doc.end();

      stream.on("finish", () => {
        resolve(fileName);
      });

      stream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
