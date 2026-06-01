import { contrastRatio } from "@/lib/color";

export const rooms = [
  "Bathroom",
  "Bedroom",
  "Living Room",
  "Kitchen",
  "Dining Room",
  "Office",
  "Kids Room",
  "Studio",
  "Lobby",
  "Outdoor Patio",
] as const;

export const styles = [
  "Minimalist",
  "Modern",
  "Scandinavian",
  "Industrial",
  "Luxury",
  "Bohemian",
  "Coastal",
  "Japandi",
  "Rustic",
  "Contemporary",
] as const;

export type RoomType = (typeof rooms)[number];
export type StyleType = (typeof styles)[number];

export type DesignScenario = {
  id: string;
  room: RoomType;
  style: StyleType;
  wallColor: string;
  floorColor: string;
  furnitureColor: string;
  accentColor: string;
  wallMaterial: string;
  floorMaterial: string;
  furnitureMaterial: string;
  lightingMood: string;
  summary: string;
  confidence: number;
};

type RoomProfile = {
  wallColors: readonly string[];
  floorColors: readonly string[];
  furnitureColors: readonly string[];
  accentColors: readonly string[];
  wallMaterials: readonly string[];
  floorMaterials: readonly string[];
  furnitureMaterials: readonly string[];
  lightingMood: string;
};

type StyleProfile = {
  wallBias: number;
  floorBias: number;
  furnitureBias: number;
  accentBias: number;
  preferredMaterials: readonly string[];
};

