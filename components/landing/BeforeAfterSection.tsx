'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, Check, Play, RotateCcw } from 'lucide-react';

export function BeforeAfterSection() {
  const [viewMode, setViewMode] = useState<'split' | 'docs' | 'visualizer'>('split');
  const [simStep, setSimStep] = useState(0);

  const microtaskSteps = [
    { label: 'Initial tick', current: 'Call Stack runs main script', activeQueue: 'none' },
    { label: 'Microtask VIP', current: 'Draining Promise.then() queue', activeQueue: 'microtasks' },
    { label: 'Browser Paint', current: 'Calculating layout reflow at 60fps', activeQueue: 'render' },
    { label: 'Macrotask', current: 'Running setTimeout(0) callback', activeQueue: 'macrotasks' },
  ];

  return (
    <section className="py-20 sm:py-28 border-t border-[var(--border)]" id="before-after">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Segmented Toggle Switch */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              Before / After
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text)] tracking-tight">
              One concept. Two ways to understand it.
            </h2>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              Compare a traditional documentation paragraph with the matching executable mental model.
            </p>
          </div>

          {/* Segmented Control */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] font-mono text-xs self-start sm:self-auto">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === 'split'
                  ? 'bg-[var(--bg-card)] text-[var(--text)] font-bold shadow-2xs border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Side-by-side
            </button>
            <button
              onClick={() => setViewMode('docs')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === 'docs'
                  ? 'bg-[var(--bg-card)] text-[var(--text)] font-bold shadow-2xs border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Docs only
            </button>
            <button
              onClick={() => setViewMode('visualizer')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === 'visualizer'
                  ? 'bg-[var(--bg-card)] text-[var(--text)] font-bold shadow-2xs border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Visualizer only
            </button>
          </div>
        </div>

        {/* Side-by-side Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left: Dry Docs Paragraph */}
          {(viewMode === 'split' || viewMode === 'docs') && (
            <div
              className={`rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4 shadow-2xs flex flex-col justify-between ${
                viewMode === 'docs' ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <span className="font-mono text-xs font-semibold text-[var(--text-muted)] uppercase">
                    Standard Documentation
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                    Passive text
                  </span>
                </div>

                <div className="space-y-3 font-serif text-sm sm:text-base text-[var(--text)] leading-relaxed">
                  <p>
                    &ldquo;Each iteration of the event loop checks whether the call stack is empty. When the script terminates, the agent processes all queued microtasks sequentially. If microtasks enqueue additional microtasks, they are resolved during the same turn before yield to the macrotask queue or browser rendering pipeline.&rdquo;
                  </p>
                  <p className="text-xs font-sans text-[var(--text-muted)] leading-relaxed">
                    Notice how this description leaves key questions ambiguous: Does <code className="font-mono text-[var(--text)]">setTimeout(fn, 0)</code> get delayed by a Promise resolve? In what exact order does paint happen?
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>Retention after 72 hours:</span>
                <span className="text-rose-600 font-bold">~18%</span>
              </div>
            </div>
          )}

          {/* Right: Matching Visualizer */}
          {(viewMode === 'split' || viewMode === 'visualizer') && (
            <div
              className={`rounded-xl border border-[var(--accent-border)] bg-[var(--bg-card)] p-6 space-y-4 shadow-2xs flex flex-col justify-between ${
                viewMode === 'visualizer' ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase">
                    FE Visualizer Engine
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSimStep((prev) => (prev + 1) % microtaskSteps.length)}
                      className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white cursor-pointer shadow-2xs"
                    >
                      Step ({simStep + 1}/4)
                    </button>
                    <button
                      onClick={() => setSimStep(0)}
                      className="p-1 rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] cursor-pointer"
                      title="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pipeline visualizer */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Current Phase:</span>
                      <span className="font-bold text-[var(--accent)]">
                        {microtaskSteps[simStep].label}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-[var(--text)]">
                      {microtaskSteps[simStep].current}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div
                      className={`p-2 rounded border transition-all ${
                        microtaskSteps[simStep].activeQueue === 'microtasks'
                          ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent)] font-bold'
                          : 'bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-muted)]'
                      }`}
                    >
                      Microtask VIP
                    </div>
                    <div
                      className={`p-2 rounded border transition-all ${
                        microtaskSteps[simStep].activeQueue === 'render'
                          ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent)] font-bold'
                          : 'bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-muted)]'
                      }`}
                    >
                      60fps Paint
                    </div>
                    <div
                      className={`p-2 rounded border transition-all ${
                        microtaskSteps[simStep].activeQueue === 'macrotasks'
                          ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent)] font-bold'
                          : 'bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-muted)]'
                      }`}
                    >
                      Macrotask Queue
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text)]">
                <span className="text-[var(--text-muted)]">Retention after 72 hours:</span>
                <span className="text-[var(--accent)] font-bold">~84% (Mental model holds)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
