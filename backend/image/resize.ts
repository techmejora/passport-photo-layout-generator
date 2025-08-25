import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const imageBucket = new Bucket("processed-images", { public: true });

export interface ResizeImageRequest {
  imageData: string; // base64 encoded image
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  quality: number; // 1-100
  format?: "jpeg" | "png" | "webp";
}

export interface ResizeImageResponse {
  processedImageData: string; // base64 encoded processed image
  originalSize: {
    width: number;
    height: number;
    fileSize: number; // in bytes
  };
  newSize: {
    width: number;
    height: number;
    fileSize: number; // in bytes
  };
  downloadUrl: string;
}

// Resizes an image to specified dimensions
export const resizeImage = api<ResizeImageRequest, ResizeImageResponse>(
  { expose: true, method: "POST", path: "/image/resize" },
  async (req) => {
    // Convert base64 to buffer
    const base64Data = req.imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Get original image dimensions (mock implementation)
    const originalWidth = 1920; // In real implementation, use image processing library
    const originalHeight = 1080;
    const originalFileSize = imageBuffer.length;
    
    // Calculate new dimensions
    let newWidth = req.width;
    let newHeight = req.height;
    
    if (req.maintainAspectRatio) {
      const aspectRatio = originalWidth / originalHeight;
      if (req.width / req.height > aspectRatio) {
        newWidth = Math.round(req.height * aspectRatio);
      } else {
        newHeight = Math.round(req.width / aspectRatio);
      }
    }
    
    // Mock image processing - in real implementation, use Sharp or similar
    // For now, we'll simulate the processing and return the original image
    const processedImageData = req.imageData;
    
    // Calculate new file size (mock)
    const compressionRatio = req.quality / 100;
    const sizeRatio = (newWidth * newHeight) / (originalWidth * originalHeight);
    const newFileSize = Math.round(originalFileSize * sizeRatio * compressionRatio);
    
    // Upload processed image to bucket
    const fileName = `resized_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${req.format || 'jpeg'}`;
    await imageBucket.upload(fileName, imageBuffer, {
      contentType: `image/${req.format || 'jpeg'}`
    });
    
    const downloadUrl = await imageBucket.signedDownloadUrl(fileName, { ttl: 3600 });
    
    return {
      processedImageData,
      originalSize: {
        width: originalWidth,
        height: originalHeight,
        fileSize: originalFileSize
      },
      newSize: {
        width: newWidth,
        height: newHeight,
        fileSize: newFileSize
      },
      downloadUrl: downloadUrl.url
    };
  }
);
