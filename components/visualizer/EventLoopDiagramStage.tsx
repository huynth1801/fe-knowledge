'use client';

import React from 'react';
import { SimulationState } from '@/lib/types';
import { RefreshCw, ArrowDown } from 'lucide-react';

interface EventLoopDiagramStageProps {
  state: SimulationState;
  className?: string;
}

export function EventLoopDiagramStage({
  state,
  className = '',
}: EventLoopDiagramStageProps) {
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
      className={`rounded-2xl border border-[var(--border)] bg-[#FDFCFB] p-4 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      {/* Top Banner with Phase Tag */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <h2 className="font-serif font-bold text-[15px] text-[var(--foreground)]">
            Mô hình trực quan Event Loop Architecture
          </h2>
        </div>

        <div className="text-[12px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]">
          Pha hiện tại:{' '}
          <strong className="text-[var(--accent)] font-semibold">
            {eventLoopPhase === 'idle' && 'Thực thi Call Stack'}
            {eventLoopPhase === 'callStackCheck' && 'Call Stack rỗng ➔ Event Loop kích hoạt'}
            {eventLoopPhase === 'microtaskDrain' && 'Dọn sạch Microtask Queue'}
            {eventLoopPhase === 'renderPhase' && 'Render Pipeline'}
            {eventLoopPhase === 'macrotaskPick' && 'Lấy 1 Macrotask'}
          </strong>
        </div>
      </div>

      {/* Main 3-Column Diagram Layout matching the uploaded diagram */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4 flex-1 min-h-0 items-center py-2 relative">
        {/* ======================================================== */}
        {/* 1. LEFT: JS Call Stack Container (Dashed Outer Border)  */}
        {/* ======================================================== */}
        <div
          className={`col-span-12 sm:col-span-3 rounded-2xl border-2 border-dashed p-3 flex flex-col h-full min-h-[220px] transition-all relative ${
            activeContainer === 'callStack'
              ? 'border-amber-500 bg-amber-50/20 shadow-xs'
              : 'border-[#D1CCC4] bg-white/70'
          }`}
        >
          {/* JS Icon & Header */}
          <div className="flex items-center gap-2 mb-2.5 shrink-0">
            <div className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center font-mono shadow-2xs">
              JS
            </div>
            <h3 className="font-bold text-[14px] text-[var(--foreground)]">
              Call Stack
            </h3>
          </div>

          {/* Inner Stack Column (Bottom-to-Top LIFO) */}
          <div className="flex-1 rounded-xl border border-[var(--border)] bg-[#FAF8F5] p-2 flex flex-col-reverse justify-start gap-1.5 overflow-y-auto">
            {callStack.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[12px] text-[var(--muted)] italic text-center py-4">
                Stack rỗng
              </div>
            ) : (
              callStack.map((frame) => (
                <div
                  key={frame.id}
                  className={`px-2.5 py-1.5 rounded-lg text-[12px] font-mono font-semibold transition-all shadow-2xs flex items-center justify-between ${
                    frame.isExecuting
                      ? 'bg-[#FBBF24] border border-[#D97706] text-[#78350F] ring-2 ring-amber-300'
                      : 'bg-[#FDE68A] border border-[#F59E0B] text-[#92400E]'
                  }`}
                >
                  <span className="truncate">{frame.name}</span>
                  {frame.isExecuting && (
                    <span className="w-2 h-2 rounded-full bg-amber-700 animate-ping shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CENTER: Queues Container (Dashed Outer Border)       */}
        {/* ======================================================== */}
        <div
          className={`col-span-12 sm:col-span-6 rounded-2xl border-2 border-dashed p-3.5 flex flex-col justify-between h-full min-h-[220px] transition-all ${
            activeContainer === 'microtasks' || activeContainer === 'macrotasks'
              ? 'border-emerald-500 bg-emerald-50/10'
              : 'border-[#D1CCC4] bg-white/70'
          }`}
        >
          {/* Top: Microtask Queue */}
          <div
            className={`rounded-xl border p-2.5 transition-all ${
              activeContainer === 'microtasks'
                ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400'
                : 'border-[var(--border)] bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[13px] text-emerald-950 font-serif">
                Microtask Queue
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                Priority 1
              </span>
            </div>

            {/* Microtask Cards (Light Mint Green) */}
            <div className="flex items-center gap-2 overflow-x-auto min-h-[44px] py-0.5">
              {microtaskQueue.length === 0 ? (
                <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--muted)] opacity-70">
                  <span className="px-2 py-1 rounded-md bg-[#DCFCE7]/60 border border-[#BBF7D0] text-[#166534]">
                    .then()
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#DCFCE7]/60 border border-[#BBF7D0] text-[#166534]">
                    .catch()
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#DCFCE7]/60 border border-[#BBF7D0] text-[#166534]">
                    .finally()
                  </span>
                  <span className="text-[11px] italic ml-1">(Rỗng)</span>
                </div>
              ) : (
                microtaskQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="shrink-0 px-2.5 py-1 rounded-md bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] text-[12px] font-mono font-semibold shadow-2xs animate-in fade-in"
                  >
                    <span>{item.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sequence Arrow Down between Microtask and Macrotask */}
          <div className="flex items-center justify-center py-0.5 text-[#78716A]">
            <ArrowDown className="w-4 h-4 text-emerald-600 animate-bounce" />
          </div>

          {/* Middle: Macrotask Queue */}
          <div
            className={`rounded-xl border p-2.5 transition-all ${
              activeContainer === 'macrotasks'
                ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                : 'border-[var(--border)] bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[13px] text-emerald-950 font-serif">
                Macrotask Queue
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                1 task / tick
              </span>
            </div>

            {/* Macrotask Cards (Solid Forest Green) */}
            <div className="flex items-center gap-2 overflow-x-auto min-h-[44px] py-0.5">
              {macrotaskQueue.length === 0 ? (
                <div className="flex items-center gap-2 text-[11px] font-mono text-white/90">
                  <span className="px-2 py-1 rounded-md bg-[#16A34A] text-white">
                    setTimeout
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#16A34A] text-white">
                    I/O callback
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#16A34A] text-white">
                    onclick
                  </span>
                  <span className="text-[11px] text-[var(--muted)] italic ml-1">
                    (Rỗng)
                  </span>
                </div>
              ) : (
                macrotaskQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="shrink-0 px-2.5 py-1 rounded-md bg-[#15803D] border border-[#166534] text-white text-[12px] font-mono font-semibold shadow-2xs animate-in fade-in"
                  >
                    <span>{item.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Caption matching diagram: Event Loop caption */}
          <div className="pt-2 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--foreground)]">
              <RefreshCw
                className={`w-3.5 h-3.5 text-emerald-600 ${
                  eventLoopPhase !== 'idle' ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s' }}
              />
              <span>Event Loop</span>
            </div>
            <p className="text-[11px] text-[var(--muted)] italic mt-0.5">
              After each task, execute all microtasks in the Microtask Queue
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. RIGHT: WebAPIs Container (Timers, FS, Network)        */}
        {/* ======================================================== */}
        <div
          className={`col-span-12 sm:col-span-3 rounded-2xl border p-3 flex flex-col h-full min-h-[220px] transition-all justify-between ${
            activeContainer === 'webApis'
              ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
              : 'border-[var(--border)] bg-white/70'
          }`}
        >
          {/* Header */}
          <div className="mb-2 text-center shrink-0">
            <h3 className="font-bold text-[14px] text-[var(--foreground)]">
              WebAPIs
            </h3>
            <span className="text-[11px] text-[var(--muted)]">
              (Browser background)
            </span>
          </div>

          {/* Inner cards (Pink / Coral) */}
          <div className="flex-1 rounded-xl border border-[var(--border)] bg-[#FAF8F5] p-2 flex flex-col gap-1.5 overflow-y-auto">
            {/* Timers block */}
            <div
              className={`p-2 rounded-lg border text-[12px] font-mono transition-all flex items-center justify-between ${
                webApis.length > 0
                  ? 'bg-rose-100 border-rose-300 text-rose-950 font-bold ring-1 ring-rose-300 animate-pulse'
                  : 'bg-[#FFE4E6] border-[#FECDD3] text-[#9F1239]'
              }`}
            >
              <span>Timers</span>
              {webApis.length > 0 ? (
                <span className="text-[10px] bg-rose-200 px-1 rounded text-rose-900">
                  {webApis[0].name}
                </span>
              ) : (
                <span className="text-[10px] opacity-70">idle</span>
              )}
            </div>

            {/* FS / I/O block */}
            <div className="p-2 rounded-lg border border-[#FECDD3] bg-[#FFE4E6] text-[#9F1239] text-[12px] font-mono flex items-center justify-between">
              <span>FS / I/O</span>
              <span className="text-[10px] opacity-70">idle</span>
            </div>

            {/* Network block */}
            <div className="p-2 rounded-lg border border-[#FECDD3] bg-[#FFE4E6] text-[#9F1239] text-[12px] font-mono flex items-center justify-between">
              <span>Network</span>
              <span className="text-[10px] opacity-70">idle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Flow Legend at bottom */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[var(--muted)] shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FCD34D] border border-[#F59E0B]" />
          <span>Call Stack (LIFO)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#DCFCE7] border border-[#86EFAC]" />
          <span>Microtasks (VIP: Dọn sạch)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#16A34A]" />
          <span className="text-[#16A34A] font-semibold">Macrotasks (1 task/vòng)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FFE4E6] border border-[#FECDD3]" />
          <span>WebAPIs</span>
        </div>
      </div>
    </div>
  );
}
