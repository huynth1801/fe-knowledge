'use client';

import React from 'react';
import { WebVitalsState } from '@/lib/scenarios/web-vitals-data';
import { Activity, AlertTriangle, CheckCircle2, Gauge, Zap, Flame } from 'lucide-react';

interface WebVitalsStageProps {
  state: WebVitalsState;
  className?: string;
}

export function WebVitalsStage({ state, className = '' }: WebVitalsStageProps) {
  const { metrics, timelineFrames, fps, layoutShiftOffsetPx, isMainThreadBlocked, activeOptimization } = state;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 flex flex-col justify-between shadow-xs select-none overflow-hidden ${className}`}
    >
      {/* Top Bar: Title & FPS Badge */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
          <h2 className="font-serif font-bold text-[15px] sm:text-[16px] text-[var(--foreground)] tracking-tight">
            Mô phỏng Core Web Vitals &amp; Main Thread
          </h2>
        </div>

        {/* Live FPS Meter */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[var(--muted)] font-mono hidden sm:inline">Khung hình:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[12px] font-mono font-bold tracking-tight border flex items-center gap-1 ${
              fps >= 50
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {fps} FPS {fps < 50 && '(Giật lag!)'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 py-2.5 flex flex-col justify-between gap-3 overflow-y-auto">
        {/* 1. 3 Metric Cards: INP, LCP, CLS */}
        <div className="grid grid-cols-3 gap-2.5">
          {metrics.map((m) => (
            <div
              key={m.name}
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                m.rating === 'good'
                  ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                  : m.rating === 'needs-improvement'
                  ? 'border-amber-200 bg-amber-50/40 text-amber-950'
                  : 'border-rose-300 bg-rose-50/70 text-rose-950 ring-2 ring-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase">{m.name}</span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    m.rating === 'good'
                      ? 'bg-emerald-200 text-emerald-900'
                      : m.rating === 'needs-improvement'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-rose-200 text-rose-900'
                  }`}
                >
                  {m.rating.toUpperCase()}
                </span>
              </div>

              <div className="my-1">
                <span className="font-serif text-2xl font-bold tracking-tight">{m.value}</span>
              </div>

              <div className="text-[10px] font-mono opacity-80">{m.thresholdText}</div>
            </div>
          ))}
        </div>

        {/* 2. Visual View: Main Thread Timeline or CLS Shift Preview */}
        {layoutShiftOffsetPx !== undefined ? (
          /* CLS Shift Window Preview */
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] flex-1 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[12px] font-mono font-bold text-[var(--foreground)]">
                Khung nhìn Layout Shift (Mô phỏng màn hình người dùng)
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                Độ lệch: {layoutShiftOffsetPx}px
              </span>
            </div>

            <div className="relative h-28 overflow-hidden rounded-lg bg-[var(--card)] border border-[var(--border-subtle)] p-2.5">
              {/* Dynamic Image Banner */}
              {layoutShiftOffsetPx > 0 ? (
                <div className="w-full h-12 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-mono font-bold flex items-center justify-center animate-in fade-in">
                  🖼️ Banner quảng cáo tải xong đột ngột (Chiếm 48px)
                </div>
              ) : (
                <div className="w-full h-0 text-transparent">Placeholder</div>
              )}

              {/* Shifting Content */}
              <div
                className="mt-2 transition-transform duration-500 ease-out space-y-1"
                style={{
                  transform: `translateY(${layoutShiftOffsetPx > 0 ? '8px' : '0px'})`,
                }}
              >
                <div className="font-bold text-[13px] text-[var(--foreground)]">
                  Bài viết: Hướng dẫn Tối ưu Core Web Vitals
                </div>
                <div className="text-[12px] text-[var(--muted)]">
                  Người dùng đang đọc dòng này thì bị banner bên trên tải muộn đẩy trôi xuống...
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[var(--muted)] flex items-center justify-between pt-1">
              <span>Khắc phục: Luôn khai báo `aspect-ratio` hoặc `width` &amp; `height`</span>
            </div>
          </div>
        ) : (
          /* Main Thread Timeline Visualization */
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] flex-1 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[12px] font-mono font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-rose-600" />
                Dòng thời gian Main Thread (Ngưỡng an toàn: 50ms)
              </span>
              <span className="text-[11px] font-mono font-bold text-zinc-600">
                {isMainThreadBlocked ? '⚠️ ĐANG BỊ NGHẼN' : '✓ THÔNG THOÁNG'}
              </span>
            </div>

            {/* Frame Bars */}
            <div className="py-2 space-y-2">
              <div className="flex items-center gap-1.5 h-10 w-full overflow-hidden">
                {timelineFrames.map((frame) => (
                  <div
                    key={frame.id}
                    className={`h-full rounded-lg px-2 flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      frame.type === 'long-task'
                        ? 'flex-1 bg-rose-500 text-white shadow-xs animate-pulse ring-2 ring-rose-300'
                        : frame.type === 'yield'
                        ? 'w-24 bg-emerald-500 text-white'
                        : 'w-20 bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {frame.label}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)] px-1">
                <span>0ms</span>
                <span className="text-rose-600 font-bold">50ms (Giới hạn Long Task)</span>
                <span>200ms (Ngưỡng INP Poor)</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-700 bg-zinc-100 p-1.5 rounded-lg flex items-center justify-between">
              <span>Trạng thái: {activeOptimization}</span>
              <span className="text-[10px] text-[var(--muted)]">Chrome Performance API</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Quote */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono shrink-0">
        <span>INP &lt;= 200ms (Interaction) | LCP &lt;= 2.5s (Loading) | CLS &lt;= 0.1 (Visual Stability)</span>
        <span className="text-[var(--accent)] font-semibold hidden sm:inline">Google Web Vitals 2026</span>
      </div>
    </div>
  );
}
