import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Maximize, Crop, Sparkles, Camera, Star, Users, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import HeroSection from '../components/home/HeroSection';
import ToolsSection from '../components/home/ToolsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import StatsSection from '../components/home/StatsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ToolsSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
    </div>
  );
}
