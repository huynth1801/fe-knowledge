'use client';

import React, { useState } from 'react';
import { Activity, Gauge, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function WebVitalsCheatsheet() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'techniques' | 'traps'>('traps');

  // Answers toggle state for Tab 3 (Quiz questions)
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  return (
    <div className="space-y-7 animate-in fade-in max-w-5xl">
      {/* 1. Tóm tắt ngay đầu trang */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <p className="text-[17px] leading-relaxed text-[var(--foreground)] font-medium">
          <strong>3 Trụ cột Core Web Vitals của Google:</strong> Đo lường trải nghiệm người dùng thực tế (Field Data) ảnh hưởng trực tiếp tới <strong>thứ hạng SEO</strong> và <strong>tỷ lệ chuyển đổi (Conversion Rate)</strong>.
        </p>

        {/* 3 khối đánh số nhất quán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Khối 1: LCP */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                1
              </span>
              <span className="text-[16px] font-bold text-blue-900">
                LCP: Tốc độ tải (&le; 2.5s)
              </span>
            </div>
            <p className="text-[15px] text-blue-800 leading-snug">
              Thời gian để khối nội dung lớn nhất (ảnh hero banner, tiêu đề H1) vẽ xong lên màn hình.
            </p>
          </div>

          {/* Khối 2: INP */}
          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                2
              </span>
              <span className="text-[16px] font-bold text-amber-950">
                INP: Độ phản hồi (&le; 200ms)
              </span>
            </div>
            <p className="text-[15px] text-amber-900 leading-snug">
              Độ trễ từ lúc click/gõ phím tới khi trình duyệt vẽ xong khung hình phản hồi. Tránh Long Tasks &gt; 50ms.
            </p>
          </div>

          {/* Khối 3: CLS */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                3
              </span>
              <span className="text-[16px] font-bold text-emerald-950">
                CLS: Độ ổn định (&le; 0.1)
              </span>
            </div>
            <p className="text-[15px] text-emerald-900 leading-snug">
              Mức độ giật nhảy layout bất ngờ do ảnh thiếu kích thước hoặc chèn banner quảng cáo động muộn.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Clean Underline Tabs */}
      <div className="flex items-center border-b border-[var(--border)] gap-8">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'metrics'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Ngưỡng chuẩn Google Vitals
        </button>

        <button
          onClick={() => setActiveTab('techniques')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'techniques'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Kỹ thuật giải phóng Main Thread
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

      {/* 3. TAB 1: NGƯỠNG CHUẨN */}
      {activeTab === 'metrics' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Bảng tiêu chuẩn đánh giá Core Web Vitals (Theo phần trăm người dùng P75)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[15px]">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] font-mono text-[13px]">
                    <th className="py-2.5 pr-4 font-semibold">Chỉ số</th>
                    <th className="py-2.5 px-4 font-semibold text-emerald-900 bg-emerald-50/50">Tốt (Good)</th>
                    <th className="py-2.5 px-4 font-semibold text-amber-900 bg-amber-50/50">Cần cải thiện</th>
                    <th className="py-2.5 pl-4 font-semibold text-rose-900 bg-rose-50/50">Kém (Poor)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[16px]">
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[var(--foreground)] font-mono">LCP</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold font-mono">&le; 2.5s</td>
                    <td className="py-3 px-4 text-amber-800 font-mono">2.5s - 4.0s</td>
                    <td className="py-3 pl-4 text-rose-700 font-bold font-mono">&gt; 4.0s</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[var(--foreground)] font-mono">INP</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold font-mono">&le; 200ms</td>
                    <td className="py-3 px-4 text-amber-800 font-mono">200ms - 500ms</td>
                    <td className="py-3 pl-4 text-rose-700 font-bold font-mono">&gt; 500ms</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[var(--foreground)] font-mono">CLS</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold font-mono">&le; 0.1</td>
                    <td className="py-3 px-4 text-amber-800 font-mono">0.1 - 0.25</td>
                    <td className="py-3 pl-4 text-rose-700 font-bold font-mono">&gt; 0.25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: KỸ THUẬT GIẢI PHÓNG MAIN THREAD */}
      {activeTab === 'techniques' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Các chiến lược Senior để không bao giờ nghẽn Main Thread
            </h3>

            <div className="space-y-3 text-[16px] leading-relaxed">
              <div className="p-4 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] space-y-1">
                <strong className="text-emerald-800 font-mono">1. scheduler.yield() (Task Chunking)</strong>
                <p className="text-[15px] text-[var(--muted)]">
                  Chia nhỏ tác vụ lặp 100ms thành các phần 20ms. Mỗi phần gọi <code>await scheduler.yield()</code> để trả quyền cho trình duyệt vẽ spinner hoặc xử lý click của người dùng.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] space-y-1">
                <strong className="text-blue-800 font-mono">2. Web Workers (Off-main-thread Computation)</strong>
                <p className="text-[15px] text-[var(--muted)]">
                  Chuyển các tác vụ nặng (xử lý ảnh, parse file Excel/JSON 50MB, giải nén zip, mã hóa crypto) sang chạy trên luồng riêng của Web Worker. Main Thread luôn giữ ở mức 60 FPS.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] space-y-1">
                <strong className="text-purple-800 font-mono">3. Virtual List / Windowing (@tanstack/react-virtual)</strong>
                <p className="text-[15px] text-[var(--muted)]">
                  Khi danh sách có 100.000 phần tử, chỉ render đúng 20 phần tử nằm vừa vặn trong Viewport + 5 phần tử đệm (buffer). Số lượng DOM node luôn không đổi &lt; 50 nodes.
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
              Câu hỏi bẫy phỏng vấn Core Web Vitals
            </h3>
            <p className="text-[17px] text-[var(--muted)] mt-1">
              Phân biệt giữa môi trường kiểm thử (Lab) và trải nghiệm người dùng thực (Field).
            </p>
          </div>

          {/* Bẫy 1: INP vs FID */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              1. Tại sao Google loại bỏ FID (First Input Delay) và thay thế bằng INP (Interaction to Next Paint)?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer1((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer1 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer1 ? 'Đã hiển thị phân tích' : 'FID chỉ đo cú click đầu tiên, INP đo toàn bộ vòng đời'}
              </span>
            </div>

            {showAnswer1 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Sự nâng cấp quan trọng:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>FID chỉ đo cú tương tác ĐẦU TIÊN</strong> khi trang tải xong và chỉ tính thời gian chờ trước khi event handler bắt đầu chạy (Input Delay), hoàn toàn bỏ qua thời gian chạy event handler và thời gian vẽ khung hình tiếp theo (Next Paint).
                  </li>
                  <li>
                    <strong>INP đo TẤT CẢ các tương tác</strong> (click, gõ phím, tap trên màn hình cảm ứng) trong suốt toàn bộ thời gian người dùng duyệt web, và tính tổng cả 3 giai đoạn: Input Delay + Processing Time + Presentation Delay. Trang web có thể tải nhanh nhưng nếu lúc người dùng gõ vào ô tìm kiếm mà bị lag giật, INP sẽ báo đỏ ngay!
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 2: 4 Sub-parts của LCP */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              2. Khi chỉ số LCP bị kém (ví dụ 4.5s), bạn phân tích 4 thành phần con của LCP như thế nào để tìm ra nguyên nhân gốc rễ?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer2((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer2 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer2 ? 'Đã hiển thị phân tích' : 'TTFB, Load Delay, Load Duration, Render Delay'}
              </span>
            </div>

            {showAnswer2 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>4 Pha con của LCP theo chuẩn Google:</strong>
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li><strong>TTFB (Time to First Byte):</strong> Thời gian server trả về byte HTML đầu tiên. Nếu quá 800ms ➔ cần tối ưu database hoặc dùng CDN Edge Cache.</li>
                  <li><strong>Resource Load Delay:</strong> Khoảng thời gian từ khi có HTML tới khi trình duyệt bắt đầu tải ảnh LCP. Nếu ảnh bị giấu trong CSS ➔ thêm <code>&lt;link rel=&quot;preload&quot;&gt;</code> hoặc <code>priority</code> trong Next Image.</li>
                  <li><strong>Resource Load Duration:</strong> Thời gian tải file ảnh qua mạng. Nếu ảnh 5MB ➔ nén về WebP/AVIF dưới 200KB.</li>
                  <li><strong>Element Render Delay:</strong> Ảnh tải xong nhưng chưa vẽ được do Main Thread bị chặn bởi JS bundle nặng ➔ defer JS không cần thiết.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Bẫy 3: Lab Data vs Field Data */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              3. Tại sao điểm số Lighthouse 100/100 trên máy của bạn không đồng nghĩa với việc website vượt qua bài kiểm tra Core Web Vitals của Google?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer3((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer3 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer3 ? 'Đã hiển thị phân tích' : 'Phân biệt Lab Data (Lighthouse) và Field Data (CrUX)'}
              </span>
            </div>

            {showAnswer3 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Khác biệt bản chất:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Lighthouse (Lab Data):</strong> Chạy trên máy của bạn với cấu hình mạng giả lập trong một phiên duyệt duy nhất, không có tương tác người dùng thực (không đo được INP chính xác).
                  </li>
                  <li>
                    <strong>CrUX (Chrome User Experience Report - Field Data):</strong> Dữ liệu Google thu thập từ hàng triệu người dùng thực tế trong 28 ngày qua, trên nhiều thiết bị Android giá rẻ, mạng 3G/4G chập chờn. <strong>Google CHỈ dùng Field Data để xếp hạng SEO!</strong>
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
