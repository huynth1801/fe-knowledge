'use client';

import React from 'react';
import { curriculumCategories } from '@/lib/curriculum';
import { TopicId } from '@/lib/types';

interface SidebarProps {
  currentTopic: TopicId;
  onSelectTopic: (id: TopicId) => void;
}

export function Sidebar({ currentTopic, onSelectTopic }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-[var(--sidebar-border)] bg-[var(--background)] flex flex-col h-[calc(100vh-65px)] overflow-y-auto p-4 sm:p-5 space-y-6">
      {curriculumCategories.map((category) => (
        <div key={category.id} className="space-y-2">
          {/* Category Header */}
          <h2 className="text-[13px] font-medium text-[var(--muted)] px-1">
            {category.title}
          </h2>

          {/* Topics List */}
          <div className="space-y-1.5">
            {category.topics.map((topic) => {
              const isActive = currentTopic === topic.id;
              const isReady = topic.isReady;

              return (
                <button
                  key={topic.id}
                  disabled={!isReady}
                  onClick={() => onSelectTopic(topic.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1.5 ${
                    isActive
                      ? 'bg-[var(--card)] border border-[var(--accent-border)] shadow-xs'
                      : isReady
                      ? 'bg-transparent hover:bg-[var(--card-subtle)] text-[var(--foreground)] cursor-pointer'
                      : 'opacity-70 cursor-not-allowed text-[var(--muted)]'
                  }`}
                >
                  {/* Topic Title */}
                  <span
                    className={`text-[15px] leading-snug ${
                      isActive
                        ? 'font-bold text-[var(--foreground)]'
                        : 'font-medium text-[var(--foreground)]'
                    }`}
                  >
                    {topic.title}
                  </span>

                  {/* Badge & Status */}
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                        Phổ biến nhất
                      </span>
                    )}

                    {isReady ? (
                      <span className="text-[13px] text-emerald-700 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Đã sẵn sàng
                      </span>
                    ) : (
                      <span className="text-[13px] text-[var(--muted)]">
                        Đang dựng
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
