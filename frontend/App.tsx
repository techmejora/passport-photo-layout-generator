import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import PhotoLayoutGenerator from './components/PhotoLayoutGenerator';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <PhotoLayoutGenerator />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
