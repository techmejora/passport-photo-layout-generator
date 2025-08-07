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
    // For now, return a mock response
    // In a real implementation, you would:
    // 1. Process the base64 image
    // 2. Remove background from the image
    // 3. Apply the selected background color
    // 4. Create the layout using a PDF library
    // 5. Upload to the bucket
    // 6. Return the URLs
    
    const mockLayoutId = `layout_${Date.now()}`;
    const layoutUrl = photoBucket.publicUrl(`${mockLayoutId}.pdf`);
    const downloadUrl = layoutUrl;
    
    return {
      layoutUrl,
      downloadUrl
    };
  }
);
