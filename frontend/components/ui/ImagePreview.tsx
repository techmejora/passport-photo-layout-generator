import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onReplace: () => void;
  onProcess?: () => void;
  isProcessing?: boolean;
  className?: string;
}

export default function ImagePreview({
  src,
  alt,
  onReplace,
  onProcess,
  isProcessing = false,
  className = ""
}: ImagePreviewProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-gray-300"
        />
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1" onClick={onReplace}>
          <Upload className="h-4 w-4 mr-2" />
          Replace
        </Button>
        {onProcess && (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onProcess}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Remove BG
              </>
            )}
          </Button>
        )}
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        Supported: JPG, PNG, WEBP up to 10MB<br />
        Recommended: 300 DPI or higher
      </p>
    </div>
  );
}
