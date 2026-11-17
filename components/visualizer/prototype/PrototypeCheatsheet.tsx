'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, CheckCircle2, ChevronRight, Clock, Award, ShieldAlert, Cpu } from 'lucide-react';

export function PrototypeCheatsheet() {
  const [activeTab, setActiveTab] = useState<'concepts' | 'rules' | 'traps'>('traps');
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
      title: 'Bẫy arrow function làm method trong Object literal',
      badge: 'Lexical this',
      pipeline: [
        { label: 'Object literal {}', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Không tạo Scope mới', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'this = window / undefined', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `const counter = {
  count: 10,
  inc: () => {
    this.count++;
    return this.count;
  }
};

console.log(counter.inc()); // In ra gì?`,
      note: 'Arrow function không có context `this` của riêng nó.',
      answerSummary: 'NaN (hoặc TypeError trong strict mode)',
      answerDetail:
        'Object literal `{}` không tạo ra lexical scope. Do đó arrow function `inc` bắt `this` từ phạm vi bên ngoài (Global/Window). Trong window không có `count` (undefined), thực hiện `undefined++` sinh ra `NaN`!',
    },
    {
      id: 1,
      title: 'Mất ngữ cảnh this khi truyền callback vào setTimeout',
      badge: 'Detached Function',
      pipeline: [
        { label: 'user.greet truyền vào Timer', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'WebAPI thực thi callback', bg: 'bg-blue-100 text-blue-950 border border-blue-300' },
        { label: 'Mất call-site (this = window)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `const user = {
  name: 'Sarah',
  greet() {
    console.log('Xin chào ' + this.name);
  }
};

setTimeout(user.greet, 100); // In ra gì?`,
      note: 'Dấu chấm chỉ có tác dụng khi trực tiếp gọi hàm `user.greet()`.',
      answerSummary: "'Xin chào undefined'",
      answerDetail:
        'Khi truyền `user.greet` vào `setTimeout`, bạn chỉ truyền con trỏ hàm, không phải đang gọi hàm. Khi WebAPI kích hoạt callback sau 100ms, nó gọi hàm dưới dạng standalone function `cb()`, dẫn đến Default Binding (`this = window/undefined`). Để sửa: dùng `() => user.greet()` hoặc `user.greet.bind(user)`.',
    },
    {
      id: 2,
      title: 'Prototype Pollution & Object.create(null)',
      badge: 'Bảo mật Strong Mid',
      pipeline: [
        { label: 'Object {} kế thừa Object.prototype', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Kẻ tấn công inject __proto__', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'Phòng thủ: Object.create(null)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `// Dictionary 1: Object thông thường
const dict1 = {};
console.log('toString' in dict1); // true (Kế thừa từ Object.prototype)

// Dictionary 2: Object thuần khiết an toàn
const dict2 = Object.create(null);
console.log('toString' in dict2); // false!
console.log(dict2.__proto__); // undefined`,
      note: 'Object.create(null) không hề có bất kỳ mắt xích Prototype nào.',
      answerSummary: 'true và false',
      answerDetail:
        'Khi cần tạo HashMap hoặc lưu trữ key động từ input người dùng, lập trình viên Strong Middle luôn dùng `Object.create(null)` hoặc `Map`. Điều này loại bỏ hoàn toàn nguy cơ bị ghi đè các hàm hệ thống (`toString`, `valueOf`) hoặc bị tấn công Prototype Pollution.',
    },
  ];

  const currentQ = questions[activeQuestion];

  return (
    <article className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12" aria-label="Sổ tay Prototype Chain">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-zinc-600 font-semibold" aria-label="Breadcrumb">
        <span>JavaScript Engine &amp; Runtime</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-900 font-bold">Prototype Chain &amp; this Binding</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-serif">
              Prototype Chain &amp; "this" Binding Architecture
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-700 mt-1.5 leading-relaxed">
              Hiểu sâu cơ chế uỷ quyền thuộc tính (Prototypal Delegation), tháp kế thừa leo thang và 4 quy tắc phân giải từ khoá "this" chuẩn ECMAScript.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-800 text-[12px] font-semibold flex items-center gap-1 shadow-2xs">
              👌 Strong Middle
            </span>
            <span className="px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-800 text-[12px] font-semibold flex items-center gap-1 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              12 phút
            </span>
          </div>
        </div>

        {/* Feature Visual Accent: Prototype Ladder Diagram */}
        <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-4 sm:p-5 shadow-2xs" data-visual="prototype-chain-ladder">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <Cpu className="w-4 h-4 text-[#BD5332]" />
              <span>Cấu trúc chuỗi Prototype Chain trong bộ nhớ V8</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold">
              Prototypal Delegation Model
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-3">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-[#BD5332]">1. Instance Object</span>
              <p className="text-[11px] text-zinc-600">Chứa các thuộc tính riêng (own properties) khởi tạo trên đối tượng.</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-blue-900">2. Constructor.prototype</span>
              <p className="text-[11px] text-blue-900">Nơi lưu trữ các hàm dùng chung để tiết kiệm bộ nhớ RAM.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-900">3. Object.prototype</span>
              <p className="text-[11px] text-emerald-900">Gốc của mọi đối tượng: toString, valueOf, hasOwnProperty.</p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-rose-900">4. null (Điểm kết thúc)</span>
              <p className="text-[11px] text-rose-900">Object.prototype.__proto__ = null. Nếu tới đây vẫn không thấy ➔ undefined.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Underline Tab Bar */}
      <nav className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]" aria-label="Nội dung sổ tay">
        <button
          onClick={() => setActiveTab('concepts')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'concepts'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Cơ chế Delegation
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'rules'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          4 Quy tắc "this"
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'traps'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Bẫy phỏng vấn
        </button>
      </nav>

      {/* 4. Alert Banner */}
      <section className="rounded-2xl border border-red-300 bg-red-50 p-4 flex items-start gap-3.5 shadow-2xs" aria-label="Quy tắc quan trọng">
        <div className="w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
          !
        </div>
        <div>
          <h2 className="font-bold text-[15px] text-red-950">Quy tắc vàng Strong Middle</h2>
          <p className="text-[14px] text-red-950 mt-0.5 leading-relaxed font-medium">
            Trong JavaScript, đối tượng KHÔNG sao chép phương thức từ cha như OOP truyền thống (Java/C++). Nó giữ <strong>con trỏ sống (live reference)</strong> qua <code>[[Prototype]]</code>. Thay đổi trên Prototype sẽ ảnh hưởng ngay tức thì đến mọi instance!
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: CƠ CHẾ DELEGATION                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'concepts' && (
        <section className="space-y-4 animate-in fade-in" aria-label="Cơ chế Delegation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-3 shadow-2xs">
              <h3 className="font-bold text-[16px] text-zinc-950 font-serif">
                __proto__ vs prototype (Phân biệt sống còn)
              </h3>
              <ul className="space-y-2 text-[14px]">
                <li className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-[#BD5332]">obj.__proto__</span>
                  <p className="text-zinc-700 text-xs mt-0.5">Con trỏ nội bộ của một instance trỏ đến prototype object mà nó kế thừa.</p>
                </li>
                <li className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="font-mono font-bold text-blue-700">Fn.prototype</span>
                  <p className="text-zinc-700 text-xs mt-0.5">Thuộc tính chỉ có trên các hàm (Function) dùng làm khuôn mẫu cho các instance được tạo bởi <code>new Fn()</code>.</p>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-3 shadow-2xs">
              <h3 className="font-bold text-[16px] text-zinc-950 font-serif">
                Property Shadowing (Che khuất thuộc tính)
              </h3>
              <p className="text-[14px] text-zinc-700 leading-relaxed font-medium">
                Nếu instance gán một thuộc tính trùng tên với thuộc tính trên Prototype (ví dụ: <code>dog.toString = ...</code>), JavaScript sẽ tạo own property trên chính <code>dog</code>, không làm hỏng <code>Object.prototype.toString</code> của các đối tượng khác.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 4 QUY TẮC PHÂN GIẢI THIS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'rules' && (
        <section className="space-y-4 animate-in fade-in" aria-label="4 quy tắc phân giải this">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-1 shadow-2xs">
              <span className="text-xs font-mono font-bold text-zinc-600">ƯU TIÊN 1</span>
              <h3 className="font-bold text-[15px] text-zinc-950">new Binding</h3>
              <p className="text-[12px] text-zinc-700">Gọi bằng <code>new Foo()</code>: this là object mới vừa tạo.</p>
            </div>

            <div className="p-4 rounded-xl border border-blue-300 bg-blue-50/50 space-y-1 shadow-2xs">
              <span className="text-xs font-mono font-bold text-blue-800">ƯU TIÊN 2</span>
              <h3 className="font-bold text-[15px] text-blue-950">Explicit Binding</h3>
              <p className="text-[12px] text-blue-950">Gọi bằng <code>call / apply / bind</code>: this là tham số chỉ định.</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1 shadow-2xs">
              <span className="text-xs font-mono font-bold text-emerald-800">ƯU TIÊN 3</span>
              <h3 className="font-bold text-[15px] text-emerald-950">Implicit Binding</h3>
              <p className="text-[12px] text-emerald-950">Gọi bằng <code>obj.method()</code>: this là đối tượng đứng trước dấu chấm.</p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1 shadow-2xs">
              <span className="text-xs font-mono font-bold text-zinc-600">ƯU TIÊN 4</span>
              <h3 className="font-bold text-[15px] text-zinc-950">Default Binding</h3>
              <p className="text-[12px] text-zinc-700">Gọi độc lập <code>fn()</code>: this là <code>undefined</code> (strict) hoặc <code>window</code>.</p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BẪY PHỎNG VẤN (QUIZ INTERACTION)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'traps' && (
        <section className="space-y-5 animate-in fade-in" aria-label="Câu hỏi bẫy phỏng vấn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="text-xl font-bold text-zinc-950 font-serif">
                Câu hỏi bẫy thường gặp (Strong Mid)
              </h3>
              <p className="text-[14px] text-zinc-700 mt-0.5">
                Dự đoán kết quả console trước khi mở đáp án chi tiết
              </p>
            </div>

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
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-[#BD5332] text-white flex items-center justify-center font-bold text-xs font-mono shadow-2xs">
                  {currentQ.id + 1}
                </span>
                <h4 className="font-bold text-[17px] text-zinc-950">
                  {currentQ.title}
                </h4>
              </div>

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

            {/* Visual Pipeline */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono">
              <span className="font-bold text-zinc-700 uppercase tracking-wider text-[11px]">Luồng phân giải:</span>
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
                  onClick={() => handleCopy(`proto-q-${currentQ.id}`, currentQ.code)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
                  title="Sao chép mã"
                >
                  {copiedId === `proto-q-${currentQ.id}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <pre className="text-zinc-200 leading-relaxed overflow-x-auto">{currentQ.code}</pre>
            </div>

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
