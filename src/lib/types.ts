export type PaletteInput = {
  primary: string;
  secondary: string;
  accent: string;
  context: string;
};

export type ScoreCard = {
  contrast: number;
  harmony: number;
  context: number;
  accessibility: number;
  emotional: number;
  overall: number;
  verdict: "Excellent" | "Good" | "Average" | "Poor" | "Terrible";
};

export type Recommendation = {
  primary: string;
  secondary: string;
  accent: string;
  reason: string;
};

export type AccessibilityPair = {
  pair: string;
  ratio: number;
  aa: boolean;
  aaa: boolean;
  suggestion: string;
};

export type AnalysisReport = {
  scores: ScoreCard;
  harmonyType: string;
  saturationState: string;
  brightnessState: string;
  emotionalSummary: string;
  contextSummary: string;
  accessibilityPairs: AccessibilityPair[];
  recommendations: Recommendation[];
};
