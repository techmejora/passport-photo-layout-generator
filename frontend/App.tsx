import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from './components/auth/AuthProvider';
import HomePage from './pages/HomePage';
import PassportPhotoPage from './pages/PassportPhotoPage';
import ImageResizerPage from './pages/ImageResizerPage';
import ImageCropperPage from './pages/ImageCropperPage';
import ImageEnhancerPage from './pages/ImageEnhancerPage';
import VideoConverterPage from './pages/VideoConverterPage';
import PvcCardMakerPage from './pages/PvcCardMakerPage';
import PricingPage from './pages/PricingPage';
import Header from './components/Header';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
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
                <Route path="/video-converter" element={<VideoConverterPage />} />
                <Route path="/pvc-card-maker" element={<PvcCardMakerPage />} />
                <Route path="/pricing" element={<PricingPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
