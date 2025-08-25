import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const cardBucket = new Bucket("pvc-cards", { public: true });

export interface GenerateCardRequest {
  cardType: "id" | "business" | "membership" | "student" | "employee" | "custom";
  template: string;
  frontData: {
    photo?: string; // base64 encoded image
    name: string;
    title?: string;
    organization?: string;
    id?: string;
    department?: string;
    email?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  backData?: {
    qrCode?: string;
    barcode?: string;
    emergencyContact?: string;
    terms?: string;
    website?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
    backgroundColor: string;
    textColor: string;
  };
  cardSize: "cr80" | "cr79" | "custom";
  customSize?: {
    width: number; // in mm
    height: number; // in mm
  };
  bleedArea: boolean;
  cornerRadius: number; // in mm
  orientation: "landscape" | "portrait";
}

export interface GenerateCardResponse {
  frontCardUrl: string;
  backCardUrl?: string;
  printReadyUrl: string;
  downloadUrl: string;
  cardId: string;
  specifications: {
    width: number;
    height: number;
    dpi: number;
    bleedArea: number;
    safeArea: number;
  };
}

// Generates a PVC card layout for printing
export const generateCard = api<GenerateCardRequest, GenerateCardResponse>(
  { expose: true, method: "POST", path: "/card/generate" },
  async (req) => {
    const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Card size configurations in mm
    const cardSizes = {
      "cr80": { width: 85.6, height: 53.98 }, // Standard credit card size
      "cr79": { width: 79.5, height: 50.0 },   // Slightly smaller
      "custom": req.customSize || { width: 85.6, height: 53.98 }
    };
    
    const cardSize = cardSizes[req.cardSize];
    const bleedArea = req.bleedArea ? 3 : 0; // 3mm bleed
    const safeArea = 5; // 5mm safe area from edges
    
    // Generate front card HTML
    const frontHtml = generateCardHtml(req, cardSize, bleedArea, safeArea, 'front');
    
    // Generate back card HTML if back data is provided
    let backHtml = '';
    if (req.backData) {
      backHtml = generateCardHtml(req, cardSize, bleedArea, safeArea, 'back');
    }
    
    // Generate print-ready layout (both sides on one sheet)
    const printReadyHtml = generatePrintReadyLayout(frontHtml, backHtml, cardSize, bleedArea);
    
    // Upload files
    const frontFileName = `${cardId}_front.html`;
    const backFileName = `${cardId}_back.html`;
    const printFileName = `${cardId}_print.html`;
    
    await cardBucket.upload(frontFileName, Buffer.from(frontHtml, 'utf-8'), {
      contentType: 'text/html'
    });
    
    let backCardUrl = '';
    if (backHtml) {
      await cardBucket.upload(backFileName, Buffer.from(backHtml, 'utf-8'), {
        contentType: 'text/html'
      });
      backCardUrl = cardBucket.publicUrl(backFileName);
    }
    
    await cardBucket.upload(printFileName, Buffer.from(printReadyHtml, 'utf-8'), {
      contentType: 'text/html'
    });
    
    const frontCardUrl = cardBucket.publicUrl(frontFileName);
    const printReadyUrl = cardBucket.publicUrl(printFileName);
    const downloadUrl = await cardBucket.signedDownloadUrl(printFileName, { ttl: 7200 });
    
    return {
      frontCardUrl,
      backCardUrl,
      printReadyUrl,
      downloadUrl: downloadUrl.url,
      cardId,
      specifications: {
        width: cardSize.width + (bleedArea * 2),
        height: cardSize.height + (bleedArea * 2),
        dpi: 300,
        bleedArea,
        safeArea
      }
    };
  }
);

function generateCardHtml(
  req: GenerateCardRequest, 
  cardSize: { width: number; height: number }, 
  bleedArea: number, 
  safeArea: number, 
  side: 'front' | 'back'
): string {
  const totalWidth = cardSize.width + (bleedArea * 2);
  const totalHeight = cardSize.height + (bleedArea * 2);
  
  const data = side === 'front' ? req.frontData : req.backData;
  if (!data) return '';
  
  const isPortrait = req.orientation === 'portrait';
  const actualWidth = isPortrait ? totalHeight : totalWidth;
  const actualHeight = isPortrait ? totalWidth : totalHeight;
  
  let cardContent = '';
  
  if (side === 'front') {
    cardContent = generateFrontContent(req, cardSize, safeArea);
  } else {
    cardContent = generateBackContent(req, cardSize, safeArea);
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PVC Card ${side === 'front' ? 'Front' : 'Back'} - ${req.cardType.toUpperCase()}</title>
  <style>
    @page {
      size: ${actualWidth}mm ${actualHeight}mm;
      margin: 0;
      padding: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      width: ${actualWidth}mm;
      height: ${actualHeight}mm;
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background: white;
      overflow: hidden;
    }
    
    .card-container {
      position: relative;
      width: ${actualWidth}mm;
      height: ${actualHeight}mm;
      background: ${data.backgroundColor};
      border-radius: ${req.cornerRadius}mm;
      overflow: hidden;
      ${req.bleedArea ? `border: ${bleedArea}mm solid ${data.backgroundColor};` : ''}
    }
    
    .card-content {
      position: absolute;
      top: ${bleedArea + safeArea}mm;
      left: ${bleedArea + safeArea}mm;
      right: ${bleedArea + safeArea}mm;
      bottom: ${bleedArea + safeArea}mm;
      color: ${data.textColor};
    }
    
    .photo {
      width: 25mm;
      height: 32mm;
      object-fit: cover;
      border-radius: 2mm;
      border: 2px solid ${data.textColor};
    }
    
    .logo {
      max-width: 20mm;
      max-height: 15mm;
      object-fit: contain;
    }
    
    .qr-code, .barcode {
      max-width: 20mm;
      max-height: 20mm;
      object-fit: contain;
    }
    
    .name {
      font-size: 14px;
      font-weight: bold;
      margin: 2mm 0;
    }
    
    .title {
      font-size: 10px;
      margin: 1mm 0;
    }
    
    .organization {
      font-size: 12px;
      font-weight: 600;
      margin: 1mm 0;
    }
    
    .id-number {
      font-size: 11px;
      font-weight: bold;
      color: ${req.frontData.accentColor};
      margin: 1mm 0;
    }
    
    .contact-info {
      font-size: 8px;
      line-height: 1.3;
      margin: 1mm 0;
    }
    
    .accent-bar {
      background: ${req.frontData.accentColor};
      height: 3mm;
      width: 100%;
      margin: 2mm 0;
    }
    
    /* Print-specific styles */
    @media print {
      html, body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .card-container {
        page-break-after: avoid;
        page-break-inside: avoid;
      }
    }
    
    /* Screen preview styles */
    @media screen {
      body {
        padding: 20px;
        background: #f0f0f0;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .card-container {
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        border: 1px solid #ddd;
      }
    }
  </style>
</head>
<body>
  <div class="card-container">
    <div class="card-content">
      ${cardContent}
    </div>
  </div>
  
  <script>
    // Auto-print functionality
    function printCard() {
      window.print();
    }
    
    // Add print button for convenience
    document.addEventListener('DOMContentLoaded', function() {
      if (window.matchMedia && !window.matchMedia('print').matches) {
        const printBtn = document.createElement('button');
        printBtn.innerHTML = '🖨️ Print Card';
        printBtn.style.cssText = \`
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        \`;
        printBtn.onclick = printCard;
        document.body.appendChild(printBtn);
      }
    });
  </script>
</body>
</html>`;
}

function generateFrontContent(
  req: GenerateCardRequest, 
  cardSize: { width: number; height: number }, 
  safeArea: number
): string {
  const data = req.frontData;
  
  switch (req.template) {
    case 'modern':
      return `
        <div style="display: flex; height: 100%;">
          <div style="flex: 1; padding-right: 3mm;">
            ${data.photo ? `<img src="${data.photo}" alt="Photo" class="photo" style="float: left; margin-right: 3mm;">` : ''}
            <div>
              <div class="name">${data.name}</div>
              ${data.title ? `<div class="title">${data.title}</div>` : ''}
              ${data.id ? `<div class="id-number">ID: ${data.id}</div>` : ''}
              ${data.department ? `<div class="title">${data.department}</div>` : ''}
            </div>
          </div>
          <div style="width: 25mm; text-align: right;">
            ${data.logoUrl ? `<img src="${data.logoUrl}" alt="Logo" class="logo">` : ''}
            ${data.organization ? `<div class="organization" style="margin-top: 2mm;">${data.organization}</div>` : ''}
          </div>
        </div>
        <div class="accent-bar" style="position: absolute; bottom: 0; left: 0;"></div>
      `;
      
    case 'classic':
      return `
        <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            ${data.logoUrl ? `<img src="${data.logoUrl}" alt="Logo" class="logo" style="margin-bottom: 2mm;">` : ''}
            ${data.organization ? `<div class="organization">${data.organization}</div>` : ''}
          </div>
          <div style="display: flex; align-items: center; justify-content: center; flex: 1;">
            ${data.photo ? `<img src="${data.photo}" alt="Photo" class="photo" style="margin-right: 3mm;">` : ''}
            <div style="text-align: left;">
              <div class="name">${data.name}</div>
              ${data.title ? `<div class="title">${data.title}</div>` : ''}
              ${data.id ? `<div class="id-number">ID: ${data.id}</div>` : ''}
              ${data.department ? `<div class="title">${data.department}</div>` : ''}
            </div>
          </div>
          <div class="accent-bar"></div>
        </div>
      `;
      
    case 'minimal':
      return `
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <div style="display: flex; align-items: center;">
            ${data.photo ? `<img src="${data.photo}" alt="Photo" class="photo" style="margin-right: 4mm;">` : ''}
            <div style="flex: 1;">
              <div class="name">${data.name}</div>
              ${data.title ? `<div class="title">${data.title}</div>` : ''}
              ${data.organization ? `<div class="organization">${data.organization}</div>` : ''}
              ${data.id ? `<div class="id-number">ID: ${data.id}</div>` : ''}
            </div>
            ${data.logoUrl ? `<img src="${data.logoUrl}" alt="Logo" class="logo">` : ''}
          </div>
        </div>
      `;
      
    default:
      return generateFrontContent({ ...req, template: 'modern' }, cardSize, safeArea);
  }
}

function generateBackContent(
  req: GenerateCardRequest, 
  cardSize: { width: number; height: number }, 
  safeArea: number
): string {
  const data = req.backData;
  if (!data) return '';
  
  return `
    <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1;">
          ${data.emergencyContact ? `
            <div style="margin-bottom: 3mm;">
              <div style="font-weight: bold; font-size: 9px; margin-bottom: 1mm;">Emergency Contact:</div>
              <div class="contact-info">${data.emergencyContact}</div>
            </div>
          ` : ''}
          ${data.website ? `<div class="contact-info">🌐 ${data.website}</div>` : ''}
          ${data.socialMedia?.linkedin ? `<div class="contact-info">💼 ${data.socialMedia.linkedin}</div>` : ''}
          ${data.socialMedia?.twitter ? `<div class="contact-info">🐦 ${data.socialMedia.twitter}</div>` : ''}
        </div>
        <div style="text-align: right;">
          ${data.qrCode ? `<img src="${data.qrCode}" alt="QR Code" class="qr-code">` : ''}
          ${data.barcode ? `<img src="${data.barcode}" alt="Barcode" class="barcode" style="margin-top: 2mm;">` : ''}
        </div>
      </div>
      
      ${data.terms ? `
        <div style="margin-top: 3mm;">
          <div style="font-size: 7px; line-height: 1.2; opacity: 0.8;">
            ${data.terms}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function generatePrintReadyLayout(
  frontHtml: string, 
  backHtml: string, 
  cardSize: { width: number; height: number }, 
  bleedArea: number
): string {
  const totalWidth = cardSize.width + (bleedArea * 2);
  const totalHeight = cardSize.height + (bleedArea * 2);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PVC Card Print Layout</title>
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      font-family: Arial, sans-serif;
      background: white;
    }
    
    .print-layout {
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
      padding: 10mm;
    }
    
    .card-pair {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 20mm;
      page-break-inside: avoid;
    }
    
    .card-side {
      width: ${totalWidth}mm;
      height: ${totalHeight}mm;
      border: 1px solid #ccc;
      border-radius: 3mm;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .cutting-guides {
      position: relative;
    }
    
    .cutting-guides::before,
    .cutting-guides::after {
      content: '';
      position: absolute;
      background: #000;
    }
    
    .cutting-guides::before {
      top: -5mm;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 3mm;
    }
    
    .cutting-guides::after {
      bottom: -5mm;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 3mm;
    }
    
    .instructions {
      margin-top: 10mm;
      padding: 5mm;
      background: #f9f9f9;
      border-radius: 3mm;
      font-size: 10px;
      line-height: 1.4;
    }
    
    @media print {
      .instructions {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="print-layout">
    <div class="card-pair">
      <div class="card-side cutting-guides">
        <iframe src="data:text/html;charset=utf-8,${encodeURIComponent(frontHtml)}" 
                width="${totalWidth}mm" 
                height="${totalHeight}mm" 
                frameborder="0"></iframe>
        <div style="text-align: center; margin-top: 2mm; font-size: 8px;">FRONT</div>
      </div>
      
      ${backHtml ? `
        <div class="card-side cutting-guides">
          <iframe src="data:text/html;charset=utf-8,${encodeURIComponent(backHtml)}" 
                  width="${totalWidth}mm" 
                  height="${totalHeight}mm" 
                  frameborder="0"></iframe>
          <div style="text-align: center; margin-top: 2mm; font-size: 8px;">BACK</div>
        </div>
      ` : ''}
    </div>
    
    <div class="instructions">
      <h3>Printing Instructions:</h3>
      <ul>
        <li>Print at 100% scale (no scaling)</li>
        <li>Use 300 DPI or higher resolution</li>
        <li>Print on PVC card stock or transfer to PVC cards</li>
        <li>Cut along the outer edges using the cutting guides</li>
        <li>Card dimensions: ${cardSize.width}mm × ${cardSize.height}mm</li>
        ${bleedArea > 0 ? `<li>Bleed area: ${bleedArea}mm on all sides</li>` : ''}
        <li>Corner radius: ${cardSize.width > 80 ? '3.18mm' : '2mm'} (standard)</li>
      </ul>
    </div>
  </div>
</body>
</html>`;
}
