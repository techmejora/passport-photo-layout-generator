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
      "4x6": {
        width: 15.24,
        height: 10.16,
        marginLeft: 0.62,
        marginRight: 0.62,
        marginTop: 0.58,
        marginBottom: 0.58
      },
      "A4": {
        width: 21,
        height: 29.7,
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

    // Calculate how many photos fit
    const columns = Math.floor(usableWidth / photo.width);
    const rows = Math.floor(usableHeight / photo.height);
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
