'use client';

import React from 'react';
import Link from 'next/link';
import { PanelLeft, PanelLeftClose, Search, Play, FileText, Home as HomeIcon } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white px-4 sm:px-6 py-2 flex items-center justify-between shrink-0 shadow-2xs min-h-[52px]">
      {/* Brand & Sidebar Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Thu gọn danh mục (Ctrl+B)' : 'Mở danh mục bài học'}
          aria-label={isSidebarOpen ? 'Thu gọn danh mục' : 'Mở danh mục bài học'}
          className="min-h-[44px] min-w-[44px] p-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-[#BD5332]" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </button>

        {/* Logo linking to landing page */}
        <Link
          href="/"
          className="flex items-center gap-2.5 cursor-pointer min-h-[44px] hover:opacity-90 transition-opacity"
          title="Về trang chủ FE Visualizer"
        >
          <div className="w-7 h-7 rounded-lg bg-[#BD5332] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
            {'{ }'}
          </div>

          <span className="font-bold text-[15px] tracking-tight text-zinc-900 leading-none">
            FE Visualizer
          </span>
        </Link>
      </div>

      {/* Center Navigation Links */}
      <nav className="hidden sm:flex items-center gap-4 text-[13px] font-semibold text-zinc-700" aria-label="Điều hướng chính">
        <Link
          href="/"
          className="py-1.5 text-zinc-600 hover:text-zinc-950 transition-colors flex items-center gap-1.5"
          title="Trang chủ giới thiệu"
        >
          <HomeIcon className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </Link>

        <button
          onClick={() => onSelectView('cheatsheet')}
          className={`py-1.5 transition-colors cursor-pointer ${
            activeView === 'cheatsheet'
              ? 'text-zinc-950 font-bold border-b-2 border-[#BD5332]'
              : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          Học
        </button>

        {hasSimulation ? (
          <button
            onClick={() => onSelectView('simulation')}
            className={`py-1.5 transition-colors cursor-pointer ${
              activeView === 'simulation'
                ? 'text-[#BD5332] font-bold border-b-2 border-[#BD5332]'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Mô phỏng
          </button>
        ) : (
          <span
            className="py-1.5 text-zinc-400 text-[12px] cursor-not-allowed"
            title="Chủ đề này không cần mô phỏng máy ảo"
          >
            Mô phỏng
          </span>
        )}

        {onOpenPredictModal && (
          <button
            onClick={onOpenPredictModal}
            className="py-1.5 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            Thử thách
          </button>
        )}

        <button
          onClick={() => onSelectView('cheatsheet')}
          className="py-1.5 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
        >
          Tài liệu
        </button>
      </nav>

      {/* Right Search & Action Button */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-[12px] text-zinc-600">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <span>Tìm kiếm...</span>
          <kbd className="text-[10px] font-mono bg-white border border-zinc-300 px-1.5 py-0.5 rounded text-zinc-700 font-semibold shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Action Button: Unified style */}
        {hasSimulation ? (
          <button
            onClick={() => onSelectView(activeView === 'simulation' ? 'cheatsheet' : 'simulation')}
            className="min-h-[44px] md:min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#BD5332] hover:bg-[#A84526] text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{activeView === 'simulation' ? 'Xem bài học' : 'Chạy mô phỏng'}</span>
          </button>
        ) : (
          <button
            onClick={() => onSelectView('cheatsheet')}
            className="min-h-[44px] md:min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-[12px] font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sổ tay lý thuyết</span>
          </button>
        )}
      </div>
    </header>
  );
}
