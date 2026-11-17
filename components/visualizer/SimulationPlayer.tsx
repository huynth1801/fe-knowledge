'use client';

import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward, HelpCircle } from 'lucide-react';

interface SimulationPlayerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number; // 0.5, 1, 2
  onPlayToggle: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onReset: () => void;
  onSelectStep: (step: number) => void;
  onChangeSpeed: (speed: number) => void;
  onOpenPredictModal?: () => void;
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
}: SimulationPlayerProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    if (isLastStep) {
      onPlayToggle(); // auto stop at the end
      return;
    }

    const intervalTime = Math.max(600, Math.floor(1800 / playbackSpeed));
    const timer = setTimeout(() => {
      onStepNext();
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, isLastStep, playbackSpeed, onStepNext, onPlayToggle]);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 sm:p-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Playback action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Quay lại từ đầu"
            className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--card-subtle)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onStepPrev}
            disabled={isFirstStep}
            title="Bước trước"
            className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--card-subtle)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--foreground)] transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayToggle}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{isLastStep ? 'Chạy lại' : 'Tự động chạy'}</span>
              </>
            )}
          </button>

          <button
            onClick={onStepNext}
            disabled={isLastStep}
            title="Bước tiếp theo"
            className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--card-subtle)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--foreground)] transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center ml-2 border border-[var(--border)] rounded-lg p-0.5 bg-[var(--card-subtle)] text-xs font-mono">
            {[0.5, 1, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSpeed(speed)}
                className={`px-2 py-1 rounded font-medium transition-all ${
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

        {/* Step indicator & Quiz trigger */}
        <div className="flex items-center gap-3">
          {onOpenPredictModal && (
            <button
              onClick={onOpenPredictModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-light)] text-[var(--accent)] text-xs font-medium hover:bg-[var(--accent-light)]/80 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Đoán Output (Quiz)</span>
            </button>
          )}

          <div className="text-right">
            <span className="text-xs font-mono text-[var(--muted)]">Bước hiện tại:</span>
            <span className="ml-1.5 font-mono text-sm font-bold text-[var(--foreground)]">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Scrubber Timeline Bar */}
      <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isPassed = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <button
                key={idx}
                onClick={() => onSelectStep(idx)}
                title={`Nhảy tới bước ${idx + 1}`}
                className="group relative flex-1 h-3 py-1 focus:outline-hidden"
              >
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-[var(--accent)] ring-2 ring-[var(--accent-border)] h-2'
                      : isPassed
                      ? 'bg-[var(--foreground)]/50 group-hover:bg-[var(--foreground)]'
                      : 'bg-[var(--border)] group-hover:bg-[var(--muted)]/40'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
