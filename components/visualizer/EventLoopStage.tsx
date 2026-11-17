'use client';

import React from 'react';
import { SimulationState, EventLoopPhase } from '@/lib/types';
import { Layers, Timer, Zap, Clock, ArrowDown, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

interface EventLoopStageProps {
  state: SimulationState;
}

export function EventLoopStage({ state }: EventLoopStageProps) {
  const {
    callStack,
    webApis,
    microtaskQueue,
    macrotaskQueue,
    eventLoopPhase,
    activeContainer,
  } = state;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 shadow-xs space-y-6">
      {/* Stage Header & Phase banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <span className="text-xs font-mono font-semibold uppercase text-[var(--muted)]">
            Mô phỏng V8 Runtime & Browser
          </span>
          <h2 className="text-base font-serif font-bold text-[var(--foreground)]">
            Sơ đồ động tương tác Event Loop
          </h2>
        </div>

        {/* Dynamic Phase Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--card-subtle)] border border-[var(--border)] text-xs">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              eventLoopPhase === 'idle'
                ? 'bg-stone-400'
                : eventLoopPhase === 'microtaskDrain'
                ? 'bg-amber-500 animate-ping'
                : eventLoopPhase === 'macrotaskPick'
                ? 'bg-sky-500 animate-pulse'
                : 'bg-emerald-500'
            }`}
          />
          <span className="font-mono text-[11px] text-[var(--foreground)]">
            Pha hiện tại:{' '}
            <strong className="text-[var(--accent)] font-semibold">
              {eventLoopPhase === 'idle' && 'Đang chạy mã đồng bộ / Chờ'}
              {eventLoopPhase === 'callStackCheck' && 'Kiểm tra Call Stack rỗng'}
              {eventLoopPhase === 'microtaskDrain' && 'Ưu tiên: Dọn sạch Microtask Queue!'}
              {eventLoopPhase === 'renderPhase' && 'Kiểm tra Render / Repaint'}
              {eventLoopPhase === 'macrotaskPick' && 'Lấy 1 tác vụ từ Macrotask Queue'}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* COLUMN 1: Call Stack (4 cols) */}
        <div
          className={`lg:col-span-4 rounded-xl border p-4 transition-all flex flex-col min-h-[220px] ${
            activeContainer === 'callStack'
              ? 'border-[var(--accent)] bg-[var(--accent-light)]/30 ring-1 ring-[var(--accent)]'
              : 'border-[var(--border)] bg-[var(--card-subtle)]/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 font-medium text-xs text-[var(--foreground)]">
              <Layers className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-semibold">Call Stack</span>
              <span className="text-[10px] text-[var(--muted)] font-mono">(LIFO)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]">
              {callStack.length} frame
            </span>
          </div>

          <div className="flex-1 flex flex-col-reverse justify-start gap-2 border-dashed border-2 border-[var(--border)] rounded-lg p-2.5 bg-[var(--card)] overflow-y-auto">
            {callStack.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-[var(--muted)] italic text-center p-4">
                Stack rỗng (Empty)
                <br />
                <span className="text-[10px] text-emerald-600 font-sans not-italic font-medium mt-1">
                  ✓ Sẵn sàng nhận Microtask
                </span>
              </div>
            ) : (
              callStack.map((frame, idx) => (
                <div
                  key={frame.id}
                  className={`p-2 rounded-md border text-xs font-mono transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                    frame.isExecuting
                      ? 'bg-[var(--accent)] text-white border-[var(--accent-hover)] shadow-xs font-semibold'
                      : 'bg-[var(--card-subtle)] text-[var(--foreground)] border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{frame.name}</span>
                    {frame.isExecuting && (
                      <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-sans uppercase">
                        Running
                      </span>
                    )}
                  </div>
                  {frame.desc && (
                    <p className="text-[10px] opacity-80 font-sans mt-0.5">{frame.desc}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: Central Event Loop Hub (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
            Event Loop Controller
          </div>

          {/* Central Animated Wheel */}
          <div className="relative w-32 h-32 my-2 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full border-4 border-dashed border-[var(--border)] transition-transform duration-700 ${
                eventLoopPhase !== 'idle' ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            />
            <div className="w-20 h-20 rounded-full bg-[var(--accent-light)] border-2 border-[var(--accent)] flex flex-col items-center justify-center shadow-xs">
              <RefreshCw
                className={`w-6 h-6 text-[var(--accent)] ${
                  eventLoopPhase !== 'idle' ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s' }}
              />
              <span className="text-[10px] font-mono font-bold text-[var(--accent)] mt-0.5">
                Loop
              </span>
            </div>
          </div>

          {/* Order of Priority Diagram */}
          <div className="w-full mt-3 space-y-1.5 text-left text-[11px] font-mono">
            <div
              className={`p-1.5 rounded flex items-center justify-between transition-colors ${
                eventLoopPhase === 'microtaskDrain'
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'text-[var(--muted)]'
              }`}
            >
              <span>1. Microtask Queue</span>
              <span className="text-[10px] bg-amber-200/80 px-1 rounded">Drain ALL</span>
            </div>
            <div
              className={`p-1.5 rounded flex items-center justify-between transition-colors ${
                eventLoopPhase === 'macrotaskPick'
                  ? 'bg-sky-100 text-sky-900 font-bold border border-sky-300'
                  : 'text-[var(--muted)]'
              }`}
            >
              <span>2. Macrotask Queue</span>
              <span className="text-[10px] bg-sky-200/80 px-1 rounded">Pick 1 only</span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Web APIs (4 cols) */}
        <div
          className={`lg:col-span-4 rounded-xl border p-4 transition-all flex flex-col min-h-[220px] ${
            activeContainer === 'webApis'
              ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
              : 'border-[var(--border)] bg-[var(--card-subtle)]/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 font-medium text-xs text-[var(--foreground)]">
              <Timer className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Web APIs (Browser)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]">
              {webApis.length} tác vụ
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-2 border-dashed border-2 border-[var(--border)] rounded-lg p-2.5 bg-[var(--card)] overflow-y-auto">
            {webApis.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-[var(--muted)] italic text-center p-4">
                Không có timer / fetch ngầm đang chạy
              </div>
            ) : (
              webApis.map((api) => (
                <div
                  key={api.id}
                  className="p-2 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-mono flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{api.name}</span>
                  </div>
                  {api.timer && (
                    <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded font-bold">
                      {api.timer}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Queues Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Microtask Queue (VIP Lane) */}
        <div
          className={`rounded-xl border p-4 transition-all ${
            activeContainer === 'microtasks'
              ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-400'
              : 'border-amber-200/80 bg-amber-50/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-900">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span className="font-serif font-bold text-sm">Microtask Queue</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-semibold">
                VIP Priority
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-800">
              {microtaskQueue.length} microtask
            </span>
          </div>
          <p className="text-[11px] text-amber-800/80 mb-3">
            Chứa callback từ <code>Promise.then()</code>, <code>async/await</code>, <code>queueMicrotask()</code>.
          </p>

          <div className="min-h-[85px] border-dashed border-2 border-amber-300 rounded-lg p-2 bg-[var(--card)] flex items-center gap-2 overflow-x-auto">
            {microtaskQueue.length === 0 ? (
              <div className="w-full text-center text-xs text-[var(--muted)] italic py-2">
                Hàng đợi Microtask đang rỗng
              </div>
            ) : (
              microtaskQueue.map((item, idx) => (
                <div
                  key={item.id}
                  className="shrink-0 p-2 rounded-md bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-mono shadow-2xs animate-in fade-in"
                >
                  <div className="font-semibold flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[9px] text-amber-700 uppercase font-sans mt-0.5 block">
                    Source: {item.source}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Macrotask Queue */}
        <div
          className={`rounded-xl border p-4 transition-all ${
            activeContainer === 'macrotasks'
              ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-400'
              : 'border-sky-200/80 bg-sky-50/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-sky-900">
              <Clock className="w-4 h-4 text-sky-600" />
              <span className="font-serif font-bold text-sm">Macrotask Queue</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-semibold">
                Task Queue
              </span>
            </div>
            <span className="text-[11px] font-mono text-sky-800">
              {macrotaskQueue.length} macrotask
            </span>
          </div>
          <p className="text-[11px] text-sky-800/80 mb-3">
            Chứa callback từ <code>setTimeout()</code>, <code>setInterval()</code>, I/O events.
          </p>

          <div className="min-h-[85px] border-dashed border-2 border-sky-300 rounded-lg p-2 bg-[var(--card)] flex items-center gap-2 overflow-x-auto">
            {macrotaskQueue.length === 0 ? (
              <div className="w-full text-center text-xs text-[var(--muted)] italic py-2">
                Hàng đợi Macrotask đang rỗng
              </div>
            ) : (
              macrotaskQueue.map((item, idx) => (
                <div
                  key={item.id}
                  className="shrink-0 p-2 rounded-md bg-sky-100/80 border border-sky-300 text-sky-900 text-xs font-mono shadow-2xs animate-in fade-in"
                >
                  <div className="font-semibold flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[9px] text-sky-700 uppercase font-sans mt-0.5 block">
                    Source: {item.source}
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
