'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

export function ClosingCtaSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-[var(--border)] bg-[var(--bg-subtle)]" id="start">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-xs font-mono text-[var(--accent)] shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          <span>Zero installation · 100% in-browser client execution</span>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--text)] tracking-tight leading-[1.15]">
            Build intuition that sticks for your next frontend interview.
          </h2>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            Step through call stacks, inspect reconciliation diffs, and master HTTP caching today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/workbench"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm sm:text-base font-semibold shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          >
            <span>Start reviewing, free</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>

          <Link
            href="#topics"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-md border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text)] text-sm sm:text-base font-medium transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          >
            <span>Browse 10 topics</span>
          </Link>
        </div>

        <p className="text-xs font-mono text-[var(--text-muted)] pt-2">
          No credit card required. Free for students and engineers worldwide.
        </p>
      </div>
    </section>
  );
}
