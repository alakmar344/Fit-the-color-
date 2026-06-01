export type RGB = { r: number; g: number; b: number };

export const clamp = (value: number, min = 0, max = 255): number =>
  Math.min(max, Math.max(min, value));

export const normalizeHex = (input: string): string | null => {
  const trimmed = input.trim();
  const source = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(source)) {
    return null;
  }
  const expanded =
    source.length === 3
      ? source
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : source;
  return `#${expanded.toUpperCase()}`;
};

export const rgbToHex = ({ r, g, b }: RGB): string =>
  `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;

export const parseRgbText = (value: string): string | null => {
  const matches = value.match(/\d+(\.\d+)?/g);
  if (!matches || matches.length < 3) {
    return null;
  }
  const channels = matches.slice(0, 3).map((part) => Number(part));
  if (channels.some((channel) => Number.isNaN(channel))) {
    return null;
  }
  return rgbToHex({ r: channels[0], g: channels[1], b: channels[2] });
};

export const hexToRgb = (hex: string): RGB => {
  const normalized = normalizeHex(hex);
  if (!normalized) {
    return { r: 0, g: 0, b: 0 };
  }
  const value = normalized.slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
};

export const rgbToHsl = ({ r, g, b }: RGB): { h: number; s: number; l: number } => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
};

const transformChannel = (channel: number): number => {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  return (
    0.2126 * transformChannel(rgb.r) +
    0.7152 * transformChannel(rgb.g) +
    0.0722 * transformChannel(rgb.b)
  );
};

export const contrastRatio = (firstHex: string, secondHex: string): number => {
  const first = relativeLuminance(firstHex);
  const second = relativeLuminance(secondHex);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
};

export const nearestHueName = (hex: string): string => {
  const hue = rgbToHsl(hexToRgb(hex)).h;
  if (hue < 15 || hue >= 345) return "red";
  if (hue < 45) return "orange";
  if (hue < 65) return "yellow";
  if (hue < 150) return "green";
  if (hue < 190) return "teal";
  if (hue < 235) return "blue";
  if (hue < 260) return "indigo";
  if (hue < 290) return "purple";
  if (hue < 330) return "pink";
  return "red";
};
