'use client';

import React from 'react';
import { TopicId } from '@/lib/types';
import { Box, Atom, Globe, Lock, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface TopicRoadmapViewProps {
  topicId: TopicId;
  onBackToEventLoop: () => void;
}

const topicDetails: Record<
  TopicId,
  {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    description: string;
    interviewPoints: string[];
    visualMockupDesc: string;
  }
> = {
  'event-loop': {
    title: 'Event Loop & Task Queues',
    subtitle: 'Mô phỏng V8 Runtime',
    icon: <Sparkles className="w-6 h-6 text-[var(--accent)]" />,
    description: 'Đã sẵn sàng hoạt động.',
    interviewPoints: [],
    visualMockupDesc: '',
  },
  'closures': {
    title: 'Closures & Scope Chain',
    subtitle: 'Lexical Environment & Heap Allocation',
    icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
    description:
      'Mô phỏng trực quan bộ nhớ Heap và chiếc "balo" (backpack) của hàm con khi ghi nhớ các biến của hàm cha ngoài phạm vi thực thi.',
    interviewPoints: [
      'Tại sao biến trong Closure không bị Garbage Collection thu hồi?',
      'Phân biệt Lexical Scope (tĩnh) vs Dynamic Scope (this context).',
      'Memory leak kinh điển khi gán event listener chứa closure không gỡ bỏ.',
    ],
    visualMockupDesc:
      'Sơ đồ 2 cột: Execution Stack bên trái, Heap Memory Objects bên phải với mũi tên trỏ tham chiếu (Reference pointer).',
  },
  'prototype': {
    title: 'Prototype Chain & Inheritance',
    subtitle: '__proto__ vs prototype property',
    icon: <Sparkles className="w-6 h-6 text-purple-600" />,
    description:
      'Trực quan hoá chuỗi liên kết Prototype Chain từ instance ngược lên Object.prototype và null khi tìm kiếm một phương thức.',
    interviewPoints: [
      'Khác biệt cốt lõi giữa `prototype` (trên Function) và `__proto__` (trên Instance).',
      'Cách toán tử `new` hoạt động ngầm (4 bước thần thánh).',
      'Cơ chế kế thừa prototype-based so với class-based truyền thống trong C++/Java.',
    ],
    visualMockupDesc:
      'Biểu đồ chuỗi liên kết các node Object với mũi tên [[Prototype]] hướng lên đỉnh chuỗi.',
  },
  'stacking-context': {
    title: '3D Stacking Context & Z-Index',
    subtitle: 'Giải mã bug z-index trong không gian 3 chiều',
    icon: <Box className="w-6 h-6 text-emerald-600" />,
    description:
      'Mô hình 3D cho phép kéo xoay đa chiều để quan sát các lớp layer xếp chồng. Giải thích trực quan tại sao z-index: 9999 vẫn nằm dưới một phần tử khác.',
    interviewPoints: [
      'Các thuộc tính CSS nào kích hoạt Stacking Context mới (opacity < 1, transform, filter, will-change)?',
      'Nguyên tắc so sánh: Các phần tử chỉ so sánh z-index với các anh em cùng chung một Stacking Context cha.',
    ],
    visualMockupDesc:
      'Khung vẽ 3D Isometric với các tấm layer nổi trên không gian Z-axis, có thanh trượt xoay góc nhìn 360 độ.',
  },
  'fiber-tree': {
    title: 'React Fiber Architecture & Diffing',
    subtitle: 'Current Tree vs WorkInProgress Tree',
    icon: <Atom className="w-6 h-6 text-sky-600" />,
    description:
      'Mô phỏng thuật toán điều phối mới của React. Thấy rõ sự phân tách giữa Render Phase (có thể tạm ngắt) và Commit Phase (đồng bộ áp vào DOM thật).',
    interviewPoints: [
      'Tại sao React chuyển từ Stack Reconciler sang Fiber Reconciler?',
      'Cách Fiber sử dụng con trỏ linked-list (child, sibling, return) để duyệt cây không đệ quy.',
      'Batching trong React 18+ và Concurrent Features.',
    ],
    visualMockupDesc:
      '2 cây Fiber hiển thị song song với các node đổi màu xanh/vàng/đỏ khi state thay đổi.',
  },
  'rendering-pipeline': {
    title: 'Browser Critical Rendering Path',
    subtitle: 'HTML/CSS Parse -> Layout (Reflow) -> Paint -> Composite',
    icon: <Globe className="w-6 h-6 text-amber-600" />,
    description:
      'Mô phỏng hành trình từ mã HTML thô đến từng điểm ảnh (pixel) xuất hiện trên màn hình thiết bị với tốc độ 60fps.',
    interviewPoints: [
      'Phân biệt Reflow (Layout) vs Repaint: Thuộc tính nào rẻ, thuộc tính nào đắt?',
      'Tại sao `transform` và `opacity` lại tối ưu nhất cho animations (chỉ chạy Composite trên GPU)?',
      'Render-blocking resources: async vs defer script tags.',
    ],
    visualMockupDesc:
      'Ống dẫn (pipeline) 5 giai đoạn nối tiếp nhau, người dùng click thử nghiệm thay đổi CSS để xem giai đoạn nào bị kích hoạt.',
  },
  'http-cache': {
    title: 'HTTP Caching & Performance',
    subtitle: 'Cache-Control, ETag, 304 Not Modified',
    icon: <Globe className="w-6 h-6 text-cyan-600" />,
    description:
      'Mô phỏng đường truyền Request/Response giữa Browser và CDN/Origin Server khi có các cờ cache khác nhau.',
    interviewPoints: [
      'Cơ chế `stale-while-revalidate` giúp tối ưu trải nghiệm người dùng như thế nào?',
      'So sánh ETag/If-None-Match (Validation) vs max-age (Expiration).',
      'Cache-Control: no-cache vs no-store.',
    ],
    visualMockupDesc:
      'Sơ đồ tương tác mạng mô phỏng gói tin HTTP bay qua lại kèm bảng phân tích headers.',
  },
};

export function TopicRoadmapView({ topicId, onBackToEventLoop }: TopicRoadmapViewProps) {
  const info = topicDetails[topicId] || topicDetails['stacking-context'];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <button
          onClick={onBackToEventLoop}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Event Loop Visualizer
        </button>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          🚧 Đang trong lộ trình phát triển (Phase 2 & 3)
        </span>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)]">
            {info.icon}
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-[var(--muted)] font-semibold">
              Kế hoạch trực quan hoá
            </span>
            <h2 className="font-serif font-bold text-2xl text-[var(--foreground)] mt-0.5">
              {info.title}
            </h2>
            <p className="text-xs text-[var(--muted)] font-mono mt-0.5">{info.subtitle}</p>
          </div>
        </div>

        <p className="text-sm text-[var(--foreground)] leading-relaxed">{info.description}</p>

        {/* Visual Mockup Concept Card */}
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card-subtle)] p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--foreground)]">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span>Mô hình tương tác dự kiến (Interactive Canvas Concept)</span>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            {info.visualMockupDesc}
          </p>
        </div>

        {/* Key Interview Questions */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-base text-[var(--foreground)]">
            Trọng tâm câu hỏi phỏng vấn sẽ được giải mã trực quan:
          </h3>
          <div className="space-y-2">
            {info.interviewPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] text-xs text-[var(--foreground)]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onBackToEventLoop}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xs"
          >
            Trải nghiệm module Event Loop đang chạy
          </button>
        </div>
      </div>
    </div>
  );
}
