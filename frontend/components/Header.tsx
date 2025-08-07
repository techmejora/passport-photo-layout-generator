import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Passport Size Photo Maker
              </h1>
              <p className="text-sm text-gray-500">
                Print Ready • 300 DPI • 6x4 inch
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Tech Mejora IT Solutions</span>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
              Go Premium
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
