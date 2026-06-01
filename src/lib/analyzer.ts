import knowledgeBase from "@/data/knowledge-base.json";
import { contrastRatio, nearestHueName, rgbToHsl, hexToRgb } from "@/lib/color";
import type { AnalysisReport, PaletteInput, Recommendation } from "@/lib/types";

const round = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

const pairContrast = (palette: PaletteInput) => [
  ["Primary / Secondary", contrastRatio(palette.primary, palette.secondary)],
  ["Primary / Accent", contrastRatio(palette.primary, palette.accent)],
  ["Secondary / Accent", contrastRatio(palette.secondary, palette.accent)],
] as const;

const calcHarmony = (palette: PaletteInput): { type: string; score: number } => {
  const hues = [palette.primary, palette.secondary, palette.accent].map(
    (hex) => rgbToHsl(hexToRgb(hex)).h,
  );
  const diffs = [
    Math.abs(hues[0] - hues[1]),
    Math.abs(hues[1] - hues[2]),
    Math.abs(hues[0] - hues[2]),
  ].map((difference) => Math.min(difference, 360 - difference));
  const average = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
  if (average > 150) return { type: "Complementary", score: 86 };
  if (average > 95) return { type: "Split Complementary", score: 79 };
  if (average > 70) return { type: "Triadic", score: 75 };
  if (average > 35) return { type: "Analogous", score: 70 };
  return { type: "Monochromatic", score: 65 };
};

const saturationBrightness = (palette: PaletteInput): { saturation: string; brightness: string; satScore: number; briScore: number } => {
  const hsl = [palette.primary, palette.secondary, palette.accent].map((hex) => rgbToHsl(hexToRgb(hex)));
  const avgSat = hsl.reduce((sum, item) => sum + item.s, 0) / hsl.length;
  const avgLight = hsl.reduce((sum, item) => sum + item.l, 0) / hsl.length;
  const saturation = avgSat > 78 ? "Over-saturated" : avgSat < 30 ? "Under-saturated" : "Balanced";
  const brightness = avgLight < 30 ? "Too dark" : avgLight > 78 ? "Too bright" : "Balanced";
  const satScore = saturation === "Balanced" ? 88 : 58;
  const briScore = brightness === "Balanced" ? 88 : 56;
  return { saturation, brightness, satScore, briScore };
};

const emotional = (palette: PaletteInput): { score: number; summary: string } => {
  const hues = [palette.primary, palette.secondary, palette.accent].map(nearestHueName);
  const notes = hues
    .map((hue) => ({ hue, traits: knowledgeBase.colorPsychology[hue as keyof typeof knowledgeBase.colorPsychology] ?? ["character"] }))
    .map(({ hue, traits }) => `${hue}: ${traits.slice(0, 2).join(", ")}`)
    .join(" | ");
  const diversity = new Set(hues).size;
  return { score: round(56 + diversity * 12), summary: notes };
};

const contextFit = (palette: PaletteInput): { score: number; summary: string } => {
  const rule = knowledgeBase.contextPreferences[palette.context as keyof typeof knowledgeBase.contextPreferences];
  if (!rule) {
    return { score: 68, summary: "General-purpose scoring applied for selected context." };
  }
  const hues = [nearestHueName(palette.primary), nearestHueName(palette.secondary), nearestHueName(palette.accent)].join(", ");
  const preferHit = rule.prefer.filter((item) => hues.toLowerCase().includes(item.split(" ")[0].toLowerCase())).length;
  const avoidHit = rule.avoid.filter((item) => hues.toLowerCase().includes(item.split(" ")[0].toLowerCase())).length;
  const score = round(62 + preferHit * 14 * Number(rule.weight) - avoidHit * 18);
  return {
    score,
    summary: `Context rule matched ${preferHit} preferred signals and ${avoidHit} cautions for ${palette.context}.`,
  };
};

const makeRecommendations = (palette: PaletteInput): Recommendation[] => {
  const contexts = knowledgeBase.contexts;
  const start = Math.abs(palette.primary.charCodeAt(1) + palette.secondary.charCodeAt(2));
  return Array.from({ length: 5 }, (_, index) => {
    const offset = (start + index * 103) % knowledgeBase.colorCatalog.length;
    return {
      primary: knowledgeBase.colorCatalog[offset].hex,
      secondary: knowledgeBase.colorCatalog[(offset + 17) % knowledgeBase.colorCatalog.length].hex,
      accent: knowledgeBase.colorCatalog[(offset + 91) % knowledgeBase.colorCatalog.length].hex,
      reason: `Alternative #${index + 1} prioritizes improved contrast spread for ${contexts[(offset + 9) % contexts.length]}.`,
    };
  });
};

export const analyzePalette = (palette: PaletteInput): AnalysisReport => {
  const contrasts = pairContrast(palette);
  const avgContrast = contrasts.reduce((sum, item) => sum + item[1], 0) / contrasts.length;
  const accessibilityScore = round((Math.min(avgContrast, 7) / 7) * 100);
  const readabilityScore = round((Math.min(avgContrast, 10) / 10) * 100);
  const harmony = calcHarmony(palette);
  const context = contextFit(palette);
  const emotion = emotional(palette);
  const sb = saturationBrightness(palette);
  const overall = round(
    readabilityScore * 0.25 +
      harmony.score * 0.2 +
      context.score * 0.2 +
      accessibilityScore * 0.2 +
      emotion.score * 0.15,
  );

  const verdict =
    overall >= 85
      ? "Excellent"
      : overall >= 72
        ? "Good"
        : overall >= 55
          ? "Average"
          : overall >= 35
            ? "Poor"
            : "Terrible";

  return {
    scores: {
      contrast: readabilityScore,
      harmony: harmony.score,
      context: context.score,
      accessibility: accessibilityScore,
      emotional: emotion.score,
      overall,
      verdict,
    },
    harmonyType: harmony.type,
    saturationState: sb.saturation,
    brightnessState: sb.brightness,
    emotionalSummary: emotion.summary,
    contextSummary: context.summary,
    accessibilityPairs: contrasts.map(([pair, ratio]) => ({
      pair,
      ratio: Number(ratio.toFixed(2)),
      aa: ratio >= knowledgeBase.accessibilityThresholds.AA,
      aaa: ratio >= knowledgeBase.accessibilityThresholds.AAA,
      suggestion: ratio >= 4.5 ? "Readable pairing" : "Increase lightness contrast or shift one tone.",
    })),
    recommendations: makeRecommendations(palette),
  };
};
