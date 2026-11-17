'use client';

import React, { useState } from 'react';
import { Layers, CheckCircle2, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export function ProofNumbersSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'junior' | 'mid' | 'senior'>('all');

  const stats = [
    { value: '15', label: 'Runnable visualizers', desc: 'Covering V8, React 19, CSS layout, and HTTP cache' },
    { value: '45', label: 'Interview scenarios', desc: 'Predict-the-output questions with animated walkthroughs' },
    { value: '10', label: 'Engineering domains', desc: 'From JavaScript lexical scope to Docker CI/CD pipelines' },
    { value: '0', label: 'Sign-in walls', desc: 'Open-access workbench with zero telemetry tracking' },
  ];

  const breakdown = {
    all: { count: 45, label: 'All interview scenarios', ready: '100% runnable in browser' },
    junior: { count: 12, label: 'Junior / Foundational', ready: 'Closures, Event Loop basics, CSS box model' },
    mid: { count: 21, label: 'Strong Mid Core', ready: 'Re-render blast radius, Prototype chain, HTTP cache, Tree shaking' },
    senior: { count: 12, label: 'Senior & Architecture', ready: 'Fiber reconciliation, Next.js streaming, Core Web Vitals' },
  };

  return (
    <section className="py-20 sm:py-28 border-t border-[var(--border)]" id="proof">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            Verified Product Metrics
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text)] tracking-tight">
            Built by engineers. Measured by real technical depth.
          </h2>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            No manufactured testimonials. Here are the concrete specifications of what runs in the workbench right now.
          </p>
        </div>

        {/* 4 Big Numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-2 shadow-2xs"
            >
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[var(--accent)] tracking-tight">
                {s.value}
              </div>
              <div className="font-serif font-bold text-base text-[var(--text)]">
                {s.label}
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Scenario Inventory Inspector */}
        <div className="p-5 sm:p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
            <span className="font-mono text-xs font-bold text-[var(--text)]">
              Curriculum Scenario Inventory by Target Level
            </span>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-xs font-mono">
              {(['all', 'junior', 'mid', 'senior'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-md capitalize cursor-pointer transition-all ${
                    activeFilter === filter
                      ? 'bg-[var(--bg-card)] text-[var(--accent)] font-bold shadow-2xs border border-[var(--border)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div>
              <span className="font-bold text-sm text-[var(--text)]">
                {breakdown[activeFilter].count} Scenarios ({breakdown[activeFilter].label})
              </span>
              <p className="text-[var(--text-muted)] mt-0.5">
                {breakdown[activeFilter].ready}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[var(--accent)] font-semibold shrink-0">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Full test suites verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
