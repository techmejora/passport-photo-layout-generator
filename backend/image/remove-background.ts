import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const imageBucket = new Bucket("processed-images", { public: true });

export interface RemoveBackgroundRequest {
  imageData: string; // base64 encoded image
  outputFormat?: "png" | "jpeg" | "webp";
  quality?: number; // 1-100, only for jpeg/webp
  transparentBackground?: boolean; // if false, use white background
  edgeSmoothing?: boolean; // apply edge smoothing
  featherRadius?: number; // edge feathering in pixels (0-10)
}

export interface RemoveBackgroundResponse {
  processedImageData: string; // base64 encoded processed image
  originalSize: {
    width: number;
    height: number;
    fileSize: number; // in bytes
  };
  processedSize: {
    width: number;
    height: number;
    fileSize: number; // in bytes
  };
  downloadUrl: string;
  processingTime: number; // in milliseconds
}

// Removes background from image using AI
export const removeBackground = api<RemoveBackgroundRequest, RemoveBackgroundResponse>(
  { expose: true, method: "POST", path: "/image/remove-background" },
  async (req) => {
    const startTime = Date.now();
    
    // Convert base64 to buffer
    const base64Data = req.imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Mock original image dimensions and file size
    const originalWidth = 1920;
    const originalHeight = 1080;
    const originalFileSize = imageBuffer.length;
    
    // Mock background removal processing
    // In real implementation, this would use AI services like:
    // - Remove.bg API
    // - Adobe Photoshop API
    // - Local AI models (U²-Net, MODNet, etc.)
    // - Cloud AI services (Google Cloud Vision, AWS Rekognition)
    
    // Simulate processing time based on image complexity
    const processingDelay = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, processingDelay));
    
    // For demo purposes, return the original image with simulated transparency
    // In real implementation, this would be the actual processed image
    const outputFormat = req.outputFormat || 'png';
    const quality = req.quality || 90;
    
    // Mock processed image - in reality this would be the background-removed image
    let processedImageData = req.imageData;
    
    // If transparent background is disabled, simulate white background
    if (req.transparentBackground === false && outputFormat !== 'jpeg') {
      // In real implementation, composite the transparent image onto white background
      processedImageData = req.imageData; // Mock: keep original for demo
    }
    
    // Calculate processed file size (typically smaller after background removal)
    const compressionRatio = outputFormat === 'png' ? 0.8 : 0.6;
    const processedFileSize = Math.round(originalFileSize * compressionRatio);
    
    // Upload processed image to bucket
    const fileName = `bg_removed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${outputFormat}`;
    await imageBucket.upload(fileName, imageBuffer, {
      contentType: `image/${outputFormat}`
    });
    
    const downloadUrl = await imageBucket.signedDownloadUrl(fileName, { ttl: 3600 });
    const processingTime = Date.now() - startTime;
    
    return {
      processedImageData,
      originalSize: {
        width: originalWidth,
        height: originalHeight,
        fileSize: originalFileSize
      },
      processedSize: {
        width: originalWidth,
        height: originalHeight,
        fileSize: processedFileSize
      },
      downloadUrl: downloadUrl.url,
      processingTime
    };
  }
);
