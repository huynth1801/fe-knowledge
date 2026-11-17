import React from 'react';
import Link from 'next/link';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { InteractiveSimulationPreview } from '@/components/landing/InteractiveSimulationPreview';
import { curriculumCategories } from '@/lib/curriculum';
import {
  Layers,
  Cpu,
  GitBranch,
  Timer,
  Boxes,
  Activity,
  Radio,
  FileCode,
  Palette,
  ArrowRight,
  Code2,
  ExternalLink,
} from 'lucide-react';

const topicIcons: Record<string, React.ReactNode> = {
  'event-loop': <Timer className="w-5 h-5 text-[#CC6745]" />,
  'closures': <Cpu className="w-5 h-5 text-[#CC6745]" />,
  'prototype': <GitBranch className="w-5 h-5 text-[#CC6745]" />,
  'fiber-tree': <Layers className="w-5 h-5 text-[#CC6745]" />,
  'react-re-renders': <Activity className="w-5 h-5 text-[#CC6745]" />,
  'nextjs-rendering': <Boxes className="w-5 h-5 text-[#CC6745]" />,
  'stacking-context': <Layers className="w-5 h-5 text-[#CC6745]" />,
  'core-web-vitals': <Activity className="w-5 h-5 text-[#CC6745]" />,
  'websocket-realtime': <Radio className="w-5 h-5 text-[#CC6745]" />,
  'design-tokens': <Palette className="w-5 h-5 text-[#CC6745]" />,
  'testing-visual-regression': <FileCode className="w-5 h-5 text-[#CC6745]" />,
};

