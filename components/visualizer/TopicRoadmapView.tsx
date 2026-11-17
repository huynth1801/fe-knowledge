'use client';

import React from 'react';
import { TopicId } from '@/lib/types';
import {
  Box,
  Atom,
  Globe,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Layers,
  Palette,
  Radio,
  BarChart3,
  CheckSquare,
} from 'lucide-react';

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
  'nextjs-rendering': {
    title: 'SSR vs SSG vs ISR vs RSC',
    subtitle: 'Next.js 16 Rendering Pipeline',
    icon: <Globe className="w-6 h-6 text-blue-600" />,
    description: 'Đã sẵn sàng hoạt động.',
    interviewPoints: [],
    visualMockupDesc: '',
  },
  'core-web-vitals': {
    title: 'Core Web Vitals & Main Thread Optimization',
    subtitle: 'LCP, INP, CLS & Long Tasks Simulator',
    icon: <BarChart3 className="w-6 h-6 text-rose-600" />,
    description:
      'Mô phỏng trực quan các chỉ số trải nghiệm người dùng cốt lõi của Google (Core Web Vitals): cách Long Tasks (>50ms) làm nghẽn Main Thread gây giật lag khi gõ phím hoặc click (INP), cách tài nguyên ảnh hưởng tới LCP và cơ chế gây nhảy layout (CLS).',
    interviewPoints: [
      'INP (Interaction to Next Paint) thay thế FID như thế nào? Cách chia nhỏ Long Tasks bằng scheduler.yield() hoặc setTimeout.',
      'LCP (Largest Contentful Paint): Phân tích 4 pha con (TTFB, Resource Load Delay, Resource Load Duration, Element Render Delay).',
      'CLS (Cumulative Layout Shift): Tại sao việc thiếu `aspect-ratio` hoặc kích thước `width/height` trên thẻ `<img>` lại giết chết điểm CLS?',
      'Kỹ thuật Virtual List (Windowing): Tại sao chỉ nên render các phần tử trong viewport + buffer khi danh sách có hàng chục nghìn records.',
    ],
    visualMockupDesc:
      'Trình mô phỏng dòng thời gian Main Thread (60fps Timeline): Người dùng kéo slider để chèn các Long Task và thấy ngay FPS tụt dốc, kèm cửa sổ mô phỏng layout shift khi chèn banner quảng cáo động.',
  },
  'design-tokens': {
    title: 'Design System, Component Library & Design Tokens',
    subtitle: 'Tokens Hierarchy, Compound Components & Storybook',
    icon: <Palette className="w-6 h-6 text-amber-600" />,
    description:
      'Hệ thống hóa phương pháp xây dựng Design System quy mô doanh nghiệp: từ phân tầng Design Tokens (Global ➔ Semantic ➔ Component), thiết kế Component Library độc lập với Storybook, tới các design patterns nâng cao (Compound Components) và tiêu chuẩn tiếp cận Accessibility (WCAG / a11y).',
    interviewPoints: [
      'Cấu trúc phân tầng Design Tokens: Phân biệt rõ Global Tokens (e.g. blue-500) vs Semantic Tokens (e.g. color-action-primary) vs Component Tokens (e.g. button-bg-hover).',
      'Compound Component Pattern: Tại sao các thư viện hàng đầu (Radix UI, Headless UI, Shadcn) ưu tiên pattern này thay vì "Props Explosion"?',
      'Accessibility (a11y) under the hood: Cách quản lý Focus Trap trong Modal, roving tabindex trong Menu/Dropdown, và các thuộc tính `aria-expanded`, `aria-controls`.',
      'Storybook & Component Documentation: Cách tổ chức Stories, Controls, Docs addon và kiểm thử Component States.',
    ],
    visualMockupDesc:
      'Trình tương tác 3 tầng Token: Người dùng chọn màu thương hiệu ở Global Token, lập tức quan sát chuỗi phản ứng đổi màu tự động trên Semantic Token và các Component mẫu (Button, Card, Input) theo thời gian thực.',
  },
  'websocket-realtime': {
    title: 'Real-time WebSocket Lifecycle & Data Stream',
    subtitle: 'Handshake 101, Full-Duplex, Ping/Pong & Exponential Backoff',
    icon: <Radio className="w-6 h-6 text-sky-600" />,
    description:
      'Mô phỏng cơ chế giao tiếp hai chiều (Full-Duplex) liên tục qua WebSocket: Quá trình nâng cấp kết nối từ HTTP 101, cơ chế Ping/Pong Heartbeat phát hiện rớt mạng ngầm, và thuật toán Exponential Backoff + Full Jitter tự động kết nối lại an toàn.',
    interviewPoints: [
      'Bắt tay WebSocket (Handshake): Ý nghĩa của các headers `Upgrade: websocket`, `Connection: Upgrade`, `Sec-WebSocket-Key` và `Sec-WebSocket-Accept`.',
      'So sánh chuyên sâu: WebSocket vs Server-Sent Events (SSE) vs Long-Polling (Khi nào nên chọn giải pháp nào?).',
      'Cơ chế Heartbeat (Ping/Pong): Tại sao TCP keep-alive không đủ để phát hiện "Zombie Connections" khi đi qua Proxy/Load Balancer?',
      'Thuật toán Exponential Backoff + Jitter: Tránh hiện tượng "Thundering Herd" làm sập server khi hàng triệu client cùng kết nối lại đồng thời.',
    ],
    visualMockupDesc:
      'Sơ đồ mạng tương tác Client ⇄ Server: Mô phỏng các gói tin bay qua lại, cho phép người dùng click "Mất mạng đột ngột" để quan sát thuật toán Backoff đếm ngược thời gian thử lại có Jitter ngẫu nhiên.',
  },
  'dataviz-maps': {
    title: 'Data Visualization & Tiled Vector Maps',
    subtitle: 'D3/Canvas Performance & Mapbox/MapLibre Tiling Pipeline',
    icon: <Globe className="w-6 h-6 text-emerald-600" />,
    description:
      'Giải mã kiến trúc vẽ dữ liệu quy mô lớn (Data Visualization) và bản đồ số: So sánh hiệu năng giới hạn giữa SVG (DOM tree), HTML5 Canvas (Bitmap pixel) và WebGL (Shader GPU). Cơ chế phân mảnh toạ độ Tile Z/X/Y và cắt tỉa Viewport Bounding Box trong Mapbox / MapLibre / Leaflet.',
    interviewPoints: [
      'So sánh chi phí render: Khi nào SVG bắt đầu nghẽn DOM (> 3,000 nodes)? Khi nào bắt buộc phải chuyển sang Canvas (2D Context) hoặc WebGL (GPU)?',
      'Nguyên lý hoạt động của D3.js: Mô hình Data Binding (Enter, Update, Exit selection pattern) và phép chiếu toạ độ Scale.',
      'Kiến trúc Bản đồ Vector (Mapbox/MapLibre): Hệ toạ độ Tile Z/X/Y (Web Mercator projection EPSG:3857), cơ chế Overzooming và GeoJSON vector tile compression.',
      'Tối ưu vẽ 100k markers: Kỹ thuật Bounding Box Query (Spatial Indexing với R-Tree / Flatbush) và Supercluster (gom cụm điểm).',
    ],
    visualMockupDesc:
      'Khung đo hiệu năng Benchmark trực tiếp: Kéo thanh trượt từ 100 đến 100,000 điểm dữ liệu và xem biểu đồ so sánh FPS giữa SVG và Canvas vẽ trực tiếp trong trình duyệt.',
  },
  'testing-visual-regression': {
    title: 'Testing Strategy, Visual Regression & E2E',
    subtitle: 'Pixel Diffing, Playwright Actionability & Testing Trophy',
    icon: <CheckSquare className="w-6 h-6 text-indigo-600" />,
    description:
      'Hệ thống hoá chiến lược kiểm thử phần mềm Front-End hiện đại: Từ kim tự tháp / chiếc cúp kiểm thử (Testing Trophy: Unit vs Component vs Integration vs E2E), kỹ thuật so sánh điểm ảnh tự động (Visual Regression Pixel Diffing), tới cơ chế Auto-waiting thông minh của Playwright.',
    interviewPoints: [
      'Visual Regression Testing: Cơ chế hoạt động của pixel-by-pixel diffing (Pixelmatch, threshold, anti-aliasing detection) và cách mask các vùng động (ngày giờ, avatar ngẫu nhiên).',
      'Playwright Auto-waiting & Actionability Checks: Playwright tự động kiểm tra những điều kiện gì trước khi click (Attached, Visible, Stable, Enabled, Editable, Actionable)?',
      'Chiến lược Testing Trophy (Kent C. Dodds): Tại sao nên đầu tư nhiều nhất vào Integration & Component Testing thay vì lạm dụng Unit test rời rạc?',
      'Mock Service Worker (MSW): Tại sao mock ở tầng Network (Service Worker) lại tốt hơn mock module (jest.mock) khi kiểm thử Component?',
    ],
    visualMockupDesc:
      'Thanh trượt so sánh ảnh Before/After (Slider Image Diff): Cho phép kéo thanh trượt để phát hiện sự sai lệch 2 pixel màu đỏ giữa bản thiết kế chuẩn (Golden Master) và code mới.',
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
  const info = topicDetails[topicId] || topicDetails['core-web-vitals'];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <button
          onClick={onBackToEventLoop}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Event Loop Visualizer
        </button>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-semibold">
          🚀 Đang mở rộng nội dung (Senior / Lead Scope)
        </span>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] shrink-0">
            {info.icon}
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-[var(--muted)] font-semibold">
              Kế hoạch trực quan hoá chuyên sâu
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--foreground)] mt-0.5">
              {info.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] font-mono mt-0.5">
              {info.subtitle}
            </p>
          </div>
        </div>

        <p className="text-[15px] sm:text-[16px] text-[var(--foreground)] leading-relaxed">
          {info.description}
        </p>

        {/* Visual Mockup Concept Card */}
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card-subtle)]/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-[14px] font-mono font-semibold text-[var(--foreground)]">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span>Mô hình tương tác trực quan (Interactive Visual Concept)</span>
          </div>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed">
            {info.visualMockupDesc}
          </p>
        </div>

        {/* Key Interview Questions */}
        <div className="space-y-3 pt-2">
          <h3 className="font-serif font-bold text-lg text-[var(--foreground)]">
            Trọng tâm phỏng vấn Senior/Lead được giải mã trực quan:
          </h3>
          <div className="space-y-2.5">
            {info.interviewPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] text-[14px] text-[var(--foreground)] shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 flex items-center gap-3">
          <button
            onClick={onBackToEventLoop}
            className="px-5 py-2.5 rounded-xl text-[14px] font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xs transition-colors cursor-pointer"
          >
            Trải nghiệm module Event Loop đang chạy
          </button>
        </div>
      </div>
    </div>
  );
}
