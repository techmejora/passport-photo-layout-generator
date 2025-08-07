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
    // Create a simple PDF-like content (in a real implementation, you would use a PDF library)
    const mockPdfContent = createMockPDF(req);
    
    const layoutId = `layout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${layoutId}.pdf`;
    
    // Upload the mock PDF to the bucket
    await photoBucket.upload(fileName, Buffer.from(mockPdfContent, 'utf-8'), {
      contentType: 'application/pdf'
    });
    
    const layoutUrl = photoBucket.publicUrl(fileName);
    const downloadUrl = await photoBucket.signedDownloadUrl(fileName, { ttl: 3600 }); // 1 hour expiry
    
    return {
      layoutUrl,
      downloadUrl: downloadUrl.url
    };
  }
);

function createMockPDF(req: GenerateLayoutRequest): string {
  // This is a mock PDF content. In a real implementation, you would use a proper PDF library
  // like PDFKit, jsPDF, or similar to create an actual PDF with the photos laid out correctly
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
100 700 Td
(Passport Photo Layout - ${req.paperSize}) Tj
0 -20 Td
(Photo Size: ${req.photoSize}) Tj
0 -20 Td
(Grid: ${req.rows} x ${req.columns} = ${req.rows * req.columns} photos) Tj
0 -20 Td
(Background: ${req.backgroundColor}) Tj
0 -40 Td
(Generated on: ${new Date().toISOString()}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
456
%%EOF`;
}