export default function LandingPage() {
  const allTopics = curriculumCategories.flatMap((c) => c.topics);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2A2724]">
      {/* 1. Header Navigation */}
      <LandingHeader />

      <main className="flex-1">
        {/* ======================================================== */}
        {/* HERO SECTION                                             */}
        {/* ======================================================== */}
        <section
          className="hero section relative overflow-hidden py-12 lg:py-20 flex flex-col justify-center"
          data-enter
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
            {/* Top Text Block */}
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EB] border border-[#F0D5C9] text-xs font-semibold text-[#CC6745]">
                <span className="w-2 h-2 rounded-full bg-[#CC6745] animate-ping" />
                <span>Front-End Mental Model Laboratory</span>
              </div>

              {/* Strict h1 naming Category and Buyer */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-950 tracking-tight leading-[1.12]">
                Front-End Engine Visualizer for Web Developers
              </h1>

              <p className="text-base sm:text-lg text-zinc-700 leading-relaxed max-w-2xl font-sans">
                Build accurate mental models for JavaScript Event Loop, React Fiber reconciliation,
                Closures, and CSS Stacking Context with step-by-step browser runtime visual simulations.
              </p>

              {/* Hard Fact on First Screen */}
              <p className="font-mono text-xs sm:text-sm text-zinc-600 bg-white/80 border border-zinc-200/90 rounded-lg px-3.5 py-2 inline-block">
                11 runtime engine visualizers, 33 interview scenarios, 0 hidden runtime abstractions.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/workbench"
                  className="btn btn--primary flex items-center gap-2 px-6 py-3 rounded-lg bg-[#CC6745] hover:bg-[#B85635] text-white text-sm sm:text-base font-semibold shadow-xs transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  <span>Launch Interactive Visualizer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#simulation"
                  className="btn btn--secondary flex items-center gap-2 px-5 py-3 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-sm sm:text-base font-semibold transition-colors shadow-2xs"
                >
                  <span>Try Live Simulation</span>
                </a>
              </div>
            </div>

            {/* Hero Visual Mockup: Event Loop Execution Preview */}
            <div
              className="rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5 shadow-xs"
              data-moment="cursor-spotlight"
              data-moment-opts='{"rest": [0.74, 0.26], "radius": 460}'
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 text-xs font-mono text-zinc-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-zinc-800 ml-1">V8 Engine Runtime Inspector</span>
                </div>
                <span className="hidden sm:inline-block text-zinc-400">Step 3 of 6 · Promise Microtask VIP Execution</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Call Stack */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                    <span>Call Stack (LIFO)</span>
                    <span className="text-[11px] font-mono text-amber-600">1 frame</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="p-2 rounded bg-amber-100 border border-amber-300 text-amber-950 font-semibold shadow-2xs flex justify-between items-center">
                      <span>Promise.then callback</span>
                      <span className="text-[10px] bg-amber-200 px-1 rounded">active</span>
                    </div>
                  </div>
                </div>

                {/* 2. Microtask VIP Lane */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>Microtask Queue</span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Priority #1</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="p-2 rounded bg-white border border-emerald-200 text-emerald-800 flex justify-between items-center">
                      <span>queueMicrotask()</span>
                      <span className="text-[10px] text-emerald-600">queued</span>
                    </div>
                  </div>
                </div>

                {/* 3. Macrotask Queue */}
                <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                    <span>Macrotask Queue</span>
                    <span className="text-[11px] font-mono text-sky-700">Waiting</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="p-2 rounded bg-white border border-sky-200 text-sky-800 flex justify-between items-center">
                      <span>setTimeout(callback, 0)</span>
                      <span className="text-[10px] text-sky-600">0ms timer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: 11 CORE ENGINE VISUALIZERS                     */}
        {/* ======================================================== */}
        <section className="section py-16 sm:py-24 border-t border-[var(--border)]" id="modules">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-xs font-semibold text-[#CC6745] uppercase tracking-wider">
                Curriculum Matrix
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
                Core Engine Visualizers
              </h2>
              <p className="text-base text-zinc-600">
                Explore 11 interactive visual environments covering JavaScript runtime execution,
                React reconciliation, CSS geometry, and web network protocols.
              </p>
            </div>

            {/* Grid of 11 Engine Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/workbench?topic=${topic.id}`}
                  className="group rounded-2xl border border-[var(--border)] bg-white p-5 hover:border-[#CC6745] hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-[#FAF0EB] flex items-center justify-center">
                        {topicIcons[topic.id] || <Code2 className="w-5 h-5 text-[#CC6745]" />}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            topic.level === 'Junior'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : topic.level === 'Mid'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {topic.level}
                        </span>

                        <span className="text-[11px] font-mono text-zinc-500">
                          {topic.estimatedMinutes}m
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-lg text-zinc-900 group-hover:text-[#CC6745] transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
                        {topic.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-[#CC6745]">
                    <span>Khám phá mô phỏng</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: INTERACTIVE LIVE RUNTIME SIMULATION            */}
        {/* ======================================================== */}
        <section className="section py-16 sm:py-24 border-t border-[var(--border)] bg-[#F4EFEB]/40" id="simulation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-xs font-semibold text-[#CC6745] uppercase tracking-wider">
                Hands-On Demonstration
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
                Interactive Runtime Simulation
              </h2>
              <p className="text-base text-zinc-600">
                Step through the JavaScript Event Loop cycle directly inside this sandbox. Observe Call Stack
                frames push, timers register, and microtasks resolve deterministically.
              </p>
            </div>

            {/* Embedded Live Simulation Widget */}
            <InteractiveSimulationPreview />
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: MENTAL MODEL ARCHITECTURE                      */}
        {/* ======================================================== */}
        <section className="section py-16 sm:py-24 border-t border-[var(--border)]" id="architecture">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-xs font-semibold text-[#CC6745] uppercase tracking-wider">
                Core Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
                Mental Model Architecture
              </h2>
              <p className="text-base text-zinc-600">
                Four engineering principles built to turn invisible browser behaviors into concrete intuition.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#CC6745] font-mono font-bold flex items-center justify-center text-sm">
                  01
                </div>
                <h3 className="font-serif font-bold text-base text-zinc-900">
                  Deterministic Tick Engine
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Every Call Stack push and pop executes deterministically. Inspect exact queue transitions
                  between script termination, microtask draining, and browser paint phases.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#CC6745] font-mono font-bold flex items-center justify-center text-sm">
                  02
                </div>
                <h3 className="font-serif font-bold text-base text-zinc-900">
                  Real-Time Code Sync
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Lines of source code illuminate in sync with memory allocations and execution context states.
                  See what happens under the hood line by line.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#CC6745] font-mono font-bold flex items-center justify-center text-sm">
                  03
                </div>
                <h3 className="font-serif font-bold text-base text-zinc-900">
                  Interview Edge Cases
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  33 production-tested interview questions analyzing microtask starvation, Promise chains,
                  React Fiber yielding, and CSS stacking context anomalies.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#CC6745] font-mono font-bold flex items-center justify-center text-sm">
                  04
                </div>
                <h3 className="font-serif font-bold text-base text-zinc-900">
                  Predict Quiz Mode
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Test your intuition before execution. Formulate your expected console output, submit
                  predictions, and verify your mental model against ground truth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: LEARNING ENGINE COMPARISON                     */}
        {/* ======================================================== */}
        <section className="section py-16 sm:py-24 border-t border-[var(--border)] bg-[#F4EFEB]/40" id="comparison">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-xs font-semibold text-[#CC6745] uppercase tracking-wider">
                Evidence Matrix
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
                Learning Engine Comparison
              </h2>
              <p className="text-base text-zinc-600">
                How FE Visualizer compares to traditional learning formats when internalizing runtime mechanics.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 font-serif font-bold text-zinc-800">
                      <th className="p-4 sm:p-5">Feature Matrix</th>
                      <th className="p-4 sm:p-5 text-zinc-600 font-sans font-medium">Static Specs & MDN</th>
                      <th className="p-4 sm:p-5 text-zinc-600 font-sans font-medium">Console Log Debugging</th>
                      <th className="p-4 sm:p-5 text-[#CC6745] font-semibold">FE Visualizer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-sans">
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-zinc-900">Microtask vs Macrotask Queue Order</td>
                      <td className="p-4 sm:p-5 text-zinc-600">Descriptive prose</td>
                      <td className="p-4 sm:p-5 text-zinc-600">Prints output only</td>
                      <td className="p-4 sm:p-5 text-emerald-700 font-semibold bg-emerald-50/50">
                        Visual VIP Lane inspection
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-zinc-900">React Fiber Reconciliation</td>
                      <td className="p-4 sm:p-5 text-zinc-600">Conceptual diagrams</td>
                      <td className="p-4 sm:p-5 text-zinc-600">React DevTools render counts</td>
                      <td className="p-4 sm:p-5 text-emerald-700 font-semibold bg-emerald-50/50">
                        Dual-buffered tree step through
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-zinc-900">CSS 3D Stacking Contexts</td>
                      <td className="p-4 sm:p-5 text-zinc-600">Complex W3C rules</td>
                      <td className="p-4 sm:p-5 text-zinc-600">Trial and error z-index: 9999</td>
                      <td className="p-4 sm:p-5 text-emerald-700 font-semibold bg-emerald-50/50">
                        Isometric 3D layer perspective
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-zinc-900">Closures & Heap Memory Pointer Chains</td>
                      <td className="p-4 sm:p-5 text-zinc-600">Abstract definitions</td>
                      <td className="p-4 sm:p-5 text-zinc-600">Debugger scope panel</td>
                      <td className="p-4 sm:p-5 text-emerald-700 font-semibold bg-emerald-50/50">
                        Visual Lexical Environment pointers
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 6: DEVELOPER INTERVIEW QUESTIONS                  */}
        {/* ======================================================== */}
        <section className="section py-16 sm:py-24 border-t border-[var(--border)]" id="interview">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-xs font-semibold text-[#CC6745] uppercase tracking-wider">
                Interview Mastery
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
                Developer Interview Questions
              </h2>
              <p className="text-base text-zinc-600">
                Master the exact mechanisms asked in Senior and Staff Front-End engineering assessments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-3 flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                    Senior Assessment
                  </span>
                  <h3 className="font-serif font-bold text-base text-zinc-900">
                    Microtask Queue Starvation
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Why does recursive <code className="font-mono text-zinc-800">Promise.resolve().then()</code> freeze
                    the browser UI while recursive <code className="font-mono text-zinc-800">setTimeout()</code> keeps the page responsive?
                  </p>
                </div>
                <Link
                  href="/workbench?topic=event-loop"
                  className="text-xs font-semibold text-[#CC6745] hover:text-[#B85635] flex items-center gap-1 pt-2 border-t border-zinc-100"
                >
                  <span>Chạy mô phỏng hiện tượng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-3 flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded">
                    Staff Architectural
                  </span>
                  <h3 className="font-serif font-bold text-base text-zinc-900">
                    Fiber Cooperative Scheduling
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    How does React Fiber split the render phase into incremental work units without blocking
                    the main thread or exceeding 16ms animation frame budgets?
                  </p>
                </div>
                <Link
                  href="/workbench?topic=fiber-tree"
                  className="text-xs font-semibold text-[#CC6745] hover:text-[#B85635] flex items-center gap-1 pt-2 border-t border-zinc-100"
                >
                  <span>Xem cây Fiber WorkInProgress</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-5 space-y-3 flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Core CSS Mechanics
                  </span>
                  <h3 className="font-serif font-bold text-base text-zinc-900">
                    Stacking Context Traps
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Why does <code className="font-mono text-zinc-800">z-index: 9999</code> fail when an ancestor container
                    has <code className="font-mono text-zinc-800">transform</code> or <code className="font-mono text-zinc-800">opacity: 0.99</code> applied?
                  </p>
                </div>
                <Link
                  href="/workbench?topic=stacking-context"
                  className="text-xs font-semibold text-[#CC6745] hover:text-[#B85635] flex items-center gap-1 pt-2 border-t border-zinc-100"
                >
                  <span>Khám phá mô hình 3D Layer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 7: FREQUENTLY ASKED QUESTIONS                     */}
        {/* ======================================================== */}
        <section className="section py-16 sm:py-24 border-t border-[var(--border)] bg-[#F4EFEB]/40" id="faq">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-xs font-semibold text-[#CC6745] uppercase tracking-wider">
                Questions & Answers
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-zinc-600">
                Common questions about FE Visualizer, runtime fidelity, and curriculum usage.
              </p>
            </div>

            <div className="space-y-3 max-w-3xl">
              <details className="group rounded-xl border border-[var(--border)] bg-white p-4 shadow-2xs open:border-zinc-400">
                <summary className="font-serif font-bold text-base text-zinc-900 cursor-pointer list-none flex items-center justify-between">
                  <span>What is FE Visualizer used for?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs sm:text-sm text-zinc-600 mt-2.5 leading-relaxed font-sans">
                  FE Visualizer is an educational workbench designed to model how browser engines and JavaScript
                  runtimes execute code. It helps engineers master complex asynchronous queues, React Fiber
                  reconciliation, scope chain closures, and CSS stacking contexts by making runtime states visible.
                </p>
              </details>

              <details className="group rounded-xl border border-[var(--border)] bg-white p-4 shadow-2xs open:border-zinc-400">
                <summary className="font-serif font-bold text-base text-zinc-900 cursor-pointer list-none flex items-center justify-between">
                  <span>How accurate is the Event Loop simulation?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs sm:text-sm text-zinc-600 mt-2.5 leading-relaxed font-sans">
                  The simulation strictly conforms to the HTML Living Standard specification and ECMAScript job
                  queues. Call Stack frames, microtask draining (Promise, queueMicrotask), and macrotask dispatch
                  (setTimeout) execute with 100% deterministic fidelity.
                </p>
              </details>

              <details className="group rounded-xl border border-[var(--border)] bg-white p-4 shadow-2xs open:border-zinc-400">
                <summary className="font-serif font-bold text-base text-zinc-900 cursor-pointer list-none flex items-center justify-between">
                  <span>Can I use FE Visualizer to prepare for tech interviews?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs sm:text-sm text-zinc-600 mt-2.5 leading-relaxed font-sans">
                  Yes. The platform includes 33 interview scenarios ranging from Junior fundamentals to Senior
                  concurrency bottlenecks. Each scenario provides architectural insights and model interview
                  explanations.
                </p>
              </details>

              <details className="group rounded-xl border border-[var(--border)] bg-white p-4 shadow-2xs open:border-zinc-400">
                <summary className="font-serif font-bold text-base text-zinc-900 cursor-pointer list-none flex items-center justify-between">
                  <span>Is FE Visualizer open source and free to use?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs sm:text-sm text-zinc-600 mt-2.5 leading-relaxed font-sans">
                  Yes. FE Visualizer is 100% free and open source. All simulations run client-side in your
                  browser with zero tracking or account requirements.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 8: VISUALIZER LAUNCHPAD                           */}
        {/* ======================================================== */}
        <section className="section py-16 sm:py-24 border-t border-[var(--border)]" id="launch">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-zinc-950 text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Visualizer Launchpad
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                  Launch the full interactive visualizer to explore all 11 modules, step through 33 scenarios,
                  or test your intuition in Predict Quiz Mode.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/workbench"
                  className="btn btn--primary flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#CC6745] hover:bg-[#B85635] text-white text-sm sm:text-base font-semibold shadow-xs transition-transform hover:scale-105"
                >
                  <span>Launch Interactive Visualizer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary flex items-center gap-2 px-5 py-3.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-sm sm:text-base font-semibold transition-colors"
                >
                  <span>View Source Code</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 9. FOOTER CLOSING                                         */}
      {/* ======================================================== */}
      <footer className="closing footer border-t border-[var(--border)] bg-[#FAF8F5] py-12 text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-zinc-900">
                <div className="w-6 h-6 rounded bg-[#CC6745] text-white flex items-center justify-center font-mono text-xs">
                  {'{ }'}
                </div>
                <span>FE Visualizer</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Deterministic browser runtime simulations designed for software engineers mastering
                front-end architecture.
              </p>
            </div>

            <div>
              <h4 className="font-serif font-bold text-zinc-900 mb-2.5">Engine Modules</h4>
              <ul className="space-y-1.5">
                <li><Link href="/workbench?topic=event-loop" className="hover:text-zinc-950">V8 Event Loop</Link></li>
                <li><Link href="/workbench?topic=fiber-tree" className="hover:text-zinc-950">React Fiber Reconciliation</Link></li>
                <li><Link href="/workbench?topic=closures" className="hover:text-zinc-950">Scope Closures & Heap</Link></li>
                <li><Link href="/workbench?topic=stacking-context" className="hover:text-zinc-950">CSS 3D Stacking Context</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-zinc-900 mb-2.5">Navigation</h4>
              <ul className="space-y-1.5">
                <li><a href="#modules" className="hover:text-zinc-950">All 11 Modules</a></li>
                <li><a href="#simulation" className="hover:text-zinc-950">Live Sandbox</a></li>
                <li><a href="#architecture" className="hover:text-zinc-950">Mental Model Philosophy</a></li>
                <li><a href="#faq" className="hover:text-zinc-950">Frequently Asked Questions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-zinc-900 mb-2.5">Keyboard Shortcuts</h4>
              <ul className="space-y-1.5 font-mono text-[11px] text-zinc-600">
                <li><kbd className="bg-white border px-1 rounded text-zinc-800">⌘K</kbd> Global Topic Search</li>
                <li><kbd className="bg-white border px-1 rounded text-zinc-800">Space</kbd> Step Forward</li>
                <li><kbd className="bg-white border px-1 rounded text-zinc-800">R</kbd> Reset Simulation</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 text-[11px]">
            <div>© 2026 FE Visualizer. All runtime engine visualizers open under MIT License.</div>
            <div>Built with Next.js App Router, React 19, and Claude Editorial Design standards.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
