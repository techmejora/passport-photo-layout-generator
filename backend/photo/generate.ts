import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const photoBucket = new Bucket("passport-photos", { public: true });

export interface GenerateLayoutRequest {
  imageData: string; // base64 encoded image
  paperSize: "3R" | "4R" | "5R" | "A4" | "A5" | "Letter" | "Legal";
  photoSize: "3.5x4.5" | "2x2" | "35x45mm";
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
    "3R": { width: 12.7, height: 8.89 },
    "4R": { width: 15.24, height: 10.16 },
    "5R": { width: 17.78, height: 12.7 },
    "A4": { width: 21, height: 29.7 },
    "A5": { width: 14.8, height: 21 },
    "Letter": { width: 21.59, height: 27.94 },
    "Legal": { width: 21.59, height: 35.56 }
  };

  // Photo size configurations in cm
  const photoSizes = {
    "3.5x4.5": { width: 3.5, height: 4.5 },
    "2x2": { width: 5.08, height: 5.08 },
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

  // Calculate spacing for even distribution
  const usableWidth = paper.width - 1; // 0.5cm margin on each side
  const usableHeight = paper.height - 1; // 0.5cm margin on each side
  
  const spacingX = req.columns > 1 ? (usableWidth - (req.columns * photo.width)) / (req.columns + 1) : (usableWidth - photo.width) / 2;
  const spacingY = req.rows > 1 ? (usableHeight - (req.rows * photo.height)) / (req.rows + 1) : (usableHeight - photo.height) / 2;

  // Generate photo grid
  let photoGrid = '';
  for (let row = 0; row < req.rows; row++) {
    for (let col = 0; col < req.columns; col++) {
      const x = spacingX + col * (photo.width + spacingX);
      const y = spacingY + row * (photo.height + spacingY);
      
      photoGrid += `
        <div class="photo-container" style="
          position: absolute;
          left: ${x}cm;
          top: ${y}cm;
          width: ${photo.width}cm;
          height: ${photo.height}cm;
          background-color: ${bgColor};
          border: 1px dashed #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        ">
          <img src="${req.imageData}" alt="Passport Photo" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          " />
          <!-- Cutting edges -->
          <div style="
            position: absolute;
            top: -2px;
            left: -2px;
            width: 4px;
            height: 4px;
            border-left: 1px solid #000;
            border-top: 1px solid #000;
          "></div>
          <div style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 4px;
            height: 4px;
            border-right: 1px solid #000;
            border-top: 1px solid #000;
          "></div>
          <div style="
            position: absolute;
            bottom: -2px;
            left: -2px;
            width: 4px;
            height: 4px;
            border-left: 1px solid #000;
            border-bottom: 1px solid #000;
          "></div>
          <div style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 4px;
            height: 4px;
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
    @page {
      size: ${paper.width}cm ${paper.height}cm;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      background: white;
      width: ${paper.width}cm;
      height: ${paper.height}cm;
      position: relative;
      overflow: hidden;
    }
    
    .layout-container {
      width: 100%;
      height: 100%;
      position: relative;
      background: white;
    }
    
    .info-header {
      position: absolute;
      top: 0.2cm;
      left: 0.2cm;
      right: 0.2cm;
      font-size: 8px;
      color: #666;
      text-align: center;
      z-index: 10;
    }
    
    .cutting-guide {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
    
    .photo-container {
      box-shadow: 0 0 2px rgba(0,0,0,0.1);
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .info-header {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="layout-container">
    <div class="info-header">
      Passport Photo Layout - ${req.paperSize} | Photo Size: ${req.photoSize} | Grid: ${req.rows} × ${req.columns} = ${req.rows * req.columns} photos | Background: ${req.backgroundColor}
    </div>
    
    ${photoGrid}
    
    <div class="cutting-guide">
      <!-- Paper border -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #ddd;
      "></div>
      
      <!-- Corner marks for paper cutting -->
      <div style="position: absolute; top: 0; left: 0; width: 0.5cm; height: 0.5cm; border-left: 2px solid #000; border-top: 2px solid #000;"></div>
      <div style="position: absolute; top: 0; right: 0; width: 0.5cm; height: 0.5cm; border-right: 2px solid #000; border-top: 2px solid #000;"></div>
      <div style="position: absolute; bottom: 0; left: 0; width: 0.5cm; height: 0.5cm; border-left: 2px solid #000; border-bottom: 2px solid #000;"></div>
      <div style="position: absolute; bottom: 0; right: 0; width: 0.5cm; height: 0.5cm; border-right: 2px solid #000; border-bottom: 2px solid #000;"></div>
    </div>
  </div>
  
  <script>
    // Auto-print when page loads (optional)
    window.onload = function() {
      // Uncomment the line below to auto-print
      // window.print();
    };
  </script>
</body>
</html>`;
}
