"use client";

import { useMemo, useState } from "react";
import {
  getAlternativeDesigns,
  getDesignRecommendation,
  rooms,
  styles,
  type RoomType,
  type StyleType,
} from "@/lib/designerSimulator";

const swatches = [
  { key: "wallColor", label: "Wall" },
  { key: "floorColor", label: "Floor" },
  { key: "furnitureColor", label: "Furniture" },
  { key: "accentColor", label: "Accent" },
] as const;

export default function Home() {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>("Bathroom");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("Minimalist");

  const recommendation = useMemo(
    () => getDesignRecommendation(selectedRoom, selectedStyle),
    [selectedRoom, selectedStyle],
  );

  const alternatives = useMemo(
    () => getAlternativeDesigns(selectedRoom, selectedStyle),
    [selectedRoom, selectedStyle],
  );

  if (!recommendation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <p>Unable to generate a design recommendation.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-3xl font-semibold">Interior Color Simulator</h1>
          <p className="mt-2 text-sm text-white/70">
            Smart designer logic over 100 real room-style simulations.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Room</span>
              <select
                value={selectedRoom}
                onChange={(event) => setSelectedRoom(event.target.value as RoomType)}
                className="h-11 w-full rounded-xl border border-white/20 bg-slate-900 px-3"
              >
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-white/70">Style</span>
              <select
                value={selectedStyle}
                onChange={(event) => setSelectedStyle(event.target.value as StyleType)}
                className="h-11 w-full rounded-xl border border-white/20 bg-slate-900 px-3"
              >
                {styles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{recommendation.room} • {recommendation.style}</h2>
            <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-sm text-emerald-200">
              Match {recommendation.confidence}%
            </span>
          </div>
          <p className="mt-3 text-sm text-white/70">{recommendation.summary}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {swatches.map((swatch) => (
              <div key={swatch.key} className="rounded-2xl border border-white/10 p-3">
                <div
                  className="h-16 rounded-xl border border-white/20"
                  style={{ backgroundColor: recommendation[swatch.key] }}
                />
                <p className="mt-2 text-xs text-white/60">{swatch.label}</p>
                <p className="text-sm font-medium">{recommendation[swatch.key]}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-white/60">Wall Material</p>
              <p>{recommendation.wallMaterial}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-white/60">Floor Material</p>
              <p>{recommendation.floorMaterial}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-white/60">Furniture Material</p>
              <p>{recommendation.furnitureMaterial}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-white/60">Lighting Mood</p>
              <p>{recommendation.lightingMood}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">Alternative styles for this room</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {alternatives.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedStyle(option.style)}
                className="rounded-2xl border border-white/10 bg-black/20 p-3 text-left hover:border-cyan-300/70"
              >
                <p className="font-medium">{option.style}</p>
                <p className="mt-1 text-xs text-white/70">{option.summary}</p>
                <p className="mt-2 text-xs text-cyan-200">Match {option.confidence}%</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
