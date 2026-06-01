# Fit The Color

**Know if your colors belong together.**

Fit The Color is a production-grade, client-only **advanced color compatibility analyzer** built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Recharts**.

The platform is designed to feel like the intersection of premium Apple-like polish, Linear-level product clarity, and Stripe-style conversion confidence.

## Product Positioning

Fit The Color is not a simple palette picker. It is a strategic decision engine for modern digital and spatial experiences. Teams use it to reduce visual risk, improve readability outcomes, increase emotional alignment, and accelerate launch confidence.

## Core Value Promise

- Turn color selection into measurable design intelligence
- Validate palette quality against accessibility and UX standards
- Simulate real product and room experiences in real time
- Export boardroom-ready reports without any backend dependency

## Technical Characteristics

- 100% client-side architecture
- No database
- No server APIs
- No AI model calls
- No authentication layer
- Vercel-compatible deployment model
- Strict TypeScript setup
- Responsive dark-first glassmorphism interface

## What the Application Delivers

### 1) Input & Palette Design Surface

- Primary, secondary, and accent color inputs
- Native color pickers
- Manual HEX entry
- RGB paste parsing
- Palette randomizer
- Generate full palette from a single primary color
- Style-driven palette generation:
  - Modern
  - Corporate
  - Luxury
  - Futuristic
  - Minimalist
  - Gaming
  - Creative

### 2) Live Visual Systems

- Instant website mock with:
  - Navbar
  - Hero
  - Buttons
  - Card system
  - Footer
- Room preview mock with walls/furniture/accent blocks
- Trend simulator states for:
  - 2026 UI design
  - Mobile app
  - Portfolio site
  - Landing page

### 3) Analysis Engine (Deterministic, Mathematical)

- Relative luminance and WCAG contrast ratio computation
- Contrast/readability scoring
- Harmony classification:
  - Complementary
  - Analogous
  - Split Complementary
  - Triadic
  - Monochromatic
  - Tetradic-compatible scoring model
- Saturation diagnostics:
  - Over-saturated
  - Under-saturated
  - Balanced
- Brightness diagnostics:
  - Too dark
  - Too bright
  - Balanced
- Emotional interpretation via hue psychology rules
- Context-fit scoring based on industry preference rules

### 4) Scoring Framework

The report includes:

- Contrast Score
- Harmony Score
- Context Score
- Accessibility Score
- Emotional Score
- Overall Fit Score (0–100)
- Verdict labels:
  - Excellent
  - Good
  - Average
  - Poor
  - Terrible

### 5) Accessibility Layer

- Pairwise contrast matrix
- AA compliance visibility
- AAA compliance visibility
- Fix suggestions for failing pairs

### 6) Recommendation Engine

- Explains where current palette is weak
- Generates at least 5 alternatives
- Suggests stronger primary/secondary/accent combinations

### 7) Visual Intelligence Charts

- Score radar chart
- Color distribution chart
- Contrast chart

### 8) Export Layer (Client-side)

- PNG palette export
- JSON report export
- PDF report export

## Local Knowledge Base Scale

The app ships with a large embedded local JSON knowledge layer containing:

- Color psychology mappings
- Accessibility thresholds
- Harmony rules
- Context-fit preference rules
- **10,000 preloaded colors**
- **1,000 preloaded contexts/places**

No external requests are required to execute the analysis logic.

## Architecture Summary

- `src/app/page.tsx` — Full interactive product surface
- `src/lib/color.ts` — Color parsing, conversion, luminance, contrast tools
- `src/lib/analyzer.ts` — Scoring, harmony, context-fit, recommendations
- `src/lib/palette.ts` — Random/style/primary-driven palette generation
- `src/lib/exporters.ts` — PNG/JSON/PDF client export helpers
- `src/data/knowledge-base.json` — Embedded color/context intelligence

## Brand Narrative

Fit The Color helps product teams transform subjective “looks good” decisions into objective, presentation-ready confidence. It empowers founders, designers, agencies, and brand operators to align aesthetics with trust, conversion readiness, and accessibility discipline—at speed.

In short: **from color choices to color strategy**.
