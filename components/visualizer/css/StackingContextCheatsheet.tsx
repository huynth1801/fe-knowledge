'use client';

import React, { useState } from 'react';
import { Layers, Box, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function StackingContextCheatsheet() {
  const [activeTab, setActiveTab] = useState<'levels' | 'triggers' | 'traps'>('traps');

  // Answers toggle state for Tab 3 (Quiz questions)
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  return (
    <div className="space-y-7 animate-in fade-in max-w-5xl">
      {/* 1. Tóm tắt ngay đầu trang */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <p className="text-[17px] leading-relaxed text-[var(--foreground)] font-medium">
          <strong>Quy tắc cốt lõi của Stacking Context:</strong> Giá trị <code>z-index</code> chỉ có ý nghĩa tương đối <strong>bên trong cùng một Ngữ cảnh Phân tầng</strong>. Nếu cha có Stacking Context thấp hơn, con có đặt <code>z-index: 999999</code> vẫn vĩnh viễn nằm dưới!
        </p>

        {/* 3 khối đánh số nhất quán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Khối 1: Tầng cha quyết định (Xanh dương) */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                1
              </span>
              <span className="text-[16px] font-bold text-blue-900">
                Tầng cha tối thượng
              </span>
            </div>
            <p className="text-[15px] text-blue-800 leading-snug">
              Trình duyệt so sánh thứ bậc của 2 Stacking Context cha trước. Cha nào cao hơn thì toàn bộ con cháu thắng.
            </p>
          </div>

          {/* Khối 2: Trigger ngầm (Vàng hổ phách) */}
          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                2
              </span>
              <span className="text-[16px] font-bold text-amber-950">
                Kích hoạt ngầm (Triggers)
              </span>
            </div>
            <p className="text-[15px] text-amber-900 leading-snug">
              Không chỉ <code>position</code>! Các thuộc tính <code>opacity &lt; 1</code>, <code>transform</code>, <code>filter</code> đều tự tạo Stacking Context.
            </p>
          </div>

          {/* Khối 3: Giải pháp Portal (Xanh lá) */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                3
              </span>
              <span className="text-[16px] font-bold text-emerald-950">
                Giải pháp React Portal
              </span>
            </div>
            <p className="text-[15px] text-emerald-900 leading-snug">
              Đưa Modal/Tooltip ra khỏi cây DOM lồng nhau bằng <code>createPortal(..., document.body)</code> để thoát khỏi cha.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Clean Underline Tabs */}
      <div className="flex items-center border-b border-[var(--border)] gap-8">
        <button
          onClick={() => setActiveTab('levels')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'levels'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          7 Tầng phân lớp chuẩn W3C
        </button>

        <button
          onClick={() => setActiveTab('triggers')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'triggers'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Thuộc tính kích hoạt ngầm
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'traps'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Câu hỏi bẫy phỏng vấn
        </button>
      </div>

      {/* 3. TAB 1: 7 TẦNG PHÂN LỚP */}
      {activeTab === 'levels' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Thứ tự vẽ 7 tầng trong một Stacking Context (Từ dưới lên trên)
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Bên trong cùng một Ngữ cảnh Phân tầng, trình duyệt vẽ các phần tử theo đúng thứ tự nghiêm ngặt từ xa nhất đến gần mắt người dùng nhất:
            </p>

            <div className="space-y-2 font-mono text-[14px]">
              <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-800">
                <strong>Tầng 1 (Đáy cùng):</strong> Background và Borders của phần tử tạo ngữ cảnh.
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
                <strong>Tầng 2:</strong> Các phần tử định vị (positioned) có <code>z-index âm</code> (ví dụ: <code>z-index: -1</code>).
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-800">
                <strong>Tầng 3:</strong> Các phần tử khối không định vị thông thường (Block-level elements: <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>).
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-800">
                <strong>Tầng 4:</strong> Các phần tử nổi (Non-positioned floats: <code>float: left/right</code>).
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-800">
                <strong>Tầng 5:</strong> Các phần tử nội dòng (Inline elements: <code>&lt;span&gt;</code>, text).
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                <strong>Tầng 6:</strong> Các phần tử định vị có <code>z-index: auto</code> hoặc <code>z-index: 0</code>.
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold">
                <strong>Tầng 7 (Đỉnh cao nhất):</strong> Các phần tử định vị có <code>z-index dương</code> (1, 2, 9999).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: CÁC THUỘC TÍNH KÍCH HOẠT */}
      {activeTab === 'triggers' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Danh sách thuộc tính CSS kích hoạt Stacking Context ngầm
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[15px]">
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-subtle)] space-y-1">
                <div className="font-mono font-bold text-indigo-900">1. opacity &lt; 1</div>
                <p className="text-[14px] text-[var(--muted)]">
                  Bắt buộc GPU tạo layer đệm để thực hiện thuật toán hòa trộn độ trong suốt (Alpha Compositing).
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-subtle)] space-y-1">
                <div className="font-mono font-bold text-indigo-900">2. transform (khác none)</div>
                <p className="text-[14px] text-[var(--muted)]">
                  Kể cả <code>transform: scale(1)</code> hay <code>translateZ(0)</code> cũng tạo ra Stacking Context mới.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-subtle)] space-y-1">
                <div className="font-mono font-bold text-indigo-900">3. filter (khác none)</div>
                <p className="text-[14px] text-[var(--muted)]">
                  <code>filter: blur(0px)</code> hay <code>contrast(1)</code> tạo ngữ cảnh đồ họa GPU riêng.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-subtle)] space-y-1">
                <div className="font-mono font-bold text-emerald-900 font-bold">4. isolation: isolate</div>
                <p className="text-[14px] text-[var(--muted)]">
                  Thuộc tính chuẩn mực của CSS hiện đại giúp lập trình viên chủ động tạo Stacking Context an toàn mà không cần hack!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: CÂU HỎI BẪY PHỎNG VẤN */}
      {activeTab === 'traps' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Câu hỏi bẫy phỏng vấn Stacking Context
            </h3>
            <p className="text-[17px] text-[var(--muted)] mt-1">
              Hiểu cặn kẽ cơ chế dựng hình đồ họa để giải quyết dứt điểm các lỗi giao diện z-index.
            </p>
          </div>

          {/* Bẫy 1: isolation: isolate */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              1. Tại sao thuộc tính `isolation: isolate` được coi là vũ khí tối thượng cho Design System?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer1((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer1 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer1 ? 'Đã hiển thị phân tích' : 'Cách cách ly z-index không tác dụng phụ'}
              </span>
            </div>

            {showAnswer1 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Đáp án:</strong>
                </p>
                <p>
                  Trước đây, để tạo Stacking Context cô lập cho một Component (tránh z-index bên trong làm rò rỉ ra ngoài trang), lập trình viên phải &quot;hack&quot; bằng <code>position: relative; z-index: 0;</code> hoặc <code>opacity: 0.999</code>. Các cách này có tác dụng phụ (làm đổi tọa độ hoặc tốn GPU).
                </p>
                <p>
                  <code>isolation: isolate</code> được W3C sinh ra dành riêng cho việc này: Nó tạo ngay một Stacking Context mới tinh, giữ mọi z-index bên trong component không bao giờ lọt ra ngoài, mà <strong>hoàn toàn không có bất kỳ tác dụng phụ nào</strong> lên layout hay độ trong suốt!
                </p>
              </div>
            )}
          </div>

          {/* Bẫy 2: z-index: 0 vs z-index: auto */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              2. Với phần tử có `position: relative`, `z-index: 0` khác gì `z-index: auto`?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer2((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer2 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer2 ? 'Đã hiển thị phân tích' : 'Một bên tạo Stacking Context, một bên không!'}
              </span>
            </div>

            {showAnswer2 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Sự khác biệt mang tính quyết định:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <code>z-index: auto</code> (Mặc định): Phần tử <strong>KHÔNG</strong> tạo ra Stacking Context mới. Các phần tử con bên trong nó vẫn có thể tự do so sánh z-index với phần tử bên ngoài!
                  </li>
                  <li>
                    <code>z-index: 0</code> (Hoặc bất kỳ số nào khác): Phần tử <strong>CHÍNH THỨC TẠO RA một Stacking Context mới</strong>. Toàn bộ con cháu bên trong nó bị giam giữ lại ở tầng phân lớp đó!
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 3: React Portal */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              3. Tại sao Modal trong các Component Library lớn (Radix, HeadlessUI) bắt buộc dùng ReactDOM.createPortal?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer3((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer3 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer3 ? 'Đã hiển thị phân tích' : 'Thoát khỏi overflow: hidden và Stacking Context cha'}
              </span>
            </div>

            {showAnswer3 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Giải pháp triệt để:</strong>
                </p>
                <p>
                  Nếu một Modal được render lồng sâu trong một thẻ <code>&lt;div&gt;</code> có <code>overflow: hidden</code>, hoặc có cha bị áp <code>transform</code> / <code>z-index</code> thấp, Modal đó sẽ bị cắt cụt hoặc bị che lấp.
                </p>
                <p>
                  <code>ReactDOM.createPortal(modalContent, document.body)</code> di chuyển cây DOM thật của Modal ra cắm thẳng vào thẻ <code>&lt;body&gt;</code> (thuộc Root Stacking Context cao nhất), trong khi vẫn giữ nguyên luồng React Events và Context cho component!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
