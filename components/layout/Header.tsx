'use client';

import React from 'react';
import { PanelLeft, PanelLeftClose } from 'lucide-react';

interface HeaderProps {
  activeView: 'simulation' | 'cheatsheet';
  onSelectView: (view: 'simulation' | 'cheatsheet') => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeTopicTitle?: string;
}

export function Header({
  activeView,
  onSelectView,
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)] px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
      {/* Brand & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Thu gọn danh mục (Ctrl+B)' : 'Mở danh mục bài học'}
          className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-subtle)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer shadow-2xs"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-[var(--accent)]" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </button>

        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center font-serif text-lg font-bold shadow-2xs">
          ✦
        </div>

        <div>
          <span className="font-serif font-bold text-lg tracking-tight text-[var(--foreground)] leading-none block">
            FE Visualizer
          </span>
          <p className="text-[12px] text-[var(--muted)] mt-0.5 hidden sm:block">
            Trực quan hoá cơ chế hoạt động Front-End
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] text-[14px]">
        <button
          onClick={() => onSelectView('simulation')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
            activeView === 'simulation'
              ? 'bg-[var(--card)] text-[var(--foreground)] font-semibold shadow-2xs border border-[var(--border)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Sân khấu mô phỏng
        </button>

        <button
          onClick={() => onSelectView('cheatsheet')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
            activeView === 'cheatsheet'
              ? 'bg-[var(--card)] text-[var(--foreground)] font-semibold shadow-2xs border border-[var(--border)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Sổ tay Micro / Macrotask
        </button>
      </div>

      {/* Right runtime badge */}
      <div className="flex items-center gap-2 text-[13px] text-[var(--foreground)]">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="font-medium">V8 Runtime</span>
      </div>
    </header>
  );
}
