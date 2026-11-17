'use client';

import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

interface ExplanationPanelProps {
  stepIndex: number;
  totalSteps: number;
  title: string;
  explanation: string;
  interviewInsight?: string;
  className?: string;
}

export function ExplanationPanel({
  stepIndex,
  totalSteps,
  title,
  explanation,
  interviewInsight,
  className = '',
}: ExplanationPanelProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 sm:p-4 space-y-2 shadow-xs shrink-0 ${className}`}
    >
      {/* Title */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-serif font-bold text-[16px] text-[var(--foreground)] leading-snug truncate">
          {title}
        </h3>
        <span className="text-[12px] font-mono text-[var(--accent)] font-semibold uppercase tracking-wider shrink-0 bg-[var(--accent-light)] px-2 py-0.5 rounded-full border border-[var(--accent-border)]">
          Bước {stepIndex + 1}/{totalSteps}
        </span>
      </div>

      {/* Main thought */}
      <p className="text-[14px] leading-relaxed text-[var(--foreground)] opacity-90 line-clamp-2">
        {explanation}
      </p>

      {/* Interview Insight Callout */}
      {interviewInsight && (
        <div className="rounded-xl bg-[var(--accent-light)]/50 border border-[var(--accent-border)] px-3 py-1.5 text-[13px] flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
          <p className="text-[13px] text-[var(--foreground)] leading-snug line-clamp-2">
            <strong className="font-serif font-bold text-[var(--accent)]">Tip phỏng vấn: </strong>
            {interviewInsight}
          </p>
        </div>
      )}
    </div>
  );
}
