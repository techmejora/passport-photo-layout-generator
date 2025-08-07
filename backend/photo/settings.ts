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
          id: "3R",
          name: "3R (3.5 × 5 inch)",
          width: 12.7,
          height: 8.89,
          marginLeft: 0.5,
          marginRight: 0.5,
          marginTop: 0.5,
          marginBottom: 0.5
        },
        {
          id: "4R",
          name: "4R (6 × 4 inch)",
          width: 15.24,
          height: 10.16,
          marginLeft: 0.62,
          marginRight: 0.62,
          marginTop: 0.58,
          marginBottom: 0.58
        },
        {
          id: "5R",
          name: "5R (7 × 5 inch)",
          width: 17.78,
          height: 12.7,
          marginLeft: 0.7,
          marginRight: 0.7,
          marginTop: 0.6,
          marginBottom: 0.6
        },
        {
          id: "A4",
          name: "A4 (8.27 × 11.69 inch)",
          width: 21,
          height: 29.7,
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
          marginBottom: 1
        },
        {
          id: "A5",
          name: "A5 (5.83 × 8.27 inch)",
          width: 14.8,
          height: 21,
          marginLeft: 0.8,
          marginRight: 0.8,
          marginTop: 0.8,
          marginBottom: 0.8
        },
        {
          id: "Letter",
          name: "Letter (8.5 × 11 inch)",
          width: 21.59,
          height: 27.94,
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
          marginBottom: 1
        },
        {
          id: "Legal",
          name: "Legal (8.5 × 14 inch)",
          width: 21.59,
          height: 35.56,
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
          marginBottom: 1
        }
      ],
      photoSizes: [
        {
          id: "3.5x4.5",
          name: "3.5 × 4.5 cm (India, EU, UK)",
          width: 3.5,
          height: 4.5,
          borderWidth: 3
        },
        {
          id: "2x2",
          name: "2\" × 2\" (US, Canada)",
          width: 5.08,
          height: 5.08,
          borderWidth: 2
        },
        {
          id: "33x48mm",
          name: "33 × 48 mm (China)",
          width: 3.3,
          height: 4.8,
          borderWidth: 2
        },
        {
          id: "25x35mm",
          name: "25 × 35 mm (India PAN)",
          width: 2.5,
          height: 3.5,
          borderWidth: 2
        },
        {
          id: "45x45mm",
          name: "45 × 45 mm (Vietnam)",
          width: 4.5,
          height: 4.5,
          borderWidth: 2
        },
        {
          id: "35x50mm",
          name: "35 × 50 mm (France/Italy)",
          width: 3.5,
          height: 5.0,
          borderWidth: 2
        },
        {
          id: "CR80",
          name: "CR80 (3.375 × 2.125 in) - Standard Card",
          width: 8.57,
          height: 5.4,
          borderWidth: 2
        },
        {
          id: "3.5x2.5cm",
          name: "3.5 × 2.5 cm - PAN Card (India)",
          width: 3.5,
          height: 2.5,
          borderWidth: 1
        },
        {
          id: "1x1",
          name: "1\" × 1\" - Stamp Photo",
          width: 2.54,
          height: 2.54,
          borderWidth: 1
        },
        {
          id: "1.2x1.6",
          name: "1.2\" × 1.6\" - Stamp Photo",
          width: 3.05,
          height: 4.06,
          borderWidth: 1
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
        { id: "red", name: "Red", hex: "#FFEBEE" },
        { id: "light-blue", name: "Light Blue", hex: "#F0F8FF" },
        { id: "cream", name: "Cream", hex: "#FFFDD0" }
      ]
    };
  }
);
