'use client';

import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export function TaskCheatsheet() {
  const [activeTab, setActiveTab] = useState<'apis' | 'lifecycle' | 'traps'>('traps');

  // Answers toggle state for Tab 3 (Quiz questions)
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  return (
    <div className="space-y-7 animate-in fade-in max-w-5xl">
      {/* 1. Tóm tắt ngay đầu trang: 1 câu + 3 bước (Macrotask, Microtask, Render) đánh số dùng đúng 3 màu */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <p className="text-[17px] leading-relaxed text-[var(--foreground)] font-medium">
          <strong>Quy tắc cốt lõi:</strong> Trình duyệt chạy xong 1 Macrotask ➔ dọn sạch toàn bộ Microtasks ➔ kiểm tra chu kỳ vẽ lại (Render) ➔ lặp lại liên tục.
        </p>

        {/* 3 bước đánh số với đúng 3 màu nhất quán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Bước 1: Macrotask (Xanh dương) */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                1
              </span>
              <span className="text-[16px] font-bold text-blue-900">
                Macrotask
              </span>
            </div>
            <p className="text-[15px] text-blue-800 leading-snug">
              Chạy đúng <strong>1 tác vụ</strong> (<code>setTimeout</code>, I/O, sự kiện click) rồi chuyển tiếp ngay.
            </p>
          </div>

          {/* Bước 2: Microtask (Vàng hổ phách) */}
          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                2
              </span>
              <span className="text-[16px] font-bold text-amber-950">
                Microtask (VIP)
              </span>
            </div>
            <p className="text-[15px] text-amber-900 leading-snug">
              Dọn sạch <strong>100%</strong> hàng đợi (<code>Promise</code>, <code>await</code>). Microtask mới sinh ra chạy tiếp luôn.
            </p>
          </div>

          {/* Bước 3: Render (Xanh lá) */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                3
              </span>
              <span className="text-[16px] font-bold text-emerald-950">
                Render
              </span>
            </div>
            <p className="text-[15px] text-emerald-900 leading-snug">
              Nếu tới chu kỳ ~16.6ms: Chạy <code>rAF</code> ➔ tính toán Layout ➔ vẽ điểm ảnh lên màn hình.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Clean Underline Tabs */}
      <div className="flex items-center border-b border-[var(--border)] gap-8">
        <button
          onClick={() => setActiveTab('apis')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'apis'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Phân loại API
        </button>

        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'lifecycle'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Chu kỳ 4 bước
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'traps'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Câu hỏi bẫy
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PHÂN LOẠI API (Clean list style, no pills, bold code + muted note) */}
      {/* ========================================================================= */}
      {activeTab === 'apis' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Nhóm 1: Microtasks (Vàng hổ phách) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-600" />
              <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">
                Microtask (Hàng đợi ưu tiên VIP)
              </h3>
              <span className="text-[15px] text-[var(--muted)] ml-2">
                — Luôn được dọn sạch hoàn toàn trước khi render
              </span>
            </div>

            <div className="space-y-2.5 pt-1 pl-5 border-l-2 border-amber-200">
              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-amber-700 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200">
                  Promise.prototype.then() / catch() / finally()
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Callback xử lý kết quả khi Promise hoàn thành (Phổ biến nhất).
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-amber-700 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200">
                  async / await
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Toàn bộ các dòng mã nằm phía dưới từ khoá <code>await</code> được gom lại thành microtask.
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-amber-700 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200">
                  queueMicrotask(callback)
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Hàm chuẩn W3C cho phép lập trình viên trực tiếp đẩy một tác vụ vào Microtask queue.
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-amber-700 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200">
                  MutationObserver
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Callback thông báo khi cấu trúc cây DOM bị thay đổi.
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-amber-700 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200">
                  process.nextTick()
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  (Riêng Node.js) Thuộc <em>nextTickQueue</em>, chạy <strong>trước</strong> cả Promise microtask!
                </span>
              </div>
            </div>
          </div>

          {/* Nhóm 2: Macrotasks (Xanh dương) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">
                Macrotask (Task Queue)
              </h3>
              <span className="text-[15px] text-[var(--muted)] ml-2">
                — Chỉ lấy duy nhất 1 tác vụ mỗi vòng lặp
              </span>
            </div>

            <div className="space-y-2.5 pt-1 pl-5 border-l-2 border-blue-200">
              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-blue-700 bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-200">
                  setTimeout(callback, delay)
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Đẩy callback vào Macrotask queue sau thời gian chờ tối thiểu.
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-blue-700 bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-200">
                  setInterval(callback, delay)
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Định kỳ đẩy callback vào Macrotask queue sau mỗi khoảng thời gian.
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-blue-700 bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-200">
                  setImmediate(callback)
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  (Riêng Node.js) Chạy trong Check Phase của libuv.
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-blue-700 bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-200">
                  UI Events (click, scroll, keypress, input)
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Các tương tác từ phía người dùng do trình duyệt dispatch vào hàng đợi.
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-blue-700 bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-200">
                  I/O & Network Callbacks
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Tác vụ đọc ghi dữ liệu từ đĩa hoặc khi nhận được gói tin phản hồi từ Server.
                </span>
              </div>
            </div>
          </div>

          {/* Nhóm 3: Render Steps (Xanh lá) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">
                Render Steps (Rendering Pipeline)
              </h3>
              <span className="text-[15px] text-[var(--muted)] ml-2">
                — Đồng bộ hóa với tần số quét màn hình (60Hz / 120Hz)
              </span>
            </div>

            <div className="space-y-2.5 pt-1 pl-5 border-l-2 border-emerald-200">
              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-emerald-700 bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200">
                  requestAnimationFrame(callback)
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Chạy ngay trước khi trình duyệt thực hiện tính toán vẽ lại khung hình tiếp theo.
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-emerald-700 bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200">
                  Style Calculation & Layout (Reflow)
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Trình duyệt tính toán lại vị trí và kích thước hình học của từng phần tử DOM.
                </span>
              </div>

              <div className="text-[17px] leading-relaxed">
                <code className="text-[16px] font-bold font-mono text-emerald-700 bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-200">
                  Paint & Composite
                </code>
                <span className="text-[15px] text-[var(--muted)] ml-3">
                  Tô màu các pixel và tổng hợp layer đưa lên GPU xuất ra màn hình.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CHU KỲ 4 BƯỚC (Dùng đúng 3 màu nhất quán, chữ 17px)                */}
      {/* ========================================================================= */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-5 animate-in fade-in">
          <p className="text-[17px] leading-relaxed text-[var(--foreground)]">
            Mỗi vòng lặp (Tick) của Event Loop trong trình duyệt diễn ra tuần tự theo 4 bước dưới đây:
          </p>

          <div className="space-y-4">
            {/* Bước 1 */}
            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs flex items-center justify-center font-bold font-mono">
                  1
                </span>
                <h4 className="text-lg font-bold text-[var(--foreground)] font-serif">
                  Call Stack (Thực thi mã đồng bộ)
                </h4>
              </div>
              <p className="text-[17px] leading-relaxed text-[var(--foreground)] pl-8">
                Toàn bộ các lệnh đồng bộ trong script chính được đẩy vào Call Stack và chạy tuần tự. Event Loop sẽ kiên nhẫn chờ đợi cho tới khi Call Stack <strong>hoàn toàn rỗng</strong> (Empty).
              </p>
            </div>

            {/* Bước 2: Màu Vàng Hổ Phách */}
            <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50/40 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold font-mono">
                  2
                </span>
                <h4 className="text-lg font-bold text-amber-950 font-serif">
                  Dọn sạch Microtask Queue (Ưu tiên VIP)
                </h4>
              </div>
              <p className="text-[17px] leading-relaxed text-amber-950 pl-8">
                Event Loop lấy lần lượt tất cả các microtask ra chạy. Nếu một microtask lại sinh ra microtask con (ví dụ Promise chain), microtask con đó sẽ được <strong>chạy tiếp ngay trong cùng lượt này</strong>. Event Loop chỉ chuyển bước khi Microtask queue không còn phần tử nào.
              </p>
            </div>

            {/* Bước 3: Màu Xanh Lá */}
            <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/40 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold font-mono">
                  3
                </span>
                <h4 className="text-lg font-bold text-emerald-950 font-serif">
                  Rendering Steps (Vẽ lại khung hình)
                </h4>
              </div>
              <p className="text-[17px] leading-relaxed text-emerald-950 pl-8">
                Nếu đã tới chu kỳ làm mới màn hình (thường là 16.6ms một lần với màn 60Hz), trình duyệt sẽ kích hoạt các callback của <code>requestAnimationFrame</code>, tính toán Layout (Reflow) và Paint khung hình mới cho người dùng nhìn thấy.
              </p>
            </div>

            {/* Bước 4: Màu Xanh Dương */}
            <div className="p-5 rounded-2xl border border-blue-300 bg-blue-50/40 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold font-mono">
                  4
                </span>
                <h4 className="text-lg font-bold text-blue-950 font-serif">
                  Lấy DUY NHẤT 1 Macrotask từ Task Queue
                </h4>
              </div>
              <p className="text-[17px] leading-relaxed text-blue-950 pl-8">
                Event Loop chọn đúng 1 tác vụ lâu nhất đang chờ trong Macrotask queue (như timer <code>setTimeout</code>) đưa vào Call Stack để thực thi. Ngay sau khi xong tác vụ này, Event Loop <strong>lập tức quay trở lại Bước 2</strong> để dọn dẹp Microtask!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CÂU HỎI BẪY THƯỜNG GẶP (Khớp 100% bố cục và nội dung trong ảnh!)   */}
      {/* ========================================================================= */}
      {activeTab === 'traps' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Câu hỏi bẫy thường gặp
            </h3>
            <p className="text-[17px] text-[var(--muted)] mt-1">
              Đoán thứ tự in ra trước, rồi bấm Xem đáp án để đối chiếu.
            </p>
          </div>

          <div className="space-y-5">
            {/* Card 1: setTimeout 0 so với Promise */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
              <h4 className="font-bold text-[17px] text-[var(--foreground)]">
                setTimeout 0 so với Promise
              </h4>

              {/* Code Box */}
              <div className="rounded-xl bg-[#1F1E1D] p-4 text-[#EDE8DF] font-mono text-[15px] leading-relaxed overflow-x-auto">
                <pre>{`console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');`}</pre>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setShowAnswer1(!showAnswer1)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-subtle)] text-[15px] font-semibold text-[var(--foreground)] transition-colors cursor-pointer shadow-2xs"
                >
                  {showAnswer1 ? 'Ẩn đáp án' : 'Xem đáp án'}
                </button>
                <span className="text-[15px] text-[var(--muted)]">
                  In ra theo thứ tự nào?
                </span>
              </div>

              {/* Revealed Answer */}
              {showAnswer1 && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-300 text-[17px] space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-amber-950 font-mono text-[18px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Thứ tự in ra: A ➔ D ➔ C ➔ B</span>
                  </div>
                  <p className="text-[15px] text-amber-900 leading-relaxed">
                    <strong>Giải thích:</strong> <code>A</code> và <code>D</code> chạy đồng bộ trên Call Stack trước. <code>Promise.then</code> đẩy <code>C</code> vào Microtask Queue. <code>setTimeout</code> đẩy <code>B</code> vào Macrotask Queue. Khi Call Stack rỗng, Event Loop dọn Microtask (<code>C</code>) trước khi lấy Macrotask (<code>B</code>).
                  </p>
                </div>
              )}
            </div>

            {/* Card 2: Microtask sinh ra microtask */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
              <h4 className="font-bold text-[17px] text-[var(--foreground)]">
                Microtask sinh ra microtask
              </h4>

              {/* Code Box */}
              <div className="rounded-xl bg-[#1F1E1D] p-4 text-[#EDE8DF] font-mono text-[15px] leading-relaxed overflow-x-auto">
                <pre>{`setTimeout(() => console.log('timeout'), 0);

Promise.resolve().then(() => {
  console.log('then 1');
  Promise.resolve().then(() => console.log('then 2'));
});`}</pre>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setShowAnswer2(!showAnswer2)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-subtle)] text-[15px] font-semibold text-[var(--foreground)] transition-colors cursor-pointer shadow-2xs"
                >
                  {showAnswer2 ? 'Ẩn đáp án' : 'Xem đáp án'}
                </button>
                <span className="text-[15px] text-[var(--muted)]">
                  In ra theo thứ tự nào?
                </span>
              </div>

              {/* Revealed Answer */}
              {showAnswer2 && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-300 text-[17px] space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-amber-950 font-mono text-[18px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Thứ tự in ra: then 1 ➔ then 2 ➔ timeout</span>
                  </div>
                  <p className="text-[15px] text-amber-900 leading-relaxed">
                    <strong>Giải thích:</strong> Khi <code>then 1</code> chạy và sinh thêm <code>then 2</code>, <code>then 2</code> tiếp tục được thêm vào Microtask Queue hiện tại. Vì Event Loop bắt buộc phải <em>dọn sạch 100% Microtask</em> trước khi chuyển sang Macrotask, nên <code>then 2</code> được thực thi ngay trước <code>timeout</code>!
                  </p>
                </div>
              )}
            </div>

            {/* Card 3: Code đứng sau await */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
              <h4 className="font-bold text-[17px] text-[var(--foreground)]">
                Code đứng sau await
              </h4>

              {/* Code Box */}
              <div className="rounded-xl bg-[#1F1E1D] p-4 text-[#EDE8DF] font-mono text-[15px] leading-relaxed overflow-x-auto">
                <pre>{`async function foo() {
  console.log('1');
  await bar();
  console.log('2');
}

async function bar() {
  console.log('3');
}

foo();
console.log('4');`}</pre>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setShowAnswer3(!showAnswer3)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-subtle)] text-[15px] font-semibold text-[var(--foreground)] transition-colors cursor-pointer shadow-2xs"
                >
                  {showAnswer3 ? 'Ẩn đáp án' : 'Xem đáp án'}
                </button>
                <span className="text-[15px] text-[var(--muted)]">
                  In ra theo thứ tự nào?
                </span>
              </div>

              {/* Revealed Answer */}
              {showAnswer3 && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-300 text-[17px] space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-amber-950 font-mono text-[18px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Thứ tự in ra: 1 ➔ 3 ➔ 4 ➔ 2</span>
                  </div>
                  <p className="text-[15px] text-amber-900 leading-relaxed">
                    <strong>Giải thích:</strong> <code>foo()</code> chạy đồng bộ in <code>1</code>. Tiếp đó gọi <code>bar()</code> đồng bộ in <code>3</code>. Gặp <code>await</code>, hàm <code>foo</code> bị tạm hoãn và phần còn lại (in <code>2</code>) trở thành Microtask. Script chính chạy tiếp in <code>4</code>. Call Stack rỗng ➔ Microtask chạy in <code>2</code>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
