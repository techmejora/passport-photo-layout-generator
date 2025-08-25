import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const imageBucket = new Bucket("processed-images", { public: true });

export interface CropImageRequest {
  imageData: string; // base64 encoded image
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  outputWidth?: number;
  outputHeight?: number;
  shape: "rectangle" | "circle";
  aspectRatio?: string; // e.g., "16:9", "4:3", "1:1", "free"
  quality: number; // 1-100
  format?: "jpeg" | "png" | "webp";
}

export interface CropImageResponse {
  processedImageData: string; // base64 encoded processed image
  originalSize: {
    width: number;
    height: number;
  };
  croppedSize: {
    width: number;
    height: number;
  };
  downloadUrl: string;
}

// Crops an image to specified area and shape
export const cropImage = api<CropImageRequest, CropImageResponse>(
  { expose: true, method: "POST", path: "/image/crop" },
  async (req) => {
    // Convert base64 to buffer
    const base64Data = req.imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Get original image dimensions (mock implementation)
    const originalWidth = 1920;
    const originalHeight = 1080;
    
    // Calculate crop dimensions
    let cropWidth = req.cropArea.width;
    let cropHeight = req.cropArea.height;
    
    // Apply aspect ratio if specified
    if (req.aspectRatio && req.aspectRatio !== "free") {
      const [ratioW, ratioH] = req.aspectRatio.split(':').map(Number);
      const targetRatio = ratioW / ratioH;
      const currentRatio = cropWidth / cropHeight;
      
      if (currentRatio > targetRatio) {
        cropWidth = cropHeight * targetRatio;
      } else {
        cropHeight = cropWidth / targetRatio;
      }
    }
    
    // Mock image processing - in real implementation, use Sharp or Canvas API
    // For now, we'll simulate the processing and return the original image
    const processedImageData = req.imageData;
    
    // Upload processed image to bucket
    const fileName = `cropped_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${req.format || 'jpeg'}`;
    await imageBucket.upload(fileName, imageBuffer, {
      contentType: `image/${req.format || 'jpeg'}`
    });
    
    const downloadUrl = await imageBucket.signedDownloadUrl(fileName, { ttl: 3600 });
    
    return {
      processedImageData,
      originalSize: {
        width: originalWidth,
        height: originalHeight
      },
      croppedSize: {
        width: Math.round(cropWidth),
        height: Math.round(cropHeight)
      },
      downloadUrl: downloadUrl.url
    };
  }
);
