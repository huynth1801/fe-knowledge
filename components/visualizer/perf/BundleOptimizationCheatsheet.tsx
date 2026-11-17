'use client';

import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Zap,
  Layers,
  Sparkles,
  FileCode,
  Gauge,
  AlertTriangle,
  FolderTree,
} from 'lucide-react';

export function BundleOptimizationCheatsheet() {
  const [activeTab, setActiveTab] = useState<'tree-shaking' | 'lazy-loading' | 'traps'>('tree-shaking');
  const [activeQuestion, setActiveQuestion] = useState<0 | 1 | 2>(0);
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleAnswer = (idx: number) => {
    setShowAnswer((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const questions = [
    {
      id: 0,
      title: 'Bẫy Barrel Files & Import toàn bộ thư viện Icons / Utils',
      badge: 'Tree Shaking Trap',
      pipeline: [
        { label: "import * as Icons from 'lucide-react'", bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Bundler gom 1,400+ SVG Icons', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'Bundle tăng vọt +850KB Gzip', bg: 'bg-red-100 text-red-950 border border-red-300' },
      ],
      code: `// ❌ SAI LẦM PHỔ BIẾN: Import đại trà từ Barrel file
import * as Icons from 'lucide-react';
// Hoặc:
import { Button, Dialog, Select, Table, DatePicker } from '@/components'; 
// (Dù trang này chỉ dùng mỗi Button!)

// ✅ GIẢI PHÁP 1: Named import trực tiếp (Tree-shakeable)
import { ChevronRight, Check } from 'lucide-react';

// ✅ GIẢI PHÁP 2 (Next.js 13.5+): Tự động tối ưu hóa trong next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@headlessui/react', 'lodash-es'],
  },
};`,
      note: 'Barrel files (index.ts re-export hàng trăm file con) là thủ phạm số 1 làm chậm build và phình to bundle.',
      answerSummary: 'Dùng Named Imports cụ thể kết hợp optimizePackageImports',
      answerDetail:
        'Khi viết `import * as Icons` hoặc re-export qua một file `index.ts` khổng lồ, nếu bundler không thể chứng minh các export còn lại không có side effects, toàn bộ code đó sẽ bị đóng gói vào bundle cuối. Next.js 13.5+ giới thiệu `optimizePackageImports` giúp compiler tự động chuyển `import { ChevronRight } from "lucide-react"` thành đường dẫn file trực tiếp tại thời điểm build mà không cần sửa code thủ công.',
    },
    {
      id: 1,
      title: 'Bẫy sideEffects: false làm biến mất toàn bộ CSS Styles & Polyfills',
      badge: 'Bundler Configuration',
      pipeline: [
        { label: 'package.json: "sideEffects": false', bg: 'bg-zinc-200 text-zinc-900' },
        { label: "import './styles.css' trong component", bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'Bundler drop file CSS (Không ai gọi hàm)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `// ❌ LỖI NGUY HIỂM: Khai báo cẩu thả trong package.json
{
  "name": "my-ui-library",
  "sideEffects": false // ⚠️ Rollup/Webpack sẽ DROP sạch file .css và polyfills!
}

// ✅ CHUẨN SENIOR: Whitelist rõ các file có Side Effects
{
  "name": "my-ui-library",
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.ts"
  ]
}`,
      note: 'Một import không export hàm nào (như import CSS hoặc CSS Module) được coi là Side Effect thuần túy.',
      answerSummary: 'Bắt buộc phải chỉ định mảng whitelist các pattern file CSS và Polyfills',
      answerDetail:
        'Cờ `sideEffects: false` ra lệnh cho Webpack/Rollup: "Nếu một file không có export nào được dùng trong app, hãy vứt bỏ hoàn toàn file đó!". Khi bạn viết `import "./button.css"`, file CSS không hề export biến/hàm nào, nên bundler hiểu nhầm là dead code và xóa sổ luôn mã CSS, dẫn đến trang web bị vỡ giao diện trắng trơn khi build production.',
    },
    {
      id: 2,
      title: 'Hiểm hoạ Over-Splitting: Khi chia nhỏ bundle lại làm trang web CHẬM ĐI',
      badge: 'Hiệu năng kiến trúc',
      pipeline: [
        { label: 'Tách 80 file li ti (< 3KB / chunk)', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Network Waterfall: Hàng chục RTT chờ', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'LCP & INP bị nghẽn (Execution Overhead)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `// ❌ QUÁ ĐÀ: Lazy loading cả những component nhỏ < 5KB
const SmallBadge = dynamic(() => import('./SmallBadge'));
const SimpleAvatar = dynamic(() => import('./SimpleAvatar'));
// Kết quả: Tạo ra hàng chục file nhỏ 1KB-3KB. Trình duyệt phải gửi
// hàng chục HTTP requests riêng lẻ, gây tắc nghẽn Network Waterfall!

// ✅ NGUYÊN TẮC VÀNG CHIA CHUNKS:
// 1. Chỉ Lazy load Component NẶNG (> 40KB): Rich Text Editor, Leaflet Map, Highcharts, Three.js
// 2. Chỉ Lazy load Component nằm DƯỚI FOLD hoặc trong MODAL ẩn (User click mới mở)
// 3. Giữ các micro-components chung trong Main/Page chunk để tận dụng gzip nén tối đa.`,
      note: 'Nén Gzip/Brotli hoạt động tốt nhất trên các file 50KB-150KB. Nhiều file nhỏ xíu làm giảm tỷ lệ nén.',
      answerSummary: 'Cân bằng giữa kích thước tải ban đầu và chi phí Round-Trip Network Waterfall',
      answerDetail:
        'Dù HTTP/2 và HTTP/3 có Multiplexing, mỗi chunk JavaScript vẫn đòi hỏi chi phí giải nén, parse AST và compile riêng rẽ trong V8 Engine. Nếu tách quá nhiều chunk li ti, độ trễ mạng tích luỹ (Waterfall RTT) sẽ khiến thời gian chờ tải mã cao hơn gấp nhiều lần so với việc gộp chúng vào một bundle 60KB duy nhất đã được nén tối ưu.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 1. Header & Summary Hero */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="font-mono text-[11px] font-semibold text-[#CC6745] uppercase tracking-wider">
              Strong Mid Core Knowledge
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-950">
              Tree Shaking, Code Splitting & Lazy Loading
            </h1>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Hiệu năng First-Load JS
          </span>
        </div>

        <p className="text-[15px] sm:text-base text-zinc-700 leading-relaxed font-sans">
          Kiến trúc giảm kích thước gói mã nguồn (Bundle Size) quyết định trực tiếp tới <strong>Core Web Vitals (LCP, INP, TBT)</strong>.
          Làm chủ cơ chế phân tích tĩnh ES Modules (Static AST), cờ <code>sideEffects</code>, Dynamic Imports và kỹ thuật Lazy Loading hiện đại trong React 19 & Next.js.
        </p>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                1
              </span>
              <span className="text-[15px] font-bold text-emerald-950">
                Tree Shaking (DCE)
              </span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Loại bỏ dead-code không bao giờ được gọi dựa trên cấu trúc tĩnh của <code>import / export</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                2
              </span>
              <span className="text-[15px] font-bold text-sky-950">
                Code Splitting
              </span>
            </div>
            <p className="text-xs text-sky-900 leading-relaxed">
              Tách nhỏ bundle theo Route và Component nặng bằng <code>React.lazy</code> và <code>next/dynamic</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                3
              </span>
              <span className="text-[15px] font-bold text-amber-950">
                Resource Lazy Loading
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Trì hoãn tải ảnh dưới fold (<code>loading="lazy"</code>) và ưu tiên tài nguyên LCP (<code>fetchpriority="high"</code>).
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tab Navigation */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('tree-shaking')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'tree-shaking'
              ? 'bg-white text-zinc-950 font-bold shadow-xs border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
          }`}
        >
          <FolderTree className="w-4 h-4 text-[#CC6745]" />
          <span>1. Tree Shaking & Dead Code</span>
        </button>

        <button
          onClick={() => setActiveTab('lazy-loading')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'lazy-loading'
              ? 'bg-white text-zinc-950 font-bold shadow-xs border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
          }`}
        >
          <Zap className="w-4 h-4 text-sky-600" />
          <span>2. Code Splitting & Lazy Load</span>
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'traps'
              ? 'bg-white text-zinc-950 font-bold shadow-xs border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>3. Bẫy Phỏng Vấn & Đo Lường</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TREE SHAKING & DEAD CODE ELIMINATION                              */}
      {/* ========================================================================= */}
      {activeTab === 'tree-shaking' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Comparison Card: ESM vs CommonJS */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
            <h2 className="font-serif font-bold text-xl text-zinc-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CC6745]" />
              Bản chất ngầm: Tại sao ESM Tree Shake được còn CommonJS thì bó tay?
            </h2>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Khái niệm <strong>Tree Shaking</strong> xuất phát từ Rollup (sau đó được Webpack 5, Turbopack, esbuild kế thừa): coi toàn bộ ứng dụng như một cái cây xanh. 
              Các module là nhánh cây, và những hàm thực sự được sử dụng là lá xanh. Lắc cái cây (shake), những chiếc lá héo úa (dead code) sẽ rơi xuống đất và bị loại khỏi bundle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* CommonJS Box */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-800 uppercase">
                    CommonJS (require / module.exports)
                  </span>
                  <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-mono font-semibold">
                    Dynamic Binding ❌
                  </span>
                </div>
                <div className="font-mono text-xs bg-zinc-900 text-zinc-100 p-3 rounded-lg overflow-x-auto">
                  <span className="text-zinc-500">// Require có thể nằm trong if/else hoặc biến:</span><br />
                  <span className="text-purple-400">let</span> mod;<br />
                  <span className="text-purple-400">if</span> (Math.random() &gt; 0.5) &#123;<br />
                  &nbsp;&nbsp;mod = <span className="text-yellow-300">require</span>(<span className="text-emerald-400">&apos;./heavy-math&apos;</span>);<br />
                  &#125;<br />
                  <span className="text-zinc-500">// ➔ Bundler KHÔNG THỂ biết trước lúc runtime</span><br />
                  <span className="text-zinc-500">// nên bắt buộc phải gom toàn bộ file!</span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed">
                  Đánh giá tại <strong>Runtime</strong>. Đối tượng <code>module.exports</code> là một object thông thường có thể bị chỉnh sửa động, compiler không thể chắc chắn thuộc tính nào sẽ được gọi.
                </p>
              </div>

              {/* ES Modules Box */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-800 uppercase">
                    ES Modules (import / export)
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-semibold">
                    Static AST Analysis ✅
                  </span>
                </div>
                <div className="font-mono text-xs bg-zinc-900 text-zinc-100 p-3 rounded-lg overflow-x-auto">
                  <span className="text-zinc-500">// Bắt buộc nằm ở Top-level của file:</span><br />
                  <span className="text-purple-400">import</span> &#123; add &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;./heavy-math&apos;</span>;<br />
                  <br />
                  <span className="text-zinc-500">// Bundler duyệt cây AST:</span><br />
                  <span className="text-zinc-500">// &apos;add&apos; được dùng ➔ GIỮ LẠI</span><br />
                  <span className="text-zinc-500">// &apos;subtract&apos;, &apos;multiply&apos; không dùng ➔ XÓA BỎ!</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  Cấu trúc tĩnh (<strong>Static Structure</strong>). Trình biên dịch có thể phân tích Abstract Syntax Tree (AST) ngay trước khi chạy mã để lập danh sách export thừa và xoá bỏ.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Case Study: Lodash vs Lodash-es */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
            <h2 className="font-serif font-bold text-lg text-zinc-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              Thực chiến Bundle: Lodash vs Lodash-es & Subpath Exports
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 space-y-2">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>bundle-size-benchmark.ts</span>
                  <span className="text-[11px] text-amber-400">Kích thước gộp sau nén</span>
                </div>
                <pre className="text-xs font-mono leading-relaxed overflow-x-auto">
{`// ❌ BẪY 1: Nhập từ 'lodash' (CommonJS build)
import { debounce } from 'lodash'; 
// ➔ Đóng gói toàn bộ lodash (khoảng 72KB minified + gzip)!

// ⚠️ CÁCH 2: Cherry-pick file đơn lẻ (Khá tốt nhưng dài dòng)
import debounce from 'lodash/debounce'; 
// ➔ Chỉ tốn ~2.5KB.

// ✅ CHUẨN HIỆN ĐẠI: Dùng thư viện ESM native 'lodash-es'
import { debounce } from 'lodash-es'; 
// ➔ Rollup/Webpack Tree Shake tự động loại bỏ mọi hàm khác! (~2.4KB)`}
                </pre>
              </div>
            </div>
          </div>

          {/* Barrel Files Matrix */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
            <h2 className="font-serif font-bold text-lg text-zinc-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              Cơ chế "sideEffects": false & Hiểm hoạ Barrel Files
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-700 font-mono">
                    <th className="py-2.5 px-3">Cấu hình / Mô hình</th>
                    <th className="py-2.5 px-3">Hành vi của Bundler</th>
                    <th className="py-2.5 px-3">Rủi ro / Lợi ích</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr className="hover:bg-zinc-50/50">
                    <td className="py-3 px-3 font-mono font-semibold text-zinc-900">
                      Không khai báo sideEffects
                    </td>
                    <td className="py-3 px-3 text-zinc-600">
                      Bundler phải phân tích từng dòng code trong module xem có mutate global state (window, prototype) không.
                    </td>
                    <td className="py-3 px-3 text-amber-700 font-medium">
                      An toàn tuyệt đối nhưng Tree Shaking bị hạn chế nhiều export nghi vấn.
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50">
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-700">
                      &quot;sideEffects&quot;: false
                    </td>
                    <td className="py-3 px-3 text-zinc-600">
                      Báo bundler: &quot;Các file trong package này là Pure Modules. Cứ mạnh tay drop file nếu không ai dùng export!&quot;
                    </td>
                    <td className="py-3 px-3 text-emerald-800 font-medium">
                      Bundle siêu nhỏ gọn, loại bỏ 100% unused files.
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50">
                    <td className="py-3 px-3 font-mono font-semibold text-sky-700">
                      &quot;sideEffects&quot;: [&quot;*.css&quot;]
                    </td>
                    <td className="py-3 px-3 text-zinc-600">
                      Bảo vệ các file styles hoặc script chạy hiệu ứng ngầm không bị xóa nhầm.
                    </td>
                    <td className="py-3 px-3 text-sky-800 font-medium">
                      Tiêu chuẩn vàng khi xuất bản thư viện UI component.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CODE SPLITTING & LAZY LOADING                                     */}
      {/* ========================================================================= */}
      {activeTab === 'lazy-loading' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Level of Code Splitting */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
            <h2 className="font-serif font-bold text-xl text-zinc-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CC6745]" />
              Chiến lược phân tầng Code Splitting trong Next.js & React
            </h2>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Mục tiêu tối thượng của <strong>Code Splitting</strong> là: <em>Người dùng truy cập trang nào, chỉ tải đúng lượng JavaScript cần thiết để trang đó hiển thị và phản hồi tương tác</em>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Route-level splitting */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#FAF0EB] text-[#CC6745] font-mono font-bold text-xs flex items-center justify-center">
                    R
                  </span>
                  <h3 className="font-serif font-bold text-zinc-900 text-sm">
                    1. Route-level Splitting (Tự động)
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Trong Next.js App Router, mỗi thư mục route với <code>page.tsx</code> tự động được đóng gói thành một JS chunk độc lập.
                  Người dùng ở trang <code>/home</code> sẽ không phải tải dù chỉ 1 byte mã của trang <code>/admin-dashboard</code>.
                </p>
              </div>

              {/* Component-level splitting */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#FAF0EB] text-[#CC6745] font-mono font-bold text-xs flex items-center justify-center">
                    C
                  </span>
                  <h3 className="font-serif font-bold text-zinc-900 text-sm">
                    2. Component-level Lazy Loading
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Dành cho các component nặng (Biểu đồ D3/Chart.js, Trình soạn thảo văn bản Rich-Text, Modal PDF Viewer).
                  Chỉ tải khi người dùng cuộn tới hoặc click nút kích hoạt.
                </p>
              </div>
            </div>
          </div>

          {/* React.lazy vs next/dynamic Code Sandbox */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
            <h2 className="font-serif font-bold text-lg text-zinc-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              So sánh React.lazy() vs next/dynamic()
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* React.lazy */}
              <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 space-y-2 overflow-x-auto">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>React.lazy + Suspense</span>
                  <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-sky-300">Client SPA</span>
                </div>
                <pre className="text-xs font-mono leading-relaxed">
{`import React, { lazy, Suspense } from 'react';

// Tạo dynamic import chunk
const HeavyChart = lazy(() => 
  import('./HeavyChart')
);

export function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={analytics} />
    </Suspense>
  );
}`}
                </pre>
              </div>

              {/* next/dynamic */}
              <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 space-y-2 overflow-x-auto">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>next/dynamic</span>
                  <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-300">Next.js SSR/RSC</span>
                </div>
                <pre className="text-xs font-mono leading-relaxed">
{`import dynamic from 'next/dynamic';

// Tắt SSR nếu thư viện truy cập window/document
const MapView = dynamic(
  () => import('./MapView'),
  { 
    ssr: false,
    loading: () => <MapLoadingSkeleton /> 
  }
);

export function StoreLocator() {
  return <MapView center={[21.0285, 105.8542]} />;
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Asset & Image Lazy Loading */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
            <h2 className="font-serif font-bold text-lg text-zinc-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Tối ưu tài nguyên hình ảnh: loading=&quot;lazy&quot; vs fetchpriority=&quot;high&quot;
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-700">
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
                <div className="flex items-center justify-between font-mono font-semibold">
                  <span className="text-emerald-800">1. Hero Banner (Phần tử ứng viên LCP)</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">KHÔNG ĐƯỢC lazy load!</span>
                </div>
                <div className="font-mono text-xs bg-zinc-900 text-zinc-100 p-2.5 rounded-lg">
                  &lt;Image src=&quot;/hero.webp&quot; priority={true} fetchPriority=&quot;high&quot; alt=&quot;Banner&quot; /&gt;
                </div>
                <p className="text-xs text-zinc-600">
                  Ảnh nằm trong khung nhìn đầu tiên (Above the fold) bắt buộc phải tải ngay lập tức với cờ ưu tiên mạng cao nhất để đạt LCP &le; 2.5s.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
                <div className="flex items-center justify-between font-mono font-semibold">
                  <span className="text-sky-800">2. Ảnh dưới trang (Below the fold)</span>
                  <span className="text-sky-700 bg-sky-100 px-2 py-0.5 rounded text-[11px]">BẮT BUỘC lazy load</span>
                </div>
                <div className="font-mono text-xs bg-zinc-900 text-zinc-100 p-2.5 rounded-lg">
                  &lt;img src=&quot;/footer-partner.png&quot; loading=&quot;lazy&quot; decoding=&quot;async&quot; /&gt;
                </div>
                <p className="text-xs text-zinc-600">
                  Trình duyệt sẽ tự động tính toán khoảng cách cuộn (khoảng 1250px trước khi phần tử lọt vào viewport) mới phát lệnh fetch ảnh qua mạng.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTERVIEW TRAPS & BUNDLE MEASUREMENT                              */}
      {/* ========================================================================= */}
      {activeTab === 'traps' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Analysis Tools Guidance */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 space-y-3 shadow-2xs">
            <h2 className="font-serif font-bold text-xl text-zinc-950 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[#CC6745]" />
              Quy trình phân tích & đo lường Bundle chuẩn kỹ sư
            </h2>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Không thể tối ưu hoá những gì bạn không đo lường được. Hãy luôn chạy <strong>@next/bundle-analyzer</strong> trước và sau mỗi PR:
            </p>

            <div className="font-mono text-xs bg-zinc-900 text-zinc-100 p-3.5 rounded-xl space-y-1.5 overflow-x-auto">
              <span className="text-zinc-500"># 1. Cài đặt package chính thức của Vercel</span><br />
              <span className="text-emerald-400">pnpm</span> add -D @next/bundle-analyzer<br />
              <br />
              <span className="text-zinc-500"># 2. Chạy phân tích bundle production</span><br />
              <span className="text-amber-400">ANALYZE=true</span> <span className="text-emerald-400">pnpm</span> build<br />
              <span className="text-zinc-500"># Trình duyệt tự mở 2 tab trực quan hoá sơ đồ Treemap (Client vs Server Chunks)</span>
            </div>
          </div>

          {/* 3 Collapsible Interview Traps */}
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-lg text-zinc-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              3 Bẫy Phỏng Vấn Tuyển Dụng Về Tối Ưu Bundle (Interactive Traps)
            </h2>

            {questions.map((q) => {
              const isOpen = showAnswer[q.id] || false;
              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-2xs transition-all"
                >
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        {q.badge}
                      </span>
                      <span className="font-mono text-xs text-zinc-600">Câu hỏi {q.id + 1} / 3</span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-zinc-950">
                      {q.title}
                    </h3>

                    {/* Pipeline visual diagram */}
                    <div className="flex flex-wrap items-center gap-1.5 py-1 text-xs">
                      {q.pipeline.map((step, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <span className={`px-2.5 py-1 rounded-md font-medium ${step.bg}`}>
                            {step.label}
                          </span>
                          {sIdx < q.pipeline.length - 1 && (
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Mac Terminal Code Viewer */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-sm">
                      <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                          <span className="ml-2">trap-demo.tsx</span>
                        </div>
                        <button
                          onClick={() => handleCopy(`q-${q.id}`, q.code)}
                          className="hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === `q-${q.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3.5 text-xs font-mono leading-relaxed overflow-x-auto text-zinc-200">
                        {q.code}
                      </pre>
                    </div>

                    <p className="text-xs text-zinc-600 italic">
                      💡 {q.note}
                    </p>

                    {/* Toggle Answer Button */}
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 font-semibold text-xs sm:text-sm text-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isOpen ? (
                        <>
                          <EyeOff className="w-4 h-4 text-zinc-500" />
                          <span>Thu gọn câu trả lời Senior</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-[#CC6745]" />
                          <span className="text-[#CC6745]">Xem lời giải & Tư duy phỏng vấn Senior</span>
                        </>
                      )}
                    </button>

                    {/* Answer Reveal Panel */}
                    {isOpen && (
                      <div className="mt-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2 animate-in fade-in">
                        <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{q.answerSummary}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                          {q.answerDetail}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
