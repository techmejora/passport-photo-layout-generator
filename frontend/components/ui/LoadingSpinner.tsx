import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

export default function LoadingSpinner({ 
  size = 'md', 
  text, 
  className 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-b-2 border-blue-600",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-gray-600 mt-2 text-sm">{text}</p>
      )}
    </div>
  );
}
