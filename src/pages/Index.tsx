import { useState } from 'react';
import { UploadSection } from '@/components/UploadSection';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { useToast } from '@/hooks/use-toast';

interface CritiqueResult {
  brand: string;
  overall_score: number;
  scores: {
    brand_alignment: number;
    visual_quality: number;
    message_clarity: number;
    safety_ethics: number;
  };
  feedback: {
    brand_alignment: string;
    visual_quality: string;
    message_clarity: string;
    safety_ethics: string;
  };
  strengths: string[];
  issues: string[];
  suggestions: string[];
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CritiqueResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const { toast } = useToast();

  const handleAnalyze = async (file: File, brand: string) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('brand', brand);

      const response = await fetch('http://localhost:8000/critique', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      // Create object URL for image preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      toast({
        title: 'Analysis Complete!',
        description: 'Your ad has been analyzed successfully',
      });
    } catch (error) {
      console.error('Error analyzing ad:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze ad. Please make sure the backend is running.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setImageUrl('');
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
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
          <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <ResultsDashboard result={result} imageUrl={imageUrl} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default Index;
