'use client';

import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3.5 shadow-xs">
      {/* Title */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bước {stepIndex + 1} của {totalSteps}</span>
        </div>
        <h3 className="font-serif font-bold text-lg text-[var(--foreground)] mt-0.5 leading-snug">
          {title}
        </h3>
      </div>

      {/* Main thought */}
      <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--foreground)] opacity-90">
        {explanation}
      </p>

      {/* Interview Insight Callout */}
      {interviewInsight && (
        <div className="rounded-xl bg-[var(--accent-light)]/60 border border-[var(--accent-border)] p-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--accent)] mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="font-serif font-bold">Góc nhìn phỏng vấn</span>
          </div>
          <p className="text-[12px] text-[var(--foreground)] leading-relaxed">
            {interviewInsight}
          </p>
        </div>
      )}
    </div>
  );
}
