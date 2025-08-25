import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, RotateCw } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onReplace: () => void;
  onProcess?: () => void;
  onRotate?: (rotatedImageData: string) => void;
  isProcessing?: boolean;
  className?: string;
}

export default function ImagePreview({
  src,
  alt,
  onReplace,
  onProcess,
  onRotate,
  isProcessing = false,
  className = ""
}: ImagePreviewProps) {
  const [rotation, setRotation] = useState(0);

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);

    if (onRotate) {
      // Create a canvas to rotate the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions based on rotation
        if (newRotation === 90 || newRotation === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        // Clear canvas and apply rotation
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        ctx!.save();
        
        // Move to center and rotate
        ctx!.translate(canvas.width / 2, canvas.height / 2);
        ctx!.rotate((newRotation * Math.PI) / 180);
        
        // Draw image centered
        ctx!.drawImage(img, -img.width / 2, -img.height / 2);
        ctx!.restore();

        // Convert to base64 and call onRotate
        const rotatedImageData = canvas.toDataURL('image/jpeg', 0.9);
        onRotate(rotatedImageData);
      };
      
      img.src = src;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-gray-300 transition-transform duration-300"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1" onClick={onReplace}>
          <Upload className="h-4 w-4 mr-2" />
          Replace
        </Button>
        <Button variant="outline" onClick={handleRotate}>
          <RotateCw className="h-4 w-4 mr-2" />
          Rotate
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
