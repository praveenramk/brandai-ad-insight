import { useState } from 'react';
import { ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioQualityCardProps {
  audioQuality: {
    score: number;
    feedback: string;
    voice_analysis: string;
    music_analysis: string;
    sound_effects: string;
    sync_quality: string;
  };
}

export const AudioQualityCard = ({ audioQuality }: AudioQualityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getColor = () => {
    if (audioQuality.score >= 76) return 'bg-success';
    if (audioQuality.score >= 51) return 'bg-warning';
    return 'bg-destructive';
  };

  const getTextColor = () => {
    if (audioQuality.score >= 76) return 'text-success';
    if (audioQuality.score >= 51) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="bg-card rounded-xl border border-primary/30 p-6 hover:shadow-card-custom transition-shadow animate-fade-in relative overflow-hidden">
      {/* Purple gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 ring-2 ring-primary/30">
              <Volume2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Audio Quality</h3>
              <span className={`text-2xl font-bold ${getTextColor()}`}>{audioQuality.score}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${getColor()} transition-all duration-1000 ease-out animate-progress`}
              style={{ width: `${audioQuality.score}%`, '--progress-width': `${audioQuality.score}%` } as any}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between text-muted-foreground hover:text-foreground"
          >
            <span className="text-sm font-medium">Details</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {isExpanded && (
            <div className="pt-2 space-y-3 text-sm animate-fade-in">
              <div>
                <p className="font-medium text-foreground mb-1">Overall Feedback:</p>
                <p className="text-muted-foreground">{audioQuality.feedback}</p>
              </div>
              <div className="space-y-2 border-t border-border pt-3">
                <div>
                  <p className="font-medium text-primary">Voice Analysis:</p>
                  <p className="text-muted-foreground">{audioQuality.voice_analysis}</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Music Analysis:</p>
                  <p className="text-muted-foreground">{audioQuality.music_analysis}</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Sound Effects:</p>
                  <p className="text-muted-foreground">{audioQuality.sound_effects}</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Sync Quality:</p>
                  <p className="text-muted-foreground">{audioQuality.sync_quality}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
