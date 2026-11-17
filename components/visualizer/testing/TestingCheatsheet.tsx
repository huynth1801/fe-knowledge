'use client';

import React, { useState } from 'react';
import { CheckSquare, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function TestingCheatsheet() {
  const [activeTab, setActiveTab] = useState<'testing-trophy' | 'playwright-actionability' | 'traps'>('traps');

  // Answers toggle state for Tab 3 (Quiz questions)
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  return (
    <div className="space-y-7 animate-in fade-in max-w-5xl">
      {/* 1. Tóm tắt ngay đầu trang */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <p className="text-[17px] leading-relaxed text-[var(--foreground)] font-medium">
          <strong>Chiến lược Kiểm thử Toàn diện cho Senior FE:</strong> Kết hợp <strong>Component Testing</strong> (Storybook / React Testing Library) + <strong>Visual Regression</strong> (Pixelmatch) + <strong>Playwright E2E</strong> (Auto-waiting) để tự tin ship code lên Production.
        </p>

        {/* 3 khối đánh số nhất quán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Khối 1: Visual Regression */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                1
              </span>
              <span className="text-[16px] font-bold text-blue-900">
                Visual Regression
              </span>
            </div>
            <p className="text-[15px] text-blue-800 leading-snug">
              So sánh từng điểm ảnh (Pixel-by-pixel). Bắt lỗi vỡ layout 1px, sai màu token hay lệch padding mà unit test bỏ qua.
            </p>
          </div>

          {/* Khối 2: Testing Trophy */}
          <div className="p-3.5 rounded-xl border border-violet-300 bg-violet-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                2
              </span>
              <span className="text-[16px] font-bold text-violet-950">
                Testing Trophy
              </span>
            </div>
            <p className="text-[15px] text-violet-900 leading-snug">
              Tập trung nguồn lực vào Integration/Component Testing: Test hành vi người dùng thay vì test chi tiết implementation.
            </p>
          </div>

          {/* Khối 3: Playwright E2E */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                3
              </span>
              <span className="text-[16px] font-bold text-emerald-950">
                Playwright Auto-waiting
              </span>
            </div>
            <p className="text-[15px] text-emerald-900 leading-snug">
              6 Tiêu chuẩn Actionability ngầm: Tự động đợi animation dừng và phần tử che lấp đóng. Xóa sổ 100% Flaky Tests!
            </p>
          </div>
        </div>
      </div>

      {/* 2. Clean Underline Tabs */}
      <div className="flex items-center border-b border-[var(--border)] gap-8">
        <button
          onClick={() => setActiveTab('testing-trophy')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'testing-trophy'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Mô hình Testing Trophy
        </button>

        <button
          onClick={() => setActiveTab('playwright-actionability')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'playwright-actionability'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Playwright Actionability Checks
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

      {/* 3. TAB 1: TESTING TROPHY */}
      {activeTab === 'testing-trophy' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Tại sao Testing Trophy (Cúp Kiểm Thử) thay thế Testing Pyramid cổ điển?
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Mô hình Kim tự tháp cũ đặt trọng tâm vào hàng nghìn Unit Tests nhỏ lẻ (test từng hàm helper, từng getter/setter). Kết quả: Unit Test 100% pass nhưng ghép các components lại với nhau thì toàn bộ luồng thanh toán bị lỗi!
            </p>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              <strong>Testing Trophy (Đề xuất bởi Kent C. Dodds):</strong>
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-[16px]">
              <li><strong>Static (TypeScript, ESLint):</strong> Bắt lỗi cú pháp và type an toàn ngay khi gõ phím.</li>
              <li><strong>Unit:</strong> Kiểm tra các hàm tính toán phức tạp (tính thuế, format tiền tệ).</li>
              <li><strong>Integration / Component (TRỌNG TÂM LỚN NHẤT):</strong> Render component với React Testing Library / Storybook, giả lập click người dùng và kiểm tra giao diện phản hồi.</li>
              <li><strong>E2E (Playwright):</strong> Chạy một số ít luồng quan trọng nhất (Đăng nhập, Mua hàng &amp; Thanh toán Stripe).</li>
            </ol>
          </div>
        </div>
      )}

      {/* 4. TAB 2: PLAYWRIGHT ACTIONABILITY */}
      {activeTab === 'playwright-actionability' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              6 Tiêu chuẩn Actionability của Playwright
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Trước khi Playwright thực hiện thao tác (như <code>page.click()</code> hay <code>page.fill()</code>), nó kiểm tra toàn bộ 6 điều kiện sau:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[14px]">
              <div className="p-3 rounded-xl bg-zinc-100 text-zinc-800">
                <strong>1. Attached:</strong> Element phải nằm trong cây DOM.
              </div>
              <div className="p-3 rounded-xl bg-zinc-100 text-zinc-800">
                <strong>2. Visible:</strong> Không có <code>display: none</code>, <code>visibility: hidden</code> hay kích thước 0x0.
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                <strong>3. Stable:</strong> Toạ độ bounding box không thay đổi qua 2 frames liên tiếp (hết animation).
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                <strong>4. Receives Events:</strong> Tọa độ click không bị che bởi Modal, Popover hay Backdrop.
              </div>
              <div className="p-3 rounded-xl bg-zinc-100 text-zinc-800">
                <strong>5. Enabled:</strong> Phần tử không có thuộc tính <code>disabled</code>.
              </div>
              <div className="p-3 rounded-xl bg-zinc-100 text-zinc-800">
                <strong>6. Editable:</strong> Cho phép gõ chữ (dành cho input/textarea không có readonly).
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
              Câu hỏi bẫy phỏng vấn Testing &amp; Visual QA
            </h3>
            <p className="text-[17px] text-[var(--muted)] mt-1">
              Khảo sát kỹ năng xây dựng CI/CD testing pipeline vững chắc cho các dự án lớn.
            </p>
          </div>

          {/* Bẫy 1: Flaky Tests */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              1. Flaky Test (Test lúc chạy pass lúc fail trên GitHub Actions) bắt nguồn từ đâu và bạn giải quyết dứt điểm thế nào?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer1((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer1 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer1 ? 'Đã hiển thị phân tích' : 'Loại bỏ hardcoded sleep và dùng network idle / locators'}
              </span>
            </div>

            {showAnswer1 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Nguyên nhân &amp; Cách giải quyết:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Nguyên nhân số 1: Dùng `sleep(2000)` cứng:</strong> Trên máy lập trình viên máy mạnh mất 500ms, nhưng trên GitHub Actions runner tài nguyên yếu mất 2500ms ➔ Test fail ngẫu nhiên!
                  </li>
                  <li>
                    <strong>Cách giải quyết:</strong> Tuyệt đối không dùng sleep. Sử dụng cơ chế <strong>Web-first Assertions</strong> của Playwright: <code>await expect(locator).toBeVisible()</code> (tự động polling với timeout 5s) và đợi network cụ thể: <code>await page.waitForResponse(&apos;/api/checkout&apos;)</code>.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 2: Visual Regression Font & Anti-aliasing */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              2. Tại sao ảnh chụp snapshot trên máy Mac lại luôn bị báo sai lệch pixel so với snapshot chạy trên Linux CI, và cách chuẩn hóa là gì?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer2((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer2 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer2 ? 'Đã hiển thị phân tích' : 'Khử răng cưa Font Sub-pixel & Docker Containerization'}
              </span>
            </div>

            {showAnswer2 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Nguyên nhân:</strong>
                </p>
                <p>
                  Hệ điều hành macOS (dùng Apple Core Text) và Linux (dùng FreeType) có thuật toán khử răng cưa chữ (Font Anti-aliasing &amp; Subpixel Rendering) khác nhau. Cùng 1 chữ, các pixel biên độ mờ sẽ lệch nhau vài phần trăm!
                </p>
                <p>
                  <strong>Giải pháp công nghiệp:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Chạy toàn bộ Visual Regression test bên trong một <strong>Docker Container cố định</strong> (như <code>mcr.microsoft.com/playwright:v1.x</code>) kể cả khi test ở máy local và trên GitHub Actions CI.</li>
                  <li>Sử dụng các dịch vụ Cloud chuyên dụng như <strong>Chromatic (từ đội ngũ Storybook)</strong> hoặc <strong>Percy</strong> để đồng nhất môi trường render.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 3: Testing Implementation Details */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              3. &quot;Đừng kiểm tra chi tiết cài đặt (Implementation Details)&quot; có nghĩa là gì trong React Testing Library?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer3((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer3 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer3 ? 'Đã hiển thị phân tích' : 'getByRole vs wrapper.state() của Enzyme cũ'}
              </span>
            </div>

            {showAnswer3 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Triết lý của React Testing Library:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Sai lầm (Implementation Details):</strong> Soi vào state nội bộ của component như <code>expect(wrapper.state(&apos;count&apos;)).toBe(1)</code> hay tìm class CSS nội bộ <code>.btn-submit-internal</code>. Khi lập trình viên refactor từ <code>useState</code> sang <code>useReducer</code>, test bị gãy dù tính năng vẫn hoạt động hoàn hảo cho người dùng!
                  </li>
                  <li>
                    <strong>Đúng (User-centric):</strong> Tìm phần tử theo cách người dùng hoặc máy đọc màn hình tiếp cận: <code>screen.getByRole(&apos;button&apos;, &#123; name: /xác nhận/i &#125;)</code> và kiểm tra kết quả hiển thị trên màn hình: <code>expect(screen.getByText(&apos;Thành công&apos;)).toBeInTheDocument()</code>.
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
