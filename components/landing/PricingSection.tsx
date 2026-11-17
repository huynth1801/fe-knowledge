'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'usd' | 'vnd'>('usd');

  return (
    <section className="py-20 sm:py-28 border-t border-[var(--border)]" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text)] tracking-tight">
              100% free for community learning. Optional supporter tier.
            </h2>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              Every single visualizer and interview scenario is freely available. No paywalls, no trial timers, no fake badges.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] font-mono text-xs self-start sm:self-auto">
            <button
              onClick={() => setBillingCycle('usd')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                billingCycle === 'usd'
                  ? 'bg-[var(--bg-card)] text-[var(--text)] font-bold shadow-2xs border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setBillingCycle('vnd')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                billingCycle === 'vnd'
                  ? 'bg-[var(--bg-card)] text-[var(--text)] font-bold shadow-2xs border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              VND (₫)
            </button>
          </div>
        </div>

        {/* 2-Column Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Column 1: Free Community */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                  Community Edition
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                  Free forever
                </span>
              </div>

              <div>
                <div className="font-serif font-bold text-4xl text-[var(--text)]">
                  $0
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Complete access for students, job candidates, and engineers.
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-[var(--border)] text-xs font-mono text-[var(--text)]">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>All 15 interactive runtime engine visualizers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>45 technical interview questions with predict mode</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>Full cheatsheet notebooks (Cache, State, CI/CD)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>Zero sign-in required · LocalStorage progress</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>Open-source client codebase under MIT License</span>
                </div>
              </div>
            </div>

            <Link
              href="/workbench"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--text)] text-xs font-mono font-semibold transition-all border border-[var(--border)]"
            >
              <span>Launch free workbench</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Column 2: Supporter Lifetime */}
          <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--bg-card)] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                  Lifetime Supporter
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold">
                  One-time payment
                </span>
              </div>

              <div>
                <div className="font-serif font-bold text-4xl text-[var(--text)]">
                  {billingCycle === 'usd' ? '$29' : '690.000₫'}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Pay once to support open-source development and get offline assets.
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-[var(--border)] text-xs font-mono text-[var(--text)]">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>Everything included in Community Edition</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>Printable 300 DPI vector mental model sheets (PDF/SVG)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>Offline standalone Progressive Web App (PWA) pack</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>GitHub Sponsor badge and early feature previews</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[var(--accent)] shrink-0" aria-hidden="true" />
                  <span>Direct technical Q&amp;A on Discord community</span>
                </div>
              </div>
            </div>

            <Link
              href="/workbench"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono font-semibold transition-all shadow-2xs"
            >
              <span>Get Lifetime Supporter</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
