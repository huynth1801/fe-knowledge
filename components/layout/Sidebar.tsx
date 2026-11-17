'use client';

import React from 'react';
import { curriculumCategories } from '@/lib/curriculum';
import { TopicId } from '@/lib/types';
import {
  Settings2,
  RefreshCw,
  Zap,
  Atom,
  Globe,
  Box,
  Activity,
  Radio,
  Palette,
  CheckSquare,
  ChevronDown,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  currentTopic: TopicId;
  onSelectTopic: (id: TopicId) => void;
  isOpen?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'js-engine': <Settings2 className="w-4 h-4 text-zinc-500" />,
  'react-internals': <Atom className="w-4 h-4 text-cyan-600" />,
  'nextjs-architecture': <Globe className="w-4 h-4 text-blue-600" />,
  'css-mechanics': <Box className="w-4 h-4 text-indigo-600" />,
  'perf-vitals': <Activity className="w-4 h-4 text-rose-600" />,
  'realtime-dataviz': <Radio className="w-4 h-4 text-emerald-600" />,
  'design-system': <Palette className="w-4 h-4 text-pink-600" />,
  'testing-qa': <CheckSquare className="w-4 h-4 text-violet-600" />,
};

export function Sidebar({ currentTopic, onSelectTopic, isOpen = true }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-[#FBF9F7] flex flex-col h-[calc(100vh-53px)] overflow-y-auto p-3.5 space-y-4 select-none">
      {/* Top Label: LỘ TRÌNH HỌC */}
      <div className="px-2 pt-1">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Lộ trình học
        </span>
      </div>

      {/* Categories & Topics List */}
      <div className="space-y-3">
        {curriculumCategories.map((category) => {
          const hasActiveTopic = category.topics.some((t) => t.id === currentTopic);

          return (
            <div key={category.id} className="space-y-1">
              {/* Category Header */}
              <div className="flex items-center justify-between px-2 py-1 text-[13px] font-semibold text-zinc-700">
                <div className="flex items-center gap-2 truncate">
                  {categoryIcons[category.id] || <Settings2 className="w-4 h-4 text-zinc-500" />}
                  <span className="truncate">{category.title}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </div>

              {/* Topics under category */}
              <div className="space-y-0.5 pl-3">
                {category.topics.map((topic) => {
                  const isActive = currentTopic === topic.id;
                  const isReady = topic.isReady;

                  return (
                    <button
                      key={topic.id}
                      disabled={!isReady}
                      onClick={() => onSelectTopic(topic.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[13px] transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-[#CC6745] text-white font-medium shadow-2xs'
                          : isReady
                          ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                          : 'opacity-50 cursor-not-allowed text-zinc-400'
                      }`}
                    >
                      <span className="truncate">{topic.title}</span>

                      {/* Pill badge if topic has no simulation (pure doc/cheatsheet) */}
                      {!topic.hasSimulation && isReady && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                          }`}
                          title="Sổ tay lý thuyết & Bẫy phỏng vấn (không cần mô phỏng máy ảo)"
                        >
                          Sổ tay
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
