'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface ConsoleCardProps {
  logs: { id: string; text: string; step: number; tag?: string }[];
  className?: string;
}

export function ConsoleCard({ logs, className = '' }: ConsoleCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest log when a new log arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs.length]);

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xs flex flex-col ${className}`}
    >
      <div className="px-4 py-2 bg-[var(--card-subtle)] border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-[13px] font-mono font-medium text-[var(--foreground)]">
            Console Terminal (Output thời gian thực)
          </span>
        </div>
        <span className="text-[12px] font-mono text-[var(--muted)]">
          {logs.length} dòng log
        </span>
      </div>

      <div
        ref={scrollRef}
        className="p-3 font-mono text-[13px] overflow-y-auto space-y-1.5 bg-[#1F1E1C] text-[#E8E2D8] flex-1"
      >
        {logs.length === 0 ? (
          <div className="text-[#757069] italic py-6 text-center text-[13px]">
            Chưa có log. Bấm "Tự động chạy" hoặc "Bước tiếp theo" để xem output in ra tại đây.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 px-2 py-0.5 rounded text-emerald-400 bg-[#282624]/60"
            >
              <span className="text-[#6E685F] text-[11px] select-none">›</span>
              <span className="flex-1 font-medium">{log.text}</span>
              {log.tag && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-sans uppercase font-bold tracking-wider ${
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
