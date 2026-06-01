import jsPDF from "jspdf";
import type { AnalysisReport, PaletteInput } from "@/lib/types";

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportPalettePng = (palette: PaletteInput): void => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const colors = [palette.primary, palette.secondary, palette.accent];
  colors.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(index * 400, 0, 400, 360);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(color, index * 400 + 30, 320);
  });
  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, "fit-the-color-palette.png");
    }
  });
};

export const exportReportJson = (palette: PaletteInput, report: AnalysisReport): void => {
  const blob = new Blob([JSON.stringify({ palette, report }, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, "fit-the-color-report.json");
};

export const exportReportPdf = (palette: PaletteInput, report: AnalysisReport): void => {
  const pdf = new jsPDF();
  pdf.setFontSize(18);
  pdf.text("Fit The Color - Compatibility Report", 14, 18);
  pdf.setFontSize(12);
  pdf.text(`Context: ${palette.context}`, 14, 30);
  pdf.text(`Primary: ${palette.primary}`, 14, 38);
  pdf.text(`Secondary: ${palette.secondary}`, 14, 46);
  pdf.text(`Accent: ${palette.accent}`, 14, 54);
  pdf.text(`Overall: ${report.scores.overall} (${report.scores.verdict})`, 14, 66);
  const lines = [
    `Contrast: ${report.scores.contrast}`,
    `Harmony: ${report.scores.harmony} (${report.harmonyType})`,
    `Context: ${report.scores.context}`,
    `Accessibility: ${report.scores.accessibility}`,
    `Emotional: ${report.scores.emotional}`,
    `Saturation: ${report.saturationState}`,
    `Brightness: ${report.brightnessState}`,
    `Emotional Summary: ${report.emotionalSummary}`,
    `Context Summary: ${report.contextSummary}`,
  ];
  let y = 80;
  lines.forEach((line) => {
    const split = pdf.splitTextToSize(line, 180);
    pdf.text(split, 14, y);
    y += 8 + (split.length - 1) * 6;
  });
  pdf.save("fit-the-color-report.pdf");
};
