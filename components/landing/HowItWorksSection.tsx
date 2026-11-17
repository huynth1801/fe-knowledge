'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, RotateCcw, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-[var(--border)]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text)] tracking-tight">
            Three steps from passive reading to permanent intuition.
          </h2>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            Every topic combines runtime simulation, active flashcard retrieval, and objective progress tracking.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: VISUALIZE (Left text, Right real interactive demo)                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              Step 01 — Visualize
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text)]">
              Watch invisible browser runtime mechanisms execute in real time.
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Never wonder what the Call Stack or Microtask Queue does again. Step forward tick-by-tick, observe variable heap allocations, and inspect fiber dirty nodes.
            </p>
            <div className="pt-2">
              <Link
                href="/workbench?topic=event-loop"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent)] hover:underline"
              >
                <span>Try Event Loop Visualizer</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InteractiveStackDemo />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 2: PRACTICE (Right text, Left interactive flip flashcard)            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <InteractiveFlashcardDemo />
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              Step 02 — Practice
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text)]">
              Active retrieval flashcards that test your real comprehension.
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Passive reading creates the illusion of mastery. Our flashcards prompt you to predict exact execution outputs and explain the underlying mechanism before flipping.
            </p>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Tip: Click the card or press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text)] font-semibold">Space</kbd> to flip.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 3: MEASURE (Left text, Right GitHub-style Heatmap)                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              Step 03 — Measure
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text)]">
              Concrete progress heatmap without fake gamification gimmicks.
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Track your mastery across all 10 frontend domains. See where your retention is strong and which browser mechanics need a quick 3-minute refresher.
            </p>
            <div className="pt-1">
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Local-first storage: Your progress never leaves your browser.
              </span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InteractiveHeatmapDemo />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================= */
