import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroVisualizerShowcase } from '@/components/landing/HeroVisualizerShowcase';
import { TheProblemSection } from '@/components/landing/TheProblemSection';
import { TopicsListSection } from '@/components/landing/TopicsListSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { BeforeAfterSection } from '@/components/landing/BeforeAfterSection';
import { ProofNumbersSection } from '@/components/landing/ProofNumbersSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { ClosingCtaSection } from '@/components/landing/ClosingCtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {/* 1. Header */}
      <LandingHeader />

      <main className="flex-1">
        {/* ======================================================== */}
        {/* 2. HERO SECTION                                          */}
        {/* ======================================================== */}
        <section
          className="py-12 sm:py-20 lg:py-24 border-b border-[var(--border)]"
          id="visualizers"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Top Text Block */}
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] text-xs font-mono text-[var(--accent)] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                <span>Frontend Mental Model Laboratory</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[var(--text)] tracking-tight leading-[1.12]">
                Review frontend engineering by seeing how the browser runs.
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl font-sans">
                Every concept ships with an interactive runtime engine. Step through call stacks, inspect fiber reconciliation, and trace closures without abstractions.
              </p>

              {/* Primary & Secondary Call to Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/workbench"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm sm:text-base font-semibold shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                >
                  <span>Start reviewing, free</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-md border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text)] text-sm sm:text-base font-medium transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                >
                  <span>See a demo</span>
                </a>
              </div>
            </div>

            {/* Hero Showcase: 4 Live Tabbed Visualizers */}
            <div className="pt-2">
              <HeroVisualizerShowcase />
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. THE PROBLEM                                           */}
        {/* ======================================================== */}
        <TheProblemSection />

        {/* ======================================================== */}
        {/* 4. TOPICS                                                */}
        {/* ======================================================== */}
        <TopicsListSection />

        {/* ======================================================== */}
        {/* 5. HOW IT WORKS                                          */}
        {/* ======================================================== */}
        <HowItWorksSection />

        {/* ======================================================== */}
        {/* 6. BEFORE / AFTER                                        */}
        {/* ======================================================== */}
        <BeforeAfterSection />

        {/* ======================================================== */}
        {/* 7. PROOF / NUMBERS                                       */}
        {/* ======================================================== */}
        <ProofNumbersSection />

        {/* ======================================================== */}
        {/* 8. PRICING                                               */}
        {/* ======================================================== */}
        <PricingSection />

        {/* ======================================================== */}
        {/* 9. FAQ                                                   */}
        {/* ======================================================== */}
        <FaqSection />

        {/* ======================================================== */}
        {/* 10. CLOSING CTA                                          */}
        {/* ======================================================== */}
        <ClosingCtaSection />
      </main>

      {/* 11. Footer */}
      <LandingFooter />
    </div>
  );
}
