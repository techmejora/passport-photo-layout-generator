import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IdCard, Download, Upload, RotateCcw, Eye, Palette, CreditCard, User, GraduationCap, Building, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import FileUploadZone from '../components/ui/FileUploadZone';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function PvcCardMakerPage() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('modern-id');
  const [cardType, setCardType] = useState('id');
  const [cardSize, setCardSize] = useState('cr80');
  const [orientation, setOrientation] = useState('landscape');
  const [colorScheme, setColorScheme] = useState('corporate-blue');
  const [bleedArea, setBleedArea] = useState(true);
  const [cornerRadius, setCornerRadius] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('front');
  
  // Form data
  const [frontData, setFrontData] = useState({
    photo: '',
    name: '',
    title: '',
    organization: '',
    id: '',
    department: '',
    email: '',
    phone: '',
    address: '',
    logoUrl: '',
    backgroundColor: '#1e40af',
    textColor: '#ffffff',
    accentColor: '#3b82f6'
  });
  
  const [backData, setBackData] = useState({
    qrCode: '',
    barcode: '',
    emergencyContact: '',
    terms: '',
    website: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: ''
    },
    backgroundColor: '#1e40af',
    textColor: '#ffffff'
  });

  // Fetch templates and settings
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['card-templates'],
    queryFn: async () => {
      try {
        return await backend.card.getTemplates();
      } catch (error) {
        console.error('Failed to fetch templates:', error);
        toast({
          title: "Error",
          description: "Failed to load card templates",
          variant: "destructive",
        });
        throw error;
      }
    }
  });

  const handlePhotoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFrontData(prev => ({ ...prev, photo: result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleLogoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFrontData(prev => ({ ...prev, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleColorSchemeChange = (schemeId: string) => {
    const scheme = templates?.colorSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setColorScheme(schemeId);
      setFrontData(prev => ({
        ...prev,
        backgroundColor: scheme.backgroundColor,
        textColor: scheme.textColor,
        accentColor: scheme.accentColor
      }));
      setBackData(prev => ({
        ...prev,
        backgroundColor: scheme.backgroundColor,
        textColor: scheme.textColor
      }));
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates?.templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setCardType(template.category);
      
      // Reset form data based on template
      setFrontData(prev => ({
        ...prev,
        name: '',
        title: '',
        organization: '',
        id: '',
        department: '',
        email: '',
        phone: '',
        address: '',
        photo: '',
        logoUrl: ''
      }));
    }
  };

  const handleGenerateCard = async () => {
    if (!frontData.name) {
      toast({
        title: "Missing Information",
        description: "Please enter at least a name for the card",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await backend.card.generateCard({
        cardType: cardType as "id" | "business" | "membership" | "student" | "employee" | "custom",
        template: selectedTemplate,
        frontData,
        backData: activeTab === 'both' ? backData : undefined,
        cardSize: cardSize as "cr80" | "cr79" | "custom",
        bleedArea,
        cornerRadius,
        orientation: orientation as "landscape" | "portrait"
      });

      setGeneratedResult(result);
      
      toast({
        title: "Card Generated Successfully",
        description: "Your PVC card is ready for download and printing",
      });
    } catch (error) {
      console.error('Failed to generate card:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFrontData({
      photo: '',
      name: '',
      title: '',
      organization: '',
      id: '',
      department: '',
      email: '',
      phone: '',
      address: '',
      logoUrl: '',
      backgroundColor: '#1e40af',
      textColor: '#ffffff',
      accentColor: '#3b82f6'
    });
    setBackData({
      qrCode: '',
      barcode: '',
      emergencyContact: '',
      terms: '',
      website: '',
      socialMedia: {
        linkedin: '',
        twitter: '',
        facebook: ''
      },
      backgroundColor: '#1e40af',
      textColor: '#ffffff'
    });
    setGeneratedResult(null);
  };

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'id': return User;
      case 'business': return Building;
      case 'student': return GraduationCap;
      case 'membership': return Users;
      case 'employee': return CreditCard;
      default: return IdCard;
    }
  };

  if (templatesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <LoadingSpinner size="lg" text="Loading templates..." />
      </div>
    );
  }

  const selectedTemplateData = templates?.templates.find(t => t.id === selectedTemplate);

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full shadow-lg">
            <IdCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PVC Card Maker</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Design and create professional ID cards, business cards, and membership cards with custom layouts and branding.
        </p>
      </div>

      {/* Template Selection */}
      <div className="mb-8">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Choose Template</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates?.templates.map((template) => {
                const Icon = getCardTypeIcon(template.category);
                return (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-25'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="h-5 w-5 text-indigo-600" />
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Card Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Card Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Card Size</Label>
                  <Select value={cardSize} onValueChange={setCardSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates?.cardSizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <Select value={orientation} onValueChange={setOrientation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landscape">Landscape</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Color Scheme */}
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-2 gap-2">
                  {templates?.colorSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => handleColorSchemeChange(scheme.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        colorScheme === scheme.id
                          ? 'border-indigo-500 shadow-lg'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      style={{ background: scheme.preview }}
                    >
                      <div className="text-sm font-medium text-white drop-shadow-lg">
                        {scheme.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Form Fields */}
              {selectedTemplateData?.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {field.type === 'text' && (
                    <Input
                      value={frontData[field.id as keyof typeof frontData] as string || ''}
                      onChange={(e) => setFrontData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <Textarea
                      value={frontData[field.id as keyof typeof frontData] as string || ''}
                      onChange={(e) => setFrontData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                      rows={3}
                    />
                  )}
                  
                  {field.type === 'select' && field.options && (
                    <Select
                      value={frontData[field.id as keyof typeof frontData] as string || ''}
                      onValueChange={(value) => setFrontData(prev => ({ ...prev, [field.id]: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {field.type === 'image' && field.id === 'photo' && (
                    <div className="space-y-2">
                      {frontData.photo ? (
                        <div className="relative">
                          <img
                            src={frontData.photo}
                            alt="Photo"
                            className="w-24 h-32 object-cover rounded border"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFrontData(prev => ({ ...prev, photo: '' }))}
                            className="mt-2"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <FileUploadZone
                          onFileSelect={handlePhotoUpload}
                          accept="image/*"
                          maxSize={5 * 1024 * 1024}
                          className="h-32"
                        />
                      )}
                    </div>
                  )}
                  
                  {field.type === 'image' && field.id === 'logo' && (
                    <div className="space-y-2">
                      {frontData.logoUrl ? (
                        <div className="relative">
                          <img
                            src={frontData.logoUrl}
                            alt="Logo"
                            className="w-24 h-16 object-contain rounded border"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFrontData(prev => ({ ...prev, logoUrl: '' }))}
                            className="mt-2"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <FileUploadZone
                          onFileSelect={handleLogoUpload}
                          accept="image/*"
                          maxSize={2 * 1024 * 1024}
                          className="h-24"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Advanced Options */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Advanced Options</h4>
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label className="text-sm">Corner Radius (mm)</Label>
                    <Input
                      type="number"
                      value={cornerRadius}
                      onChange={(e) => setCornerRadius(Number(e.target.value))}
                      min="0"
                      max="10"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Results Section */}
        <div className="space-y-6">
          {/* Card Preview */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Card Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-lg p-6 shadow-inner">
                <div 
                  className="mx-auto rounded-lg shadow-lg overflow-hidden"
                  style={{
                    width: orientation === 'landscape' ? '340px' : '214px',
                    height: orientation === 'landscape' ? '214px' : '340px',
                    backgroundColor: frontData.backgroundColor,
                    color: frontData.textColor,
                    borderRadius: `${cornerRadius * 2}px`
                  }}
                >
                  <div className="p-4 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {frontData.photo && (
                          <img
                            src={frontData.photo}
                            alt="Photo"
                            className="w-16 h-20 object-cover rounded border-2 border-white mb-2 float-left mr-3"
                          />
                        )}
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{frontData.name || 'Name'}</h3>
                          {frontData.title && <p className="text-sm opacity-90">{frontData.title}</p>}
                          {frontData.id && <p className="text-sm font-mono" style={{ color: frontData.accentColor }}>ID: {frontData.id}</p>}
                          {frontData.department && <p className="text-xs opacity-80">{frontData.department}</p>}
                        </div>
                      </div>
                      {frontData.logoUrl && (
                        <img
                          src={frontData.logoUrl}
                          alt="Logo"
                          className="w-12 h-8 object-contain"
                        />
                      )}
                    </div>
                    <div>
                      {frontData.organization && (
                        <p className="text-sm font-semibold">{frontData.organization}</p>
                      )}
                      <div 
                        className="h-1 w-full mt-2"
                        style={{ backgroundColor: frontData.accentColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Results */}
          {generatedResult && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle>Generated Card</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">Card ID:</div>
                      <div className="text-gray-600">{generatedResult.cardId}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Dimensions:</div>
                      <div className="text-gray-600">{generatedResult.specifications.width} × {generatedResult.specifications.height} mm</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Resolution:</div>
                      <div className="text-gray-600">{generatedResult.specifications.dpi} DPI</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Bleed Area:</div>
                      <div className="text-gray-600">{generatedResult.specifications.bleedArea} mm</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => window.open(generatedResult.frontCardUrl, '_blank')}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Front
                    </Button>
                    {generatedResult.backCardUrl && (
                      <Button 
                        onClick={() => window.open(generatedResult.backCardUrl, '_blank')}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Back
                      </Button>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => window.open(generatedResult.downloadUrl, '_blank')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Print-Ready File
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1 border-indigo-200 hover:bg-indigo-50" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={handleGenerateCard}
              disabled={!frontData.name || isGenerating}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Card
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
