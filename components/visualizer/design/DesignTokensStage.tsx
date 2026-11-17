'use client';

import React from 'react';
import { DesignTokensState } from '@/lib/scenarios/design-tokens-data';
import { Palette, ArrowRight, Sun, Moon, Layers, Sliders, CheckCircle2 } from 'lucide-react';

interface DesignTokensStageProps {
  state: DesignTokensState;
  className?: string;
}

export function DesignTokensStage({ state, className = '' }: DesignTokensStageProps) {
  const { activeTheme, tokenChain, componentPreview, storybookArgs } = state;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 flex flex-col justify-between shadow-xs select-none overflow-hidden ${className}`}
    >
      {/* Top Bar: Title & Active Theme Pill */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse" />
          <h2 className="font-serif font-bold text-[15px] sm:text-[16px] text-[var(--foreground)] tracking-tight">
            Kiến trúc Design Tokens &amp; Component Matrix
          </h2>
        </div>

        {/* Theme Pill */}
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-[var(--muted)] hidden sm:inline">Theme:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[12px] font-mono font-bold tracking-tight border flex items-center gap-1 ${
              activeTheme === 'dark'
                ? 'bg-zinc-900 text-zinc-100 border-zinc-700'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            {activeTheme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3 text-amber-600" />}
            {activeTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
      </div>

      {/* Main Content Area: Token Pipeline (Left) & Component Preview (Right) */}
      <div className="flex-1 min-h-0 py-2.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch overflow-y-auto">
        {/* Left: 3-Tier Token Pipeline (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
          <div className="text-[11px] font-mono font-bold text-[var(--muted)] uppercase tracking-wider pb-1 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <span>Chuỗi phân giải Token (Token Resolution Chain)</span>
            <span className="text-[10px] text-pink-600 font-bold">W3C Design Tokens Spec</span>
          </div>

          <div className="space-y-1.5 py-1">
            {/* Tier 1: Global Token */}
            <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border-subtle)] flex items-center justify-between text-[12px]">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                  Tier 1: Global Token
                </span>
                <span className="font-mono font-bold text-[var(--foreground)]">
                  {tokenChain.globalToken}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-zinc-300 shadow-2xs"
                  style={{ backgroundColor: tokenChain.globalValue.startsWith('#') ? tokenChain.globalValue : '#E4E4E7' }}
                />
                <span className="font-mono text-[11px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">
                  {tokenChain.globalValue}
                </span>
              </div>
            </div>

            <div className="flex justify-center text-zinc-400">
              <span className="text-[11px] font-mono">↓ kế thừa sang</span>
            </div>

            {/* Tier 2: Semantic Token */}
            <div className="p-2 rounded-lg bg-pink-50/50 border border-pink-200 flex items-center justify-between text-[12px]">
              <div>
                <span className="text-[10px] font-mono uppercase text-pink-700 font-bold block">
                  Tier 2: Semantic Token
                </span>
                <span className="font-mono font-bold text-pink-950">
                  {tokenChain.semanticToken}
                </span>
              </div>
              <span className="font-mono text-[11px] text-pink-800 bg-pink-100/70 px-1.5 py-0.5 rounded font-medium">
                {tokenChain.semanticValue}
              </span>
            </div>

            <div className="flex justify-center text-zinc-400">
              <span className="text-[11px] font-mono">↓ áp dụng vào</span>
            </div>

            {/* Tier 3: Component Token */}
            <div className="p-2 rounded-lg bg-[var(--card)] border border-emerald-300 flex items-center justify-between text-[12px]">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">
                  Tier 3: Component Scoped Token
                </span>
                <span className="font-mono font-bold text-[var(--foreground)]">
                  {tokenChain.componentToken}
                </span>
              </div>
              <span className="font-mono font-bold text-[11px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                ✓ {tokenChain.resolvedCss}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-[var(--muted)] font-mono text-center pt-1 border-t border-[var(--border-subtle)]">
            Đổi Theme chỉ cần hoán đổi Tier 2, giữ nguyên Tier 1 &amp; Tier 3
          </div>
        </div>

        {/* Right: Live Component Preview & Storybook Controls (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
          <div>
            <div className="text-[11px] font-mono font-bold text-[var(--muted)] uppercase tracking-wider pb-1 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <span>Storybook Preview</span>
              <span className="text-[10px] text-zinc-500 font-mono">Canvas</span>
            </div>

            {/* Component Live Render Box */}
            <div className="my-3 py-6 px-4 rounded-xl bg-[var(--card)] border border-[var(--border-subtle)] flex items-center justify-center shadow-2xs">
              <button
                style={componentPreview.previewStyle}
                className="font-medium text-[13px] shadow-sm transition-all cursor-pointer font-sans"
              >
                {storybookArgs.label || componentPreview.name}
              </button>
            </div>
          </div>

          {/* Storybook Args Controls */}
          <div className="p-2 rounded-lg bg-[var(--card-subtle)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-mono text-[var(--muted)] uppercase font-bold flex items-center gap-1">
              <Sliders className="w-3 h-3 text-pink-600" /> Storybook Args
            </span>
            <div className="font-mono text-[11px] text-zinc-700 space-y-0.5">
              {Object.entries(storybookArgs).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-zinc-500">{key}:</span>
                  <span className="font-bold text-zinc-900">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Quote */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono shrink-0">
        <span>Global (Primitive) ➔ Semantic (Context) ➔ Component (Scoped)</span>
        <span className="text-[var(--accent)] font-semibold hidden sm:inline">Design Systems &amp; Storybook</span>
      </div>
    </div>
  );
}
