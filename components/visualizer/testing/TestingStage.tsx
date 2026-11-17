'use client';

import React from 'react';
import { TestingState } from '@/lib/scenarios/testing-regression-data';
import { CheckSquare, ShieldCheck, AlertTriangle, Eye, MousePointerClick, CheckCircle2 } from 'lucide-react';

interface TestingStageProps {
  state: TestingState;
  className?: string;
}

export function TestingStage({ state, className = '' }: TestingStageProps) {
  const { mode, baselineSnapshot, prSnapshot, diffAreas, actionabilityChecks, testStatus } = state;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 flex flex-col justify-between shadow-xs select-none overflow-hidden ${className}`}
    >
      {/* Top Bar: Title & Test Status */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />
          <h2 className="font-serif font-bold text-[15px] sm:text-[16px] text-[var(--foreground)] tracking-tight">
            Mô phỏng Visual Regression &amp; E2E Testing
          </h2>
        </div>

        {/* Test Result Pill */}
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-[var(--muted)] font-mono hidden sm:inline">Kết quả CI:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[12px] font-mono font-bold tracking-tight border flex items-center gap-1 ${
              testStatus === 'PASSED'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : testStatus === 'FAILED'
                ? 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
                : 'bg-zinc-100 text-zinc-700 border-zinc-200'
            }`}
          >
            {testStatus === 'PASSED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            {testStatus === 'FAILED' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
            {testStatus}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 py-2.5 flex flex-col justify-between gap-3 overflow-y-auto">
        {mode === 'visual-diff' ? (
          /* Case 1: Pixel Diff 3-Column Comparison */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch">
            {/* 1. Baseline */}
            <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col justify-between shadow-2xs">
              <div className="text-[11px] font-mono font-bold text-zinc-700 pb-1.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <span>1. Baseline (main)</span>
                <span className="text-[10px] text-zinc-400">commit: {baselineSnapshot.commitHash}</span>
              </div>
              <div className="py-4 flex items-center justify-center">
                <button
                  style={baselineSnapshot.stylePreview}
                  className="font-medium text-white text-[13px] shadow-sm font-sans"
                >
                  Xác nhận
                </button>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono text-center pt-1 border-t border-[var(--border-subtle)]">
                Golden Master Snapshot
              </div>
            </div>

            {/* 2. PR Candidate */}
            <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col justify-between shadow-2xs">
              <div className="text-[11px] font-mono font-bold text-blue-800 pb-1.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <span>2. PR Candidate</span>
                <span className="text-[10px] text-blue-600 font-bold">commit: {prSnapshot.commitHash}</span>
              </div>
              <div className="py-4 flex items-center justify-center">
                <button
                  style={prSnapshot.stylePreview}
                  className="font-medium text-white text-[13px] shadow-sm font-sans"
                >
                  Xác nhận
                </button>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono text-center pt-1 border-t border-[var(--border-subtle)]">
                Bản đề xuất merge PR
              </div>
            </div>

            {/* 3. Pixel Diff Overlay */}
            <div
              className={`p-2.5 rounded-xl border flex flex-col justify-between shadow-2xs ${
                diffAreas.length > 0
                  ? 'border-rose-300 bg-rose-50/60 ring-1 ring-rose-200'
                  : 'border-[var(--border)] bg-[var(--background)]'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-rose-800 pb-1.5 border-b border-rose-200 flex items-center justify-between">
                <span>3. Pixel Diff Overlay</span>
                {diffAreas.length > 0 && (
                  <span className="text-[10px] bg-rose-200 text-rose-900 px-1 rounded font-bold">
                    +{diffAreas[0].mismatchPercentage}% Mismatch
                  </span>
                )}
              </div>
              <div className="py-4 flex items-center justify-center relative">
                <div className="relative p-1 border-2 border-dashed border-rose-500 rounded-lg bg-rose-200/50">
                  <div className="px-4 py-2 bg-blue-600 text-white rounded text-[13px] font-medium opacity-80">
                    Xác nhận
                  </div>
                  <span className="absolute -top-2.5 -right-2 text-[9px] font-mono bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold shadow-2xs">
                    +4px Padding!
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-rose-700 text-center pt-1 border-t border-rose-200">
                {diffAreas.length > 0 ? '❌ Bị chặn merge CI' : '✓ 100% Khớp điểm ảnh'}
              </div>
            </div>
          </div>
        ) : (
          /* Case 2: Playwright Actionability 6-Check View */
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
            <div className="text-[12px] font-mono font-bold text-[var(--foreground)] pb-1.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MousePointerClick className="w-4 h-4 text-violet-600" />
                Playwright Auto-waiting: 5 Tiêu chuẩn Actionability
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">
                page.locator(&apos;#checkout-btn&apos;).click()
              </span>
            </div>

            <div className="space-y-1.5">
              {actionabilityChecks.map((chk, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border text-[12px] flex items-center justify-between transition-all ${
                    chk.status === 'passed'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950 animate-pulse'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {chk.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin shrink-0" />
                    )}
                    <span className="font-mono font-bold">{chk.name}</span>
                  </div>
                  <span className="text-[11px] text-zinc-600">{chk.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Quote */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono shrink-0">
        <span>Visual Regression = Pixel-by-pixel Diffing | Playwright = Auto-waiting Actionability</span>
        <span className="text-[var(--accent)] font-semibold hidden sm:inline">Chromium CDP &amp; Pixelmatch</span>
      </div>
    </div>
  );
}
