'use client';

import React, { useState } from 'react';
import { CheckCircle2, Lock, ShieldAlert, Sparkles } from 'lucide-react';

export function ClosureCheatsheet() {
  const [activeTab, setActiveTab] = useState<'concepts' | 'applications' | 'traps'>('concepts');

  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <p className="text-[17px] leading-relaxed text-[var(--foreground)] font-medium">
          <strong>Định nghĩa chuẩn:</strong> Closure là cơ chế một hàm có thể <strong>ghi nhớ và truy cập</strong> các biến thuộc môi trường từ vựng (Lexical Scope) nơi nó được sinh ra, ngay cả khi hàm cha đã hoàn tất thực thi và rút khỏi Call Stack.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-1">
            <span className="text-[16px] font-bold text-indigo-950 font-serif block">
              1. Lexical Scope
            </span>
            <p className="text-[15px] text-indigo-900 leading-snug">
              Phạm vi biến được xác định <strong>tại thời điểm viết code</strong> (vị trí khai báo), không phụ thuộc vào nơi hàm được gọi.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1">
            <span className="text-[16px] font-bold text-amber-950 font-serif block">
              2. Heap Preservation
            </span>
            <p className="text-[15px] text-amber-900 leading-snug">
              Garbage Collector <strong>không thu hồi</strong> biến của cha nếu hàm con còn sống và giữ tham chiếu tới chúng.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <span className="text-[16px] font-bold text-emerald-950 font-serif block">
              3. Private State
            </span>
            <p className="text-[15px] text-emerald-900 leading-snug">
              Tạo ra các biến riêng tư mà thế giới bên ngoài không thể truy cập hay sửa đổi trực tiếp.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[var(--border)] gap-8">
        <button
          onClick={() => setActiveTab('concepts')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'concepts'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Cơ chế & Bản chất
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'applications'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Ứng dụng thực tế
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'traps'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Bẫy phỏng vấn & Memory Leak
        </button>
      </div>

      {/* TAB 1: Cơ chế & Bản chất */}
      {activeTab === 'concepts' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-3">
            <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
              Scope Chain hoạt động như thế nào?
            </h3>
            <p className="text-[17px] leading-relaxed text-[var(--foreground)]">
              Khi JavaScript Engine gặp một biến trong hàm, nó sẽ tìm kiếm tuần tự theo <strong>Scope Chain</strong>:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-[16px] text-[var(--foreground)]">
              <li>
                <strong>Local Scope (Phạm vi cục bộ):</strong> Tìm kiếm trong chính hàm đang chạy.
              </li>
              <li>
                <strong>Outer Lexical Scopes (Các Closure cha bao bọc):</strong> Tìm ngược lên môi trường chứa hàm đó.
              </li>
              <li>
                <strong>Global Scope:</strong> Phạm vi toàn cục (`window` trong trình duyệt hoặc `global` trong Node.js).
              </li>
              <li>
                Nếu lên tới đỉnh Global mà vẫn không thấy ➔ Quăng lỗi <code>ReferenceError: x is not defined</code>.
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB 2: Ứng dụng thực tế */}
      {activeTab === 'applications' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-2">
            <h4 className="font-bold text-[17px] text-[var(--foreground)]">
              1. Data Privacy & Module Pattern (Đóng gói dữ liệu riêng tư)
            </h4>
            <p className="text-[16px] text-[var(--foreground)] leading-relaxed">
              Trước khi JavaScript có `#privateField` trong class, Closure là cách duy nhất để tạo ra các biến private không thể bị truy cập hay can thiệp từ bên ngoài.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-2">
            <h4 className="font-bold text-[17px] text-[var(--foreground)]">
              2. Function Currying & Partial Application
            </h4>
            <p className="text-[16px] text-[var(--foreground)] leading-relaxed">
              Chuyển đổi một hàm nhiều tham số thành chuỗi các hàm 1 tham số: <code>add(5)(10)</code>. Hàm bên trong ghi nhớ tham số <code>5</code> thông qua Closure.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-2">
            <h4 className="font-bold text-[17px] text-[var(--foreground)]">
              3. Memoization (Bộ nhớ đệm tính toán)
            </h4>
            <p className="text-[16px] text-[var(--foreground)] leading-relaxed">
              Tạo một đối tượng <code>cache</code> đóng kín trong Closure để lưu lại kết quả của các hàm tính toán nặng (như tính Fibonacci, factorial).
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Bẫy phỏng vấn */}
      {activeTab === 'traps' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
            <h4 className="font-bold text-[17px] text-[var(--foreground)]">
              Bẫy 1: Memory Leak khi Closure giữ tham chiếu tới DOM khổng lồ
            </h4>
            <div className="rounded-xl bg-[#1F1E1D] p-4 text-[#EDE8DF] font-mono text-[15px] leading-relaxed overflow-x-auto">
              <pre>{`function setupHandler() {
  const hugeData = new Array(1000000).fill("data");
  return function handleClick() {
    console.log("Clicked!");
    // hugeData không hề được dùng ở đây, nhưng có bị leak không?
  };
}`}</pre>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAnswer1(!showAnswer1)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-subtle)] text-[15px] font-semibold text-[var(--foreground)] cursor-pointer"
              >
                {showAnswer1 ? 'Ẩn phân tích' : 'Xem phân tích V8'}
              </button>
            </div>
            {showAnswer1 && (
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-300 text-[16px] text-amber-950 space-y-1.5 animate-in fade-in">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Cơ chế tối ưu của V8 Engine:</span>
                </div>
                <p className="text-[15px] leading-relaxed">
                  Các JavaScript Engine hiện đại (như V8) có cơ chế phân tích tĩnh (Static Analysis). Nếu một biến không được tham chiếu trong bất kỳ hàm con nào, V8 sẽ tự động loại bỏ biến đó khỏi Scope Object để tránh lãng phí RAM! Tuy nhiên, nếu bạn dùng <code>eval()</code> trong hàm, V8 sẽ buộc phải giữ lại toàn bộ biến vì không thể tối ưu tĩnh.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
