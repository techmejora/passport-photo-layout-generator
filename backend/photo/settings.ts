import { api } from "encore.dev/api";

export interface PhotoSettings {
  paperSizes: PaperSize[];
  photoSizes: PhotoSize[];
  backgroundColors: BackgroundColor[];
}

export interface PaperSize {
  id: string;
  name: string;
  width: number; // in cm
  height: number; // in cm
  marginLeft: number; // in cm
  marginRight: number; // in cm
  marginTop: number; // in cm
  marginBottom: number; // in cm
}

export interface PhotoSize {
  id: string;
  name: string;
  width: number; // in cm
  height: number; // in cm
  borderWidth: number; // in mm
}

export interface BackgroundColor {
  id: string;
  name: string;
  hex: string;
}

// Gets available photo settings
export const getSettings = api<void, PhotoSettings>(
  { expose: true, method: "GET", path: "/photo/settings" },
  async () => {
    return {
      paperSizes: [
        {
          id: "4x6",
          name: "4\" × 6\" (10.16 × 15.24 cm)",
          width: 15.24,
          height: 10.16,
          marginLeft: 0.62,
          marginRight: 0.62,
          marginTop: 0.58,
          marginBottom: 0.58
        },
        {
          id: "A4",
          name: "A4 (21 × 29.7 cm)",
          width: 21,
          height: 29.7,
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
          marginBottom: 1
        }
      ],
      photoSizes: [
        {
          id: "3.5x4.5",
          name: "3.5 × 4.5 cm (Passport)",
          width: 3.5,
          height: 4.5,
          borderWidth: 3
        },
        {
          id: "2x2",
          name: "2\" × 2\" (5.08 × 5.08 cm)",
          width: 5.08,
          height: 5.08,
          borderWidth: 2
        },
        {
          id: "35x45mm",
          name: "35 × 45 mm",
          width: 3.5,
          height: 4.5,
          borderWidth: 2
        }
      ],
      backgroundColors: [
        { id: "white", name: "White", hex: "#FFFFFF" },
        { id: "light-gray", name: "Light Gray", hex: "#F5F5F5" },
        { id: "blue", name: "Blue", hex: "#E3F2FD" },
        { id: "red", name: "Red", hex: "#FFEBEE" }
      ]
    };
  }
);
