import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const cardBucket = new Bucket("pvc-cards", { public: true });

export interface GenerateCardLayoutRequest {
  frontCardImage: string; // base64 encoded image
  backCardImage?: string; // base64 encoded image (optional)
  paperSize: "4x6" | "A4" | "Letter";
  cardSize: "CR80" | "CR79" | "custom";
  customSize?: {
    width: number; // in mm
    height: number; // in mm
  };
  cardsPerRow: number;
  cardsPerColumn: number;
  spacing: number; // in mm
  bleedArea: boolean;
  cornerRadius: number; // in mm
}

export interface GenerateCardLayoutResponse {
  layoutUrl: string;
  downloadUrl: string;
  layoutId: string;
  specifications: {
    paperWidth: number;
    paperHeight: number;
    cardWidth: number;
    cardHeight: number;
    totalCards: number;
    dpi: number;
    bleedArea: number;
  };
}

// Generates a layout for existing PVC cards on photo paper
export const generateCardLayout = api<GenerateCardLayoutRequest, GenerateCardLayoutResponse>(
  { expose: true, method: "POST", path: "/card/layout" },
  async (req) => {
    const layoutId = `layout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Paper size configurations in mm - 4x6 is now vertical (4" width × 6" height)
    const paperSizes = {
      "4x6": { width: 101.6, height: 152.4 }, // 4x6 inches vertical (4" W × 6" H)
      "A4": { width: 210, height: 297 },
      "Letter": { width: 215.9, height: 279.4 }
    };
    
    // Card size configurations in mm
    const cardSizes = {
      "CR80": { width: 85.6, height: 53.98 }, // Standard credit card size
      "CR79": { width: 79.5, height: 50.0 },   // Slightly smaller
      "custom": req.customSize || { width: 85.6, height: 53.98 }
    };
    
    const paperSize = paperSizes[req.paperSize];
    const cardSize = cardSizes[req.cardSize];
    const bleedArea = req.bleedArea ? 3 : 0; // 3mm bleed
    
    // Generate layout HTML
    const layoutHtml = generateCardLayoutHtml(req, paperSize, cardSize, bleedArea, layoutId);
    
    // Upload layout file
    const fileName = `${layoutId}_layout.html`;
    
    await cardBucket.upload(fileName, Buffer.from(layoutHtml, 'utf-8'), {
      contentType: 'text/html'
    });
    
    const layoutUrl = cardBucket.publicUrl(fileName);
    const downloadUrl = await cardBucket.signedDownloadUrl(fileName, { ttl: 7200 });
    
    return {
      layoutUrl,
      downloadUrl: downloadUrl.url,
      layoutId,
      specifications: {
        paperWidth: paperSize.width,
        paperHeight: paperSize.height,
        cardWidth: cardSize.width + (bleedArea * 2),
        cardHeight: cardSize.height + (bleedArea * 2),
        totalCards: req.cardsPerRow * req.cardsPerColumn,
        dpi: 300,
        bleedArea
      }
    };
  }
);

function generateCardLayoutHtml(
  req: GenerateCardLayoutRequest,
  paperSize: { width: number; height: number },
  cardSize: { width: number; height: number },
  bleedArea: number,
  layoutId: string
): string {
  const totalCardWidth = cardSize.width + (bleedArea * 2);
  const totalCardHeight = cardSize.height + (bleedArea * 2);
  
  // Calculate grid layout
  const totalGridWidth = (req.cardsPerRow * totalCardWidth) + ((req.cardsPerRow - 1) * req.spacing);
  const totalGridHeight = (req.cardsPerColumn * totalCardHeight) + ((req.cardsPerColumn - 1) * req.spacing);
  
  // Center the grid on the paper
  const startX = (paperSize.width - totalGridWidth) / 2;
  const startY = (paperSize.height - totalGridHeight) / 2;
  
  // Generate card grid
  let cardGrid = '';
  for (let row = 0; row < req.cardsPerColumn; row++) {
    for (let col = 0; col < req.cardsPerRow; col++) {
      const x = startX + col * (totalCardWidth + req.spacing);
      const y = startY + row * (totalCardHeight + req.spacing);
      
      // For 4x6 paper: top row = front cards, bottom row = back cards
      // For other layouts: alternate front/back by column
      let isBackCard = false;
      let cardImage = req.frontCardImage;
      let cardLabel = 'FRONT';
      
      if (req.paperSize === '4x6' && req.backCardImage) {
        // For 4x6: top row (row 0) = front, bottom row (row 1) = back
        isBackCard = row === 1;
        cardImage = isBackCard ? req.backCardImage : req.frontCardImage;
        cardLabel = isBackCard ? 'BACK' : 'FRONT';
      } else if (req.backCardImage) {
        // For other paper sizes: alternate by column
        isBackCard = col % 2 === 1;
        cardImage = isBackCard ? req.backCardImage : req.frontCardImage;
        cardLabel = isBackCard ? 'BACK' : 'FRONT';
      }
      
      cardGrid += `
        <div class="card-item" style="
          position: absolute;
          left: ${x}mm;
          top: ${y}mm;
          width: ${totalCardWidth}mm;
          height: ${totalCardHeight}mm;
          border: 1px solid #ddd;
          overflow: hidden;
          box-sizing: border-box;
          border-radius: ${req.cornerRadius}mm;
          background: white;
        ">
          <img src="${cardImage}" alt="${cardLabel} Card ${row * req.cardsPerRow + col + 1}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
          " />
          
          <!-- Cutting marks -->
          <div class="cutting-marks">
            <!-- Top left -->
            <div style="
              position: absolute;
              top: -2mm;
              left: -2mm;
              width: 4mm;
              height: 1px;
              background: #000;
            "></div>
            <div style="
              position: absolute;
              top: -2mm;
              left: -2mm;
              width: 1px;
              height: 4mm;
              background: #000;
            "></div>
            
            <!-- Top right -->
            <div style="
              position: absolute;
              top: -2mm;
              right: -2mm;
              width: 4mm;
              height: 1px;
              background: #000;
            "></div>
            <div style="
              position: absolute;
              top: -2mm;
              right: -2mm;
              width: 1px;
              height: 4mm;
              background: #000;
            "></div>
            
            <!-- Bottom left -->
            <div style="
              position: absolute;
              bottom: -2mm;
              left: -2mm;
              width: 4mm;
              height: 1px;
              background: #000;
            "></div>
            <div style="
              position: absolute;
              bottom: -2mm;
              left: -2mm;
              width: 1px;
              height: 4mm;
              background: #000;
            "></div>
            
            <!-- Bottom right -->
            <div style="
              position: absolute;
              bottom: -2mm;
              right: -2mm;
              width: 4mm;
              height: 1px;
              background: #000;
            "></div>
            <div style="
              position: absolute;
              bottom: -2mm;
              right: -2mm;
              width: 1px;
              height: 4mm;
              background: #000;
            "></div>
          </div>
          
          <!-- Card label (hidden in print) -->
          <div class="card-label screen-only" style="
            position: absolute;
            bottom: -6mm;
            left: 50%;
            transform: translateX(-50%);
            font-size: 8px;
            color: #666;
            background: white;
            padding: 1px 4px;
            border-radius: 2px;
            white-space: nowrap;
          ">${cardLabel}</div>
        </div>
      `;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PVC Card Layout - ${req.paperSize}</title>
  <style>
    /* Page setup for exact paper size */
    @page {
      size: ${paperSize.width}mm ${paperSize.height}mm;
      margin: 0;
      padding: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      width: ${paperSize.width}mm;
      height: ${paperSize.height}mm;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background: white;
      overflow: hidden;
    }
    
    .page-container {
      position: relative;
      width: ${paperSize.width}mm;
      height: ${paperSize.height}mm;
      background: white;
      overflow: hidden;
    }
    
    .info-header {
      position: absolute;
      top: 2mm;
      left: 2mm;
      right: 2mm;
      font-size: 7px;
      color: #666;
      text-align: center;
      z-index: 10;
      line-height: 1.2;
    }
    
    .card-item {
      box-shadow: 0 0 1px rgba(0,0,0,0.2);
    }
    
    .cutting-marks {
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
    
    /* Print button styling */
    .print-button {
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
      font-family: Arial, sans-serif;
    }
    
    .print-button:hover {
      background: #0056b3;
    }
    
    /* Hide screen-only elements in print */
    @media print {
      html, body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .screen-only {
        display: none !important;
      }
      
      .info-header {
        display: none !important;
      }
      
      .card-label {
        display: none !important;
      }
      
      .paper-border {
        display: none !important;
      }
      
      .print-button {
        display: none !important;
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
    <div class="info-header screen-only">
      PVC Card Layout - ${req.paperSize} Paper (4" W × 6" H - Vertical) | Card Size: ${req.cardSize} | 
      Grid: ${req.cardsPerRow} × ${req.cardsPerColumn} = ${req.cardsPerRow * req.cardsPerColumn} cards | 
      Spacing: ${req.spacing}mm | ${req.bleedArea ? 'With' : 'Without'} bleed area | 
      ${req.paperSize === '4x6' && req.backCardImage ? 'Top: Front Cards, Bottom: Back Cards' : 'Alternating Front/Back'} | Print at 100% scale
    </div>
    
    <!-- Paper border (hidden in print) -->
    <div class="paper-border screen-only"></div>
    
    <!-- Card grid -->
    ${cardGrid}
  </div>
  
  <!-- Print button (hidden in print) -->
  <button class="print-button screen-only" onclick="printLayout()">
    🖨️ Print Layout
  </button>
  
  <script>
    // Auto-print functionality
    function printLayout() {
      window.print();
    }
    
    // Ensure images are loaded before printing
    window.addEventListener('load', function() {
      console.log('Card layout loaded and ready for printing');
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Ctrl+P or Cmd+P for print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printLayout();
      }
    });
  </script>
</body>
</html>`;
}
