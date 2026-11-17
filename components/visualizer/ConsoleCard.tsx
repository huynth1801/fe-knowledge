'use client';

import React from 'react';
import { Terminal } from 'lucide-react';

interface ConsoleCardProps {
  logs: { id: string; text: string; step: number; tag?: string }[];
}

export function ConsoleCard({ logs }: ConsoleCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xs">
      <div className="px-4 py-2 bg-[var(--card-subtle)] border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-xs font-mono font-medium text-[var(--foreground)]">
            Console Terminal
          </span>
        </div>
        <span className="text-[11px] font-mono text-[var(--muted)]">
          {logs.length} output
        </span>
      </div>

      <div className="p-3 font-mono text-xs min-h-[90px] max-h-[140px] overflow-y-auto space-y-1 bg-[#1F1E1C] text-[#E8E2D8]">
        {logs.length === 0 ? (
          <div className="text-[#757069] italic py-4 text-center text-xs">
            Chưa có output. Nhấn "Tự động chạy" hoặc tua bước.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 px-2 py-0.5 rounded text-emerald-400"
            >
              <span className="text-[#6E685F] text-[10px]">›</span>
              <span className="flex-1 font-medium">{log.text}</span>
              {log.tag && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold tracking-wider ${
                    log.tag === 'microtask'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : log.tag === 'macrotask'
                      ? 'bg-sky-950 text-sky-300 border border-sky-800'
                      : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  {log.tag}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
