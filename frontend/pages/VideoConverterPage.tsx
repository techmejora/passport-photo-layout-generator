import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Download, Upload, RotateCcw, Play, Music, Scissors } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import FileUploadZone from '../components/ui/FileUploadZone';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function VideoConverterPage() {
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [quality, setQuality] = useState('medium');
  const [resolution, setResolution] = useState('original');
  const [frameRate, setFrameRate] = useState('30');
  const [audioCodec, setAudioCodec] = useState('aac');
  const [videoCodec, setVideoCodec] = useState('h264');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('convert');

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedVideo(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleConvert = async () => {
    if (!selectedVideo) {
      toast({
        title: "No Video Selected",
        description: "Please select a video to convert",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      let resolutionObj;
      switch (resolution) {
        case '720p':
          resolutionObj = { width: 1280, height: 720 };
          break;
        case '1080p':
          resolutionObj = { width: 1920, height: 1080 };
          break;
        case '4k':
          resolutionObj = { width: 3840, height: 2160 };
          break;
        default:
          resolutionObj = undefined;
      }

      const result = await backend.video.convertVideo({
        videoData: selectedVideo,
        outputFormat: outputFormat as "mp4" | "webm" | "avi" | "mov" | "mkv" | "flv",
        quality: quality as "low" | "medium" | "high" | "ultra",
        resolution: resolutionObj,
        frameRate: parseInt(frameRate),
        audioCodec: audioCodec as "aac" | "mp3" | "opus" | "none",
        videoCodec: videoCodec as "h264" | "h265" | "vp9" | "av1"
      });

      setProcessedResult(result);
      
      toast({
        title: "Video Converted Successfully",
        description: `Video converted to ${outputFormat.toUpperCase()} format`,
      });
    } catch (error) {
      console.error('Failed to convert video:', error);
      toast({
        title: "Conversion Failed",
        description: "Failed to convert video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompress = async () => {
    if (!selectedVideo) {
      toast({
        title: "No Video Selected",
        description: "Please select a video to compress",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await backend.video.compressVideo({
        videoData: selectedVideo,
        compressionLevel: quality as "light" | "medium" | "heavy" | "custom",
        quality: 75
      });

      setProcessedResult(result);
      
      toast({
        title: "Video Compressed Successfully",
        description: `Video compressed by ${result.compressionRatio}%`,
      });
    } catch (error) {
      console.error('Failed to compress video:', error);
      toast({
        title: "Compression Failed",
        description: "Failed to compress video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractAudio = async () => {
    if (!selectedVideo) {
      toast({
        title: "No Video Selected",
        description: "Please select a video to extract audio from",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await backend.video.extractAudio({
        videoData: selectedVideo,
        outputFormat: audioCodec as "mp3" | "wav" | "aac" | "ogg" | "flac",
        quality: quality as "low" | "medium" | "high"
      });

      setProcessedResult(result);
      
      toast({
        title: "Audio Extracted Successfully",
        description: `Audio extracted as ${audioCodec.toUpperCase()} format`,
      });
    } catch (error) {
      console.error('Failed to extract audio:', error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedVideo(null);
    setProcessedResult(null);
  };

  const handleReplace = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFile(file);
      }
    };
    input.click();
  }, [handleFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-red-50 to-pink-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full shadow-lg">
            <Video className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Video Converter</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert videos to any format, compress for smaller file sizes, or extract audio tracks with professional quality.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg p-1 shadow-lg">
          <Button
            variant={activeTab === 'convert' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('convert')}
            className={activeTab === 'convert' ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white' : ''}
          >
            <Video className="h-4 w-4 mr-2" />
            Convert
          </Button>
          <Button
            variant={activeTab === 'compress' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('compress')}
            className={activeTab === 'compress' ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white' : ''}
          >
            <Scissors className="h-4 w-4 mr-2" />
            Compress
          </Button>
          <Button
            variant={activeTab === 'extract' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('extract')}
            className={activeTab === 'extract' ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white' : ''}
          >
            <Music className="h-4 w-4 mr-2" />
            Extract Audio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Video</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedVideo ? (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-64 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-red-400 mx-auto mb-2" />
                        <p className="text-red-600 font-medium">Video Selected</p>
                        <p className="text-sm text-red-500">Ready for processing</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 border-red-200 hover:bg-red-50" onClick={handleReplace}>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                  </div>
                </div>
              ) : (
                <FileUploadZone 
                  onFileSelect={handleFile} 
                  accept="video/*"
                  maxSize={500 * 1024 * 1024} // 500MB
                />
              )}
            </CardContent>
          </Card>

          {processedResult && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle>Processing Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {processedResult.convertedInfo && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-700">Format:</div>
                        <div className="text-gray-600">{processedResult.convertedInfo.format.toUpperCase()}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Resolution:</div>
                        <div className="text-gray-600">{processedResult.convertedInfo.resolution.width}×{processedResult.convertedInfo.resolution.height}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Duration:</div>
                        <div className="text-gray-600">{processedResult.convertedInfo.duration}s</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">File Size:</div>
                        <div className="text-gray-600">{formatFileSize(processedResult.convertedInfo.estimatedFileSize)}</div>
                      </div>
                    </div>
                  )}
                  
                  {processedResult.compressionRatio && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-700">Original Size:</div>
                        <div className="text-gray-600">{formatFileSize(processedResult.originalSize)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Compressed Size:</div>
                        <div className="text-gray-600">{formatFileSize(processedResult.compressedSize)}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="font-medium text-gray-700">Compression Ratio:</div>
                        <div className="text-gray-600">{processedResult.compressionRatio}% reduction</div>
                      </div>
                    </div>
                  )}

                  {processedResult.audioInfo && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-700">Audio Format:</div>
                        <div className="text-gray-600">{processedResult.audioInfo.format.toUpperCase()}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Bitrate:</div>
                        <div className="text-gray-600">{processedResult.audioInfo.bitrate} kbps</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Duration:</div>
                        <div className="text-gray-600">{processedResult.audioInfo.duration}s</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">File Size:</div>
                        <div className="text-gray-600">{formatFileSize(processedResult.audioInfo.fileSize)}</div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => window.open(processedResult.downloadUrl, '_blank')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Processed File
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle>
                {activeTab === 'convert' && 'Conversion Settings'}
                {activeTab === 'compress' && 'Compression Settings'}
                {activeTab === 'extract' && 'Audio Extraction Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {activeTab === 'convert' && (
                <>
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">MP4</SelectItem>
                        <SelectItem value="webm">WebM</SelectItem>
                        <SelectItem value="avi">AVI</SelectItem>
                        <SelectItem value="mov">MOV</SelectItem>
                        <SelectItem value="mkv">MKV</SelectItem>
                        <SelectItem value="flv">FLV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Video Codec</Label>
                    <Select value={videoCodec} onValueChange={setVideoCodec}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="h264">H.264</SelectItem>
                        <SelectItem value="h265">H.265 (HEVC)</SelectItem>
                        <SelectItem value="vp9">VP9</SelectItem>
                        <SelectItem value="av1">AV1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Audio Codec</Label>
                    <Select value={audioCodec} onValueChange={setAudioCodec}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aac">AAC</SelectItem>
                        <SelectItem value="mp3">MP3</SelectItem>
                        <SelectItem value="opus">Opus</SelectItem>
                        <SelectItem value="none">No Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Resolution</Label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="720p">720p (HD)</SelectItem>
                        <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                        <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Frame Rate</Label>
                    <Select value={frameRate} onValueChange={setFrameRate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 fps</SelectItem>
                        <SelectItem value="30">30 fps</SelectItem>
                        <SelectItem value="60">60 fps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {activeTab === 'extract' && (
                <>
                  <div className="space-y-2">
                    <Label>Audio Format</Label>
                    <Select value={audioCodec} onValueChange={setAudioCodec}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp3">MP3</SelectItem>
                        <SelectItem value="wav">WAV</SelectItem>
                        <SelectItem value="aac">AAC</SelectItem>
                        <SelectItem value="ogg">OGG</SelectItem>
                        <SelectItem value="flac">FLAC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Quality</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setOutputFormat('mp4');
                      setQuality('medium');
                      setResolution('720p');
                    }}
                  >
                    Web Optimized
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setOutputFormat('mp4');
                      setQuality('high');
                      setResolution('1080p');
                    }}
                  >
                    High Quality
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setOutputFormat('mp4');
                      setQuality('low');
                      setResolution('720p');
                    }}
                  >
                    Small File
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setOutputFormat('webm');
                      setQuality('medium');
                      setResolution('1080p');
                    }}
                  >
                    Web Streaming
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1 border-red-200 hover:bg-red-50" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={activeTab === 'convert' ? handleConvert : activeTab === 'compress' ? handleCompress : handleExtractAudio}
                  disabled={!selectedVideo || isProcessing}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      {activeTab === 'convert' && 'Convert Video'}
                      {activeTab === 'compress' && 'Compress Video'}
                      {activeTab === 'extract' && 'Extract Audio'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