const roomProfiles: Record<RoomType, RoomProfile> = {
  Bathroom: {
    wallColors: ["#F7F7F5", "#ECEFF1", "#E3E8ED", "#DCE3EA"],
    floorColors: ["#F5F5F3", "#CED4DA", "#B8C0C8", "#D7DBDE"],
    furnitureColors: ["#1F2933", "#111827", "#374151", "#4B5563"],
    accentColors: ["#8AA7B1", "#C3CCD5", "#6B8A95", "#A3B9C2"],
    wallMaterials: ["Moisture-safe limestone paint", "Microcement with matte seal"],
    floorMaterials: ["White carrara marble", "Slip-resistant porcelain stone"],
    furnitureMaterials: ["Black stone vanity", "Powder-coated steel cabinet"],
    lightingMood: "Clean daylight",
  },
  Bedroom: {
    wallColors: ["#F4EFE8", "#EAE5DC", "#DCD4C8", "#CFC7BA"],
    floorColors: ["#B49B7A", "#9E886B", "#A98F72", "#8F7A62"],
    furnitureColors: ["#4B3F35", "#5C4A3D", "#6B5848", "#3E332B"],
    accentColors: ["#9C8AA4", "#B6A5BF", "#8A6C95", "#6F8DA9"],
    wallMaterials: ["Soft limewash", "Warm matte paint"],
    floorMaterials: ["Engineered oak plank", "Walnut veneer flooring"],
    furnitureMaterials: ["Natural oak veneer", "Textured fabric headboard"],
    lightingMood: "Soft layered",
  },
  "Living Room": {
    wallColors: ["#F3F1ED", "#E8E4DD", "#DED7CC", "#D0C7B8"],
    floorColors: ["#B8A17E", "#A98F6B", "#8E7758", "#746149"],
    furnitureColors: ["#2C2F33", "#3A3F45", "#4B4F55", "#5B6168"],
    accentColors: ["#A96752", "#4B6A88", "#9A8D74", "#6E7A5E"],
    wallMaterials: ["Mineral paint", "Low-sheen acrylic"],
    floorMaterials: ["Wide oak plank", "Brushed walnut wood"],
    furnitureMaterials: ["Performance linen upholstery", "Powder metal frame"],
    lightingMood: "Balanced ambient",
  },
  Kitchen: {
    wallColors: ["#F4F4F2", "#EDECEA", "#D8D9D5", "#C8CAC4"],
    floorColors: ["#B6ADA0", "#A39A8C", "#8D8479", "#726A60"],
    furnitureColors: ["#2A3138", "#39424A", "#505A64", "#20262C"],
    accentColors: ["#C77B4C", "#7B96A9", "#95A08A", "#D2B686"],
    wallMaterials: ["Washable matte paint", "Quartz backsplash panel"],
    floorMaterials: ["Porcelain slab tile", "Textured stone ceramic"],
    furnitureMaterials: ["Quartz countertop", "Lacquered MDF cabinet"],
    lightingMood: "Task bright",
  },
  "Dining Room": {
    wallColors: ["#F1ECE5", "#E7DDD1", "#D9CCBC", "#C5B4A1"],
    floorColors: ["#AF936E", "#9C825F", "#876D4D", "#6D563D"],
    furnitureColors: ["#3C2F24", "#4F3F30", "#66513D", "#2D241C"],
    accentColors: ["#8E5D4A", "#4A5E7C", "#6B7A59", "#A27E58"],
    wallMaterials: ["Fine plaster finish", "Eggshell paint"],
    floorMaterials: ["Oak herringbone", "Smoked timber plank"],
    furnitureMaterials: ["Solid walnut table", "Boucle chair fabric"],
    lightingMood: "Warm focal",
  },
  Office: {
    wallColors: ["#EFF2F4", "#E3E9ED", "#D5DDE3", "#C8D0D7"],
    floorColors: ["#9EA7AF", "#8C97A0", "#7A858F", "#69747E"],
    furnitureColors: ["#1F252B", "#2A3139", "#35404A", "#12171C"],
    accentColors: ["#3F6C92", "#5E8E75", "#9C7854", "#7E6AA0"],
    wallMaterials: ["Acoustic felt panel paint", "Matte emulsion"],
    floorMaterials: ["Commercial carpet tile", "Vinyl stone composite"],
    furnitureMaterials: ["Laminate worktop", "Steel leg workstation"],
    lightingMood: "Focused neutral",
  },
  "Kids Room": {
    wallColors: ["#F9F4EE", "#F3EDE6", "#EDE5DC", "#E7DED3"],
    floorColors: ["#C9B597", "#B8A488", "#A69278", "#97836B"],
    furnitureColors: ["#57606F", "#697586", "#7A8799", "#485262"],
    accentColors: ["#F28E8E", "#6EA8D9", "#F2C94C", "#7CCB94"],
    wallMaterials: ["Scrubbable zero-VOC paint", "Magnetic wall coating"],
    floorMaterials: ["Cork comfort floor", "Durable vinyl plank"],
    furnitureMaterials: ["Rounded MDF furniture", "Fabric storage modules"],
    lightingMood: "Playful bright",
  },
  Studio: {
    wallColors: ["#F0F0EE", "#E4E4E2", "#D2D2CF", "#C2C2BE"],
    floorColors: ["#A79F95", "#948C82", "#7E766E", "#69635D"],
    furnitureColors: ["#2D2E30", "#3D3F43", "#4D5055", "#1D1E20"],
    accentColors: ["#A75F4D", "#5A7F9B", "#8B9A6A", "#7D6D9A"],
    wallMaterials: ["Matte concrete skim", "Neutral gallery paint"],
    floorMaterials: ["Polished concrete", "Resin-coated screed"],
    furnitureMaterials: ["Modular sofa fabric", "Black steel shelving"],
    lightingMood: "Adaptive creative",
  },
  Lobby: {
    wallColors: ["#F8F6F2", "#EFEAE1", "#E3DBCE", "#D5CAB9"],
    floorColors: ["#BDB1A2", "#AFA292", "#9B8E80", "#857A6E"],
    furnitureColors: ["#2A2A2A", "#3B3B3B", "#4D4D4D", "#1A1A1A"],
    accentColors: ["#B98F5E", "#4D6D8A", "#8A9A76", "#7D6878"],
    wallMaterials: ["Stone veneer cladding", "Luxury matte paint"],
    floorMaterials: ["Large-format marble tile", "Terrazzo slab"],
    furnitureMaterials: ["Leather lounge seating", "Brushed brass details"],
    lightingMood: "Premium welcoming",
  },
  "Outdoor Patio": {
    wallColors: ["#E9E2D8", "#DCD3C7", "#CCC0B1", "#B9AC9A"],
    floorColors: ["#A68863", "#927858", "#7E674A", "#6B573F"],
    furnitureColors: ["#3E4A3F", "#566256", "#6B7569", "#2D382E"],
    accentColors: ["#D9814B", "#4B7F7A", "#A1A866", "#C97F6D"],
    wallMaterials: ["Weatherproof mineral coating", "Textured render"],
    floorMaterials: ["Natural travertine paver", "Outdoor porcelain stone"],
    furnitureMaterials: ["Powder-coated aluminum", "All-weather rattan"],
    lightingMood: "Evening relaxed",
  },
};