/* DEMO 1: INTERACTIVE STACK CONTROLLER                                      */
/* ========================================================================= */
function InteractiveStackDemo() {
  const [frames, setFrames] = useState(['main()', 'fetchUser()', 'parseJson()']);

  const handlePush = () => {
    if (frames.length >= 5) return;
    const names = ['renderItem()', 'computeHash()', 'validateToken()', 'memoize()'];
    const nextName = names[frames.length % names.length];
    setFrames((prev) => [...prev, nextName]);
  };

  const handlePop = () => {
    if (frames.length === 0) return;
    setFrames((prev) => prev.slice(0, prev.length - 1));
  };

  const handleReset = () => {
    setFrames(['main()', 'fetchUser()', 'parseJson()']);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[var(--border)]">
        <span className="font-mono text-xs font-bold text-[var(--text)]">
          Call Stack Execution Frame Inspector
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePush}
            disabled={frames.length >= 5}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 cursor-pointer"
          >
            Push frame
          </button>
          <button
            onClick={handlePop}
            disabled={frames.length === 0}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 cursor-pointer"
          >
            Pop frame
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded border border-[var(--border)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] cursor-pointer"
            title="Reset stack"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="h-48 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] p-3 flex flex-col justify-end gap-1.5 font-mono text-xs">
        {frames.length > 0 ? (
          frames.map((frame, idx) => {
            const isTop = idx === frames.length - 1;
            return (
              <div
                key={idx}
                className={`p-2 rounded border flex items-center justify-between transition-all ${
                  isTop
                    ? 'bg-[var(--bg-card)] border-[var(--accent)] text-[var(--accent)] font-bold shadow-2xs'
                    : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text)]'
                }`}
              >
                <span>{frame}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-normal">
                  {isTop ? 'Executing (Top of stack)' : `Frame #${idx}`}
                </span>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">
            Call stack empty. Main thread idle.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
        <span>Current depth: {frames.length} / 5</span>
        <span className="text-[var(--accent)] font-semibold">LIFO Resolution</span>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* DEMO 2: INTERACTIVE FLIP FLASHCARD                                        */
/* ========================================================================= */
const flashcards = [
  {
    q: 'Why can ES Modules be tree-shaken while CommonJS require() cannot?',
    a: 'ES Modules have a static syntax (import/export must be top-level strings). The bundler constructs an Abstract Syntax Tree (AST) at build-time to identify dead code without running the file. CommonJS evaluates dynamically at runtime (e.g. if (cond) require()), making static elimination impossible.',
    tag: 'Bundling & AST',
    link: '/workbench?topic=bundle-optimization',
  },
  {
    q: 'Does Cache-Control: no-cache prevent the browser from saving the file?',
    a: 'No! no-cache still tells the browser to store the file in cache, but mandates conditional validation with the origin server (ETag / If-None-Match 304) before every reuse. To forbid any local storage, you must use Cache-Control: no-store.',
    tag: 'HTTP Cache',
    link: '/workbench?topic=http-cache',
  },
  {
    q: 'Why does creating a transform or opacity property create a new Stacking Context?',
    a: 'Properties like transform and opacity < 1 are rendered as separate compositing layers on the GPU. The browser creates an isolated stacking context so children do not interfere with the outside paint order.',
    tag: 'CSS Geometry',
    link: '/workbench?topic=stacking-context',
  },
];

function InteractiveFlashcardDemo() {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = flashcards[index];

  // Listen for Spacebar to flip card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNext = () => {
    setIsFlipped(false);
    setIndex((prev) => (prev + 1) % flashcards.length);
  };

  return (
    <div className="space-y-3">
      {/* Flashcard container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Interactive flashcard. Click or press space to flip."
        className="min-h-[220px] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 flex flex-col justify-between cursor-pointer hover:border-[var(--accent)] transition-all shadow-2xs select-none focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold">
            {card.tag}
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Card {index + 1} of {flashcards.length} · {isFlipped ? 'Answer' : 'Question'}
          </span>
        </div>

        <div className="py-4">
          {!isFlipped ? (
            <p className="text-base sm:text-lg font-serif font-bold text-[var(--text)] leading-snug">
              {card.q}
            </p>
          ) : (
            <p className="text-xs sm:text-sm font-sans text-[var(--text)] leading-relaxed">
              {card.a}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] border-t border-[var(--border)] pt-3">
          <span>Click or Space to flip</span>
          <span className="text-[var(--accent)] font-semibold">
            {isFlipped ? 'View concept in workbench ➜' : 'Reveal answer ➜'}
          </span>
        </div>
      </div>

      {/* Cycle button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
        >
          <span>Next question</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* DEMO 3: INTERACTIVE PROGRESS HEATMAP                                      */
/* ========================================================================= */
function InteractiveHeatmapDemo() {
  const [selectedDay, setSelectedDay] = useState<{ day: number; topic: string; score: string }>({
    day: 14,
    topic: 'Event Loop VIP Microtask Queue',
    score: '100% correct',
  });

  // Generate 7 rows x 16 columns of cells
  const days = Array.from({ length: 112 }, (_, i) => {
    const intensity = (i * 7 + 13) % 5; // 0 to 4
    return {
      id: i,
      intensity,
      topic: i % 3 === 0 ? 'React Fiber Reconciliation' : i % 2 === 0 ? 'Event Loop & Timers' : 'HTTP Cache Headers',
      score: intensity > 2 ? 'Mastered' : intensity > 0 ? 'In Progress' : 'Unreviewed',
    };
  });

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[var(--border)]">
        <div>
          <span className="font-mono text-xs font-bold text-[var(--text)]">
            Review Activity & Mastery Heatmap
          </span>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            112 concepts mapped across active retention intervals
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold self-start sm:self-auto">
          84% Retention
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-1">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 w-max">
          {days.map((d) => {
            const isSelected = selectedDay.day === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDay({ day: d.id, topic: d.topic, score: d.score })}
                aria-label={`Concept ${d.id}: ${d.topic}`}
                className={`w-3.5 h-3.5 rounded-xs transition-all cursor-pointer ${
                  d.intensity === 0
                    ? 'bg-[var(--bg-subtle)] hover:bg-[var(--border)]'
                    : d.intensity === 1
                    ? 'bg-[#F0D5C9] hover:bg-[#E5BEAE]'
                    : d.intensity === 2
                    ? 'bg-[#E5A58E] hover:bg-[#D48970]'
                    : d.intensity === 3
                    ? 'bg-[#CC6745] hover:bg-[#B85635]'
                    : 'bg-[#9C4325] hover:bg-[#85351C]'
                } ${isSelected ? 'ring-2 ring-[var(--text)]' : ''}`}
              />
            );
          })}
        </div>
      </div>

      {/* Tooltip detail info */}
      <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-xs">
        <div>
          <span className="text-[var(--text-muted)]">Selected Session #{selectedDay.day}: </span>
          <span className="font-bold text-[var(--text)]">{selectedDay.topic}</span>
        </div>
        <span className="text-[var(--accent)] font-semibold">{selectedDay.score}</span>
      </div>
    </div>
  );
}
