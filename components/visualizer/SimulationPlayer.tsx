'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, HelpCircle } from 'lucide-react';

interface SimulationPlayerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayToggle: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onReset: () => void;
  onSelectStep: (step: number) => void;
  onChangeSpeed: (speed: number) => void;
  onOpenPredictModal?: () => void;
  className?: string;
}

export function SimulationPlayer({
  currentStep,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onPlayToggle,
  onStepNext,
  onStepPrev,
  onReset,
  onSelectStep,
  onChangeSpeed,
  onOpenPredictModal,
  className = '',
}: SimulationPlayerProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xs space-y-2 shrink-0 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          <button
            onClick={onReset}
            title="Quay lại đầu"
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-subtle)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onStepPrev}
            disabled={isFirstStep}
            title="Bước trước"
            className="p-1.5 rounded-lg text-[var(--foreground)] hover:bg-[var(--card-subtle)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayToggle}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isLastStep ? 'Chạy lại' : 'Tự động chạy'}</span>
              </>
            )}
          </button>

          <button
            onClick={onStepNext}
            disabled={isLastStep}
            title="Bước tiếp theo"
            className="p-1.5 rounded-lg text-[var(--foreground)] hover:bg-[var(--card-subtle)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Pills */}
          <div className="flex items-center ml-1 sm:ml-2 p-0.5 rounded-lg bg-[var(--card-subtle)] border border-[var(--border-subtle)] text-[11px] font-mono shrink-0">
            {[0.5, 1, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSpeed(speed)}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-[var(--card)] text-[var(--accent)] font-bold shadow-2xs'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Step indicator & Quiz */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
          {onOpenPredictModal && (
            <button
              onClick={onOpenPredictModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border)] text-[12px] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-subtle)] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Đoán Output</span>
            </button>
          )}

          <div className="text-[13px] font-mono">
            <span className="text-[var(--muted)]">Bước: </span>
            <strong className="text-[var(--foreground)] font-semibold">
              {currentStep + 1}
            </strong>
            <span className="text-[var(--muted)]"> / {totalSteps}</span>
          </div>
        </div>
      </div>

      {/* Scrubber timeline */}
      <div className="flex items-center gap-1 pt-0.5">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const isPassed = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <button
              key={idx}
              onClick={() => onSelectStep(idx)}
              title={`Nhảy tới bước ${idx + 1}`}
              className="flex-1 py-1 group focus:outline-hidden cursor-pointer"
            >
              <div
                className={`h-1 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-[var(--accent)] h-1.5'
                    : isPassed
                    ? 'bg-[var(--foreground)]/40 group-hover:bg-[var(--foreground)]/70'
                    : 'bg-[var(--border)] group-hover:bg-[var(--muted)]/50'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