const styleProfiles: Record<StyleType, StyleProfile> = {
  Minimalist: {
    wallBias: 0,
    floorBias: 0,
    furnitureBias: 0,
    accentBias: 1,
    preferredMaterials: ["matte", "stone", "clean lines"],
  },
  Modern: {
    wallBias: 1,
    floorBias: 1,
    furnitureBias: 1,
    accentBias: 0,
    preferredMaterials: ["engineered", "sleek", "glass"],
  },
  Scandinavian: {
    wallBias: 2,
    floorBias: 0,
    furnitureBias: 2,
    accentBias: 2,
    preferredMaterials: ["oak", "linen", "light"],
  },
  Industrial: {
    wallBias: 3,
    floorBias: 2,
    furnitureBias: 0,
    accentBias: 3,
    preferredMaterials: ["concrete", "steel", "charcoal"],
  },
  Luxury: {
    wallBias: 0,
    floorBias: 3,
    furnitureBias: 1,
    accentBias: 2,
    preferredMaterials: ["marble", "velvet", "brass"],
  },
  Bohemian: {
    wallBias: 1,
    floorBias: 0,
    furnitureBias: 2,
    accentBias: 1,
    preferredMaterials: ["textured", "woven", "artisan"],
  },
  Coastal: {
    wallBias: 2,
    floorBias: 1,
    furnitureBias: 3,
    accentBias: 0,
    preferredMaterials: ["washed wood", "cotton", "light"],
  },
  Japandi: {
    wallBias: 3,
    floorBias: 2,
    furnitureBias: 3,
    accentBias: 1,
    preferredMaterials: ["natural wood", "stone", "calm"],
  },
  Rustic: {
    wallBias: 1,
    floorBias: 3,
    furnitureBias: 2,
    accentBias: 2,
    preferredMaterials: ["aged wood", "raw stone", "earth"],
  },
  Contemporary: {
    wallBias: 0,
    floorBias: 2,
    furnitureBias: 1,
    accentBias: 3,
    preferredMaterials: ["mixed textures", "neutral", "tailored"],
  },
};

const pick = (items: readonly string[], seed: number): string => items[seed % items.length];

const CONTRAST_CAP = 8;
const ACCENT_CONTRAST_CAP = 6;
const STONE_MATERIAL_KEYWORD = "stone";
const MATERIAL_BONUS_POINTS = 5;
const MIN_CONFIDENCE = 65;
const MAX_CONFIDENCE = 99;
const CONTRAST_WEIGHT = 0.65;
const ACCENT_WEIGHT = 0.35;

const scoreScenario = (scenario: Omit<DesignScenario, "confidence">): number => {
  const contrast = contrastRatio(scenario.wallColor, scenario.furnitureColor);
  const accentContrast = contrastRatio(scenario.wallColor, scenario.accentColor);
  const contrastScore = Math.min(100, Math.round((Math.min(contrast, CONTRAST_CAP) / CONTRAST_CAP) * 100));
  const accentScore = Math.min(
    100,
    Math.round((Math.min(accentContrast, ACCENT_CONTRAST_CAP) / ACCENT_CONTRAST_CAP) * 100),
  );
  const materialBonus = scenario.summary.toLowerCase().includes(STONE_MATERIAL_KEYWORD)
    ? MATERIAL_BONUS_POINTS
    : 0;

  return Math.max(
    MIN_CONFIDENCE,
    Math.min(
      MAX_CONFIDENCE,
      Math.round(contrastScore * CONTRAST_WEIGHT + accentScore * ACCENT_WEIGHT + materialBonus),
    ),
  );
};

export const designDataset: DesignScenario[] = rooms.flatMap((room, roomIndex) =>
  styles.map((style, styleIndex) => {
    const roomProfile = roomProfiles[room];
    const styleProfile = styleProfiles[style];
    const seed = roomIndex * 10 + styleIndex;

    const scenarioBase: Omit<DesignScenario, "confidence"> = {
      id: `${room.toLowerCase().replace(/\s+/g, "-")}-${style.toLowerCase()}`,
      room,
      style,
      wallColor: pick(roomProfile.wallColors, seed + styleProfile.wallBias),
      floorColor: pick(roomProfile.floorColors, seed + styleProfile.floorBias),
      furnitureColor: pick(roomProfile.furnitureColors, seed + styleProfile.furnitureBias),
      accentColor: pick(roomProfile.accentColors, seed + styleProfile.accentBias),
      wallMaterial: pick(roomProfile.wallMaterials, seed + styleProfile.wallBias),
      floorMaterial: pick(roomProfile.floorMaterials, seed + styleProfile.floorBias),
      furnitureMaterial: pick(roomProfile.furnitureMaterials, seed + styleProfile.furnitureBias),
      lightingMood: roomProfile.lightingMood,
      summary: `${style} ${room.toLowerCase()} concept using ${pick(styleProfile.preferredMaterials, seed)} material language.`,
    };

    if (room === "Bathroom" && style === "Minimalist") {
      scenarioBase.wallColor = "#F8F8F6";
      scenarioBase.floorColor = "#F0F0EE";
      scenarioBase.furnitureColor = "#111111";
      scenarioBase.accentColor = "#B0B7BC";
      scenarioBase.floorMaterial = "White marble slab";
      scenarioBase.furnitureMaterial = "Black stone vanity";
      scenarioBase.summary = "Minimalist bathroom with white marble envelope and black stone furniture for crisp luxury.";
    }

    return {
      ...scenarioBase,
      confidence: scoreScenario(scenarioBase),
    };
  }),
);

export const getDesignRecommendation = (room: RoomType, style: StyleType): DesignScenario | undefined =>
  designDataset.find((entry) => entry.room === room && entry.style === style);

export const getAlternativeDesigns = (room: RoomType, style: StyleType): DesignScenario[] =>
  designDataset
    .filter((entry) => entry.room === room && entry.style !== style)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
