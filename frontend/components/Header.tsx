import React from 'react';
import { Camera, Download, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Passport Photo Layout Generator
              </h1>
              <p className="text-gray-600">
                Create professional passport photo layouts instantly
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Customizable Settings</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>High-Quality PDF</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
