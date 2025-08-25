import { api } from "encore.dev/api";
import { Bucket } from "encore.dev/storage/objects";

const audioBucket = new Bucket("extracted-audio", { public: true });

export interface ExtractAudioRequest {
  videoData: string; // base64 encoded video
  outputFormat: "mp3" | "wav" | "aac" | "ogg" | "flac";
  quality: "low" | "medium" | "high";
  startTime?: number; // seconds
  duration?: number; // seconds
  bitrate?: number; // kbps
}

export interface ExtractAudioResponse {
  audioUrl: string;
  downloadUrl: string;
  audioInfo: {
    format: string;
    duration: number;
    bitrate: number;
    fileSize: number;
  };
  extractionId: string;
}

// Extracts audio from video file
export const extractAudio = api<ExtractAudioRequest, ExtractAudioResponse>(
  { expose: true, method: "POST", path: "/video/extract-audio" },
  async (req) => {
    // Generate extraction ID
    const extractionId = `extract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate bitrate based on quality
    let bitrate: number;
    switch (req.quality) {
      case "low":
        bitrate = 128;
        break;
      case "medium":
        bitrate = 192;
        break;
      case "high":
        bitrate = 320;
        break;
    }
    
    if (req.bitrate) {
      bitrate = req.bitrate;
    }
    
    // Mock audio extraction
    const duration = req.duration || 120; // 2 minutes default
    const fileSize = Math.round((bitrate * duration * 1000) / 8); // Calculate file size in bytes
    
    const fileName = `extracted_${extractionId}.${req.outputFormat}`;
    const mockAudioBuffer = Buffer.from("mock audio data");
    
    await audioBucket.upload(fileName, mockAudioBuffer, {
      contentType: `audio/${req.outputFormat}`
    });
    
    const audioUrl = audioBucket.publicUrl(fileName);
    const downloadUrl = await audioBucket.signedDownloadUrl(fileName, { ttl: 7200 });
    
    return {
      audioUrl,
      downloadUrl: downloadUrl.url,
      audioInfo: {
        format: req.outputFormat,
        duration,
        bitrate,
        fileSize
      },
      extractionId
    };
  }
);
