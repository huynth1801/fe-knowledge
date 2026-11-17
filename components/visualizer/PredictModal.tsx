'use client';

import React, { useState } from 'react';
import { X, HelpCircle, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Scenario } from '@/lib/types';

interface PredictModalProps {
  scenario: Scenario;
  isOpen: boolean;
  onClose: () => void;
  onStartSimulation: () => void;
}

export function PredictModal({
  scenario,
  isOpen,
  onClose,
  onStartSimulation,
}: PredictModalProps) {
  const [revealed, setRevealed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl space-y-5 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--accent)] font-serif font-bold text-lg">
            <HelpCircle className="w-5 h-5" />
            <span>Thử thách: Dự đoán Output</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-subtle)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Trước khi quan sát Event Loop chạy từng bước, bạn hãy thử suy đoán thứ tự in ra của Console trong kịch bản: <strong>{scenario.title}</strong>.
        </p>

        {/* Answer section */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-subtle)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase text-[var(--muted)]">
              Kết quả chuẩn xác
            </span>
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="text-xs font-mono px-3 py-1 rounded bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors shadow-2xs"
              >
                Hiện đáp án
              </button>
            ) : (
              <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã mở đáp án
              </span>
            )}
          </div>

          {revealed ? (
            <div className="font-mono text-xs space-y-1 bg-[#1F1E1D] p-3 rounded-lg text-emerald-400">
              {scenario.expectedOutput.map((out, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[#757069]">{idx + 1}.</span>
                  <span>{out}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-[var(--muted)] italic">
              Bấm "Hiện đáp án" nếu bạn muốn đối chiếu ngay hoặc bấm nút bên dưới để xem máy chạy từng frame!
            </div>
          )}
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--border)] hover:bg-[var(--card-subtle)]"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onClose();
              onStartSimulation();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xs"
          >
            <span>Bắt đầu mô phỏng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
