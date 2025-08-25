import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const photoBucket = new Bucket("passport-photos", { public: true });

export interface GenerateLayoutRequest {
  imageData: string; // base64 encoded image
  paperSize: "3R" | "4R" | "5R" | "A4" | "A5" | "Letter" | "Legal";
  photoSize: "3.5x4.5" | "2x2" | "33x48mm" | "25x35mm" | "45x45mm" | "35x50mm" | "CR80" | "3.5x2.5cm" | "1x1" | "1.2x1.6" | "35x45mm";
  backgroundColor: string;
  rows: number;
  columns: number;
}

export interface GenerateLayoutResponse {
  layoutUrl: string;
  downloadUrl: string;
}

// Generates a passport photo layout PDF
export const generateLayout = api<GenerateLayoutRequest, GenerateLayoutResponse>(
  { expose: true, method: "POST", path: "/photo/generate" },
  async (req) => {
    // Create an HTML-based PDF layout
    const htmlContent = createPrintableLayout(req);
    
    const layoutId = `layout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${layoutId}.html`;
    
    // Upload the HTML layout to the bucket
    await photoBucket.upload(fileName, Buffer.from(htmlContent, 'utf-8'), {
      contentType: 'text/html'
    });
    
    const layoutUrl = photoBucket.publicUrl(fileName);
    const downloadUrl = await photoBucket.signedDownloadUrl(fileName, { ttl: 3600 }); // 1 hour expiry
    
    return {
      layoutUrl,
      downloadUrl: downloadUrl.url
    };
  }
);

