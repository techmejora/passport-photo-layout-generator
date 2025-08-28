import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout, Download, Upload, RotateCcw, Eye, Grid, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import FileUploadZone from './ui/FileUploadZone';
import LoadingSpinner from './ui/LoadingSpinner';

export default function CardLayoutGenerator() {
  const { toast } = useToast();
  const [frontCardImage, setFrontCardImage] = useState<string | null>(null);
  const [backCardImage, setBackCardImage] = useState<string | null>(null);
  const [paperSize, setPaperSize] = useState('4x6');
  const [cardSize, setCardSize] = useState('CR80');
  const [cardsPerRow, setCardsPerRow] = useState(1);
  const [cardsPerColumn, setCardsPerColumn] = useState(2);
  const [spacing, setSpacing] = useState(5);
  const [bleedArea, setBleedArea] = useState(true);
  const [cornerRadius, setCornerRadius] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const handleFrontCardUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFrontCardImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleBackCardUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBackCardImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerateLayout = async () => {
    if (!frontCardImage) {
      toast({
        title: "Missing Front Card",
        description: "Please upload the front card image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await backend.card.generateCardLayout({
        frontCardImage,
        backCardImage: backCardImage || undefined,
        paperSize: paperSize as "4x6" | "A4" | "Letter",
        cardSize: cardSize as "CR80" | "CR79" | "custom",
        cardsPerRow,
        cardsPerColumn,
        spacing,
        bleedArea,
        cornerRadius
      });

      setGeneratedResult(result);
      
      toast({
        title: "Layout Generated Successfully",
        description: "Your card layout is ready for download and printing",
      });
    } catch (error) {
      console.error('Failed to generate layout:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate card layout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFrontCardImage(null);
    setBackCardImage(null);
    setGeneratedResult(null);
  };

  const handleReplaceFront = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFrontCardUpload(file);
      }
    };
    input.click();
  }, [handleFrontCardUpload]);

  const handleReplaceBack = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleBackCardUpload(file);
      }
    };
    input.click();
  }, [handleBackCardUpload]);

  const totalCards = cardsPerRow * cardsPerColumn;

  // Function to determine card arrangement for preview
  const getCardArrangement = () => {
    const cards = [];
    for (let row = 0; row < cardsPerColumn; row++) {
      for (let col = 0; col < cardsPerRow; col++) {
        let isBackCard = false;
        let cardImage = frontCardImage;
        
        if (paperSize === '4x6' && backCardImage) {
          // For 4x6: top row = front, bottom row = back
          isBackCard = row === 1;
          cardImage = isBackCard ? backCardImage : frontCardImage;
        } else if (backCardImage) {
          // For other sizes: alternate by column
          isBackCard = col % 2 === 1;
          cardImage = isBackCard ? backCardImage : frontCardImage;
        }
        
        cards.push({ cardImage, isBackCard, index: row * cardsPerRow + col });
      }
    }
    return cards;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-teal-50 to-cyan-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-full shadow-lg">
            <Layout className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Card Layout Generator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your existing PVC card images and generate a print-ready layout for photo paper. Perfect for printing multiple cards efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Front Card Upload */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Front Card Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {frontCardImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={frontCardImage}
                      alt="Front card"
                      className="w-full h-48 object-contain rounded-lg border-2 border-dashed border-teal-300 bg-gradient-to-br from-teal-50 to-cyan-50"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 border-teal-200 hover:bg-teal-50" onClick={handleReplaceFront}>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                    <Button variant="outline" className="flex-1 border-red-200 hover:bg-red-50" onClick={() => setFrontCardImage(null)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <FileUploadZone 
                  onFileSelect={handleFrontCardUpload}
                  accept="image/*"
                  maxSize={10 * 1024 * 1024}
                />
              )}
            </CardContent>
          </Card>

          {/* Back Card Upload */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Back Card Image (Optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {backCardImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={backCardImage}
                      alt="Back card"
                      className="w-full h-48 object-contain rounded-lg border-2 border-dashed border-cyan-300 bg-gradient-to-br from-cyan-50 to-teal-50"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 border-cyan-200 hover:bg-cyan-50" onClick={handleReplaceBack}>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                    <Button variant="outline" className="flex-1 border-red-200 hover:bg-red-50" onClick={() => setBackCardImage(null)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <FileUploadZone 
                  onFileSelect={handleBackCardUpload}
                  accept="image/*"
                  maxSize={10 * 1024 * 1024}
                />
              )}
            </CardContent>
          </Card>

          {/* Layout Preview */}
          {frontCardImage && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Layout Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white rounded-lg p-4 shadow-inner">
                  <div 
                    className="mx-auto border-2 border-gray-300 rounded-lg p-2 bg-white"
                    style={{
                      width: '300px',
                      height: paperSize === '4x6' ? '200px' : '400px',
                      aspectRatio: paperSize === '4x6' ? '3/2' : paperSize === 'A4' ? '210/297' : '8.5/11'
                    }}
                  >
                    <div 
                      className="grid gap-1 h-full"
                      style={{
                        gridTemplateRows: `repeat(${cardsPerColumn}, 1fr)`,
                        gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)`
                      }}
                    >
                      {getCardArrangement().map((card) => (
                        <div
                          key={card.index}
                          className="border border-gray-300 rounded-sm overflow-hidden bg-gray-50 flex items-center justify-center relative"
                        >
                          <img
                            src={card.cardImage}
                            alt={`Card ${card.index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                            {card.isBackCard ? 'BACK' : 'FRONT'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {totalCards} cards on {paperSize} paper
                    {paperSize === '4x6' && backCardImage && (
                      <span className="block text-xs text-blue-600 mt-1">
                        Top row: Front cards, Bottom row: Back cards
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Grid className="h-5 w-5" />
                <span>Layout Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Paper Size</Label>
                  <Select value={paperSize} onValueChange={setPaperSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4x6">4×6 inch (Photo Paper)</SelectItem>
                      <SelectItem value="A4">A4 (210×297 mm)</SelectItem>
                      <SelectItem value="Letter">Letter (8.5×11 inch)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Card Size</Label>
                  <Select value={cardSize} onValueChange={setCardSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CR80">CR80 (Standard Credit Card)</SelectItem>
                      <SelectItem value="CR79">CR79 (Slightly Smaller)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cards per Row</Label>
                  <Input
                    type="number"
                    value={cardsPerRow}
                    onChange={(e) => setCardsPerRow(Math.max(1, Math.min(4, parseInt(e.target.value) || 1)))}
                    min="1"
                    max="4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cards per Column</Label>
                  <Input
                    type="number"
                    value={cardsPerColumn}
                    onChange={(e) => setCardsPerColumn(Math.max(1, Math.min(4, parseInt(e.target.value) || 1)))}
                    min="1"
                    max="4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Spacing between cards ({spacing}mm)</Label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={spacing}
                  onChange={(e) => setSpacing(parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div className="space-y-2">
                <Label>Corner Radius ({cornerRadius}mm)</Label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={cornerRadius}
                  onChange={(e) => setCornerRadius(parseFloat(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="bleedArea"
                  checked={bleedArea}
                  onChange={(e) => setBleedArea(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="bleedArea" className="text-sm">
                  Include bleed area (3mm)
                </Label>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-teal-200 hover:bg-teal-50"
                    onClick={() => {
                      setPaperSize('4x6');
                      setCardsPerRow(1);
                      setCardsPerColumn(2);
                      setSpacing(5);
                    }}
                  >
                    4×6 - 2 Cards
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-teal-200 hover:bg-teal-50"
                    onClick={() => {
                      setPaperSize('A4');
                      setCardsPerRow(2);
                      setCardsPerColumn(3);
                      setSpacing(8);
                    }}
                  >
                    A4 - 6 Cards
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-teal-200 hover:bg-teal-50"
                    onClick={() => {
                      setPaperSize('Letter');
                      setCardsPerRow(2);
                      setCardsPerColumn(3);
                      setSpacing(10);
                    }}
                  >
                    Letter - 6 Cards
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-teal-200 hover:bg-teal-50"
                    onClick={() => {
                      setPaperSize('4x6');
                      setCardsPerRow(1);
                      setCardsPerColumn(1);
                      setSpacing(0);
                    }}
                  >
                    Single Card
                  </Button>
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-medium text-teal-800 mb-2">Layout Summary</h4>
                <div className="text-sm text-teal-700 space-y-1">
                  <div>Paper: {paperSize}</div>
                  <div>Total Cards: {totalCards}</div>
                  <div>Grid: {cardsPerRow} × {cardsPerColumn}</div>
                  <div>Spacing: {spacing}mm</div>
                  {backCardImage && (
                    <div>
                      {paperSize === '4x6' 
                        ? 'Layout: Top row (Front), Bottom row (Back)' 
                        : 'Layout: Alternating Front/Back by column'
                      }
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Results */}
          {generatedResult && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle>Generated Layout</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">Layout ID:</div>
                      <div className="text-gray-600">{generatedResult.layoutId}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Total Cards:</div>
                      <div className="text-gray-600">{generatedResult.specifications.totalCards}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Paper Size:</div>
                      <div className="text-gray-600">{generatedResult.specifications.paperWidth} × {generatedResult.specifications.paperHeight} mm</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Resolution:</div>
                      <div className="text-gray-600">{generatedResult.specifications.dpi} DPI</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => window.open(generatedResult.layoutUrl, '_blank')}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Layout
                    </Button>
                    <Button 
                      onClick={() => window.open(generatedResult.downloadUrl, '_blank')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1 border-teal-200 hover:bg-teal-50" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={handleGenerateLayout}
              disabled={!frontCardImage || isGenerating}
              className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Layout
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
