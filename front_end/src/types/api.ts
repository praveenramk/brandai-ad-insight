export interface AnalysisResult {
  overall_score: number;
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
  strengths: string[];
  issues: string[];
  suggestions: string[];
  brand: string;
  timestamp: string;
}