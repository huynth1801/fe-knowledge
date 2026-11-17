'use client';

import React from 'react';
import { Lightbulb, Info, Sparkles } from 'lucide-react';

interface ExplanationPanelProps {
  stepIndex: number;
  totalSteps: number;
  title: string;
  explanation: string;
  interviewInsight?: string;
}

export function ExplanationPanel({
  stepIndex,
  totalSteps,
  title,
  explanation,
  interviewInsight,
}: ExplanationPanelProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phân tích cơ chế (Step {stepIndex + 1}/{totalSteps})</span>
          </div>
          <h3 className="font-serif font-bold text-lg text-[var(--foreground)] mt-1">
            {title}
          </h3>
        </div>
      </div>

      {/* Main explanation */}
      <div className="text-sm leading-relaxed text-[var(--foreground)] border-l-2 border-[var(--border)] pl-3.5 py-0.5">
        {explanation}
      </div>

      {/* Interview Insight Callout */}
      {interviewInsight && (
        <div className="rounded-lg bg-[var(--accent-light)] border border-[var(--accent-border)] p-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--accent)] mb-1">
            <Lightbulb className="w-4 h-4" />
            <span>Góc nhìn phỏng vấn (Interview Tip)</span>
          </div>
          <p className="text-[var(--foreground)] leading-relaxed">
            {interviewInsight}
          </p>
        </div>
      )}
    </div>
  );
}
