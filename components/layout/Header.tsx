'use client';

import React from 'react';
import { PanelLeft, PanelLeftClose, Search, Play, BookOpen, Layers, HelpCircle, FileText } from 'lucide-react';

interface HeaderProps {
  activeView: 'simulation' | 'cheatsheet';
  onSelectView: (view: 'simulation' | 'cheatsheet') => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenPredictModal?: () => void;
  hasSimulation?: boolean;
}

export function Header({
  activeView,
  onSelectView,
  isSidebarOpen,
  onToggleSidebar,
  onOpenPredictModal,
  hasSimulation = true,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
      {/* Brand & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Thu gọn danh mục (Ctrl+B)' : 'Mở danh mục bài học'}
          className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer shadow-2xs"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-[#CC6745]" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </button>

        {/* Logo matching pen.dev */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectView('cheatsheet')}>
          <div className="w-7 h-7 rounded-lg bg-[#CC6745] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
            {'{ }'}
          </div>

          <span className="font-bold text-[15px] tracking-tight text-zinc-900 leading-none">
            FE Visualizer
          </span>
        </div>
      </div>

      {/* Center Navigation Tabs matching pen.dev: Học | Mô phỏng | Thử thách | Tài liệu */}
      <nav className="hidden sm:flex items-center gap-1 text-[13px] font-medium text-zinc-600">
        <button
          onClick={() => onSelectView('cheatsheet')}
          className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
            activeView === 'cheatsheet'
              ? 'text-zinc-900 font-bold bg-zinc-100/80'
              : 'hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          Học
        </button>

        {hasSimulation ? (
          <button
            onClick={() => onSelectView('simulation')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeView === 'simulation'
                ? 'text-[#CC6745] font-bold bg-orange-50'
                : 'hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            Mô phỏng
          </button>
        ) : (
          <span className="px-3 py-1 text-zinc-400 text-[12px] cursor-not-allowed" title="Chủ đề này không cần mô phỏng máy ảo">
            Mô phỏng
          </span>
        )}

        {onOpenPredictModal && (
          <button
            onClick={onOpenPredictModal}
            className="px-3 py-1 rounded-lg hover:text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            Thử thách
          </button>
        )}

        <button
          onClick={() => onSelectView('cheatsheet')}
          className="px-3 py-1 rounded-lg hover:text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          Tài liệu
        </button>
      </nav>

      {/* Right Search & Action Button matching pen.dev */}
      <div className="flex items-center gap-2.5">
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50/80 text-[12px] text-zinc-500">
          <Search className="w-3.5 h-3.5" />
          <span>Tìm kiếm...</span>
          <kbd className="text-[10px] font-mono bg-white border border-zinc-200 px-1 py-0.2 rounded shadow-2xs text-zinc-400">
            ⌘K
          </kbd>
        </div>

        {/* Chạy mô phỏng Button (Red / Terracotta) */}
        {hasSimulation ? (
          <button
            onClick={() => onSelectView(activeView === 'simulation' ? 'cheatsheet' : 'simulation')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#CC6745] hover:bg-[#B85635] text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{activeView === 'simulation' ? 'Xem bài học' : 'Chạy mô phỏng'}</span>
          </button>
        ) : (
          <button
            onClick={() => onSelectView('cheatsheet')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 text-[12px] font-medium"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sổ tay lý thuyết</span>
          </button>
        )}
      </div>
    </header>
  );
}
