import { useState } from 'react';
import { UploadSection } from '@/components/UploadSection';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { useToast } from '@/hooks/use-toast';

interface CritiqueResult {
  brand: string;
  overall_score: number;
  media_type: 'image' | 'video';
  brand_alignment: {
    score: number;
    feedback: string;
  };
  visual_quality: {
    score: number;
    feedback: string;
  };
  message_clarity: {
    score: number;
    feedback: string;
  };
  safety_ethics: {
    score: number;
    feedback: string;
  };
  audio_quality?: {
    score: number;
    feedback: string;
    voice_analysis: string;
    music_analysis: string;
    sound_effects: string;
    sync_quality: string;
  };
  strengths: string[];
  issues: string[];
  suggestions: string[];
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CritiqueResult | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const { toast } = useToast();

const handleAnalyze = async (file: File, brand: string, fileMediaType: 'image' | 'video') => {
  setIsLoading(true);
  setMediaType(fileMediaType);

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('brand', brand);

    const API_URL = 'http://localhost:8000';
    const response = await fetch(`${API_URL}/critique`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Debug log to see what we're getting from the server
    console.log('Server response:', data);
    
    // More detailed validation
    if (!data || typeof data !== 'object') {
      throw new Error('Server returned invalid data format');
    }

    const requiredFields = [
      'brand_alignment',
      'visual_quality',
      'message_clarity',
      'safety_ethics',
      'overall_score',
      'strengths',
      'issues',
      'suggestions'
    ];

    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    setResult(data as CritiqueResult);
    
    const url = URL.createObjectURL(file);
    setMediaUrl(url);

    toast({
      title: 'Analysis Complete!',
      description: `Your ${fileMediaType} ad has been analyzed successfully`,
    });
  } catch (error) {
    console.error('Server response error:', error);
    toast({
      title: 'Analysis Failed',
      description: error instanceof Error ? error.message : 'Failed to analyze ad',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleReset = () => {
    setResult(null);
    setMediaUrl('');
    setMediaType(null);
    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            BrandAI - Ad Critique Engine
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your ad and get instant AI-powered brand analysis
          </p>
        </header>

        {!result ? (
          <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} mediaType={mediaType} />
        ) : (
          <ResultsDashboard result={result} mediaUrl={mediaUrl} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default Index;
