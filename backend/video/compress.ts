import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const videoBucket = new Bucket("processed-videos", { public: true });

export interface CompressVideoRequest {
  videoData: string; // base64 encoded video
  compressionLevel: "light" | "medium" | "heavy" | "custom";
  targetFileSize?: number; // in MB
  maxWidth?: number;
  maxHeight?: number;
  quality: number; // 1-100
  removeAudio?: boolean;
}

export interface CompressVideoResponse {
  compressedVideoUrl: string;
  downloadUrl: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  compressionRatio: number; // percentage
  compressionId: string;
}

// Compresses video to reduce file size
export const compressVideo = api<CompressVideoRequest, CompressVideoResponse>(
  { expose: true, method: "POST", path: "/video/compress" },
  async (req) => {
    // Generate compression ID
    const compressionId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock original video size
    const originalSize = 100 * 1024 * 1024; // 100MB
    
    // Calculate compression ratio based on level
    let compressionRatio: number;
    switch (req.compressionLevel) {
      case "light":
        compressionRatio = 0.8; // 20% reduction
        break;
      case "medium":
        compressionRatio = 0.6; // 40% reduction
        break;
      case "heavy":
        compressionRatio = 0.3; // 70% reduction
        break;
      case "custom":
        compressionRatio = req.quality / 100;
        break;
    }
    
    // Apply target file size if specified
    if (req.targetFileSize) {
      const targetBytes = req.targetFileSize * 1024 * 1024;
      compressionRatio = Math.min(compressionRatio, targetBytes / originalSize);
    }
    
    const compressedSize = Math.round(originalSize * compressionRatio);
    
    // Mock video processing
    const fileName = `compressed_${compressionId}.mp4`;
    const mockVideoBuffer = Buffer.from("mock compressed video data");
    
    await videoBucket.upload(fileName, mockVideoBuffer, {
      contentType: "video/mp4"
    });
    
    const compressedVideoUrl = videoBucket.publicUrl(fileName);
    const downloadUrl = await videoBucket.signedDownloadUrl(fileName, { ttl: 7200 });
    
    return {
      compressedVideoUrl,
      downloadUrl: downloadUrl.url,
      originalSize,
      compressedSize,
      compressionRatio: Math.round((1 - compressionRatio) * 100),
      compressionId
    };
  }
);
