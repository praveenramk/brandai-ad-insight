import { useState } from 'react';
import { Download, RotateCcw, Copy, Check, Shield, Eye, MessageSquare, CheckCircle, ChevronDown, ChevronUp, Volume2, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircularProgress } from './CircularProgress';
import { ScoreCard } from './ScoreCard';
import { AudioQualityCard } from './AudioQualityCard';
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

interface ResultsDashboardProps {
  result: CritiqueResult;
  mediaUrl: string;
  onReset: () => void;
}

export const ResultsDashboard = ({ result, mediaUrl, onReset }: ResultsDashboardProps) => {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const { toast } = useToast();
  
  const isVideo = result.media_type === 'video';

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: 'JSON data copied to clipboard',
    });
  };

  const handleDownload = () => {
    toast({
      title: 'Coming soon!',
      description: 'PDF export will be available in a future update',
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Visual */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl shadow-card-custom p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground capitalize">
                {result.brand} Ad
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                {isVideo ? (
                  <>
                    <Volume2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Video Ad</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Image Ad</span>
                  </>
                )}
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border">
              {isVideo ? (
                <video
                  src={mediaUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-auto object-contain bg-muted"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt="Analyzed ad"
                  className="w-full h-auto object-contain bg-muted"
                />
              )}
            </div>
            {isVideo && (
              <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                <span className="text-lg">✨</span>
                Includes audio analysis
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Scores */}
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-card rounded-2xl shadow-card-custom p-8 flex flex-col items-center">
            <CircularProgress score={result.overall_score} />
          </div>

          {/* Score Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4`}>
            <ScoreCard
              title="Brand Alignment"
              score={result.brand_alignment.score}
              feedback={result.brand_alignment.feedback}
              icon={CheckCircle}
            />
            <ScoreCard
              title="Visual Quality"
              score={result.visual_quality.score}
              feedback={result.visual_quality.feedback}
              icon={Eye}
            />
            <ScoreCard
              title="Message Clarity"
              score={result.message_clarity.score}
              feedback={result.message_clarity.feedback}
              icon={MessageSquare}
            />
            {isVideo && result.audio_quality && (
              <AudioQualityCard audioQuality={result.audio_quality} />
            )}
            <ScoreCard
              title="Safety & Ethics"
              score={result.safety_ethics.score}
              feedback={result.safety_ethics.feedback}
              icon={Shield}
            />
          </div>

          {/* Tabbed Interface */}
          <div className="bg-card rounded-2xl shadow-card-custom p-6">
            <Tabs defaultValue="strengths" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="strengths">Strengths</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>
              <TabsContent value="strengths" className="space-y-2 mt-4">
                {result.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{strength}</span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="issues" className="space-y-2 mt-4">
                {result.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="text-destructive flex-shrink-0 mt-0.5">✕</span>
                    <span className="text-foreground">{issue}</span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="suggestions" className="space-y-2 mt-4">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="text-primary flex-shrink-0 mt-0.5">💡</span>
                    <span className="text-foreground">{suggestion}</span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* JSON Viewer */}
          <div className="bg-card rounded-2xl shadow-card-custom p-6">
            <Button
              variant="ghost"
              onClick={() => setShowJson(!showJson)}
              className="w-full justify-between mb-4"
            >
              <span className="font-semibold">View JSON</span>
              {showJson ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
            {showJson && (
              <div className="space-y-4 animate-fade-in">
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs text-foreground">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCopy}
                    className="absolute top-2 right-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={onReset} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Analyze Another Ad
            </Button>
            <Button onClick={handleDownload} className="flex-1 bg-gradient-primary">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