function createPrintableLayout(req: GenerateLayoutRequest): string {
  // Paper size configurations in cm
  const paperSizes = {
    "3R": { width: 12.7, height: 8.89, marginLeft: 0.5, marginRight: 0.5, marginTop: 0.5, marginBottom: 0.5 },
    "4R": { width: 15.24, height: 10.16, marginLeft: 0.62, marginRight: 0.62, marginTop: 0.58, marginBottom: 0.58 },
    "5R": { width: 17.78, height: 12.7, marginLeft: 0.7, marginRight: 0.7, marginTop: 0.6, marginBottom: 0.6 },
    "A4": { width: 21, height: 29.7, marginLeft: 1, marginRight: 1, marginTop: 1, marginBottom: 1 },
    "A5": { width: 14.8, height: 21, marginLeft: 0.8, marginRight: 0.8, marginTop: 0.8, marginBottom: 0.8 },
    "Letter": { width: 21.59, height: 27.94, marginLeft: 1, marginRight: 1, marginTop: 1, marginBottom: 1 },
    "Legal": { width: 21.59, height: 35.56, marginLeft: 1, marginRight: 1, marginTop: 1, marginBottom: 1 }
  };

  // Photo size configurations in cm
  const photoSizes = {
    "3.5x4.5": { width: 3.5, height: 4.5 },
    "2x2": { width: 5.08, height: 5.08 },
    "33x48mm": { width: 3.3, height: 4.8 },
    "25x35mm": { width: 2.5, height: 3.5 },
    "45x45mm": { width: 4.5, height: 4.5 },
    "35x50mm": { width: 3.5, height: 5.0 },
    "CR80": { width: 8.57, height: 5.4 },
    "3.5x2.5cm": { width: 3.5, height: 2.5 },
    "1x1": { width: 2.54, height: 2.54 },
    "1.2x1.6": { width: 3.05, height: 4.06 },
    "35x45mm": { width: 3.5, height: 4.5 }
  };

  const paper = paperSizes[req.paperSize];
  const photo = photoSizes[req.photoSize];

  // Background colors
  const backgroundColors = {
    white: '#FFFFFF',
    'light-gray': '#F5F5F5',
    blue: '#E3F2FD',
    red: '#FFEBEE',
    'light-blue': '#F0F8FF',
    cream: '#FFFDD0'
  };

  const bgColor = backgroundColors[req.backgroundColor as keyof typeof backgroundColors] || '#E3F2FD';

  // Calculate usable area
  const usableWidth = paper.width - paper.marginLeft - paper.marginRight;
  const usableHeight = paper.height - paper.marginTop - paper.marginBottom;
  
  // Calculate spacing for even distribution
  const totalPhotoWidth = req.columns * photo.width;
  const totalPhotoHeight = req.rows * photo.height;
  
  const spacingX = req.columns > 1 ? (usableWidth - totalPhotoWidth) / (req.columns - 1) : 0;
  const spacingY = req.rows > 1 ? (usableHeight - totalPhotoHeight) / (req.rows - 1) : 0;
  
  // Calculate starting positions to center the grid
  const startX = paper.marginLeft + (usableWidth - totalPhotoWidth - (req.columns - 1) * spacingX) / 2;
  const startY = paper.marginTop + (usableHeight - totalPhotoHeight - (req.rows - 1) * spacingY) / 2;

  // Generate photo grid
  let photoGrid = '';
  for (let row = 0; row < req.rows; row++) {
    for (let col = 0; col < req.columns; col++) {
      const x = startX + col * (photo.width + spacingX);
      const y = startY + row * (photo.height + spacingY);
      
      photoGrid += `
        <div class="photo-item" style="
          position: absolute;
          left: ${x}cm;
          top: ${y}cm;
          width: ${photo.width}cm;
          height: ${photo.height}cm;
          background-color: ${bgColor};
          border: 1px solid #ddd;
          overflow: hidden;
          box-sizing: border-box;
        ">
          <img src="${req.imageData}" alt="Passport Photo ${row * req.columns + col + 1}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
          " />
          
          <!-- Corner cutting marks -->
          <div class="corner-mark top-left" style="
            position: absolute;
            top: -1px;
            left: -1px;
            width: 8px;
            height: 8px;
            border-left: 1px solid #000;
            border-top: 1px solid #000;
          "></div>
          <div class="corner-mark top-right" style="
            position: absolute;
            top: -1px;
            right: -1px;
            width: 8px;
            height: 8px;
            border-right: 1px solid #000;
            border-top: 1px solid #000;
          "></div>
          <div class="corner-mark bottom-left" style="
            position: absolute;
            bottom: -1px;
            left: -1px;
            width: 8px;
            height: 8px;
            border-left: 1px solid #000;
            border-bottom: 1px solid #000;
          "></div>
          <div class="corner-mark bottom-right" style="
            position: absolute;
            bottom: -1px;
            right: -1px;
            width: 8px;
            height: 8px;
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
          "></div>
        </div>
      `;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passport Photo Layout - ${req.paperSize}</title>
  <style>
    /* Page setup for exact paper size */
    @page {
      size: ${paper.width}cm ${paper.height}cm;
      margin: 0;
      padding: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      width: ${paper.width}cm;
      height: ${paper.height}cm;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background: white;
      overflow: hidden;
    }
    
    .page-container {
      position: relative;
      width: ${paper.width}cm;
      height: ${paper.height}cm;
      background: white;
      overflow: hidden;
    }
    
    .info-header {
      position: absolute;
      top: 0.1cm;
      left: 0.2cm;
      right: 0.2cm;
      font-size: 7px;
      color: #666;
      text-align: center;
      z-index: 10;
      line-height: 1.2;
    }
    
    .photo-item {
      box-shadow: 0 0 1px rgba(0,0,0,0.2);
    }
    
    .corner-mark {
      pointer-events: none;
    }
    
    /* Paper border for reference */
    .paper-border {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px solid #eee;
      pointer-events: none;
    }
    
    /* Margin guides */
    .margin-guide {
      position: absolute;
      border: 1px dashed #ccc;
      pointer-events: none;
    }
    
    .margin-guide.top {
      top: ${paper.marginTop}cm;
      left: 0;
      right: 0;
      height: 0;
    }
    
    .margin-guide.bottom {
      bottom: ${paper.marginBottom}cm;
      left: 0;
      right: 0;
      height: 0;
    }
    
    .margin-guide.left {
      left: ${paper.marginLeft}cm;
      top: 0;
      bottom: 0;
      width: 0;
    }
    
    .margin-guide.right {
      right: ${paper.marginRight}cm;
      top: 0;
      bottom: 0;
      width: 0;
    }
    
    /* Print-specific styles */
    @media print {
      html, body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .info-header {
        display: none;
      }
      
      .margin-guide {
        display: none;
      }
      
      .paper-border {
        display: none;
      }
      
      .page-container {
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
      
      .page-container {
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        border: 1px solid #ddd;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- Info header (hidden in print) -->
    <div class="info-header">
      Passport Photo Layout - ${req.paperSize} Paper | Photo Size: ${req.photoSize} | 
      Grid: ${req.rows} × ${req.columns} = ${req.rows * req.columns} photos | 
      Background: ${req.backgroundColor} | Print at 100% scale
    </div>
    
    <!-- Paper border (hidden in print) -->
    <div class="paper-border"></div>
    
    <!-- Margin guides (hidden in print) -->
    <div class="margin-guide top"></div>
    <div class="margin-guide bottom"></div>
    <div class="margin-guide left"></div>
    <div class="margin-guide right"></div>
    
    <!-- Photo grid -->
    ${photoGrid}
  </div>
  
  <script>
    // Auto-print functionality
    function printLayout() {
      window.print();
    }
    
    // Add print button for convenience
    document.addEventListener('DOMContentLoaded', function() {
      // Only add print button on screen, not in print
      if (window.matchMedia && !window.matchMedia('print').matches) {
        const printBtn = document.createElement('button');
        printBtn.innerHTML = '🖨️ Print Layout';
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
        printBtn.onclick = printLayout;
        document.body.appendChild(printBtn);
      }
    });
    
    // Ensure images are loaded before printing
    window.addEventListener('load', function() {
      console.log('Layout loaded and ready for printing');
    });
  </script>
</body>
</html>`;
}
