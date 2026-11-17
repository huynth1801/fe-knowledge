'use client';

import React, { useState } from 'react';
import { Globe, Server, Zap, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function NextRenderingCheatsheet() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'hydration-streaming' | 'traps'>('traps');

  // Answers toggle state for Tab 3 (Quiz questions)
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  return (
    <div className="space-y-7 animate-in fade-in max-w-5xl">
      {/* 1. Tóm tắt ngay đầu trang: 1 câu + 3 khối đánh số theo đúng 3 màu nhất quán */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <p className="text-[17px] leading-relaxed text-[var(--foreground)] font-medium">
          <strong>Bản chất của các chiến lược Rendering hiện đại:</strong> Cân bằng giữa <strong>Tốc độ TTFB (Time to First Byte)</strong> ➔ <strong>Kích thước file JavaScript gửi về Client</strong> ➔ <strong>Độ tươi mới của dữ liệu (Data Freshness)</strong>.
        </p>

        {/* 3 khối đánh số nhất quán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Khối 1: SSR (Xanh dương) */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                1
              </span>
              <span className="text-[16px] font-bold text-blue-900">
                SSR (Dynamic)
              </span>
            </div>
            <p className="text-[15px] text-blue-800 leading-snug">
              Mỗi request sinh ra HTML mới. Dữ liệu luôn tươi 100%, nhưng phụ thuộc tốc độ DB (TTFB chậm hơn SSG).
            </p>
          </div>

          {/* Khối 2: ISR (Vàng hổ phách) */}
          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                2
              </span>
              <span className="text-[16px] font-bold text-amber-950">
                ISR (Stale-While-Revalidate)
              </span>
            </div>
            <p className="text-[15px] text-amber-900 leading-snug">
              Lưu cache HTML tại Edge CDN (TTFB &lt; 20ms). Hết hạn thời gian (TTL) ➔ tự động sinh lại ngầm trong nền.
            </p>
          </div>

          {/* Khối 3: RSC & Streaming (Xanh lá) */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                3
              </span>
              <span className="text-[16px] font-bold text-emerald-950">
                RSC &amp; Streaming
              </span>
            </div>
            <p className="text-[15px] text-emerald-900 leading-snug">
              Giữ code nặng ở Server (0 KB client bundle). Stream ngay Shell HTML kèm Skeleton qua HTTP chunked stream.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Clean Underline Tabs */}
      <div className="flex items-center border-b border-[var(--border)] gap-8">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'matrix'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Ma trận so sánh các chiến lược
        </button>

        <button
          onClick={() => setActiveTab('hydration-streaming')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'hydration-streaming'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Hydration &amp; Streaming HTML
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

      {/* 3. TAB 1: MA TRẬN SO SÁNH */}
      {activeTab === 'matrix' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Bảng ma trận quyết định chiến lược Rendering
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[15px]">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] font-mono text-[13px]">
                    <th className="py-2.5 pr-3 font-semibold">Chiến lược</th>
                    <th className="py-2.5 px-3 font-semibold">Thời điểm sinh HTML</th>
                    <th className="py-2.5 px-3 font-semibold">Tốc độ TTFB</th>
                    <th className="py-2.5 px-3 font-semibold">Độ tươi của dữ liệu</th>
                    <th className="py-2.5 pl-3 font-semibold">Trường hợp sử dụng lý tưởng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[15px]">
                  <tr>
                    <td className="py-3 pr-3 font-bold text-blue-900 font-mono">SSR</td>
                    <td className="py-3 px-3">Mỗi khi có HTTP Request</td>
                    <td className="py-3 px-3 text-amber-800 font-mono">100ms - 500ms</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Thời gian thực (100%)</td>
                    <td className="py-3 pl-3 text-[var(--muted)]">Trang Dashboard, giỏ hàng, thông tin theo User session.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-3 font-bold text-emerald-900 font-mono">SSG</td>
                    <td className="py-3 px-3">Lúc chạy lệnh build</td>
                    <td className="py-3 px-3 text-emerald-700 font-mono font-bold">&lt; 20ms (Edge CDN)</td>
                    <td className="py-3 px-3 text-rose-700">Tĩnh (chỉ đổi khi build lại)</td>
                    <td className="py-3 pl-3 text-[var(--muted)]">Trang giới thiệu (About), Điều khoản sử dụng, Landing page.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-3 font-bold text-amber-900 font-mono">ISR</td>
                    <td className="py-3 px-3">Build time + Revalidate ngầm</td>
                    <td className="py-3 px-3 text-emerald-700 font-mono font-bold">&lt; 20ms (Edge CDN)</td>
                    <td className="py-3 px-3 text-amber-800">Cập nhật theo chu kỳ TTL</td>
                    <td className="py-3 pl-3 text-[var(--muted)]">Trang tin tức, bài viết Blog, trang sản phẩm thương mại điện tử.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-3 font-bold text-purple-900 font-mono">RSC &amp; Stream</td>
                    <td className="py-3 px-3">Stream từng chunk qua HTTP</td>
                    <td className="py-3 px-3 text-emerald-700 font-mono font-bold">&lt; 50ms (Shell FCP)</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">Thời gian thực</td>
                    <td className="py-3 pl-3 text-[var(--muted)]">Các trang có khối dữ liệu nhanh và khối dữ liệu chậm (Reviews, Charts).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: HYDRATION & STREAMING */}
      {activeTab === 'hydration-streaming' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Hydration */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Bản chất của quá trình Hydration
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Trình duyệt nhận về một chuỗi HTML đã có cấu trúc DOM, nhưng chưa thể bấm nút hay mở dropdown. <strong>Hydration</strong> là tiến trình React chạy trên máy khách, đọc Virtual DOM từ mã JavaScript tải về, đối chiếu từng phần tử với DOM thực tế, và gắn các bộ lắng nghe sự kiện (Event Listeners).
            </p>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[15px] space-y-1">
              <strong>Vấn đề kinh điển (The Hydration Cost):</strong>
              <p>Nếu cây component quá lớn và file JavaScript bundle nặng hàng Megabyte, thiết bị di động yếu sẽ bị đơ Main Thread (INP cao) trong suốt thời gian React duyệt cây để hydrate!</p>
            </div>
          </div>

          {/* Selective Hydration with Suspense */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Streaming HTML &amp; Selective Hydration trong React 18 / Next.js
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Nhờ có <code>&lt;Suspense&gt;</code>, React giải quyết 2 bài toán lớn:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-[17px] text-[var(--foreground)]">
              <li>
                <strong>Streaming HTML:</strong> Bạn không cần chờ toàn bộ trang render xong mới gửi về trình duyệt. Server gửi ngay Header và Skeleton trong 30ms đầu tiên, sau đó stream tiếp phần dữ liệu chậm.
              </li>
              <li>
                <strong>Selective Hydration:</strong> React có thể hydrate từng phần độc lập. Nếu người dùng bấm vào một phần tử đang chờ hydrate, React sẽ <strong>ưu tiên hydrate phần tử đó trước</strong> thay vì hydrate tuần tự từ trên xuống dưới!
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* 5. TAB 3: CÂU HỎI BẪY PHỎNG VẤN */}
      {activeTab === 'traps' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Câu hỏi bẫy phỏng vấn Next.js thường gặp
            </h3>
            <p className="text-[17px] text-[var(--muted)] mt-1">
              Đoán trước cách hoạt động của App Router, rồi bấm Xem đáp án để đối chiếu kiến thức.
            </p>
          </div>

          {/* Bẫy 1: Hydration Mismatch */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              1. Tại sao đoạn mã sau gây lỗi Hydration Mismatch và cách sửa chuẩn mực là gì?
            </h4>
            <div className="p-4 rounded-xl bg-[var(--code-bg)] text-[var(--code-fg)] font-mono text-[15px] leading-relaxed">
              <div>export default function Header() &#123;</div>
              <div className="pl-4">return &lt;div&gt;Thời gian: &#123;new Date().toLocaleTimeString()&#125;&lt;/div&gt;;</div>
              <div>&#125;</div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer1((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer1 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer1 ? 'Đã hiển thị phân tích' : 'Lệch múi giờ giữa Node server và browser'}
              </span>
            </div>

            {showAnswer1 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Nguyên nhân:</strong>
                </p>
                <p>
                  Server render lúc thời gian T1 (ở múi giờ UTC của server), nhưng khi HTML về tới máy khách và chạy JavaScript lúc thời gian T2 (ở múi giờ địa phương của người dùng). React phát hiện chuỗi text trong thẻ <code>&lt;div&gt;</code> khác nhau nên ném lỗi Hydration Mismatch.
                </p>
                <p>
                  <strong>Cách khắc phục:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Cách 1 (Chuẩn): Đặt việc lấy thời gian hoặc localStorage vào <code>useEffect</code> và lưu vào state (chỉ chạy sau khi client đã mount).
                  </li>
                  <li>
                    Cách 2: Sử dụng <code>suppressHydrationWarning</code> nếu cố tình chấp nhận lệch chuỗi hiển thị.
                  </li>
                  <li>
                    Cách 3: Dùng <code>dynamic(() =&gt; import(...), &#123; ssr: false &#125;)</code> để chỉ render hoàn toàn ở phía client.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 2: 'use client' boundary */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              2. Nếu một component cha có đánh dấu &apos;use client&apos;, các component con import bên trong nó có tự động biến thành Client Component không?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer2((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer2 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer2 ? 'Đã hiển thị phân tích' : 'Quy tắc ranh giới Server/Client (Network Boundary)'}
              </span>
            </div>

            {showAnswer2 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Đáp án: CÓ, nếu import trực tiếp; nhưng KHÔNG nếu truyền qua `children` props!</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Khi đánh dấu <code>&apos;use client&apos;</code>, bạn thiết lập một <strong>Network Boundary</strong>. Mọi file được <code>import</code> trực tiếp vào file đó đều được đóng gói vào client JavaScript bundle.
                  </li>
                  <li>
                    <em>Kỹ thuật Senior tối ưu:</em> Để giữ component con chạy ở Server (Server Component) dù nằm trong Client Component cha, hãy truyền nó qua prop <code>children</code>:
                    <br />
                    <code>&lt;ClientParent&gt;&lt;ServerChild /&gt;&lt;/ClientParent&gt;</code>. Lúc này <code>ServerChild</code> vẫn giữ nguyên bản chất là Server Component (0 KB JS)!
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 3: On-Demand Revalidation */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              3. Trong kiến trúc E-commerce lớn, tại sao nên dùng On-Demand Revalidation (revalidateTag) thay vì revalidate theo thời gian?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer3((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer3 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer3 ? 'Đã hiển thị phân tích' : 'Tối ưu tài nguyên Server & trải nghiệm kho hàng'}
              </span>
            </div>

            {showAnswer3 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Đáp án:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Nếu dùng thời gian cố định (ví dụ <code>revalidate: 60</code>), một sản phẩm không có ai sửa gì vẫn bị kích hoạt rebuild liên tục mỗi khi hết 60s, gây lãng phí tài nguyên CPU và DB server. Ngược lại, khi kho hết hàng, người dùng vẫn phải đợi tới 60s mới thấy cập nhật.
                  </li>
                  <li>
                    Với <strong>On-Demand Revalidation</strong>: Bạn có thể cache trang tĩnh vĩnh viễn (TTL = infinity). Chỉ khi nào admin bấm &quot;Cập nhật giá&quot; hoặc khách hàng đặt mua thành công, Backend gọi Webhook trigger <code>revalidateTag(&apos;product-42&apos;)</code>, bản cache mới lập tức được sinh lại ngay trong mili-giây!
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
