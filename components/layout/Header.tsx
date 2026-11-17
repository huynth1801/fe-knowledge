'use client';

import React from 'react';

interface HeaderProps {
  activeView: 'simulation' | 'cheatsheet';
  onSelectView: (view: 'simulation' | 'cheatsheet') => void;
  activeTopicTitle?: string;
}

export function Header({ activeView, onSelectView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)] px-6 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center font-serif text-lg font-bold shadow-2xs">
          ✦
        </div>
        <div>
          <span className="font-serif font-bold text-xl tracking-tight text-[var(--foreground)] leading-none block">
            FE Visualizer
          </span>
          <p className="text-[13px] text-[var(--muted)] mt-0.5 hidden sm:block">
            Trực quan hoá cơ chế hoạt động Front-End
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] text-[14px]">
        <button
          onClick={() => onSelectView('simulation')}
          className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
            activeView === 'simulation'
              ? 'bg-[var(--card)] text-[var(--foreground)] font-semibold shadow-2xs border border-[var(--border)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Sân khấu mô phỏng
        </button>

        <button
          onClick={() => onSelectView('cheatsheet')}
          className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
            activeView === 'cheatsheet'
              ? 'bg-[var(--card)] text-[var(--foreground)] font-semibold shadow-2xs border border-[var(--border)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Sổ tay Micro / Macrotask
        </button>
      </div>

      {/* Right runtime badge */}
      <div className="flex items-center gap-2 text-[14px] text-[var(--foreground)]">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="font-medium">V8 Runtime</span>
      </div>
    </header>
  );
}
