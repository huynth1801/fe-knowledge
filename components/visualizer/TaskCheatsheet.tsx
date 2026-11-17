'use client';

import React, { useState } from 'react';
import {
  Zap,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export function TaskCheatsheet() {
  const [activeTab, setActiveTab] = useState<'comparison' | 'lifecycle' | 'traps'>('comparison');
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xs">
      {/* Header with toggle */}
      <div className="p-4 bg-[var(--card-subtle)] border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[var(--foreground)]">
                Sổ tay tra cứu: Microtask vs Macrotask & Thứ tự ưu tiên
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                Kiến thức cốt lõi
              </span>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Chi tiết các API, cơ chế dọn sạch và sơ đồ vòng lặp 4 bước trong Event Loop
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-3">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-[var(--accent)] text-white font-semibold shadow-2xs'
                  : 'bg-[var(--card-subtle)] text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              1. Bảng phân loại các API
            </button>
            <button
              onClick={() => setActiveTab('lifecycle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'lifecycle'
                  ? 'bg-[var(--accent)] text-white font-semibold shadow-2xs'
                  : 'bg-[var(--card-subtle)] text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              2. Sơ đồ chu kỳ 4 bước (Execution Order)
            </button>
            <button
              onClick={() => setActiveTab('traps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'traps'
                  ? 'bg-[var(--accent)] text-white font-semibold shadow-2xs'
                  : 'bg-[var(--card-subtle)] text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              3. Câu hỏi bẫy phỏng vấn thực tế
            </button>
          </div>

          {/* TAB 1: Comparison Table */}
          {activeTab === 'comparison' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Microtasks Box */}
                <div className="rounded-xl border border-amber-300 bg-amber-50/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                      <h4 className="font-serif font-bold text-amber-950 text-sm">
                        Microtasks (Hàng đợi VIP)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      Ưu tiên: Tối cao (Dọn sạch 100%)
                    </span>
                  </div>

                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    Dành cho các tác vụ cần phản hồi ngay lập tức sau khi Call Stack trống, trước khi trình duyệt thực hiện bất kỳ thao tác vẽ (Render) nào.
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono uppercase font-semibold text-amber-950 block">
                      Các API bao gồm:
                    </span>
                    <ul className="text-xs space-y-1.5 text-amber-950">
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-amber-300 text-amber-900">
                            Promise.then() / catch() / finally()
                          </code>
                          <span className="text-[11px] text-amber-800 ml-1.5">
                            (Phổ biến nhất trong JS hiện đại)
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-amber-300 text-amber-900">
                            async / await
                          </code>
                          <span className="text-[11px] text-amber-800 ml-1.5">
                            (Mọi dòng code sau từ khoá <code>await</code>)
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-amber-300 text-amber-900">
                            queueMicrotask(() =&gt; {'{...}'})
                          </code>
                          <span className="text-[11px] text-amber-800 ml-1.5">
                            (Chuẩn W3C chủ động tạo microtask)
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-amber-300 text-amber-900">
                            MutationObserver
                          </code>
                          <span className="text-[11px] text-amber-800 ml-1.5">
                            (Lắng nghe thay đổi cây DOM)
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-amber-300 text-amber-900">
                            process.nextTick()
                          </code>
                          <span className="text-[11px] text-amber-800 ml-1.5">
                            (Riêng Node.js - Ưu tiên số 1, chạy trước cả Promise!)
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Quy tắc dọn dẹp:</strong> Event Loop sẽ dọn sạch <strong>toàn bộ</strong> Microtask Queue. Nếu microtask lại tạo ra microtask mới, nó sẽ chạy tiếp trong cùng vòng lặp đó cho đến khi rỗng!
                    </span>
                  </div>
                </div>

                {/* Macrotasks Box */}
                <div className="rounded-xl border border-sky-300 bg-sky-50/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-600" />
                      <h4 className="font-serif font-bold text-sky-950 text-sm">
                        Macrotasks (Task Queue)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-200 text-sky-900">
                      Quy tắc: Lấy DUY NHẤT 1 tác vụ / vòng
                    </span>
                  </div>

                  <p className="text-xs text-sky-900/90 leading-relaxed">
                    Dành cho các tác vụ lớn hoặc tác vụ từ hệ điều hành / Web APIs như timers, tương tác người dùng, tải file, mạng.
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono uppercase font-semibold text-sky-950 block">
                      Các API bao gồm:
                    </span>
                    <ul className="text-xs space-y-1.5 text-sky-950">
                      <li className="flex items-start gap-1.5">
                        <span className="text-sky-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-sky-300 text-sky-900">
                            setTimeout(cb, delay)
                          </code>
                          <span className="text-[11px] text-sky-800 ml-1.5">
                            (Đưa callback vào task queue sau delay)
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-sky-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-sky-300 text-sky-900">
                            setInterval(cb, delay)
                          </code>
                          <span className="text-[11px] text-sky-800 ml-1.5">
                            (Lặp lại định kỳ)
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-sky-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-sky-300 text-sky-900">
                            setImmediate(cb)
                          </code>
                          <span className="text-[11px] text-sky-800 ml-1.5">
                            (Node.js Check phase)
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-sky-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-sky-300 text-sky-900">
                            UI Events (click, scroll, keypress)
                          </code>
                          <span className="text-[11px] text-sky-800 ml-1.5">
                            (Tương tác từ người dùng)
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-sky-600 font-bold">•</span>
                        <div>
                          <code className="font-mono bg-white/80 px-1 py-0.2 rounded border border-sky-300 text-sky-900">
                            I/O Operations & postMessage
                          </code>
                          <span className="text-[11px] text-sky-800 ml-1.5">
                            (Đọc ghi file, giao tiếp iframe/worker)
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-sky-200 text-[11px] text-sky-900 flex items-start gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Quy tắc dọn dẹp:</strong> Event Loop chỉ lấy <strong>1 task duy nhất</strong> mỗi vòng lặp, sau đó nhường quyền lại cho Microtask queue và Rendering pipeline!
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Note: requestAnimationFrame */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card-subtle)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono font-semibold text-[var(--accent)] uppercase text-[11px]">
                    🔍 Vị trí đặc biệt: requestAnimationFrame (rAF)
                  </span>
                  <p className="text-[var(--foreground)] mt-0.5 leading-relaxed">
                    <code>requestAnimationFrame</code> <strong>không</strong> phải là microtask và cũng <strong>không</strong> phải macrotask thông thường. Nó được chạy trong pha <strong>Rendering Steps</strong> của trình duyệt, ngay trước khi tính toán Style, Layout (Reflow) và Paint khung hình mới.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Execution Lifecycle Flowchart */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-xs text-[var(--muted)]">
                Một chu kỳ đầy đủ của Event Loop trong trình duyệt tuân theo quy trình tuần tự khép kín dưới đây:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                {/* Step 1 */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col justify-between space-y-2 relative">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="w-5 h-5 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs flex items-center justify-center font-bold">
                        1
                      </span>
                      <span className="text-[10px] font-mono text-[var(--muted)]">BƯỚC 1</span>
                    </div>
                    <h5 className="font-serif font-bold text-sm text-[var(--foreground)]">
                      Call Stack (Sync)
                    </h5>
                    <p className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
                      Chạy toàn bộ mã JavaScript đồng bộ cho tới khi Call Stack hoàn toàn rỗng.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono bg-stone-100 text-stone-800 p-1.5 rounded">
                    Stack: <code>main()</code> ➔ rỗng
                  </div>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-4 flex flex-col justify-between space-y-2 relative ring-1 ring-amber-300">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">
                        2
                      </span>
                      <span className="text-[10px] font-mono text-amber-800 font-bold">ƯU TIÊN VIP</span>
                    </div>
                    <h5 className="font-serif font-bold text-sm text-amber-950">
                      Dọn sạch Microtasks
                    </h5>
                    <p className="text-[11px] text-amber-900/90 mt-1 leading-relaxed">
                      Lấy lần lượt tất cả Microtask (Promises, await). Nếu sinh thêm microtask mới ➔ chạy tiếp cho tới khi queue = 0.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono bg-amber-200/80 text-amber-950 p-1.5 rounded font-semibold">
                    <code>while (queue.length) run()</code>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-4 flex flex-col justify-between space-y-2 relative">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                        3
                      </span>
                      <span className="text-[10px] font-mono text-emerald-800">MỖI ~16.6ms</span>
                    </div>
                    <h5 className="font-serif font-bold text-sm text-emerald-950">
                      Rendering Pipeline
                    </h5>
                    <p className="text-[11px] text-emerald-900/90 mt-1 leading-relaxed">
                      Nếu đến thời điểm vẽ khung hình: Chạy <code>requestAnimationFrame</code> ➔ Reflow ➔ Repaint.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono bg-emerald-200/80 text-emerald-950 p-1.5 rounded">
                    rAF ➔ Layout ➔ Paint
                  </div>
                </div>

                {/* Step 4 */}
                <div className="rounded-xl border border-sky-300 bg-sky-50/50 p-4 flex flex-col justify-between space-y-2 relative">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-bold">
                        4
                      </span>
                      <span className="text-[10px] font-mono text-sky-800 font-bold">CHỈ 1 TASK</span>
                    </div>
                    <h5 className="font-serif font-bold text-sm text-sky-950">
                      Lấy 1 Macrotask
                    </h5>
                    <p className="text-[11px] text-sky-900/90 mt-1 leading-relaxed">
                      Lấy đúng 1 tác vụ từ Task Queue (e.g. <code>setTimeout</code>). Xong tác vụ này ➔ QUAY LẠI BƯỚC 2 NGAY.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono bg-sky-200/80 text-sky-950 p-1.5 rounded">
                    <code>tasks.shift().run()</code>
                  </div>
                </div>
              </div>

              {/* Loop arrow recap */}
              <div className="p-3 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)] flex items-center justify-between">
                <span className="font-mono text-[11px] text-[var(--accent)] font-semibold">
                  Chu kỳ lặp:
                </span>
                <span className="text-xs">
                  Sync Code ➔ <strong>Dọn sạch toàn bộ Microtasks</strong> ➔ Render (nếu cần) ➔ <strong>1 Macrotask</strong> ➔ (Lặp lại từ Microtask).
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: Real-world Interview Traps */}
          {activeTab === 'traps' && (
            <div className="space-y-3 animate-in fade-in">
              {/* Trap 1 */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Bẫy 1: Treo trình duyệt (UI Starvation) giữa Microtask vs Macrotask</span>
                </div>
                <p className="text-xs text-[var(--foreground)] leading-relaxed">
                  <strong>Câu hỏi:</strong> Nếu gọi đệ quy vô tận <code>function loop() {'{'} queueMicrotask(loop) {'}'}</code> thì điều gì xảy ra so với <code>function loop() {'{'} setTimeout(loop, 0) {'}'}</code>?
                </p>
                <div className="text-[11px] bg-[var(--accent-light)] border border-[var(--accent-border)] p-2.5 rounded-lg text-[var(--foreground)] mt-1">
                  <strong>Đáp án phỏng vấn:</strong> Với <code>queueMicrotask</code>, vì Event Loop buộc phải dọn sạch microtask queue mới được sang bước tiếp theo, nên queue không bao giờ rỗng ➔ <strong>Trình duyệt bị treo hoàn toàn, không thể click, không thể render!</strong>
                  <br />
                  Với <code>setTimeout</code>, vì mỗi vòng lặp chỉ lấy 1 task rồi nhường quyền cho Render, nên trình duyệt vẫn vẽ lại được và giao diện không bị đóng băng.
                </div>
              </div>

              {/* Trap 2 */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Bẫy 2: Node.js: process.nextTick vs Promise.then</span>
                </div>
                <p className="text-xs text-[var(--foreground)] leading-relaxed">
                  <strong>Câu hỏi:</strong> Trong Node.js, <code>process.nextTick()</code> và <code>Promise.resolve().then()</code> cái nào chạy trước?
                </p>
                <div className="text-[11px] bg-[var(--card-subtle)] border border-[var(--border-subtle)] p-2.5 rounded-lg text-[var(--foreground)] mt-1">
                  <strong>Đáp án phỏng vấn:</strong> Trong Node.js, <code>process.nextTick</code> thuộc về một hàng đợi đặc biệt gọi là <em>nextTickQueue</em>. Nó luôn được xử lý <strong>TRƯỚC</strong> cả <em>microtaskQueue</em> (Promise). Do đó <code>nextTick</code> luôn thắng!
                </div>
              </div>

              {/* Trap 3 */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Bẫy 3: setTimeout(fn, 0) có thực sự là 0 mili-giây?</span>
                </div>
                <p className="text-xs text-[var(--foreground)] leading-relaxed">
                  <strong>Câu hỏi:</strong> <code>setTimeout(fn, 0)</code> có chạy ngay lập tức không?
                </p>
                <div className="text-[11px] bg-[var(--card-subtle)] border border-[var(--border-subtle)] p-2.5 rounded-lg text-[var(--foreground)] mt-1">
                  <strong>Đáp án phỏng vấn:</strong> Không bao giờ là 0ms tuyệt đối. Theo chuẩn HTML5, các lệnh setTimeout lồng nhau (nested &gt; 5 cấp) bị trình duyệt ép độ trễ tối thiểu (minimum clamping) là <strong>4ms</strong>. Hơn nữa, nó còn phải đợi Call Stack rỗng và Microtask queue dọn sạch.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
