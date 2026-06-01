"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import knowledgeBase from "@/data/knowledge-base.json";
import { analyzePalette } from "@/lib/analyzer";
import { exportPalettePng, exportReportJson, exportReportPdf } from "@/lib/exporters";
import { normalizeHex, parseRgbText } from "@/lib/color";
import { generateByStyle, generateFromPrimary, paletteStyles, randomPalette } from "@/lib/palette";
import type { PaletteInput } from "@/lib/types";

const startingPalette: PaletteInput = {
  primary: "#1D4ED8",
  secondary: "#0F172A",
  accent: "#22D3EE",
  context: "Bedroom",
};

type ColorKey = "primary" | "secondary" | "accent";

function ColorControl({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
  onChange: (next: string) => void;
}) {
  const [rgbText, setRgbText] = useState("");
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
      <p className="text-sm font-medium text-white/80">{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="h-11 w-14 cursor-pointer rounded-md border border-white/30 bg-transparent"
        />
        <input
          value={color}
          onChange={(event) => {
            const parsed = normalizeHex(event.target.value);
            if (parsed) onChange(parsed);
          }}
          className="h-11 flex-1 rounded-xl border border-white/20 bg-black/30 px-3 text-sm text-white outline-none"
          aria-label={`${label} hex input`}
        />
      </div>
      <input
        value={rgbText}
        onChange={(event) => setRgbText(event.target.value)}
        onBlur={() => {
          const converted = parseRgbText(rgbText);
          if (converted) onChange(converted);
        }}
        placeholder="Paste RGB e.g. 34, 211, 238"
        className="mt-3 h-10 w-full rounded-xl border border-white/20 bg-black/30 px-3 text-xs text-white/80 outline-none"
      />
    </div>
  );
}

