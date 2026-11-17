'use client';

import React from 'react';
import { SimulationState } from '@/lib/types';
import { Layers, Timer, Zap, Clock } from 'lucide-react';

interface EventLoopStageProps {
  state: SimulationState;
  className?: string;
}

export function EventLoopStage({ state, className = '' }: EventLoopStageProps) {
  const {
    callStack,
    webApis,
    microtaskQueue,
    macrotaskQueue,
    eventLoopPhase,
    activeContainer,
  } = state;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 shadow-xs flex flex-col gap-3.5 ${className}`}
    >
      {/* Top Phase Ribbon - Claude minimalist style */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="font-serif text-[14px] font-semibold text-[var(--foreground)]">
            Trạng thái Event Loop
          </span>
        </div>

        {/* Dynamic Minimalist Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--card-subtle)] border border-[var(--border)] text-[12px] font-mono">
          <span className="text-[var(--muted)]">Pha:</span>
          <span className="font-semibold text-[var(--accent)]">
            {eventLoopPhase === 'idle' && 'Đang chạy mã đồng bộ (Call Stack)'}
            {eventLoopPhase === 'callStackCheck' && 'Call Stack rỗng ➔ Kích hoạt Event Loop'}
            {eventLoopPhase === 'microtaskDrain' && 'Ưu tiên VIP: Dọn sạch Microtask Queue'}
            {eventLoopPhase === 'renderPhase' && 'Kiểm tra chu kỳ vẽ lại (Rendering Pipeline)'}
            {eventLoopPhase === 'macrotaskPick' && 'Lấy đúng 1 tác vụ từ Macrotask Queue'}
          </span>
        </div>
      </div>

      {/* 2x2 Stage Matrix - flexible flex-1 min-h-0 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1 min-h-0">
        {/* 1. Call Stack (Top-Left) */}
        <div
          className={`rounded-xl border p-3 transition-all flex flex-col min-h-0 ${
            activeContainer === 'callStack'
              ? 'border-[var(--accent)] bg-[var(--accent-light)]/20 ring-1 ring-[var(--accent)]'
              : 'border-[var(--border)] bg-[var(--card)]'
          }`}
        >
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--foreground)]">
              <Layers className="w-4 h-4 text-[var(--accent)]" />
              <span>Call Stack (LIFO)</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--card-subtle)] text-[var(--muted)]">
              {callStack.length} frame
            </span>
          </div>

          <div className="flex-1 min-h-0 flex flex-col-reverse justify-start gap-1.5 border border-dashed border-[var(--border)] rounded-lg p-2 bg-[var(--card-subtle)]/40 overflow-y-auto">
            {callStack.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[13px] text-[var(--muted)] italic text-center py-2">
                Stack rỗng (Sẵn sàng nhận microtask)
              </div>
            ) : (
              callStack.map((frame) => (
                <div
                  key={frame.id}
                  className={`px-2.5 py-1 rounded-md text-[13px] font-mono transition-all flex items-center justify-between ${
                    frame.isExecuting
                      ? 'bg-[var(--accent)] text-white font-medium shadow-xs'
                      : 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)]'
                  }`}
                >
                  <span className="truncate">{frame.name}</span>
                  {frame.isExecuting && (
                    <span className="text-[9px] bg-white/20 px-1 rounded font-sans uppercase">
                      Running
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Web APIs (Top-Right) */}
        <div
          className={`rounded-xl border p-3 transition-all flex flex-col min-h-0 ${
            activeContainer === 'webApis'
              ? 'border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600'
              : 'border-[var(--border)] bg-[var(--card)]'
          }`}
        >
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--foreground)]">
              <Timer className="w-4 h-4 text-emerald-700" />
              <span>Web APIs (Background Timers)</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--card-subtle)] text-[var(--muted)]">
              {webApis.length} tác vụ
            </span>
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-1.5 border border-dashed border-[var(--border)] rounded-lg p-2 bg-[var(--card-subtle)]/40 overflow-y-auto">
            {webApis.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[13px] text-[var(--muted)] italic text-center py-2">
                Không có timer ngầm đang chạy
              </div>
            ) : (
              webApis.map((api) => (
                <div
                  key={api.id}
                  className="px-2.5 py-1 rounded-md text-[13px] font-mono bg-emerald-50/80 border border-emerald-200 text-emerald-900 flex items-center justify-between"
                >
                  <span>{api.name}</span>
                  {api.timer && (
                    <span className="text-[10px] font-bold bg-emerald-200/80 px-1.5 rounded">
                      {api.timer}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Microtask Queue (Bottom-Left) */}
        <div
          className={`rounded-xl border p-3 transition-all flex flex-col min-h-0 ${
            activeContainer === 'microtasks'
              ? 'border-amber-500 bg-amber-50/30 ring-1 ring-amber-400'
              : 'border-[var(--border)] bg-[var(--card)]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 shrink-0">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-950">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Microtask Queue</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                VIP (Drain All)
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-900 font-semibold">
              {microtaskQueue.length}
            </span>
          </div>

          <div className="flex-1 min-h-[65px] border border-dashed border-amber-200 rounded-lg p-2 bg-amber-50/20 flex items-center gap-2 overflow-x-auto">
            {microtaskQueue.length === 0 ? (
              <div className="w-full text-center text-[13px] text-[var(--muted)] italic py-1">
                Hàng đợi rỗng
              </div>
            ) : (
              microtaskQueue.map((item, idx) => (
                <div
                  key={item.id}
                  className="shrink-0 p-2 rounded-md bg-amber-100/90 border border-amber-300 text-amber-950 text-[12px] font-mono shadow-2xs"
                >
                  <div className="font-semibold flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[130px]">{item.name}</span>
                  </div>
                  <span className="text-[9px] text-amber-800 font-sans block mt-0.5">
                    {item.source}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Macrotask Queue (Bottom-Right) */}
        <div
          className={`rounded-xl border p-3 transition-all flex flex-col min-h-0 ${
            activeContainer === 'macrotasks'
              ? 'border-sky-500 bg-sky-50/30 ring-1 ring-sky-400'
              : 'border-[var(--border)] bg-[var(--card)]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 shrink-0">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-sky-950">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Macrotask Queue</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 text-sky-900">
                1 task / vòng
              </span>
            </div>
            <span className="text-[11px] font-mono text-sky-900 font-semibold">
              {macrotaskQueue.length}
            </span>
          </div>

          <div className="flex-1 min-h-[65px] border border-dashed border-sky-200 rounded-lg p-2 bg-sky-50/20 flex items-center gap-2 overflow-x-auto">
            {macrotaskQueue.length === 0 ? (
              <div className="w-full text-center text-[13px] text-[var(--muted)] italic py-1">
                Hàng đợi rỗng
              </div>
            ) : (
              macrotaskQueue.map((item, idx) => (
                <div
                  key={item.id}
                  className="shrink-0 p-2 rounded-md bg-sky-100/90 border border-sky-300 text-sky-950 text-[12px] font-mono shadow-2xs"
                >
                  <div className="font-semibold flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white text-[9px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[130px]">{item.name}</span>
                  </div>
                  <span className="text-[9px] text-sky-800 font-sans block mt-0.5">
                    {item.source}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
