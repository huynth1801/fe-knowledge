'use client';

import React, { useState } from 'react';
import { Layers, GitCommit, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function ReactCheatsheet() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'diffing-rules' | 'traps'>('traps');

  // Answers toggle state for Tab 3 (Quiz questions)
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  return (
    <div className="space-y-7 animate-in fade-in max-w-5xl">
      {/* 1. Tóm tắt ngay đầu trang: 1 câu + 3 bước đánh số với đúng 3 màu nhất quán */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <p className="text-[17px] leading-relaxed text-[var(--foreground)] font-medium">
          <strong>Quy tắc cốt lõi của React Reconciler:</strong> Tính toán ngầm trong RAM ở <strong>Render Phase</strong> (không chặn Main Thread) ➔ gom hết thay đổi ➔ ghi đồng bộ vào Real DOM một lần duy nhất ở <strong>Commit Phase</strong>.
        </p>

        {/* 3 bước đánh số nhất quán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Bước 1: Render Phase (Vàng hổ phách) */}
          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                1
              </span>
              <span className="text-[16px] font-bold text-amber-950">
                Render Phase (Bất đồng bộ)
              </span>
            </div>
            <p className="text-[15px] text-amber-900 leading-snug">
              Duyệt cây Fiber, chạy hàm Component, tính Diffing và gắn cờ <code>flags</code> ngầm trong RAM. <strong>Có thể tạm ngắt/hủy bỏ</strong>.
            </p>
          </div>

          {/* Bước 2: Commit Phase (Xanh lá) */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                2
              </span>
              <span className="text-[16px] font-bold text-emerald-950">
                Commit Phase (Đồng bộ)
              </span>
            </div>
            <p className="text-[15px] text-emerald-900 leading-snug">
              Chạy 1 lần duy nhất: đột biến DOM thật, gọi <code>useLayoutEffect</code>, vẽ trình duyệt, rồi gọi <code>useEffect</code>. <strong>Không thể ngắt</strong>.
            </p>
          </div>

          {/* Bước 3: Dual Buffering Swap (Xanh dương) */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                3
              </span>
              <span className="text-[16px] font-bold text-blue-900">
                Pointer Swap
              </span>
            </div>
            <p className="text-[15px] text-blue-800 leading-snug">
              Hoán đổi con trỏ <code>root.current = workInProgress</code>. Cây vừa vẽ ngầm lập tức trở thành cây chính thức hiển thị cho người dùng.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Clean Underline Tabs */}
      <div className="flex items-center border-b border-[var(--border)] gap-8">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'architecture'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Kiến trúc Fiber & Dual Buffering
        </button>

        <button
          onClick={() => setActiveTab('diffing-rules')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'diffing-rules'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Diffing & Danh bạ Hooks
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

      {/* 3. TAB 1: KIẾN TRÚC FIBER & DUAL BUFFERING */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Cấu trúc một Fiber Node */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Bản chất của Fiber: Đơn vị công việc (Unit of Work)
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Trước React 16 (Stack Reconciler), React gọi đệ quy đồng bộ duyệt qua toàn bộ cây ảo. Nếu cây quá lớn, nó sẽ khóa chặt Main Thread làm ứng dụng bị đơ (jank). <strong>Fiber Node</strong> ra đời như một JavaScript Object lưu giữ con trỏ danh sách liên kết:
            </p>

            <div className="p-4 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] font-mono text-[14px] leading-relaxed space-y-1.5">
              <div><strong className="text-purple-700">child:</strong> con trỏ tới component con đầu tiên</div>
              <div><strong className="text-purple-700">sibling:</strong> con trỏ tới component anh em kế bên</div>
              <div><strong className="text-purple-700">return:</strong> con trỏ quay lại component cha (giống Call Stack frame)</div>
              <div><strong className="text-amber-800">alternate:</strong> con trỏ trỏ giữa <code>current</code> và <code>workInProgress</code></div>
              <div><strong className="text-blue-700">memoizedState:</strong> danh sách liên kết lưu giá trị các hooks (useState, useEffect)</div>
              <div><strong className="text-emerald-700">flags (effectTag):</strong> cờ đánh dấu cần làm gì ở DOM (Placement, Update, Deletion)</div>
            </div>
          </div>

          {/* Bảng so sánh 2 Phase */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              So sánh Render Phase vs Commit Phase
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[15px]">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] font-mono text-[13px]">
                    <th className="py-2.5 pr-4 font-semibold">Tiêu chí</th>
                    <th className="py-2.5 px-4 font-semibold text-amber-900 bg-amber-50/50">Render Phase</th>
                    <th className="py-2.5 pl-4 font-semibold text-emerald-900 bg-emerald-50/50">Commit Phase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[16px]">
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[var(--foreground)]">Tính chất</td>
                    <td className="py-3 px-4 text-amber-950 font-medium">Bất đồng bộ (Asynchronous)</td>
                    <td className="py-3 pl-4 text-emerald-950 font-medium">Đồng bộ (Synchronous)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[var(--foreground)]">Có thể bị ngắt?</td>
                    <td className="py-3 px-4 text-amber-950">Có thể dừng/hủy bỏ khi có event ưu tiên hơn</td>
                    <td className="py-3 pl-4 text-emerald-950">Không thể ngắt, chạy 1 mạch tới khi xong</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[var(--foreground)]">Tác động DOM thật</td>
                    <td className="py-3 px-4 text-amber-950">Tuyệt đối không đụng vào DOM thật</td>
                    <td className="py-3 pl-4 text-emerald-950">Đột biến DOM thật (insert, update, remove)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[var(--foreground)]">Lifecycle / Hooks</td>
                    <td className="py-3 px-4 text-amber-950 font-mono text-[14px]">Component function, useMemo</td>
                    <td className="py-3 pl-4 text-emerald-950 font-mono text-[14px]">useLayoutEffect ➔ Paint ➔ useEffect</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: DIFFING & DANH BẠ HOOKS */}
      {activeTab === 'diffing-rules' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Thuật toán Diffing O(n) */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Thuật toán Diffing Heuristics: Tại sao đạt được độ phức tạp O(n)?
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              So sánh hai cây bất kỳ thông thường tốn <strong>O(n³)</strong> thao tác. React giảm xuống <strong>O(n)</strong> nhờ 2 giả định thực tế:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-[17px] text-[var(--foreground)]">
              <li>
                <strong>Hai element khác loại (Type) sẽ sinh ra hai cây khác nhau:</strong> Nếu đổi từ <code>&lt;div&gt;</code> sang <code>&lt;p&gt;</code>, React đập bỏ toàn bộ cây con cũ và tạo lại từ đầu, không tốn công so sánh từng nhánh con.
              </li>
              <li>
                <strong>Nhận diện phần tử qua thuộc tính <code>key</code>:</strong> Lập trình viên cung cấp <code>key</code> duy nhất cho các phần tử anh em trong danh sách để React nhận diện phần tử nào được thêm, bớt hoặc di chuyển.
              </li>
            </ol>
          </div>

          {/* Bản chất Hooks là Singly Linked List */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Tại sao không được gọi Hook trong if / else hay loops?
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              React <strong>không hề lưu trữ Hooks theo tên biến</strong> (như <code>count</code> hay <code>name</code>). Khi component mount lần đầu, React tạo ra một danh sách liên kết đơn (Singly Linked List) trên thuộc tính <code>memoizedState</code> của Fiber node:
            </p>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-950 font-mono text-[15px] space-y-2">
              <div>memoizedState ➔ [Hook 1: useState] ➔ .next ➔ [Hook 2: useEffect] ➔ .next ➔ [Hook 3: useState]</div>
            </div>

            <p className="text-[16px] text-[var(--muted)] leading-relaxed">
              Ở mỗi lần Re-render tiếp theo, React duyệt lại danh sách này theo con trỏ <code>workInProgressHook = workInProgressHook.next</code>. Nếu có một câu lệnh <code>if</code> làm Hook 2 không được gọi, Hook 3 sẽ bị khớp nhầm vào state của Hook 2 ➔ dữ liệu đảo lộn và ứng dụng crash ngay lập tức!
            </p>
          </div>
        </div>
      )}

      {/* 5. TAB 3: CÂU HỎI BẪY PHỎNG VẤN */}
      {activeTab === 'traps' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Câu hỏi bẫy phỏng vấn thường gặp
            </h3>
            <p className="text-[17px] text-[var(--muted)] mt-1">
              Đoán trước cách React xử lý, rồi bấm Xem đáp án để đối chiếu với kiến thức Reconciler thực tế.
            </p>
          </div>

          {/* Bẫy 1: useLayoutEffect vs useEffect */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              1. useLayoutEffect khác gì useEffect về thời điểm thực thi và hiện tượng chớp nháy (Flicker)?
            </h4>
            <div className="p-4 rounded-xl bg-[var(--code-bg)] text-[var(--code-fg)] font-mono text-[15px] leading-relaxed">
              <div>useEffect(() =&gt; &#123; /* Chạy khi nào? */ &#125;);</div>
              <div>useLayoutEffect(() =&gt; &#123; /* Chạy khi nào? */ &#125;);</div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer1((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer1 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer1 ? 'Đã hiển thị phân tích' : 'Hook nào chạy chặn Paint?'}
              </span>
            </div>

            {showAnswer1 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Đáp án:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <code>useLayoutEffect</code>: Chạy <strong>đồng bộ ngay sau khi DOM được cập nhật nhưng TRƯỚC KHI trình duyệt vẽ ra màn hình (Paint)</strong>. Dùng khi cần đo kích thước DOM (<code>getBoundingClientRect</code>) và điều chỉnh lại toạ độ để người dùng không thấy giao diện bị giật nảy (flicker).
                  </li>
                  <li>
                    <code>useEffect</code>: Chạy <strong>bất đồng bộ SAU KHI trình duyệt đã Paint xong</strong> (không chặn thao tác người dùng). Thích hợp cho 99% tác vụ gọi API, lắng nghe event, subscriptions.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 2: Automatic Batching trong React 18 */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              2. Đoạn mã sau Re-render bao nhiêu lần trên React 17 so với React 18?
            </h4>
            <div className="p-4 rounded-xl bg-[var(--code-bg)] text-[var(--code-fg)] font-mono text-[15px] leading-relaxed">
              <div>setTimeout(() =&gt; &#123;</div>
              <div className="pl-4">setCount(c =&gt; c + 1);</div>
              <div className="pl-4">setFlag(f =&gt; !f);</div>
              <div>&#125;, 1000);</div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer2((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer2 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer2 ? 'Đã hiển thị phân tích' : '17 hay 18 batching khác nhau ra sao?'}
              </span>
            </div>

            {showAnswer2 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Đáp án:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>React 17: Re-render 2 lần.</strong> Do setTimeout là Macrotask nằm ngoài Synthetic Event handler của React, mỗi lệnh setState re-render ngay tức thì.
                  </li>
                  <li>
                    <strong>React 18: Chỉ Re-render 1 lần duy nhất!</strong> React 18 giới thiệu <em>Automatic Batching</em>: gom tất cả các lệnh state update trong setTimeout, Promise, Native Event vào một lượt Microtask duy nhất.
                  </li>
                  <li>
                    <em>Mẹo phỏng vấn:</em> Nếu muốn ép re-render ngay trong React 18, dùng <code>ReactDOM.flushSync(() =&gt; setCount(...))</code>.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 3: Hậu quả của key={Math.random()} */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              3. Điều gì xảy ra khi đặt key={'{Math.random()}'} cho một input hoặc card component?
            </h4>
            <div className="p-4 rounded-xl bg-[var(--code-bg)] text-[var(--code-fg)] font-mono text-[15px] leading-relaxed">
              <div>&lt;InputRow key=&#123;Math.random()&#125; value=&#123;item&#125; /&gt;</div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer3((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer3 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer3 ? 'Đã hiển thị phân tích' : 'Tại sao input bị mất focus liên tục?'}
              </span>
            </div>

            {showAnswer3 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Hậu quả nghiêm trọng:</strong>
                </p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>
                    <strong>Hủy bỏ và tạo mới DOM node liên tục (Unmount &amp; Remount):</strong> Mỗi lần re-render, <code>Math.random()</code> sinh ra key mới, React coi đó là node hoàn toàn xa lạ, phá hủy Fiber node cũ và tạo mới.
                  </li>
                  <li>
                    <strong>Mất focus khi gõ phím:</strong> Khi người dùng vừa gõ 1 ký tự, component unmount, con trỏ chuột mất tiêu điểm (blur).
                  </li>
                  <li>
                    <strong>Mất toàn bộ Local State và trigger lại toàn bộ useEffect:</strong> Gây sụt giảm nghiêm trọng hiệu năng.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
