import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

export default function FileUploadZone({
  onFileSelect,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = ""
}: FileUploadZoneProps) {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const validateAndHandleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      toast({
        title: "File Too Large",
        description: `Please select an image smaller than ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    onFileSelect(file);
  }, [onFileSelect, maxSize, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  }, [validateAndHandleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
  }, [validateAndHandleFile]);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
        dragActive
          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 scale-105'
          : 'border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50'
      } ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <Upload className="h-8 w-8 text-purple-600" />
      </div>
      <p className="text-lg font-medium text-gray-700 mb-2">
        Drag and drop your photo here
      </p>
      <p className="text-sm text-gray-500 mb-6">
        or click to browse
      </p>
      
      <div className="flex space-x-2 justify-center">
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Browse Files
          </label>
        </Button>
        <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
      </div>
      
      <p className="text-xs text-gray-400 mt-4">
        Supported: JPG, PNG, WEBP up to {Math.round(maxSize / (1024 * 1024))}MB<br />
        Recommended: 300 DPI or higher
      </p>
    </div>
  );
}
