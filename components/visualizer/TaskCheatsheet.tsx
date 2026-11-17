'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, CheckCircle2, ChevronRight, Clock, RefreshCw, Cpu, Layers } from 'lucide-react';

export function TaskCheatsheet() {
  const [activeTab, setActiveTab] = useState<'apis' | 'lifecycle' | 'traps'>('traps');

  // Interactive Question Index on Tab 3
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
      title: 'setTimeout 0 so với Promise',
      badge: 'Thứ tự ưu tiên',
      pipeline: [
        { label: 'Call Stack (A, D)', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Microtask Queue (C)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
        { label: 'Macrotask Queue (B)', bg: 'bg-blue-100 text-blue-950 border border-blue-300' },
      ],
      code: `console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');`,
      note: 'Thứ tự in ra sẽ là A, D, C, B — microtask dọn sạch trước macrotask.',
      answerSummary: 'A ➔ D ➔ C ➔ B',
      answerDetail:
        'A và D chạy đồng bộ trên Call Stack trước. Promise.then đẩy C vào Microtask Queue. setTimeout đẩy B vào Macrotask Queue. Khi Call Stack rỗng, Event Loop bắt buộc dọn Microtask (C) trước khi chuyển qua Macrotask (B).',
    },
    {
      id: 1,
      title: 'Microtask lồng sinh ra Microtask con',
      badge: 'Dọn sạch 100%',
      pipeline: [
        { label: 'Microtask 1 (then 1)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
        { label: 'Microtask con (then 2)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
        { label: 'Macrotask (timer)', bg: 'bg-blue-100 text-blue-950 border border-blue-300' },
      ],
      code: `setTimeout(() => console.log('timer'), 0);

Promise.resolve().then(() => {
  console.log('then 1');
  Promise.resolve().then(() => console.log('then 2'));
});`,
      note: 'Microtask mới sinh ra vẫn được ưu tiên thực thi dọn sạch trước macrotask timer.',
      answerSummary: 'then 1 ➔ then 2 ➔ timer',
      answerDetail:
        'Khi then 1 chạy và sinh thêm then 2, then 2 tiếp tục được thêm vào Microtask Queue hiện tại. Vì Event Loop bắt buộc phải dọn sạch 100% Microtask trước khi chuyển sang Macrotask, nên then 2 được thực thi ngay trước timer!',
    },
    {
      id: 2,
      title: 'Code đứng sau biểu thức await',
      badge: 'Bất đồng bộ ES8',
      pipeline: [
        { label: 'Sync Start (1, 3)', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Sync End (4)', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Resumed await (2)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `async function foo() {
  console.log('1');
  await bar();
  console.log('2');
}

async function bar() {
  console.log('3');
}

foo();
console.log('4');`,
      note: 'Mọi dòng code đứng sau await được đóng gói thành Microtask continuation.',
      answerSummary: '1 ➔ 3 ➔ 4 ➔ 2',
      answerDetail:
        'foo() chạy in 1. Gọi bar() chạy đồng bộ in 3. Gặp await, phần còn lại của hàm foo (in 2) bị đóng gói thành Microtask. Call Stack tiếp tục chạy dòng đồng bộ cuối cùng in 4. Khi Stack trống, Microtask chạy in 2!',
    },
  ];

  const currentQ = questions[activeQuestion];

  return (
    <article className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12" aria-label="Sổ tay Event Loop">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-zinc-600 font-semibold" aria-label="Breadcrumb">
        <span>Event Loop &amp; Task Queues</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-900 font-bold">Microtask vs Macrotask</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-serif">
              Event Loop Architecture: Microtask vs Macrotask
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-700 mt-1.5 leading-relaxed">
              Khám phá cơ chế điều phối luồng thực thi trong JavaScript runtime: thứ tự ưu tiên Microtask Queue, Task Queue và chu kỳ Render.
            </p>
          </div>

          {/* Badges on right: Nâng cao & 12 phút */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-800 text-[12px] font-semibold flex items-center gap-1 shadow-2xs">
              👌 Nâng cao
            </span>
            <span className="px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-800 text-[12px] font-semibold flex items-center gap-1 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              12 phút
            </span>
          </div>
        </div>

        {/* Feature Visual Accent: Event Loop Architecture Diagram */}
        <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-4 sm:p-5 shadow-2xs" data-visual="event-loop-architecture">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <RefreshCw className="w-4 h-4 text-[#BD5332]" />
              <span>Mô hình chu trình Event Loop (V8 Runtime)</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold">
              Single-threaded Event Model
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-3">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-800 font-bold text-xs">
                <Cpu className="w-3.5 h-3.5 text-amber-600" />
                <span>1. Call Stack</span>
              </div>
              <p className="text-[11px] text-zinc-600">Thực thi đồng bộ LIFO cho tới khi stack rỗng hoàn toàn.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>2. Microtasks (VIP)</span>
              </div>
              <p className="text-[11px] text-emerald-900">Dọn sạch 100% Promise, await trước khi chuyển bước.</p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-300 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-purple-950 font-bold text-xs">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>3. Render Phase</span>
              </div>
              <p className="text-[11px] text-purple-900">Tính toán Style, Layout, Paint và rAF mỗi 16.6ms (60fps).</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-300 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-blue-950 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>4. Macrotasks</span>
              </div>
              <p className="text-[11px] text-blue-900">Lấy duy nhất 1 callback timer/IO mỗi vòng lặp tick.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Underline Tab Bar */}
      <nav className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]" aria-label="Nội dung sổ tay">
        <button
          onClick={() => setActiveTab('apis')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'apis'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Phân loại API
        </button>

        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'lifecycle'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Chu kỳ 6 bước
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'traps'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Câu hỏi bẫy
        </button>
      </nav>

      {/* 4. Alert Banner: Quy tắc vàng (h2 tag for semantic order) */}
      <section className="rounded-2xl border border-red-300 bg-red-50 p-4 flex items-start gap-3.5 shadow-2xs" aria-label="Quy tắc quan trọng">
        <div className="w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
          !
        </div>
        <div>
          <h2 className="font-bold text-[15px] text-red-950">Quy tắc vàng</h2>
          <p className="text-[14px] text-red-950 mt-0.5 leading-relaxed font-medium">
            Sau mỗi macrotask, event loop sẽ làm rỗng toàn bộ hàng đợi microtask trước khi chạy macrotask tiếp theo. Vì vậy <code>Promise.then()</code> luôn chạy trước <code>setTimeout(0)</code>.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: PHÂN LOẠI API                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'apis' && (
        <section className="space-y-6 animate-in fade-in" aria-label="Phân loại API">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Macrotask Column */}
            <div className="rounded-2xl border border-blue-300 bg-white p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                <h3 className="font-bold text-[16px] text-blue-950 font-serif">
                  Macrotask (Task Queue)
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 ml-auto font-bold">
                  1 task / vòng
                </span>
              </div>
              <ul className="space-y-2 text-[14px]">
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-zinc-950">setTimeout / setInterval</span>
                  <span className="text-zinc-600 text-[13px] font-medium">Bộ hẹn giờ WebAPI</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-zinc-950">setImmediate</span>
                  <span className="text-zinc-600 text-[13px] font-medium">Node.js Check phase</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-zinc-950">I/O Callback</span>
                  <span className="text-zinc-600 text-[13px] font-medium">Đọc ghi file, socket</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-zinc-950">UI Events (click, scroll)</span>
                  <span className="text-zinc-600 text-[13px] font-medium">Sự kiện người dùng</span>
                </li>
              </ul>
            </div>

            {/* Microtask Column */}
            <div className="rounded-2xl border border-amber-300 bg-white p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
                <h3 className="font-bold text-[16px] text-amber-950 font-serif">
                  Microtask (VIP Queue)
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 ml-auto font-bold">
                  Dọn sạch 100%
                </span>
              </div>
              <ul className="space-y-2 text-[14px]">
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-zinc-950">Promise.then / catch / finally</span>
                  <span className="text-zinc-600 text-[13px] font-medium">Xử lý Promise</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-zinc-950">queueMicrotask()</span>
                  <span className="text-zinc-600 text-[13px] font-medium">Khởi tạo trực tiếp</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-zinc-950">MutationObserver</span>
                  <span className="text-zinc-600 text-[13px] font-medium">Theo dõi thay đổi DOM</span>
                </li>
                <li className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-zinc-950">process.nextTick (Node.js)</span>
                  <span className="text-zinc-600 text-[13px] font-medium">Ưu tiên cao nhất</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CHU KỲ 6 BƯỚC                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'lifecycle' && (
        <section className="space-y-4 animate-in fade-in" aria-label="Chu kỳ vòng lặp sự kiện">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-1">
              <span className="text-xs font-mono font-bold text-[#BD5332]">BƯỚC 1</span>
              <h3 className="font-bold text-[15px] text-zinc-950">Chạy Call Stack</h3>
              <p className="text-[13px] text-zinc-700">Thực thi hết toàn bộ code đồng bộ (Synchronous code).</p>
            </div>
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1">
              <span className="text-xs font-mono font-bold text-amber-800">BƯỚC 2 (VIP)</span>
              <h3 className="font-bold text-[15px] text-amber-950">Dọn sạch Microtasks</h3>
              <p className="text-[13px] text-amber-950">Xử lý 100% Promise, await và microtask con sinh ra.</p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-800">BƯỚC 3</span>
              <h3 className="font-bold text-[15px] text-emerald-950">Render Khung hình</h3>
              <p className="text-[13px] text-emerald-950">Chạy rAF, tính toán Reflow Layout và Paint màn hình.</p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CÂU HỎI BẪY THƯỜNG GẶP (Taste Skill Clean Redesign)               */}
      {/* ========================================================================= */}
      {activeTab === 'traps' && (
        <section className="space-y-5 animate-in fade-in" aria-label="Câu hỏi bẫy thường gặp">
          {/* Section Header with Question Switcher Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="text-xl font-bold text-zinc-950 font-serif">
                Câu hỏi bẫy thường gặp
              </h3>
              <p className="text-[14px] text-zinc-700 mt-0.5">
                Dự đoán kết quả console trước khi xem đáp án chi tiết
              </p>
            </div>

            {/* Selector Pills: Standardized 44px tap target */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200 shrink-0">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestion(idx as 0 | 1 | 2)}
                  className={`min-h-[44px] md:min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer flex items-center justify-center ${
                    activeQuestion === idx
                      ? 'bg-white text-[#BD5332] shadow-2xs font-bold border border-zinc-300'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50'
                  }`}
                >
                  Câu {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Question Card */}
          <div className="rounded-2xl border border-zinc-300 bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
            {/* Header row: Number + Title + Action button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-[#BD5332] text-white flex items-center justify-center font-bold text-xs font-mono shadow-2xs">
                  {currentQ.id + 1}
                </span>
                <h4 className="font-bold text-[17px] text-zinc-950">
                  {currentQ.title}
                </h4>
              </div>

              {/* Single Unified Action Button: Matching Height */}
              <button
                onClick={() => toggleAnswer(currentQ.id)}
                className="min-h-[44px] md:min-h-[38px] px-3.5 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-[13px] font-semibold text-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {showAnswer[currentQ.id] ? (
                  <EyeOff className="w-3.5 h-3.5 text-zinc-600" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-zinc-600" />
                )}
                <span>{showAnswer[currentQ.id] ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
              </button>
            </div>

            {/* Visual Diagram Accent (Taste Skill Card Visual) */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono">
              <span className="font-bold text-zinc-700 uppercase tracking-wider text-[11px]">Luồng thực thi:</span>
              {currentQ.pipeline.map((step, i) => (
                <React.Fragment key={i}>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-2xs ${step.bg}`}>
                    {step.label}
                  </span>
                  {i < currentQ.pipeline.length - 1 && (
                    <span className="text-zinc-500 font-bold">➔</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mac Terminal Code Block */}
            <div className="rounded-xl bg-[#18181B] p-3.5 text-zinc-100 font-mono text-[13px] overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-400 text-[11px] mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                </div>
                <span className="font-mono text-zinc-400 font-medium">javascript</span>
                <button
                  onClick={() => handleCopy(`q-${currentQ.id}`, currentQ.code)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
                  title="Sao chép mã"
                >
                  {copiedId === `q-${currentQ.id}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <pre className="text-zinc-200 leading-relaxed overflow-x-auto">{currentQ.code}</pre>
            </div>

            {/* Note below code matching pen.dev */}
            <div className="text-[13px] text-zinc-700 italic flex items-center gap-1.5 font-medium">
              <span className="font-bold text-[#BD5332]">ⓘ</span>
              <span>{currentQ.note}</span>
            </div>

            {/* Revealed Answer */}
            {showAnswer[currentQ.id] && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-[14px] space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-950 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Đáp án chi tiết: {currentQ.answerSummary}</span>
                </div>
                <p className="text-[13px] text-amber-950 leading-relaxed font-medium">
                  {currentQ.answerDetail}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </article>
  );
}
