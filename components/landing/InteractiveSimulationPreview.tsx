'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { eventLoopScenarios } from '@/lib/scenarios/event-loop-data';
import { Play, Pause, SkipForward, RotateCcw, ArrowRight, Terminal } from 'lucide-react';

export function InteractiveSimulationPreview() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenario = eventLoopScenarios[selectedScenarioIndex];
  const totalSteps = scenario.steps.length;
  const currentStep = scenario.steps[currentStepIndex] || scenario.steps[0];
  const { callStack, microtaskQueue, macrotaskQueue, consoleLogs, eventLoopPhase } = currentStep.state;

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedScenarioIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1100);
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps]);

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white shadow-2xs overflow-hidden flex flex-col">
      {/* Top Header / Scenario Selector */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--card-subtle)] px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Live Sandbox
          </span>
          <span className="text-zinc-300">|</span>
          <span className="text-xs font-medium text-[var(--foreground)]">
            {scenario.title}
          </span>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-200/60 text-xs">
          {eventLoopScenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioIndex(idx)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                selectedScenarioIndex === idx
                  ? 'bg-white text-zinc-900 shadow-2xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {sc.difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Stage: Code on Left, Runtime Queues on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
        {/* Left Column: Synchronized Code Viewer (5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-zinc-950 text-zinc-100 font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                script.js
              </span>
              <span>Step {currentStepIndex + 1} of {totalSteps}</span>
            </div>

            <pre className="overflow-x-auto leading-relaxed py-1">
              <code>
                {scenario.code.split('\n').map((line, idx) => {
                  const lineNumber = idx + 1;
                  const isActive = currentStep.activeCodeLines?.includes(lineNumber);
                  return (
                    <div
                      key={idx}
                      className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-200 border-l-2 border-amber-400 font-semibold'
                          : 'text-zinc-300'
                      }`}
                    >
                      <span className="w-6 shrink-0 text-zinc-600 select-none text-[11px]">
                        {lineNumber}
                      </span>
                      <span className="flex-1">{line || ' '}</span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>

          {/* Current Step Explanation Box */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80">
            <div className="text-[11px] uppercase tracking-wide text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
              <span>Engine Status:</span>
              <span className="text-zinc-300 font-normal normal-case">
                {eventLoopPhase === 'idle' && 'Thực thi mã đồng bộ trong Call Stack'}
                {eventLoopPhase === 'callStackCheck' && 'Call Stack rỗng ➔ Event Loop kích hoạt'}
                {eventLoopPhase === 'microtaskDrain' && 'Dọn sạch hàng đợi Microtask'}
                {eventLoopPhase === 'macrotaskPick' && 'Lấy 1 Macrotask từ Callback Queue'}
              </span>
            </div>
            <p className="text-[12px] text-zinc-300 font-sans leading-normal">
              {currentStep.explanation}
            </p>
          </div>
        </div>

        {/* Right Column: Runtime Engine Containers (7 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-[#FAF8F5]">
          <div className="space-y-4">
            {/* Visual Grid: Call Stack & VIP Microtasks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Call Stack Box */}
              <div className="rounded-xl border border-[var(--border)] bg-white p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Call Stack (LIFO)
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {callStack.length} frame{callStack.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="min-h-[100px] flex flex-col-reverse gap-1.5 p-2 rounded-lg bg-zinc-50 border border-zinc-200/80">
                  {callStack.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-400 text-xs italic py-6">
                      (Call Stack rỗng)
                    </div>
                  ) : (
                    callStack.map((frame, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs font-semibold shadow-2xs flex items-center justify-between"
                      >
                        <span>{frame.name}</span>
                        <span className="text-[10px] text-amber-700 bg-amber-200/60 px-1 rounded">active</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Microtask Queue (VIP Lane) */}
              <div className="rounded-xl border border-[var(--border)] bg-white p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Microtask Queue (VIP)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Ưu tiên #1
                  </span>
                </div>

                <div className="min-h-[100px] flex flex-col gap-1.5 p-2 rounded-lg bg-zinc-50 border border-zinc-200/80">
                  {microtaskQueue.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-400 text-xs italic py-6">
                      (Hàng đợi Microtask rỗng)
                    </div>
                  ) : (
                    microtaskQueue.map((task, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs font-medium shadow-2xs flex items-center justify-between"
                      >
                        <span>{task.name}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded">VIP</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Macrotask Queue Row */}
            <div className="rounded-xl border border-[var(--border)] bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Macrotask Queue (setTimeout / Timers)
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {macrotaskQueue.length} task
                </span>
              </div>

              <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-zinc-50 border border-zinc-200/80 min-h-[46px] items-center">
                {macrotaskQueue.length === 0 ? (
                  <span className="text-zinc-400 text-xs italic">(Không có macrotask chờ xử lý)</span>
                ) : (
                  macrotaskQueue.map((task, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-300 text-sky-900 font-mono text-xs font-medium"
                    >
                      {task.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Console Output */}
            <div className="rounded-xl border border-zinc-300 bg-zinc-900 p-3 text-zinc-100 font-mono shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  Terminal Output
                </span>
                <span>{consoleLogs.length} logs</span>
              </div>

              <div className="min-h-[56px] space-y-1 text-xs">
                {consoleLogs.length === 0 ? (
                  <span className="text-zinc-500 italic text-[11px]">&gt; Chưa có output in ra console...</span>
                ) : (
                  consoleLogs.map((log, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-zinc-500">&gt;</span>
                      <span className="text-emerald-400 font-semibold">{log.text}</span>
                      {log.tag && (
                        <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1 py-0.5 rounded">
                          [{log.tag}]
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Interactive Step Controls & Deep Link */}
          <div className="mt-5 pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                title={isPlaying ? 'Tạm dừng mô phỏng' : 'Chạy tự động'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Tạm dừng' : 'Chạy tự động'}</span>
              </button>

              <button
                onClick={handleStepForward}
                disabled={currentStepIndex >= totalSteps - 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Bước kế tiếp (Step Forward)"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Bước tiếp</span>
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 text-xs shadow-2xs transition-colors cursor-pointer"
                title="Khởi động lại mô phỏng"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <Link
              href="/workbench?topic=event-loop"
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors group"
            >
              <span>Mở phòng thí nghiệm đầy đủ</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
