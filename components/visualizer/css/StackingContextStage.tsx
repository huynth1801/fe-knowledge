'use client';

import React, { useState } from 'react';
import { StackingContextState } from '@/lib/scenarios/stacking-context-data';
import { Layers, AlertTriangle, CheckCircle2, Eye, Box } from 'lucide-react';

interface StackingContextStageProps {
  state: StackingContextState;
  className?: string;
}

export function StackingContextStage({ state, className = '' }: StackingContextStageProps) {
  const { layers, activeRule, createdContexts } = state;
  const [is3DView, setIs3DView] = useState(true);

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 flex flex-col justify-between shadow-xs select-none overflow-hidden ${className}`}
    >
      {/* Top Bar: Title & 2D/3D Toggle */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <h2 className="font-serif font-bold text-[15px] sm:text-[16px] text-[var(--foreground)] tracking-tight">
            Mô hình 3D phân tầng Stacking Context &amp; Z-Index
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIs3DView((prev) => !prev)}
            className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--card-subtle)] text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Box className="w-3.5 h-3.5 text-indigo-600" />
            {is3DView ? 'Chế độ: 3D Isometric' : 'Chế độ: 2D Phẳng'}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="flex-1 min-h-0 py-3 flex items-center justify-center overflow-hidden relative">
        {/* Background perspective grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {is3DView ? (
          /* 3D Isometric View */
          <div
            className="relative w-full max-w-md h-64 flex items-center justify-center transition-all duration-500"
            style={{
              perspective: '1000px',
            }}
          >
            <div
              className="relative w-64 h-48 transition-transform duration-700 ease-out"
              style={{
                transform: 'rotateX(55deg) rotateZ(-30deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {layers.map((layer, idx) => {
                const zOffset = layer.elevationLevel * 36;
                return (
                  <div
                    key={layer.id}
                    className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 flex flex-col justify-between p-3.5 shadow-xl ${
                      layer.isWinning
                        ? 'border-emerald-500 bg-emerald-50/90 ring-4 ring-emerald-200'
                        : layer.trapWarning
                        ? 'border-rose-400 bg-rose-50/90 ring-2 ring-rose-300'
                        : 'border-zinc-300 bg-white/95'
                    }`}
                    style={{
                      transform: `translateZ(${zOffset}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[12px] text-zinc-900 truncate">
                        {layer.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-zinc-900 text-white">
                        z: {layer.zIndex}
                      </span>
                    </div>

                    {layer.trapWarning && (
                      <div className="text-[10px] font-sans font-bold text-rose-700 bg-rose-100 p-1.5 rounded-md border border-rose-300">
                        {layer.trapWarning}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 pt-1 border-t border-zinc-200/60">
                      <span>Thuộc: {layer.contextOwner}</span>
                      <span className="font-bold text-indigo-700">Tầng Z: +{zOffset}px</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 2D Flat Layer Stack */
          <div className="w-full max-w-lg space-y-2">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  layer.isWinning
                    ? 'border-emerald-400 bg-emerald-50/80'
                    : layer.trapWarning
                    ? 'border-rose-300 bg-rose-50/80'
                    : 'border-[var(--border)] bg-[var(--background)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-zinc-100 border border-zinc-300 text-zinc-800 text-[11px] font-mono font-bold flex items-center justify-center">
                    L{layer.computedOrder}
                  </span>
                  <div>
                    <div className="font-mono font-bold text-[13px] text-[var(--foreground)]">
                      {layer.name}
                    </div>
                    <div className="text-[11px] text-[var(--muted)]">
                      Ngữ cảnh: {layer.contextOwner}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-white font-mono text-[11px] font-bold">
                    z-index: {layer.zIndex}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info Quote */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono shrink-0">
        <span>Quy tắc: So sánh Stacking Context của cha trước ➔ Nếu cha thua, con z:9999 vẫn nằm dưới</span>
        <span className="text-[var(--accent)] font-semibold hidden sm:inline">CSS 3D Rendering Pipeline</span>
      </div>
    </div>
  );
}
