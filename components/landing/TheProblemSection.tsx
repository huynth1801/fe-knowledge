'use client';

import React, { useState } from 'react';
import { XCircle, CheckCircle2, Sliders } from 'lucide-react';

export function TheProblemSection() {
  const [daysElapsed, setDaysElapsed] = useState(14);

  // Simulated Retention Decay Formula (Ebbinghaus Forgetting Curve)
  // Passive text reading drops to ~15% after 14 days
  // Active visual mental models maintain ~78%
  const textRetention = Math.max(12, Math.round(100 / Math.pow(daysElapsed + 1, 0.72)));
  const visualRetention = Math.max(72, Math.round(100 - (daysElapsed * 1.4)));

  return (
    <section className="py-20 sm:py-28 border-t border-[var(--border)]" id="problem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text)] tracking-tight">
            Frontend knowledge is invisible. Reading docs does not fix that.
          </h2>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            When you read text descriptions of call stacks, fiber trees, or z-index stacking contexts, your brain constructs a vague metaphor. In interviews, that metaphor collapses under pressure.
          </p>
        </div>

        {/* Interactive Retention Simulation Bar */}
        <div className="p-4 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
              <span className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wide">
                Interactive Memory Decay Simulator
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
              <span>Time elapsed since review:</span>
              <span className="font-bold text-[var(--text)] px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border)]">
                {daysElapsed} days
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <input
              type="range"
              min="1"
              max="30"
              value={daysElapsed}
              onChange={(e) => setDaysElapsed(Number(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer"
              aria-label="Days elapsed slider"
            />
            <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>Day 1 (Fresh memory)</span>
              <span>Day 7</span>
              <span>Day 14</span>
              <span>Day 30 (Interview day)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)]">Passive text reading:</span>
                <span className="font-bold text-[var(--text)]">{textRetention}% recall</span>
              </div>
              <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--text-muted)] h-full transition-all duration-300"
                  style={{ width: `${textRetention}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-subtle)] space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--accent)] font-semibold">Visual runtime engine:</span>
                <span className="font-bold text-[var(--accent)]">{visualRetention}% recall</span>
              </div>
              <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--accent)] h-full transition-all duration-300"
                  style={{ width: `${visualRetention}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comparison: Mobile Card View (< sm) */}
        <div className="sm:hidden space-y-3.5">
          {[
            {
              metric: 'Learning input',
              traditional: 'Passive text articles, bullet-point cheat sheets, or 40-minute video lectures.',
              feVisualizer: 'Direct browser engine simulation. You push call frames and drain queues yourself.',
            },
            {
              metric: 'Mental model depth',
              traditional: 'Abstract verbal analogies that crumble when an interviewer asks an edge case.',
              feVisualizer: 'Concrete visual mechanics. You know exactly what happens at line 14 at tick 3.',
            },
            {
              metric: 'Verification',
              traditional: 'Rereading highlights and assuming you understand the concept.',
              feVisualizer: 'Predict-then-run quizzes. Guess the exact console output before watching it execute.',
            },
            {
              metric: 'Interview recall',
              traditional: 'Stumbling through memorized definitions while trying to solve live coding bugs.',
              feVisualizer: 'Instant visual recall. You picture the heap closure or fiber tree immediately.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-2.5 shadow-2xs"
            >
              <div className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wide">
                {item.metric}
              </div>
              <div className="p-2.5 rounded bg-[var(--bg-subtle)] space-y-1">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">How people usually review</span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.traditional}</p>
              </div>
              <div className="p-2.5 rounded bg-[var(--accent-subtle)] border border-[var(--accent-border)] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase">How FE Visualizer works</span>
                <p className="text-xs text-[var(--text)] font-medium leading-relaxed">{item.feVisualizer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table (Desktop: sm+) */}
        <div className="hidden sm:block rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-x-auto shadow-2xs">
          <table className="w-full min-w-[580px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)] font-mono text-[var(--text)]">
                <th className="py-3 px-4 sm:px-6 w-1/4">Evaluation metric</th>
                <th className="py-3 px-4 sm:px-6 w-3/8 text-[var(--text-muted)]">How people usually review</th>
                <th className="py-3 px-4 sm:px-6 w-3/8 text-[var(--accent)] font-bold">How FE Visualizer works</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-4 px-4 sm:px-6 font-mono font-semibold">Learning input</td>
                <td className="py-4 px-4 sm:px-6 text-[var(--text-muted)]">
                  Passive text articles, bullet-point cheat sheets, or 40-minute video lectures.
                </td>
                <td className="py-4 px-4 sm:px-6 font-medium">
                  Direct browser engine simulation. You push call frames and drain queues yourself.
                </td>
              </tr>

              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-4 px-4 sm:px-6 font-mono font-semibold">Mental model depth</td>
                <td className="py-4 px-4 sm:px-6 text-[var(--text-muted)]">
                  Abstract verbal analogies that crumble when an interviewer asks an edge case.
                </td>
                <td className="py-4 px-4 sm:px-6 font-medium">
                  Concrete visual mechanics. You know exactly what happens at line 14 at tick 3.
                </td>
              </tr>

              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-4 px-4 sm:px-6 font-mono font-semibold">Verification</td>
                <td className="py-4 px-4 sm:px-6 text-[var(--text-muted)]">
                  Rereading highlights and assuming you understand the concept.
                </td>
                <td className="py-4 px-4 sm:px-6 font-medium">
                  Predict-then-run quizzes. Guess the exact console output before watching it execute.
                </td>
              </tr>

              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-4 px-4 sm:px-6 font-mono font-semibold">Interview recall</td>
                <td className="py-4 px-4 sm:px-6 text-[var(--text-muted)]">
                  Stumbling through memorized definitions while trying to solve live coding bugs.
                </td>
                <td className="py-4 px-4 sm:px-6 font-medium">
                  Instant visual recall. You picture the heap closure or fiber tree immediately.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
