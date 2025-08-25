import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const imageBucket = new Bucket("processed-images", { public: true });

export interface EnhanceImageRequest {
  imageData: string; // base64 encoded image
  adjustments: {
    brightness: number; // 0-200, 100 is normal
    contrast: number; // 0-200, 100 is normal
    saturation: number; // 0-200, 100 is normal
    sharpness: number; // 0-100, 50 is normal
    hue?: number; // -180 to 180
    gamma?: number; // 0.1-3.0, 1.0 is normal
  };
  preset?: "vibrant" | "vintage" | "portrait" | "landscape" | "bw" | "sepia";
  quality: number; // 1-100
  format?: "jpeg" | "png" | "webp";
}

export interface EnhanceImageResponse {
  processedImageData: string; // base64 encoded processed image
  appliedAdjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    sharpness: number;
    hue: number;
    gamma: number;
  };
  downloadUrl: string;
}

// Enhances an image with various adjustments
export const enhanceImage = api<EnhanceImageRequest, EnhanceImageResponse>(
  { expose: true, method: "POST", path: "/image/enhance" },
  async (req) => {
    // Convert base64 to buffer
    const base64Data = req.imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Apply preset adjustments if specified
    let adjustments = { ...req.adjustments };
    
    if (req.preset) {
      switch (req.preset) {
        case "vibrant":
          adjustments = {
            brightness: 110,
            contrast: 120,
            saturation: 130,
            sharpness: 70,
            hue: 0,
            gamma: 1.1
          };
          break;
        case "vintage":
          adjustments = {
            brightness: 90,
            contrast: 80,
            saturation: 70,
            sharpness: 60,
            hue: 15,
            gamma: 1.2
          };
          break;
        case "portrait":
          adjustments = {
            brightness: 105,
            contrast: 110,
            saturation: 105,
            sharpness: 80,
            hue: 0,
            gamma: 1.0
          };
          break;
        case "landscape":
          adjustments = {
            brightness: 100,
            contrast: 115,
            saturation: 120,
            sharpness: 75,
            hue: 0,
            gamma: 1.0
          };
          break;
        case "bw":
          adjustments = {
            brightness: 100,
            contrast: 110,
            saturation: 0,
            sharpness: 70,
            hue: 0,
            gamma: 1.0
          };
          break;
        case "sepia":
          adjustments = {
            brightness: 110,
            contrast: 105,
            saturation: 80,
            sharpness: 65,
            hue: 30,
            gamma: 1.1
          };
          break;
      }
    }
    
    // Ensure all adjustment values are within valid ranges
    const finalAdjustments = {
      brightness: Math.max(0, Math.min(200, adjustments.brightness)),
      contrast: Math.max(0, Math.min(200, adjustments.contrast)),
      saturation: Math.max(0, Math.min(200, adjustments.saturation)),
      sharpness: Math.max(0, Math.min(100, adjustments.sharpness)),
      hue: Math.max(-180, Math.min(180, adjustments.hue || 0)),
      gamma: Math.max(0.1, Math.min(3.0, adjustments.gamma || 1.0))
    };
    
    // Mock image processing - in real implementation, use Sharp or Canvas API
    // For now, we'll simulate the processing and return the original image
    const processedImageData = req.imageData;
    
    // Upload processed image to bucket
    const fileName = `enhanced_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${req.format || 'jpeg'}`;
    await imageBucket.upload(fileName, imageBuffer, {
      contentType: `image/${req.format || 'jpeg'}`
    });
    
    const downloadUrl = await imageBucket.signedDownloadUrl(fileName, { ttl: 3600 });
    
    return {
      processedImageData,
      appliedAdjustments: finalAdjustments,
      downloadUrl: downloadUrl.url
    };
  }
);
