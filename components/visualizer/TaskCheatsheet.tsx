'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, CheckCircle2, ChevronRight, Clock, Award } from 'lucide-react';

export function TaskCheatsheet() {
  const [activeTab, setActiveTab] = useState<'apis' | 'lifecycle' | 'traps'>('traps');

  // Answers toggle state for Tab 3 (Quiz questions)
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12">
      {/* 1. Breadcrumbs matching pen.dev */}
      <div className="flex items-center gap-1.5 text-[13px] text-zinc-400 font-medium">
        <span>Event Loop &amp; Task Queues</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-700 font-semibold">Microtask vs Macrotask</span>
      </div>

      {/* 2. Page Title & Meta Badges matching pen.dev */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-serif">
            Microtask vs Macrotask
          </h1>
          <p className="text-[15px] sm:text-[16px] text-zinc-600 mt-1.5 leading-relaxed">
            Tìm hiểu thứ tự ưu tiên giữa microtask và macrotask trong vòng lặp sự kiện, và lý do Promise luôn chạy trước setTimeout.
          </p>
        </div>

        {/* Badges on right: Nâng cao & 12 phút */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 text-[12px] font-medium flex items-center gap-1 shadow-2xs">
            👌 Nâng cao
          </span>
          <span className="px-2.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 text-[12px] font-medium flex items-center gap-1 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            12 phút
          </span>
        </div>
      </div>

      {/* 3. Underline Tab Bar matching pen.dev */}
      <div className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]">
        <button
          onClick={() => setActiveTab('apis')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'apis'
              ? 'border-b-2 border-[#CC6745] font-bold text-zinc-900'
              : 'text-zinc-500 hover:text-zinc-800 font-medium'
          }`}
        >
          Phân loại API
        </button>

        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'lifecycle'
              ? 'border-b-2 border-[#CC6745] font-bold text-zinc-900'
              : 'text-zinc-500 hover:text-zinc-800 font-medium'
          }`}
        >
          Chu kỳ 6 bước
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'traps'
              ? 'border-b-2 border-[#CC6745] font-bold text-zinc-900'
              : 'text-zinc-500 hover:text-zinc-800 font-medium'
          }`}
        >
          Câu hỏi bẫy
        </button>
      </div>

      {/* 4. Alert Banner: Quy tắc vàng matching pen.dev */}
      <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 flex items-start gap-3.5 shadow-2xs">
        <div className="w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
          !
        </div>
        <div>
          <h4 className="font-bold text-[15px] text-red-950">Quy tắc vàng</h4>
          <p className="text-[14px] text-red-900 mt-0.5 leading-relaxed">
            Sau mỗi macrotask, event loop sẽ làm rỗng toàn bộ hàng đợi microtask trước khi chạy macrotask tiếp theo. Vì vậy <code>Promise.then()</code> luôn chạy trước <code>setTimeout(0)</code>.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PHÂN LOẠI API                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'apis' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Macrotask Column (Xanh dương) */}
            <div className="rounded-2xl border border-blue-200 bg-white p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="font-bold text-[16px] text-blue-900 font-serif">
                  Macrotask (Task Queue)
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 ml-auto font-medium">
                  1 task / vòng
                </span>
              </div>
              <ul className="space-y-2 text-[14px]">
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-bold text-zinc-900">setTimeout / setInterval</span>
                  <span className="text-zinc-500 text-[13px]">Bộ hẹn giờ WebAPI</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-bold text-zinc-900">setImmediate</span>
                  <span className="text-zinc-500 text-[13px]">Node.js Check phase</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-bold text-zinc-900">I/O Callback</span>
                  <span className="text-zinc-500 text-[13px]">Đọc ghi file, socket</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-bold text-zinc-900">UI Events (click, scroll)</span>
                  <span className="text-zinc-500 text-[13px]">Sự kiện người dùng</span>
                </li>
              </ul>
            </div>

            {/* Microtask Column (Vàng Hổ Phách) */}
            <div className="rounded-2xl border border-amber-300 bg-white p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <h3 className="font-bold text-[16px] text-amber-950 font-serif">
                  Microtask (VIP Queue)
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 ml-auto font-medium">
                  Dọn sạch 100%
                </span>
              </div>
              <ul className="space-y-2 text-[14px]">
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-bold text-zinc-900">Promise.then / catch / finally</span>
                  <span className="text-zinc-500 text-[13px]">Xử lý bất đồng bộ</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-bold text-zinc-900">queueMicrotask()</span>
                  <span className="text-zinc-500 text-[13px]">Native API hàng đợi VIP</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-bold text-zinc-900">MutationObserver</span>
                  <span className="text-zinc-500 text-[13px]">Theo dõi DOM thay đổi</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-bold text-zinc-900">process.nextTick</span>
                  <span className="text-zinc-500 text-[13px]">Node.js siêu ưu tiên</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CHU KỲ 6 BƯỚC                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-1">
              <span className="text-xs font-mono font-bold text-[#CC6745]">BƯỚC 1</span>
              <h4 className="font-bold text-[15px] text-zinc-900">Chạy Call Stack</h4>
              <p className="text-[13px] text-zinc-600">Thực thi hết toàn bộ code đồng bộ (Synchronous code).</p>
            </div>
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700">BƯỚC 2 (VIP)</span>
              <h4 className="font-bold text-[15px] text-amber-950">Dọn sạch Microtasks</h4>
              <p className="text-[13px] text-amber-900">Xử lý 100% Promise, await và microtask con sinh ra.</p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-700">BƯỚC 3</span>
              <h4 className="font-bold text-[15px] text-emerald-950">Render Khung hình</h4>
              <p className="text-[13px] text-emerald-900">Chạy rAF, tính toán Reflow Layout và Paint màn hình.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CÂU HỎI BẪY THƯỜNG GẶP (Khớp 100% thiết kế trong ảnh pen.dev!)    */}
      {/* ========================================================================= */}
      {activeTab === 'traps' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Section Header matching pen.dev */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 font-serif">
                Câu hỏi bẫy thường gặp
              </h3>
              <p className="text-[14px] text-zinc-500 mt-0.5">
                Dự đoán kết quả console trước khi xem đáp án
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[12px] font-medium">
              3 câu hỏi
            </span>
          </div>

          {/* Card 1: setTimeout 0 so với Promise */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-2xs">
            {/* Header row: Number + Title + Action button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[#CC6745] font-bold text-sm font-mono">1</span>
                <h4 className="font-bold text-[16px] text-zinc-900">
                  setTimeout 0 so với Promise
                </h4>
              </div>

              <button
                onClick={() => setShowAnswer1(!showAnswer1)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-[12px] font-medium text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {showAnswer1 ? <EyeOff className="w-3.5 h-3.5 text-zinc-500" /> : <Eye className="w-3.5 h-3.5 text-zinc-500" />}
                <span>{showAnswer1 ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
              </button>
            </div>

            {/* Mac Terminal Code Block */}
            <div className="rounded-xl bg-[#18181B] p-3 text-zinc-100 font-mono text-[13px] overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-400 text-[11px] mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                </div>
                <span>javascript</span>
                <button
                  onClick={() =>
                    handleCopy('c1', `console.log('A');\n\nsetTimeout(() => console.log('B'), 0);\n\nPromise.resolve().then(() => console.log('C'));\n\nconsole.log('D');`)
                  }
                  className="hover:text-white cursor-pointer"
                  title="Sao chép"
                >
                  {copiedId === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <pre className="text-zinc-200 leading-relaxed overflow-x-auto">{`console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');`}</pre>
            </div>

            {/* Note below code matching pen.dev */}
            <div className="text-[13px] text-zinc-500 italic flex items-center gap-1.5">
              <span>ⓘ</span>
              <span>Thứ tự in ra sẽ là A, D, C, B — microtask thắng macrotask.</span>
            </div>

            {/* Revealed Answer */}
            {showAnswer1 && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 text-[14px] space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-950 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đáp án chi tiết: A ➔ D ➔ C ➔ B</span>
                </div>
                <p className="text-[13px] text-amber-900 leading-relaxed">
                  <code>A</code> và <code>D</code> chạy đồng bộ trên Call Stack trước. <code>Promise.then</code> đẩy <code>C</code> vào Microtask Queue. <code>setTimeout</code> đẩy <code>B</code> vào Macrotask Queue. Khi Call Stack rỗng, Event Loop dọn Microtask (<code>C</code>) trước khi lấy Macrotask (<code>B</code>).
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Microtask sinh ra microtask */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[#CC6745] font-bold text-sm font-mono">2</span>
                <h4 className="font-bold text-[16px] text-zinc-900">
                  Microtask sinh ra microtask
                </h4>
              </div>

              <button
                onClick={() => setShowAnswer2(!showAnswer2)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-[12px] font-medium text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {showAnswer2 ? <EyeOff className="w-3.5 h-3.5 text-zinc-500" /> : <Eye className="w-3.5 h-3.5 text-zinc-500" />}
                <span>{showAnswer2 ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
              </button>
            </div>

            <div className="rounded-xl bg-[#18181B] p-3 text-zinc-100 font-mono text-[13px] overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-400 text-[11px] mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                </div>
                <span>javascript</span>
                <button
                  onClick={() =>
                    handleCopy('c2', `setTimeout(() => console.log('timer'), 0);\n\nPromise.resolve().then(() => {\n  console.log('then 1');\n  Promise.resolve().then(() => console.log('then 2'));\n});`)
                  }
                  className="hover:text-white cursor-pointer"
                  title="Sao chép"
                >
                  {copiedId === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <pre className="text-zinc-200 leading-relaxed overflow-x-auto">{`setTimeout(() => console.log('timer'), 0);

Promise.resolve().then(() => {
  console.log('then 1');
  Promise.resolve().then(() => console.log('then 2'));
});`}</pre>
            </div>

            <div className="text-[13px] text-zinc-500 italic flex items-center gap-1.5">
              <span>ⓘ</span>
              <span>Microtask mới được thêm vào vẫn chạy hết trước macrotask timer.</span>
            </div>

            {showAnswer2 && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 text-[14px] space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-950 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đáp án chi tiết: then 1 ➔ then 2 ➔ timer</span>
                </div>
                <p className="text-[13px] text-amber-900 leading-relaxed">
                  Khi <code>then 1</code> chạy và sinh thêm <code>then 2</code>, <code>then 2</code> tiếp tục được thêm vào Microtask Queue hiện tại. Vì Event Loop bắt buộc phải dọn sạch 100% Microtask trước khi chuyển sang Macrotask, nên <code>then 2</code> được thực thi ngay trước <code>timer</code>!
                </p>
              </div>
            )}
          </div>

          {/* Card 3: Code đứng sau await */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[#CC6745] font-bold text-sm font-mono">3</span>
                <h4 className="font-bold text-[16px] text-zinc-900">
                  Code đứng sau await
                </h4>
              </div>

              <button
                onClick={() => setShowAnswer3(!showAnswer3)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-[12px] font-medium text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {showAnswer3 ? <EyeOff className="w-3.5 h-3.5 text-zinc-500" /> : <Eye className="w-3.5 h-3.5 text-zinc-500" />}
                <span>{showAnswer3 ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
              </button>
            </div>

            <div className="rounded-xl bg-[#18181B] p-3 text-zinc-100 font-mono text-[13px] overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-400 text-[11px] mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                </div>
                <span>javascript</span>
                <button
                  onClick={() =>
                    handleCopy('c3', `async function foo() {\n  console.log('1');\n  await bar();\n  console.log('2');\n}\n\nfoo(); // bar() in '3', rồi '4', cuối cùng '2'`)
                  }
                  className="hover:text-white cursor-pointer"
                  title="Sao chép"
                >
                  {copiedId === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <pre className="text-zinc-200 leading-relaxed overflow-x-auto">{`async function foo() {
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

            <div className="text-[13px] text-zinc-500 italic flex items-center gap-1.5">
              <span>ⓘ</span>
              <span>Mọi thứ sau await được đưa vào microtask queue, in ra: 1, 3, 4, 2.</span>
            </div>

            {showAnswer3 && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 text-[14px] space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-950 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đáp án chi tiết: 1 ➔ 3 ➔ 4 ➔ 2</span>
                </div>
                <p className="text-[13px] text-amber-900 leading-relaxed">
                  <code>foo()</code> chạy in <code>1</code>. Gọi <code>bar()</code> chạy đồng bộ in <code>3</code>. Gặp <code>await</code>, phần còn lại của hàm <code>foo</code> (in <code>2</code>) bị đóng gói thành Microtask. Call Stack tiếp tục chạy dòng đồng bộ cuối cùng in <code>4</code>. Khi Stack trống, Microtask chạy in <code>2</code>!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
