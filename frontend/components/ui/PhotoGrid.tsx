import React from 'react';
import { User } from 'lucide-react';
import type { CalculateLayoutResponse } from '~backend/photo/calculate';

interface PhotoGridProps {
  layout: CalculateLayoutResponse;
  selectedImage: string | null;
  backgroundColor: string;
}

const backgroundColors = {
  white: '#FFFFFF',
  'light-gray': '#F5F5F5',
  blue: '#E3F2FD',
  red: '#FFEBEE',
  'light-blue': '#F0F8FF',
  cream: '#FFFDD0'
};

export default function PhotoGrid({ 
  layout, 
  selectedImage, 
  backgroundColor 
}: PhotoGridProps) {
  const bgColor = backgroundColors[backgroundColor as keyof typeof backgroundColors] || '#E3F2FD';

  return (
    <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 border border-purple-100">
      <div 
        className="mx-auto border-2 border-purple-300 rounded-lg p-4 bg-white shadow-lg"
        style={{
          width: `${Math.min(500, layout.usableWidth * 25)}px`,
          height: `${Math.min(350, layout.usableHeight * 25)}px`,
          aspectRatio: `${layout.usableWidth} / ${layout.usableHeight}`
        }}
      >
        <div 
          className="grid gap-2 h-full"
          style={{
            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${layout.columns}, 1fr)`
          }}
        >
          {Array.from({ length: layout.totalPhotos }).map((_, index) => (
            <div
              key={index}
              className="border-2 border-purple-200 flex items-center justify-center overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-shadow"
              style={{ 
                aspectRatio: '3.5 / 4.5',
                backgroundColor: bgColor
              }}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-purple-400 text-center">
                  <User className="h-6 w-6 mx-auto mb-1" />
                  <div className="text-xs">Photo</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
