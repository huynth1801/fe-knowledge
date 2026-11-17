'use client';

import React from 'react';
import { curriculumCategories } from '@/lib/curriculum';
import { TopicId } from '@/lib/types';
import {
  Settings2,
  Atom,
  Globe,
  Box,
  Activity,
  Radio,
  Palette,
  CheckSquare,
  ShieldCheck,
  ChevronDown,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentTopic: TopicId;
  onSelectTopic: (id: TopicId) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'js-engine': <Settings2 className="w-4 h-4 text-zinc-600 shrink-0" />,
  'react-internals': <Atom className="w-4 h-4 text-cyan-700 shrink-0" />,
  'network-security': <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />,
  'nextjs-architecture': <Globe className="w-4 h-4 text-blue-700 shrink-0" />,
  'css-mechanics': <Box className="w-4 h-4 text-indigo-700 shrink-0" />,
  'perf-vitals': <Activity className="w-4 h-4 text-rose-700 shrink-0" />,
  'realtime-dataviz': <Radio className="w-4 h-4 text-emerald-700 shrink-0" />,
  'design-system': <Palette className="w-4 h-4 text-pink-700 shrink-0" />,
  'testing-qa': <CheckSquare className="w-4 h-4 text-violet-700 shrink-0" />,
};

export function Sidebar({ currentTopic, onSelectTopic, isOpen = true, onClose }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside
        className="fixed md:static inset-y-0 left-0 z-50 md:z-auto w-72 md:w-72 shrink-0 border-r border-zinc-200 bg-[#FBF9F7] flex flex-col h-full md:h-[calc(100vh-53px)] overflow-y-auto px-3 py-4 space-y-4 select-none shadow-xl md:shadow-none"
        aria-label="Lộ trình học"
      >
        {/* Top Header Label & Mobile Close */}
        <div className="flex items-center justify-between px-3 pt-1 pb-0.5">
          <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block">
            Lộ trình học
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Đóng danh mục"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories & Topics List */}
        <div className="space-y-4">
          {curriculumCategories.map((category) => {
            return (
              <div key={category.id} className="space-y-1">
                {/* Category Header */}
                <div className="flex items-center justify-between px-3 py-1.5 text-[13px] font-bold text-zinc-800">
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    {categoryIcons[category.id] || <Settings2 className="w-4 h-4 text-zinc-600 shrink-0" />}
                    <span className="truncate">{category.title}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                </div>

                {/* Topics under category */}
                <div className="space-y-1">
                  {category.topics.map((topic) => {
                    const isActive = currentTopic === topic.id;
                    const isReady = topic.isReady;

                    return (
                      <button
                        key={topic.id}
                        disabled={!isReady}
                        onClick={() => {
                          onSelectTopic(topic.id);
                          if (onClose && window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                        className={`w-full text-left px-3 py-2 min-h-[44px] md:min-h-[38px] rounded-lg text-[13px] transition-all flex flex-col justify-center cursor-pointer ${
                          isActive
                            ? 'bg-[#BD5332] text-white font-semibold shadow-2xs'
                            : isReady
                            ? 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/60'
                            : 'opacity-50 cursor-not-allowed text-zinc-500'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate flex-1 min-w-0">{topic.title}</span>
                          {!topic.hasSimulation && isReady && (
                            <span
                              className={`ml-2 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium shrink-0 ${
                                isActive ? 'bg-black/25 text-white' : 'bg-zinc-200 text-zinc-700'
                              }`}
                            >
                              Sổ tay
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
