import knowledgeBase from "@/data/knowledge-base.json";
import { normalizeHex, rgbToHex } from "@/lib/color";

const styleSeeds: Record<string, [string, string, string]> = {
  Modern: ["#3B82F6", "#111827", "#22D3EE"],
  Corporate: ["#1D4ED8", "#F8FAFC", "#2563EB"],
  Luxury: ["#0A0A0A", "#2D1B45", "#D4AF37"],
  Futuristic: ["#0F172A", "#312E81", "#22D3EE"],
  Minimalist: ["#F5F5F5", "#171717", "#737373"],
  Gaming: ["#111827", "#4C1D95", "#F97316"],
  Creative: ["#6D28D9", "#FCE7F3", "#14B8A6"],
};

export const paletteStyles = Object.keys(styleSeeds);

export const randomPalette = (): [string, string, string] => {
  const catalog = knowledgeBase.colorCatalog;
  const pick = () => catalog[Math.floor(Math.random() * catalog.length)].hex;
  return [pick(), pick(), pick()];
};

const shiftHex = (hex: string, shift: number): string => {
  const normalized = normalizeHex(hex) ?? "#2563EB";
  const source = Number.parseInt(normalized.slice(1), 16);
  const next = (source + shift + 0xffffff) % 0xffffff;
  return rgbToHex({
    r: (next >> 16) & 0xff,
    g: (next >> 8) & 0xff,
    b: next & 0xff,
  });
};

export const generateFromPrimary = (primaryHex: string): [string, string, string] => {
  const normalized = normalizeHex(primaryHex) ?? "#2563EB";
  return [normalized, shiftHex(normalized, 0x223344), shiftHex(normalized, -0x112244)];
};

export const generateByStyle = (style: string): [string, string, string] =>
  styleSeeds[style] ?? styleSeeds.Modern;
