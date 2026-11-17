'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: 'How is FE Visualizer different from LeetCode or reading official docs?',
    a: 'LeetCode focuses on abstract algorithms (arrays, trees, graphs) that rarely reflect real day-to-day frontend bugs. Official docs describe concepts textually, which creates the illusion of understanding until an interviewer asks an edge case. FE Visualizer runs the actual browser mechanisms in front of your eyes: you watch microtasks drain, fiber trees reconcile, and variable pointers resolve across scopes.',
  },
  {
    q: 'Does FE Visualizer work completely offline?',
    a: 'Yes. The entire application runs client-side inside your browser without backend dependencies. Once the page is loaded, you can step through simulations, run code scenarios, and review cheatsheets even when disconnected from the internet.',
  },
  {
    q: 'Do I need an account or email to use the visualizers?',
    a: 'No. There are no login screens, no email walls, and no verification codes. You click "Start reviewing, free" and immediately land on the interactive workbench.',
  },
  {
    q: 'Where is my quiz and study progress stored?',
    a: 'All quiz answers, predict history, and topic review records are stored locally in your browser using the standard Web Storage API (localStorage). Your data is private to your device and never uploaded to any remote tracking server.',
  },
  {
    q: 'Are these simulations accurate to modern V8 and React 19?',
    a: 'Yes. The simulations strictly follow the ECMAScript 2026 specification, the WHATWG HTML event loop processing model, and React 19 Fiber reconciliation semantics (including batching, dual buffering, and dirty node traversal).',
  },
  {
    q: 'Can I contribute a new interview scenario or report an issue?',
    a: 'Yes. FE Visualizer is open source under the MIT License on GitHub. You can open an issue, submit a scenario PR, or suggest new engine visualizers directly through our public repository.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-20 sm:py-28 border-t border-[var(--border)]" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text)] tracking-tight">
            Direct answers to common engineering questions.
          </h2>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            Everything you need to know about how the workbench runs, privacy, and technical accuracy.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-serif font-bold text-base sm:text-lg text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer py-1 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-sm"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[var(--accent)]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="pt-2 pb-1 text-xs sm:text-sm text-[var(--text-muted)] font-sans leading-relaxed animate-in fade-in"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
