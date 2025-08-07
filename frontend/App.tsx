import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from './pages/HomePage';
import PassportPhotoPage from './pages/PassportPhotoPage';
import ImageResizerPage from './pages/ImageResizerPage';
import ImageCropperPage from './pages/ImageCropperPage';
import ImageEnhancerPage from './pages/ImageEnhancerPage';
import Header from './components/Header';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/passport-photo" element={<PassportPhotoPage />} />
              <Route path="/image-resizer" element={<ImageResizerPage />} />
              <Route path="/image-cropper" element={<ImageCropperPage />} />
              <Route path="/image-enhancer" element={<ImageEnhancerPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
