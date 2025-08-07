import React from 'react';

interface SpecificationItemProps {
  label: string;
  value: string;
  className?: string;
}

export default function SpecificationItem({ 
  label, 
  value, 
  className = "" 
}: SpecificationItemProps) {
  return (
    <div className={className}>
      <div className="font-medium text-gray-700">{label}:</div>
      <div className="text-gray-600">{value}</div>
    </div>
  );
}
