'use client';

import React from 'react';
import { Sparkles, BookOpen, Layers, Terminal } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  activeTopicTitle?: string;
}

export function Header({ activeTopicTitle = 'Event Loop & Task Queues' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center shadow-xs font-serif text-lg font-bold">
          ✦
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-lg tracking-tight text-[var(--foreground)]">
              FE Visualizer
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent-border)] font-medium">
              v1.0 MVP
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] hidden sm:block">
            Trực quan hoá cơ chế hoạt động ngầm Front-End (Claude Editorial Style)
          </p>
        </div>
      </div>

      {/* Center Topic Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--foreground)]">
        <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
        <span className="text-[var(--muted)]">Chủ đề đang xem:</span>
        <span className="font-semibold">{activeTopicTitle}</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-[var(--muted)]" />
          <span className="hidden sm:inline">Tài liệu ôn tập</span>
        </a>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--card-subtle)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--muted)]">
          <Terminal className="w-3 h-3 text-[var(--accent)]" />
          <span>V8 Runtime Sim</span>
        </div>
      </div>
    </header>
  );
}