export default function Home() {
  const [palette, setPalette] = useState<PaletteInput>(startingPalette);
  const [selectedStyle, setSelectedStyle] = useState("Modern");

  const report = useMemo(() => analyzePalette(palette), [palette]);

  const scoreRadarData = [
    { metric: "Contrast", value: report.scores.contrast },
    { metric: "Harmony", value: report.scores.harmony },
    { metric: "Context", value: report.scores.context },
    { metric: "Access", value: report.scores.accessibility },
    { metric: "Emotion", value: report.scores.emotional },
  ];

  const distributionData = [
    { name: "Primary", value: 44, color: palette.primary },
    { name: "Secondary", value: 36, color: palette.secondary },
    { name: "Accent", value: 20, color: palette.accent },
  ];

  const contrastChartData = report.accessibilityPairs.map((entry) => ({
    name: entry.pair,
    ratio: Number(entry.ratio.toFixed(2)),
  }));

  const updateColor = (key: ColorKey, value: string) => {
    setPalette((previous) => ({ ...previous, [key]: value }));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b,#020617_52%)] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl md:p-8">
          <h1 className="text-4xl font-bold tracking-tight">Fit The Color</h1>
          <p className="mt-2 text-white/70">Know if your colors belong together.</p>
          <p className="mt-3 text-sm text-white/60">Client-side compatibility intelligence with {knowledgeBase.colorCatalog.length.toLocaleString()} preloaded colors and {knowledgeBase.contexts.length.toLocaleString()} contexts.</p>
        </motion.section>

        <section className="grid gap-4 lg:grid-cols-3">
          <ColorControl label="Primary Color" color={palette.primary} onChange={(value) => updateColor("primary", value)} />
          <ColorControl label="Secondary Color" color={palette.secondary} onChange={(value) => updateColor("secondary", value)} />
          <ColorControl label="Accent Color" color={palette.accent} onChange={(value) => updateColor("accent", value)} />
        </section>

        <section className="grid gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl md:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-sm text-white/70">Select Place</p>
            <select
              value={palette.context}
              onChange={(event) => setPalette((previous) => ({ ...previous, context: event.target.value }))}
              className="mt-2 h-11 w-full rounded-xl border border-white/20 bg-black/30 px-3 text-sm outline-none"
            >
              {knowledgeBase.contexts.map((context) => (
                <option key={context} value={context}>
                  {context}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            <button className="rounded-xl bg-white/15 px-3 py-2 text-sm hover:bg-white/25" onClick={() => {
              const [primary, secondary, accent] = randomPalette();
              setPalette((previous) => ({ ...previous, primary, secondary, accent }));
            }}>Randomize</button>
            <button className="rounded-xl bg-white/15 px-3 py-2 text-sm hover:bg-white/25" onClick={() => {
              const [primary, secondary, accent] = generateFromPrimary(palette.primary);
              setPalette((previous) => ({ ...previous, primary, secondary, accent }));
            }}>From Primary</button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
          <p className="text-sm text-white/70">Palette Generator Style</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {paletteStyles.map((style) => (
              <button
                key={style}
                className={`rounded-full px-4 py-2 text-xs ${selectedStyle === style ? "bg-cyan-400/80 text-black" : "bg-white/10 text-white"}`}
                onClick={() => {
                  setSelectedStyle(style);
                  const [primary, secondary, accent] = generateByStyle(style);
                  setPalette((previous) => ({ ...previous, primary, secondary, accent }));
                }}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Website Preview</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/15" style={{ background: palette.secondary }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ background: palette.primary }}>
                <span className="font-semibold">Fit Brand</span>
                <button className="rounded-lg px-3 py-1 text-xs font-semibold" style={{ background: palette.accent, color: "#0B1020" }}>Contact</button>
              </div>
              <div className="space-y-3 p-4">
                <h3 className="text-2xl font-bold">Landing Hero</h3>
                <p className="text-sm text-white/80">Design systems, product landing pages, and UI shells update instantly with your active palette.</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl p-3" style={{ background: `${palette.primary}AA` }}>Growth dashboard card</div>
                  <div className="rounded-xl p-3" style={{ background: `${palette.accent}66` }}>Conversion metrics card</div>
                </div>
              </div>
              <div className="px-4 py-3 text-xs text-white/80" style={{ background: `${palette.primary}66` }}>Footer preview</div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Room Preview</h2>
            <div className="mt-4 rounded-2xl border border-white/15 p-4" style={{ background: palette.secondary }}>
              <div className="h-28 rounded-xl" style={{ background: palette.primary }} />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-14 rounded-lg" style={{ background: `${palette.accent}CC` }} />
                <div className="h-14 rounded-lg" style={{ background: `${palette.primary}AA` }} />
                <div className="h-14 rounded-lg" style={{ background: `${palette.accent}88` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
          <h2 className="text-xl font-semibold">Final Score</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {["contrast", "harmony", "context", "accessibility", "emotional", "overall"].map((key) => (
              <div key={key} className="rounded-xl bg-black/30 p-3 text-center">
                <p className="text-xs uppercase text-white/60">{key}</p>
                <p className="mt-1 text-2xl font-bold">{report.scores[key as keyof typeof report.scores]}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-cyan-300">Verdict: {report.scores.verdict}</p>
          <p className="text-sm text-white/70">Harmony: {report.harmonyType} • Saturation: {report.saturationState} • Brightness: {report.brightnessState}</p>
          <p className="mt-2 text-xs text-white/70">{report.emotionalSummary}</p>
          <p className="text-xs text-white/70">{report.contextSummary}</p>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="h-72 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={scoreRadarData}>
                <PolarGrid stroke="rgba(255,255,255,0.3)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#CBD5E1", fontSize: 12 }} />
                <Radar dataKey="value" stroke={palette.accent} fill={palette.accent} fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-72 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {distributionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-72 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contrastChartData}>
                <XAxis dataKey="name" tick={{ fill: "#CBD5E1", fontSize: 10 }} />
                <YAxis tick={{ fill: "#CBD5E1" }} />
                <Tooltip />
                <Bar dataKey="ratio" fill={palette.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
          <h2 className="text-xl font-semibold">Accessibility Checker</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-white/60">
                  <th className="p-2">Pair</th>
                  <th className="p-2">Contrast</th>
                  <th className="p-2">AA</th>
                  <th className="p-2">AAA</th>
                  <th className="p-2">Fix</th>
                </tr>
              </thead>
              <tbody>
                {report.accessibilityPairs.map((entry) => (
                  <tr key={entry.pair} className="border-t border-white/10">
                    <td className="p-2">{entry.pair}</td>
                    <td className="p-2">{entry.ratio}</td>
                    <td className="p-2">{entry.aa ? "Pass" : "Fail"}</td>
                    <td className="p-2">{entry.aaa ? "Pass" : "Fail"}</td>
                    <td className="p-2 text-xs text-white/70">{entry.suggestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
          <h2 className="text-xl font-semibold">Recommendation Engine</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {report.recommendations.map((rec, index) => (
              <div key={`${rec.primary}-${index}`} className="rounded-xl border border-white/10 bg-black/25 p-3">
                <div className="mb-2 flex h-5 overflow-hidden rounded">
                  {[rec.primary, rec.secondary, rec.accent].map((swatch) => (
                    <div key={swatch} className="h-full flex-1" style={{ background: swatch }} />
                  ))}
                </div>
                <p className="text-xs text-white/70">{rec.reason}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl md:grid-cols-3">
          <button className="rounded-xl bg-cyan-400/80 px-4 py-3 font-semibold text-black hover:bg-cyan-300" onClick={() => exportPalettePng(palette)}>Export PNG Palette</button>
          <button className="rounded-xl bg-white/20 px-4 py-3 font-semibold hover:bg-white/30" onClick={() => exportReportJson(palette, report)}>Export JSON Report</button>
          <button className="rounded-xl bg-white/20 px-4 py-3 font-semibold hover:bg-white/30" onClick={() => exportReportPdf(palette, report)}>Export PDF Report</button>
        </section>

        <section className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
          <h2 className="text-xl font-semibold">Trend Simulator</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            {[
              "2026 UI Design",
              "Mobile App",
              "Portfolio Site",
              "Landing Page",
            ].map((item, index) => (
              <div key={item} className="rounded-xl border border-white/10 p-3" style={{ background: [palette.primary, palette.secondary, `${palette.accent}AA`, `${palette.primary}88`][index] }}>
                <p className="font-medium">{item}</p>
                <p className="mt-2 text-xs text-white/80">Simulated tone response with your current palette and contrast model.</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
