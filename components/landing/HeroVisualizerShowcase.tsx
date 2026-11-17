'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  ChevronRight,
  Layers,
  Cpu,
  Move,
  GitBranch,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type TabKey = 'event-loop' | 'reconciliation' | 'flexbox' | 'closure';

export function HeroVisualizerShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>('event-loop');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-advance every 6s until user interacts
  useEffect(() => {
    if (hasInteracted) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const tabs: TabKey[] = ['event-loop', 'reconciliation', 'flexbox', 'closure'];
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const nextIndex = (tabs.indexOf(prev) + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [hasInteracted]);

  const handleSelectTab = (tab: TabKey) => {
    setHasInteracted(true);
    setActiveTab(tab);
  };

  return (
    <div
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shadow-xs"
      onClick={() => setHasInteracted(true)}
    >
      {/* Tab Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 overflow-x-auto select-none">
        <div className="flex items-center gap-1.5 min-w-max" role="tablist" aria-label="Visualizer Demos">
          <button
            role="tab"
            aria-selected={activeTab === 'event-loop'}
            onClick={() => handleSelectTab('event-loop')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${
              activeTab === 'event-loop'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] font-bold shadow-2xs border border-[var(--border)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Event loop</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'reconciliation'}
            onClick={() => handleSelectTab('reconciliation')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${
              activeTab === 'reconciliation'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] font-bold shadow-2xs border border-[var(--border)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reconciliation</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'flexbox'}
            onClick={() => handleSelectTab('flexbox')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${
              activeTab === 'flexbox'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] font-bold shadow-2xs border border-[var(--border)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Move className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Flexbox</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'closure'}
            onClick={() => handleSelectTab('closure')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${
              activeTab === 'closure'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] font-bold shadow-2xs border border-[var(--border)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Closure</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" aria-hidden="true" />
          <span>Interactive runtime engine</span>
        </div>
      </div>

      {/* Visualizer Canvas Area */}
      <div className="p-4 sm:p-6 bg-[var(--bg-card)] min-h-[380px] flex flex-col justify-between">
        {activeTab === 'event-loop' && <EventLoopMini />}
        {activeTab === 'reconciliation' && <ReconciliationMini />}
        {activeTab === 'flexbox' && <FlexboxMini />}
        {activeTab === 'closure' && <ClosureMini />}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 1. EVENT LOOP MINI VISUALIZER                                             */
/* ========================================================================= */
function EventLoopMini() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      action: "Execute: console.log('1')",
      stack: ["console.log('1')"],
      microtasks: [],
      macrotasks: [],
      logs: ['1'],
      desc: 'Synchronous statement executes immediately on Call Stack.',
    },
    {
      action: 'Register: setTimeout(cb, 0)',
      stack: ['setTimeout(cb, 0)'],
      microtasks: [],
      macrotasks: ['timerCb()'],
      logs: ['1'],
      desc: 'Web API registers timer; callback is dispatched to Macrotask Queue.',
    },
    {
      action: 'Resolve: Promise.then(cb)',
      stack: ['Promise.resolve()'],
      microtasks: ['promiseCb()'],
      macrotasks: ['timerCb()'],
      logs: ['1'],
      desc: 'Promise microtask enqueued into VIP Microtask Queue.',
    },
    {
      action: "Execute: console.log('2')",
      stack: ["console.log('2')"],
      microtasks: ['promiseCb()'],
      macrotasks: ['timerCb()'],
      logs: ['1', '2'],
      desc: 'Call stack finishes running main script code.',
    },
    {
      action: 'Drain Microtask: promiseCb()',
      stack: ['promiseCb()'],
      microtasks: [],
      macrotasks: ['timerCb()'],
      logs: ['1', '2', 'Promise VIP'],
      desc: 'Event loop drains ALL microtasks BEFORE touching macrotasks.',
    },
    {
      action: 'Run Macrotask: timerCb()',
      stack: ['timerCb()'],
      microtasks: [],
      macrotasks: [],
      logs: ['1', '2', 'Promise VIP', 'Timer cb'],
      desc: 'Browser executes the macrotask once the call stack is clear.',
    },
  ];

  const current = steps[step];

  return (
    <div className="space-y-4">
      {/* Step controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent)] font-semibold uppercase">
            Step {step + 1} of {steps.length}
          </span>
          <p className="text-sm font-semibold text-[var(--text)] mt-0.5">{current.action}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[var(--text)] cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => setStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
            className="px-3 py-1 text-xs font-mono font-semibold rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white cursor-pointer shadow-2xs"
          >
            Next step
          </button>
          <button
            onClick={() => setStep(0)}
            className="p-1 rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Queues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Call Stack */}
        <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text)]">
            <span>Call Stack (LIFO)</span>
            <span className="text-[10px] text-[var(--text-muted)]">{current.stack.length} frame</span>
          </div>
          <div className="min-h-[52px] flex flex-col justify-end gap-1">
            {current.stack.length > 0 ? (
              current.stack.map((fn, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1.5 rounded bg-[var(--bg-card)] border border-[var(--border)] text-xs font-mono text-[var(--text)] font-semibold shadow-2xs flex items-center justify-between"
                >
                  <span>{fn}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-bold">
                    active
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs font-mono text-[var(--text-muted)] italic">Empty</span>
            )}
          </div>
        </div>

        {/* Microtask VIP Lane */}
        <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text)]">
            <span>Microtask Queue</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold">
              Priority #1
            </span>
          </div>
          <div className="min-h-[52px] flex flex-col gap-1">
            {current.microtasks.length > 0 ? (
              current.microtasks.map((task, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1.5 rounded bg-[var(--bg-card)] border border-[var(--accent-border)] text-xs font-mono text-[var(--accent)] font-semibold"
                >
                  {task}
                </div>
              ))
            ) : (
              <span className="text-xs font-mono text-[var(--text-muted)] italic">Queue empty</span>
            )}
          </div>
        </div>

        {/* Macrotask Queue */}
        <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text)]">
            <span>Macrotask Queue</span>
            <span className="text-[10px] text-[var(--text-muted)]">Timers & I/O</span>
          </div>
          <div className="min-h-[52px] flex flex-col gap-1">
            {current.macrotasks.length > 0 ? (
              current.macrotasks.map((task, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1.5 rounded bg-[var(--bg-card)] border border-[var(--border)] text-xs font-mono text-[var(--text)]"
                >
                  {task}
                </div>
              ))
            ) : (
              <span className="text-xs font-mono text-[var(--text-muted)] italic">Queue empty</span>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-between font-mono text-xs">
        <span className="text-[var(--text-muted)]">Console Output:</span>
        <span className="font-bold text-[var(--text)]">
          {current.logs.length > 0 ? current.logs.join('  ➜  ') : '(none)'}
        </span>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 2. RECONCILIATION MINI VISUALIZER                                         */
/* ========================================================================= */
function ReconciliationMini() {
  const [count, setCount] = useState(0);
  const [useMemo, setUseMemo] = useState(true);
  const [renderCount, setRenderCount] = useState(0);

  const handleTrigger = () => {
    setCount((prev) => prev + 1);
    setRenderCount((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent)] font-semibold uppercase">
            React Reconciliation & Blast Radius
          </span>
          <p className="text-sm font-semibold text-[var(--text)] mt-0.5">
            Click trigger to observe which component nodes re-render
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={useMemo}
              onChange={(e) => setUseMemo(e.target.checked)}
              className="accent-[var(--accent)] rounded"
            />
            <span>React.memo on Leaf</span>
          </label>

          <button
            onClick={handleTrigger}
            className="px-3 py-1.5 text-xs font-mono font-semibold rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white cursor-pointer shadow-2xs"
          >
            Trigger setState()
          </button>
        </div>
      </div>

      {/* Component Tree Hierarchy */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] space-y-3 font-mono text-xs">
        {/* Root */}
        <div className="p-2.5 rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text)] font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--border)]" />
            <span>&lt;App /&gt;</span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Root state holder</span>
        </div>

        {/* Level 1 branches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-[var(--border)]">
          {/* Branch A: Counter (Rerenders) */}
          <div className="p-2.5 rounded bg-[var(--bg-card)] border border-[var(--accent)] text-[var(--text)] space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--accent)]">&lt;Counter count={'{' + count + '}'} /&gt;</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-bold">
                re-rendered ({renderCount})
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-sans">
              State changed here ➜ fiber dirty flag set.
            </p>
          </div>

          {/* Branch B: Memoized Leaf */}
          <div
            className={`p-2.5 rounded bg-[var(--bg-card)] border text-[var(--text)] space-y-1.5 transition-all ${
              useMemo ? 'border-[var(--border)]' : 'border-[var(--accent)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">&lt;StaticCard /&gt;</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  useMemo
                    ? 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]'
                    : 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                }`}
              >
                {useMemo ? 'skipped (0ms)' : `re-rendered (${renderCount})`}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-sans">
              {useMemo
                ? 'Props unchanged. Reconciliation skips this entire subtree.'
                : 'No memo wrapper! Component re-renders unnecessarily.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 3. FLEXBOX MINI VISUALIZER                                                */
/* ========================================================================= */
function FlexboxMini() {
  const [justify, setJustify] = useState<'flex-start' | 'center' | 'space-between' | 'flex-end'>('center');
  const [align, setAlign] = useState<'stretch' | 'center' | 'flex-start' | 'flex-end'>('center');

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent)] font-semibold uppercase">
            CSS Flexbox Layout Engine
          </span>
          <p className="text-sm font-semibold text-[var(--text)] mt-0.5">
            Adjust alignment axis and observe geometry reflow
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded border border-[var(--border)]">
            <span className="text-[var(--text-muted)] px-1">justify:</span>
            {(['flex-start', 'center', 'space-between', 'flex-end'] as const).map((val) => (
              <button
                key={val}
                onClick={() => setJustify(val)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  justify === val
                    ? 'bg-[var(--bg-card)] text-[var(--accent)] font-bold shadow-2xs border border-[var(--border)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {val}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded border border-[var(--border)]">
            <span className="text-[var(--text-muted)] px-1">align:</span>
            {(['flex-start', 'center', 'flex-end'] as const).map((val) => (
              <button
                key={val}
                onClick={() => setAlign(val)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  align === val
                    ? 'bg-[var(--bg-card)] text-[var(--accent)] font-bold shadow-2xs border border-[var(--border)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flexbox Stage */}
      <div
        className="w-full h-44 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-4 flex transition-all duration-300"
        style={{ justifyContent: justify, alignItems: align }}
      >
        <div className="w-16 h-16 rounded bg-[var(--bg-card)] border border-[var(--accent)] flex flex-col items-center justify-center font-mono text-xs font-bold text-[var(--text)] shadow-2xs transition-all duration-300">
          <span>01</span>
          <span className="text-[9px] text-[var(--text-muted)]">50px</span>
        </div>
        <div className="w-16 h-20 rounded bg-[var(--bg-card)] border border-[var(--accent)] flex flex-col items-center justify-center font-mono text-xs font-bold text-[var(--text)] shadow-2xs transition-all duration-300 ml-2">
          <span>02</span>
          <span className="text-[9px] text-[var(--text-muted)]">64px</span>
        </div>
        <div className="w-16 h-14 rounded bg-[var(--bg-card)] border border-[var(--accent)] flex flex-col items-center justify-center font-mono text-xs font-bold text-[var(--text)] shadow-2xs transition-all duration-300 ml-2">
          <span>03</span>
          <span className="text-[9px] text-[var(--text-muted)]">44px</span>
        </div>
      </div>

      {/* Generated CSS */}
      <div className="p-2.5 rounded bg-[var(--bg-subtle)] border border-[var(--border)] font-mono text-xs text-[var(--text-muted)] flex items-center justify-between">
        <span>Computed CSS:</span>
        <code className="text-[var(--text)] font-semibold">
          display: flex; justify-content: {justify}; align-items: {align};
        </code>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 4. CLOSURE MINI VISUALIZER                                                */
/* ========================================================================= */
function ClosureMini() {
  const [activeVar, setActiveVar] = useState<'count' | 'globalConfig' | 'secret' | null>('count');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <span className="text-[11px] font-mono text-[var(--accent)] font-semibold uppercase">
            Lexical Environment & Closure Scope Chain
          </span>
          <p className="text-sm font-semibold text-[var(--text)] mt-0.5">
            Click variable tag to trace pointer up the scope chain
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[var(--text-muted)] mr-1">Trace variable:</span>
          {(['count', 'globalConfig', 'secret'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveVar(v)}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                activeVar === v
                  ? 'bg-[var(--accent)] text-white font-bold shadow-2xs'
                  : 'bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--border)]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Nested Frames */}
      <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] space-y-2 font-mono text-xs">
        {/* Frame 1: Global */}
        <div
          className={`p-3 rounded border transition-all ${
            activeVar === 'globalConfig'
              ? 'border-[var(--accent)] bg-[var(--bg-card)] shadow-xs'
              : 'border-[var(--border)] bg-[var(--bg-card)]'
          }`}
        >
          <div className="flex items-center justify-between pb-1 border-b border-[var(--border-subtle)]">
            <span className="font-bold text-[var(--text)]">1. Global Execution Context</span>
            <span className="text-[10px] text-[var(--text-muted)]">Root Environment</span>
          </div>
          <div className="pt-2 text-[var(--text-muted)]">
            <code>const globalConfig = &#123; app: &quot;V8&quot; &#125;;</code>
          </div>

          {/* Frame 2: Outer Closure */}
          <div
            className={`mt-2 p-3 rounded border transition-all ${
              activeVar === 'count'
                ? 'border-[var(--accent)] bg-[var(--bg-subtle)]'
                : 'border-[var(--border)] bg-[var(--bg-subtle)]'
            }`}
          >
            <div className="flex items-center justify-between pb-1 border-b border-[var(--border-subtle)]">
              <span className="font-bold text-[var(--text)]">
                2. function createCounter() &#123; ... &#125;
              </span>
              <span className="text-[10px] text-[var(--accent)] font-semibold">Heap Closure</span>
            </div>
            <div className="pt-2 text-[var(--text)] font-semibold flex items-center justify-between">
              <code>let count = 0;</code>
              {activeVar === 'count' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--accent)] text-white">
                  Pointer resolved here
                </span>
              )}
            </div>

            {/* Frame 3: Inner Function */}
            <div
              className={`mt-2 p-2.5 rounded border transition-all bg-[var(--bg-card)] ${
                activeVar === 'secret' ? 'border-[var(--accent)]' : 'border-[var(--border)]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[var(--text)]">
                  3. return function increment() &#123; ... &#125;
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">Active Frame</span>
              </div>
              <div className="pt-1.5 text-[var(--text-muted)]">
                <code>count += 1; const secret = true;</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
