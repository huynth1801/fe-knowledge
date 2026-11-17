'use client';

import React from 'react';
import { BookOpen, Sparkles, Terminal } from 'lucide-react';

interface HeaderProps {
  activeView: 'simulation' | 'cheatsheet';
  onSelectView: (view: 'simulation' | 'cheatsheet') => void;
  activeTopicTitle?: string;
}

export function Header({ activeView, onSelectView, activeTopicTitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
          ✦
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg tracking-tight text-[var(--foreground)]">
              FE Visualizer
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent-border)] font-medium">
              Anthropic Style
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] hidden sm:block">
            Trực quan hoá cơ chế hoạt động Front-End
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs (Claude-style Segmented Control) */}
      <div className="flex items-center p-1 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] text-xs font-medium">
        <button
          onClick={() => onSelectView('simulation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeView === 'simulation'
              ? 'bg-[var(--card)] text-[var(--foreground)] font-semibold shadow-2xs border border-[var(--border)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Sân khấu mô phỏng</span>
        </button>

        <button
          onClick={() => onSelectView('cheatsheet')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeView === 'cheatsheet'
              ? 'bg-[var(--card)] text-[var(--foreground)] font-semibold shadow-2xs border border-[var(--border)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[var(--muted)]" />
          <span>Sổ tay Micro / Macrotask</span>
        </button>
      </div>

      {/* Right runtime badge */}
      <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>V8 Runtime</span>
      </div>
    </header>
  );
}
