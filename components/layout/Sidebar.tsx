'use client';

import React from 'react';
import { curriculumCategories } from '@/lib/curriculum';
import { TopicId } from '@/lib/types';
import { Cpu, Box, Atom, Globe, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

interface SidebarProps {
  currentTopic: TopicId;
  onSelectTopic: (id: TopicId) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'js-engine': <Cpu className="w-4 h-4 text-[var(--accent)]" />,
  'css-mechanics': <Box className="w-4 h-4 text-emerald-600" />,
  'react-internals': <Atom className="w-4 h-4 text-sky-600" />,
  'browser-network': <Globe className="w-4 h-4 text-amber-600" />,
};

export function Sidebar({ currentTopic, onSelectTopic }: SidebarProps) {
  return (
    <aside className="w-72 shrink-0 border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] flex flex-col h-[calc(100vh-61px)] overflow-y-auto">
      {/* Sidebar intro */}
      <div className="p-4 border-b border-[var(--sidebar-border)]">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Giáo trình trực quan
        </h2>
        <p className="text-xs text-[var(--muted)] mt-1">
          Lộ trình ôn tập Front-End từ cơ chế đến phỏng vấn chuyên sâu.
        </p>
      </div>

      {/* Categories */}
      <div className="p-3 space-y-6 flex-1">
        {curriculumCategories.map((category) => (
          <div key={category.id} className="space-y-1.5">
            <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
              {categoryIcons[category.id] || <Cpu className="w-4 h-4" />}
              <span>{category.title}</span>
            </div>

            <div className="space-y-1">
              {category.topics.map((topic) => {
                const isActive = currentTopic === topic.id;
                const isReady = topic.isReady;

                return (
                  <button
                    key={topic.id}
                    disabled={!isReady}
                    onClick={() => onSelectTopic(topic.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex flex-col gap-1 border ${
                      isActive
                        ? 'bg-[var(--card)] border-[var(--accent)] shadow-xs text-[var(--foreground)] font-medium'
                        : isReady
                        ? 'bg-transparent border-transparent hover:bg-[var(--card)]/60 text-[var(--foreground)]'
                        : 'opacity-60 cursor-not-allowed bg-transparent border-transparent text-[var(--muted)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[13px]">{topic.title}</span>
                      {topic.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            isReady
                              ? 'bg-[var(--accent-light)] text-[var(--accent)] font-semibold'
                              : 'bg-[var(--muted-background)] text-[var(--muted)]'
                          }`}
                        >
                          {topic.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--muted)] line-clamp-1">
                      {topic.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[var(--muted)] font-mono">
                      <span className="px-1.5 py-0.2 rounded bg-[var(--card-subtle)] border border-[var(--border-subtle)]">
                        {topic.level}
                      </span>
                      {isReady ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-sans">
                          <CheckCircle2 className="w-3 h-3" /> Đã sẵn sàng
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[var(--muted)] font-sans">
                          <Clock className="w-3 h-3" /> Đang dựng
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom helper card */}
      <div className="p-4 m-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs">
        <div className="font-serif font-bold text-sm text-[var(--foreground)]">
          💡 Phương pháp học
        </div>
        <p className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
          Đọc kỹ từng bước chuyển đổi của Call Stack và hàng đợi để nắm chắc bản chất, không học vẹt.
        </p>
      </div>
    </aside>
  );
}
