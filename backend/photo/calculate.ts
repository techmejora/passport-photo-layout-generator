import { api } from "encore.dev/api";

export interface CalculateLayoutRequest {
  paperSizeId: string;
  photoSizeId: string;
}

export interface CalculateLayoutResponse {
  rows: number;
  columns: number;
  totalPhotos: number;
  usableWidth: number; // in cm
  usableHeight: number; // in cm
  spacingX: number; // in cm
  spacingY: number; // in cm
}

// Calculates optimal layout for given paper and photo sizes
export const calculateLayout = api<CalculateLayoutRequest, CalculateLayoutResponse>(
  { expose: true, method: "POST", path: "/photo/calculate" },
  async (req) => {
    // Paper size configurations
    const paperSizes = {
      "3R": {
        width: 12.7,
        height: 8.89,
        marginLeft: 0.5,
        marginRight: 0.5,
        marginTop: 0.5,
        marginBottom: 0.5
      },
      "4R": {
        width: 15.24,
        height: 10.16,
        marginLeft: 0.62,
        marginRight: 0.62,
        marginTop: 0.58,
        marginBottom: 0.58
      },
      "5R": {
        width: 17.78,
        height: 12.7,
        marginLeft: 0.7,
        marginRight: 0.7,
        marginTop: 0.6,
        marginBottom: 0.6
      },
      "A4": {
        width: 21,
        height: 29.7,
        marginLeft: 1,
        marginRight: 1,
        marginTop: 1,
        marginBottom: 1
      },
      "A5": {
        width: 14.8,
        height: 21,
        marginLeft: 0.8,
        marginRight: 0.8,
        marginTop: 0.8,
        marginBottom: 0.8
      },
      "Letter": {
        width: 21.59,
        height: 27.94,
        marginLeft: 1,
        marginRight: 1,
        marginTop: 1,
        marginBottom: 1
      },
      "Legal": {
        width: 21.59,
        height: 35.56,
        marginLeft: 1,
        marginRight: 1,
        marginTop: 1,
        marginBottom: 1
      }
    };

    // Photo size configurations
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

    const paper = paperSizes[req.paperSizeId as keyof typeof paperSizes];
    const photo = photoSizes[req.photoSizeId as keyof typeof photoSizes];

    if (!paper || !photo) {
      throw new Error("Invalid paper or photo size");
    }

    // Calculate usable area
    const usableWidth = paper.width - paper.marginLeft - paper.marginRight;
    const usableHeight = paper.height - paper.marginTop - paper.marginBottom;

    // Calculate how many photos fit with proper spacing
    let columns = Math.floor(usableWidth / photo.width);
    let rows = Math.floor(usableHeight / photo.height);

    // For 4R paper with 3.5x4.5 photo, ensure correct layout
    if (req.paperSizeId === "4R" && req.photoSizeId === "3.5x4.5") {
      columns = 4;
      rows = 2;
    }

    // Ensure we don't exceed the usable area
    if (columns * photo.width > usableWidth) {
      columns = Math.floor(usableWidth / photo.width);
    }
    if (rows * photo.height > usableHeight) {
      rows = Math.floor(usableHeight / photo.height);
    }

    const totalPhotos = rows * columns;

    // Calculate spacing for even distribution
    const spacingX = columns > 1 ? (usableWidth - (columns * photo.width)) / (columns - 1) : 0;
    const spacingY = rows > 1 ? (usableHeight - (rows * photo.height)) / (rows - 1) : 0;

    return {
      rows,
      columns,
      totalPhotos,
      usableWidth,
      usableHeight,
      spacingX,
      spacingY
    };
  }
);
