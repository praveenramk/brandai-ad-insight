import { useState } from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScoreCardProps {
  title: string;
  score: number;
  feedback: string;
  icon: LucideIcon;
}

export const ScoreCard = ({ title, score, feedback, icon: Icon }: ScoreCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getColor = () => {
    if (score >= 76) return 'bg-success';
    if (score >= 51) return 'bg-warning';
    return 'bg-destructive';
  };

  const getTextColor = () => {
    if (score >= 76) return 'text-success';
    if (score >= 51) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-card-custom transition-shadow animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <span className={`text-2xl font-bold ${getTextColor()}`}>{score}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor()} transition-all duration-1000 ease-out animate-progress`}
            style={{ width: `${score}%`, '--progress-width': `${score}%` } as any}
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
          <div className="pt-2 text-sm text-muted-foreground animate-fade-in">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};
