'use client';

import React, { useState } from 'react';
import { Palette, Layers, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function DesignTokensCheatsheet() {
  const [activeTab, setActiveTab] = useState<'tokens-arch' | 'compound-storybook' | 'traps'>('traps');

  // Answers toggle state for Tab 3 (Quiz questions)
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  return (
    <div className="space-y-7 animate-in fade-in max-w-5xl">
      {/* 1. Tóm tắt ngay đầu trang */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <p className="text-[17px] leading-relaxed text-[var(--foreground)] font-medium">
          <strong>Bản chất của Design System hiện đại:</strong> Tách rời <strong>Giá trị thô (Global Tokens)</strong> khỏi <strong>Mục đích sử dụng (Semantic Tokens)</strong> và xây dựng các thành phần có tính tương thích cao (<strong>Compound Components</strong>) qua Storybook.
        </p>

        {/* 3 khối đánh số nhất quán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Khối 1: Global Tokens */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                1
              </span>
              <span className="text-[16px] font-bold text-blue-900">
                Global (Primitive) Tokens
              </span>
            </div>
            <p className="text-[15px] text-blue-800 leading-snug">
              Bảng màu thô của thương hiệu (<code>blue-500: #3B82F6</code>, <code>space-4: 16px</code>). Không gắn với ngữ cảnh.
            </p>
          </div>

          {/* Khối 2: Semantic Tokens */}
          <div className="p-3.5 rounded-xl border border-pink-300 bg-pink-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                2
              </span>
              <span className="text-[16px] font-bold text-pink-950">
                Semantic Tokens (Ngữ nghĩa)
              </span>
            </div>
            <p className="text-[15px] text-pink-900 leading-snug">
              Đặt tên theo chức năng (<code>action.primary</code>, <code>surface.card</code>). Nơi quyết định giao diện Dark / Light.
            </p>
          </div>

          {/* Khối 3: Component Scoped */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                3
              </span>
              <span className="text-[16px] font-bold text-emerald-950">
                Component Tokens &amp; Storybook
              </span>
            </div>
            <p className="text-[15px] text-emerald-900 leading-snug">
              Gán vào từng component cụ thể (<code>--btn-bg</code>). Test trạng thái độc lập trên Storybook isolation canvas.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Clean Underline Tabs */}
      <div className="flex items-center border-b border-[var(--border)] gap-8">
        <button
          onClick={() => setActiveTab('tokens-arch')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'tokens-arch'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Kiến trúc 3 Tầng Tokens
        </button>

        <button
          onClick={() => setActiveTab('compound-storybook')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'compound-storybook'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Compound Components &amp; Storybook
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

      {/* 3. TAB 1: KIẾN TRÚC 3 TẦNG TOKENS */}
      {activeTab === 'tokens-arch' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Tại sao kiến trúc 3 tầng giải quyết triệt để bài toán Đổi Theme &amp; Rebrand?
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Nếu lập trình viên viết trực tiếp <code>className=&quot;bg-blue-600&quot;</code> vào từng nút bấm:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-[16px] text-rose-800">
              <li>Khi công ty đổi màu thương hiệu từ Xanh dương sang Tím ➔ Phải tìm và thay thế hàng nghìn file code, rất dễ sót bug.</li>
              <li>Khi làm Dark Mode ➔ Phải viết đè <code>dark:bg-blue-500</code> ở mọi thẻ con lặp đi lặp lại.</li>
            </ul>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Với kiến trúc 3 tầng (Global ➔ Semantic ➔ Component), component chỉ đọc <code>var(--color-action-primary)</code>. Khi đổi sang Dark Mode hay Rebrand, bạn chỉ cần hoán đổi định nghĩa của Semantic Token đúng <strong>1 lần duy nhất</strong> tại file gốc!
            </p>
          </div>
        </div>
      )}

      {/* 4. TAB 2: COMPOUND COMPONENTS & STORYBOOK */}
      {activeTab === 'compound-storybook' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Compound Components Pattern: Tránh thảm họa &quot;40 props&quot;
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Khi làm một component Dropdown hoặc Accordion, nếu bạn gom hết vào 1 thẻ với hàng chục props:
              <br />
              <code>&lt;Select options=&#123;items&#125; renderItem=&#123;...&#125; iconPosition=&quot;left&quot; hasSearch=&#123;true&#125; renderSearch=&#123;...&#125; /&gt;</code>
              <br />
              Code sẽ trở nên rối rắm và không thể tùy biến layout linh hoạt.
            </p>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              <strong>Compound Pattern</strong> (giống như thẻ <code>&lt;select&gt;</code> và <code>&lt;option&gt;</code> của HTML):
              <br />
              Cha <code>&lt;Select&gt;</code> nắm giữ Context ngầm. Các con <code>&lt;Select.Trigger&gt;</code>, <code>&lt;Select.Content&gt;</code>, <code>&lt;Select.Option&gt;</code> giao tiếp qua Context. Người dùng tự do chèn Icon, Header, Divider ở bất kỳ vị trí nào họ muốn!
            </p>
          </div>
        </div>
      )}

      {/* 5. TAB 3: CÂU HỎI BẪY PHỎNG VẤN */}
      {activeTab === 'traps' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Câu hỏi bẫy phỏng vấn Design Systems &amp; Component Library
            </h3>
            <p className="text-[17px] text-[var(--muted)] mt-1">
              Khảo sát năng lực thiết kế kiến trúc UI quy mô lớn cho Senior / Design System Lead.
            </p>
          </div>

          {/* Bẫy 1: Quản lý Token Conflict */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              1. Khi Designer yêu cầu thêm một màu mới &quot;vừa giống warning vừa giống error&quot;, bạn xử lý thế nào để không làm vỡ hệ thống Design Tokens?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer1((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer1 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer1 ? 'Đã hiển thị phân tích' : 'Quy trình kiểm soát rò rỉ token (Token Bloat)'}
              </span>
            </div>

            {showAnswer1 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Cách xử lý chuẩn mực của Senior:</strong>
                </p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>
                    <strong>Không vội vàng tạo token mới ngay:</strong> Phỏng vấn Designer để hiểu mục đích sử dụng thực tế (Intent / Use case). Liệu nó có thay thế hoàn toàn cho trạng thái <code>warning</code> hay chỉ là một trường hợp cá biệt (One-off exception)?
                  </li>
                  <li>
                    Nếu thực sự cần thiết: Bổ sung vào tầng Global trước (ví dụ <code>amber-orange-500</code>), sau đó định nghĩa Semantic Token rõ ràng (ví dụ <code>color.status.critical-warning</code>).
                  </li>
                  <li>
                    Đồng bộ hóa 2 chiều qua công cụ Figma Tokens Studio / Style Dictionary xuất ra JSON và tự động build ra CSS variables trên Git repository.
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Bẫy 2: Controlled vs Uncontrolled trong Design System */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              2. Làm thế nào để một component trong Component Library hỗ trợ song song cả 2 chế độ: Controlled (truyền prop `value`) và Uncontrolled (truyền `defaultValue`)?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer2((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer2 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer2 ? 'Đã hiển thị phân tích' : 'Custom hook useControllableState'}
              </span>
            </div>

            {showAnswer2 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Giải pháp kiến trúc:</strong>
                </p>
                <p>
                  Sử dụng pattern <code>useControllableState</code> (giống Radix UI):
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Nếu <code>props.value !== undefined</code> ➔ Xem như Controlled: Lấy giá trị trực tiếp từ prop và gọi <code>onChange</code> khi tương tác.</li>
                  <li>Nếu <code>props.value === undefined</code> ➔ Xem như Uncontrolled: Khởi tạo một <code>useState(defaultValue)</code> nội bộ để tự quản lý state.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 3: Accessibility WCAG trong Storybook */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              3. Trong Storybook pipeline, bạn làm thế nào để tự động bắt lỗi tương phản màu (Contrast Ratio) và thiếu ARIA attributes trước khi code lên Production?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer3((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer3 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer3 ? 'Đã hiển thị phân tích' : 'storybook-addon-a11y và axe-core CI runner'}
              </span>
            </div>

            {showAnswer3 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Bộ công cụ chuẩn công nghiệp:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Cài đặt <code>@storybook/addon-a11y</code>: Tích hợp thư viện <strong>axe-core</strong> của Deque Labs quét trực tiếp cây DOM của từng Story.
                  </li>
                  <li>
                    Tự động kiểm tra độ tương phản màu chữ so với nền (tối thiểu 4.5:1 cho text thường theo chuẩn WCAG AA).
                  </li>
                  <li>
                    Chạy trong GitHub Actions CI qua <code>test-storybook</code>: Nếu có component thiếu <code>aria-label</code> hoặc bấm phím Tab không focus được, PR sẽ tự động bị chặn merge!
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
