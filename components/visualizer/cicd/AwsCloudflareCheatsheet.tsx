'use client';

import React, { useState } from 'react';
import {
  Cloud,
  Globe,
  Server,
  Layers,
  ShieldCheck,
  Check,
  Copy,
  ChevronRight,
  Clock,
  ExternalLink,
  Cpu,
  RefreshCw,
  AlertTriangle,
  FolderTree,
  CheckCircle2,
} from 'lucide-react';

export function AwsCloudflareCheatsheet() {
  const [activeTab, setActiveTab] = useState<'aws-spa' | 'ssr-edge' | 'traps'>('aws-spa');
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
      title: 'Thảm hoạ "ChunkLoadError: Loading chunk failed" sau khi Deploy phiên bản mới',
      badge: 'Senior Incident Handling',
      pipeline: [
        { label: 'User A đang mở app v1.0', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'CI/CD chạy: s3 sync --delete (xoá sạch chunks v1.0)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'User click menu ➔ Trình duyệt tải chunk v1.0 ➔ 404 Crash!', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `// ❌ LỆNH CI/CD NGUY HIỂM: Xoá sạch file cũ ngay khi deploy mới
aws s3 sync dist/ s3://$BUCKET --delete // GÂY LỖI CHUNKLOADERROR 100%!

// ✅ CHIẾN LƯỢC SENIOR ZERO-CRASH:
// Bước 1: Upload assets mới LÊN TRƯỚC (giữ nguyên file hash cũ trong S3)
aws s3 sync dist/assets s3://$BUCKET/assets --cache-control "public, max-age=31536000, immutable"

// Bước 2: Upload index.html mới (người dùng mới lập tức nhận app mới)
aws s3 cp dist/index.html s3://$BUCKET/index.html --cache-control "no-cache, no-store, must-revalidate"

// Bước 3: Invalidate index.html tại CloudFront
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/index.html"

// (File chunk v1.0 cũ vẫn nằm an toàn trên S3 thêm 24-48h nhờ S3 Lifecycle Rule)`,
      note: 'Các file hashed chunks (main.a89bf.js) có tính bất biến. Giữ lại file cũ 48 giờ để người dùng đang mở tab cũ không bị crash.',
      answerSummary: 'Không dùng flag `--delete` ngay lập tức đối với thư mục chứa static assets có hash.',
      answerDetail:
        'Khi Single Page App đang chạy trên máy khách, trình duyệt giữ trong bộ nhớ file `index.html` của v1.0. Khi user bấm sang trang Dashboard, trình duyệt dùng dynamic import() để tải `dashboard.hash1.js`. Nếu CI/CD đã xoá file này khỏi S3, request trả về 404 và văng lỗi `ChunkLoadError`. Cách khắc phục: Chỉ ghi đè `index.html`, còn toàn bộ file trong `/assets/` chỉ thêm mới và dùng S3 Lifecycle Rule tự xoá file sau 7 ngày.',
    },
    {
      id: 1,
      title: 'Đã xóa Cache trên CloudFront (Invalidate) nhưng người dùng vẫn thấy giao diện cũ?',
      badge: 'Browser vs Edge Cache',
      pipeline: [
        { label: 'Lỗi gán Cache-Control: max-age=86400 cho index.html', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'CloudFront Invalidation xoá cache tại CDN Edge', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'Trình duyệt đọc từ Disk Cache (không hề gọi mạng!)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `// ❌ SAI LẦM: Gán chung cache header cho tất cả file:
// Nginx / S3 metadata:
Cache-Control: public, max-age=86400 // Kể cả index.html!

// KHI ĐÓ:
// Trình duyệt user lưu index.html vào bộ nhớ Disk Cache trong 24 giờ.
// Dù bạn có invalidate CloudFront hàng nghìn lần,
// trình duyệt KHÔNG HỀ GỬI REQUEST qua internet, mà đọc thẳng từ ổ cứng!

// ✅ BẮT BUỘC TÁCH BIỆT:
// 1. File index.html:
Cache-Control: no-cache, no-store, must-revalidate

// 2. File JS/CSS có hash (assets/*.js):
Cache-Control: public, max-age=31536000, immutable`,
      note: 'CloudFront Invalidation chỉ xoá cache tại Edge PoP của CDN. Không thể can thiệp vào bộ nhớ Disk Cache của trình duyệt khách hàng.',
      answerSummary: 'Tách biệt triệt để Cache-Control của `index.html` (no-cache) và Hashed Assets (immutable 1 năm).',
      answerDetail:
        'Trình duyệt tuân theo phân cấp bộ nhớ đệm: Memory Cache ➔ Disk Cache ➔ Edge CDN ➔ Origin Server. Nếu `index.html` bị gán `max-age`, trình duyệt dừng ngay ở Disk Cache mà không bao giờ chạm đến CloudFront CDN. Vì vậy, `index.html` bắt buộc phải luôn luôn có cờ `no-cache` để luôn kiểm tra phiên bản mới nhất.',
    },
    {
      id: 2,
      title: 'Next.js trên Cloudflare Pages (Edge Isolate) vs AWS ECS (Node.js Container)',
      badge: 'Kiến trúc Runtime',
      pipeline: [
        { label: 'Node.js Container (ECS Fargate)', bg: 'bg-blue-100 text-blue-950 border border-blue-300' },
        { label: 'VS', bg: 'bg-zinc-200 text-zinc-900 font-bold' },
        { label: 'Edge V8 Isolate (Cloudflare Workers)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `// Trong Next.js Route Handler:
export const runtime = 'edge'; // hoặc 'nodejs' (mặc định)

// ❌ BỊ LỖI KHI CHẠY TRÊN CLOUDFLARE EDGE:
import fs from 'fs'; // Crash! Edge không có file system
import crypto from 'crypto'; // Hạn chế, chỉ dùng Web Crypto API
import { PrismaClient } from '@prisma/client'; // Cần driver serverless / TCP proxy!

// ✅ KHI NÀO CHỌN GÌ?
// - Cloudflare Pages / Edge:
//   Khởi động 0ms, độ trễ < 15ms toàn cầu, phù hợp API nhẹ, Auth redirect, A/B testing.
// - AWS ECS Fargate Docker:
//   Hỗ trợ 100% hệ sinh thái Node.js, full RAM (1GB - 16GB), kết nối DB trực tiếp qua VPC.`,
      note: 'V8 Isolate nhẹ gấp 100 lần Container vì hàng nghìn isolates chạy chung 1 tiến trình V8, không ảo hoá OS.',
      answerSummary: 'Edge Runtime là V8 Isolate siêu nhẹ (không có Node OS API); Docker ECS là full Node.js server.',
      answerDetail:
        'Cloudflare Workers / Edge Runtime không chạy toàn bộ môi trường Node.js mà chạy trên V8 Isolates. Điều này mang lại ưu điểm vượt trội: Cold start = 0ms và phân bổ tại hơn 300 thành phố trên thế giới. Tuy nhiên, nó bị giới hạn: giới hạn CPU time (50ms), giới hạn RAM (128MB), và không hỗ trợ các thư viện phụ thuộc vào C++ native addons hoặc hệ điều hành (`fs`, `child_process`).',
    },
  ];

  const currentQ = questions[activeQuestion];

  return (
    <article className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12" aria-label="Sổ tay AWS và Cloudflare">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-zinc-600 font-semibold" aria-label="Breadcrumb">
        <span>DevOps, CI/CD &amp; Deployments</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-900 font-bold">AWS S3/CloudFront &amp; Cloudflare Edge Deployments</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-serif">
              AWS S3/CloudFront &amp; Cloudflare Edge Deployments
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-700 mt-1.5 leading-relaxed">
              Giải mã kiến trúc triển khai thực chiến chuẩn doanh nghiệp: Hosting SPA trên S3 + CloudFront với Origin Access Control (OAC), xử lý bẫy 404 Routing, Docker ECS Fargate cho Next.js SSR và Edge Caching trên Cloudflare.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-[#CC6745] text-[12px] font-semibold flex items-center gap-1 shadow-2xs font-mono">
              🔥 Senior Level
            </span>
            <span className="px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-800 text-[12px] font-semibold flex items-center gap-1 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              15 phút
            </span>
          </div>
        </div>

        {/* Feature Visual Accent: 4-Stage Zero-downtime Architecture Flow */}
        <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-4 sm:p-5 shadow-2xs" data-visual="aws-deployment-flow">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <Cloud className="w-4 h-4 text-[#CC6745]" />
              <span>Kiến trúc phân phối nội dung toàn cầu (Enterprise Content Delivery)</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold">
              Global Low-Latency Flow
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#CC6745]">1. Route 53 (DNS)</span>
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <p className="text-[11px] text-zinc-600 leading-snug">
                DNS định tuyến thông minh (Geo-location) trỏ CNAME/Alias tới Edge Distribution.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-900">2. CloudFront Edge</span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <p className="text-[11px] text-amber-900 leading-snug">
                SSL termination (ACM), nén Brotli/Gzip, DDoS WAF, và Edge Caching tại 450+ PoP.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-300 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-900">3. S3 Bucket (Private)</span>
                <FolderTree className="w-3.5 h-3.5 text-blue-700" />
              </div>
              <p className="text-[11px] text-blue-900 leading-snug">
                Kho lưu trữ tĩnh (OAC khoá kín). Chặn 100% traffic truy cập trực tiếp qua HTTP.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-900">4. Custom Error 404</span>
                <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <p className="text-[11px] text-emerald-900 leading-snug">
                Tự động map lỗi 404/403 về `index.html` với HTTP Status 200 để cứu Client Router.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Underline Tab Bar */}
      <nav className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]" aria-label="Nội dung sổ tay">
        <button
          onClick={() => setActiveTab('aws-spa')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'aws-spa'
              ? 'border-b-2 border-[#CC6745] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          SPA trên AWS S3 + CloudFront
        </button>

        <button
          onClick={() => setActiveTab('ssr-edge')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'ssr-edge'
              ? 'border-b-2 border-[#CC6745] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Next.js SSR (ECS) vs Cloudflare Edge
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'traps'
              ? 'border-b-2 border-[#CC6745] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Bẫy phỏng vấn Senior Cloud
        </button>
      </nav>

      {/* 4. Alert Banner */}
      <section className="rounded-2xl border border-red-300 bg-red-50 p-4 flex items-start gap-3.5 shadow-2xs" aria-label="Quy tắc vàng">
        <div className="w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
          !
        </div>
        <div>
          <h2 className="font-bold text-[15px] text-red-950">Quy tắc vàng bảo mật S3 Origin</h2>
          <p className="text-[14px] text-red-950 mt-0.5 leading-relaxed font-medium">
            <strong>Tuyệt đối không bật tính năng &ldquo;Static website hosting&rdquo; công khai trên S3 bucket</strong> trong môi trường Production! Bật chế độ này khiến bucket mở toang trên internet và người dùng có thể bypass CDN, làm vô hiệu hóa WAF, SSL và bộ nhớ đệm CloudFront. Luôn giữ S3 ở chế độ Private và sử dụng <strong>CloudFront Origin Access Control (OAC)</strong> để xác thực!
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: SPA TRÊN AWS S3 + CLOUDFRONT                                       */}
      {/* ========================================================================= */}
      {activeTab === 'aws-spa' && (
        <section className="space-y-6 animate-in fade-in" aria-label="SPA Deployment">
          {/* Section 1: The SPA 404 Routing Problem */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              1. Giải mã tận gốc lỗi 404 khi F5 trên trang con SPA (React Router / TanStack Router)
            </h3>
            <p className="text-sm text-zinc-700 leading-relaxed">
              Khi người dùng truy cập trang chủ <code>https://my-app.com/</code>, CloudFront đọc file <code>index.html</code> từ S3. Khi người dùng click vào link &ldquo;Dashboard&rdquo;, React Router dùng HTML5 History API (<code>pushState</code>) để đổi URL trên thanh địa chỉ thành <code>https://my-app.com/dashboard</code> mà không gọi server.
            </p>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1">
              <strong className="block font-bold">Kịch bản gây lỗi sập trang:</strong>
              <p>
                Nếu người dùng nhấn F5 (Refresh) hoặc copy link <code>https://my-app.com/dashboard</code> gửi cho bạn bè: CloudFront sẽ tìm file có key là <code>/dashboard</code> trong S3 bucket. Nhưng S3 chỉ là ổ đĩa tĩnh dạng key-value, hoàn toàn không có file nào tên là `dashboard`! S3 lập tức trả về mã lỗi <code>404 Not Found (NoSuchKey)</code>.
              </p>
            </div>

            <h4 className="font-bold text-sm text-zinc-900 pt-2">Cấu hình sửa lỗi chuẩn trên AWS CloudFront Console / Terraform:</h4>
            <div className="rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
              <pre>{`// Cấu hình CloudFront Custom Error Response:
HTTP Error Code:            404 Not Found  (hoặc 403 Forbidden tuỳ cấu hình OAC)
Customize Error Response:   Yes
Response Page Path:         /index.html    // Trả về file index.html gốc!
HTTP Response Code:         200 OK         // Ép trạng thái về 200 để browser chạy JS!

// Khi đó:
// Trình duyệt nhận được file index.html, nạp React bundle,
// React Router đọc window.location.pathname = "/dashboard"
// và render đúng component Dashboard mong muốn!`}</pre>
            </div>
          </div>

          {/* Section 2: Zero-downtime Deploy Script */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-xl font-bold font-serif text-zinc-900">
                2. Kịch bản Deploy CI/CD chuẩn Enterprise (GitHub Actions / GitLab CI)
              </h3>
              <button
                onClick={() =>
                  handleCopy(
                    's3-deploy-sh',
                    `# 1. Build app với Vite/Webpack
pnpm build

# 2. Upload các file static assets có hash (Cache 1 năm)
aws s3 sync dist/assets s3://$AWS_S3_BUCKET/assets \\
  --cache-control "public, max-age=31536000, immutable"

# 3. Upload file index.html (Không được lưu cache)
aws s3 cp dist/index.html s3://$AWS_S3_BUCKET/index.html \\
  --cache-control "no-cache, no-store, must-revalidate"

# 4. Invalidate bộ nhớ đệm CloudFront cho duy nhất index.html
aws cloudfront create-invalidation \\
  --distribution-id $AWS_CLOUDFRONT_DIST_ID \\
  --paths "/index.html"`
                  )
                }
                className="text-xs font-semibold text-[#CC6745] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 's3-deploy-sh' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Sao chép script</span>
              </button>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Quy tắc vàng phân tầng bộ nhớ đệm: Chỉ cần invalidate duy nhất <code>/index.html</code> (tiết kiệm chi phí vì CloudFront chỉ miễn phí 1.000 invalidations/tháng). Mọi file JavaScript, CSS, hình ảnh đều đã gắn hash trong tên file (VD: <code>app.4f3e.js</code>) nên không bao giờ cần invalidate!
            </p>

            <pre className="text-zinc-800 font-mono text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200 overflow-x-auto leading-relaxed">
{`# BƯỚC 1: Đẩy tất cả assets (JS, CSS, SVG) vào S3 với cache 1 năm
aws s3 sync dist/assets s3://$AWS_S3_BUCKET/assets \\
  --cache-control "public, max-age=31536000, immutable"

# BƯỚC 2: Đẩy file index.html với Cache-Control cấm lưu
aws s3 cp dist/index.html s3://$AWS_S3_BUCKET/index.html \\
  --cache-control "no-cache, no-store, must-revalidate"

# BƯỚC 3: Kích hoạt huỷ cache CloudFront tức thì cho file gốc
aws cloudfront create-invalidation \\
  --distribution-id $AWS_CLOUDFRONT_DIST_ID \\
  --paths "/index.html"`}
            </pre>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: NEXT.JS SSR (ECS) VS CLOUDFLARE EDGE                               */}
      {/* ========================================================================= */}
      {activeTab === 'ssr-edge' && (
        <section className="space-y-6 animate-in fade-in" aria-label="SSR vs Edge Deployments">
          {/* Comparison Matrix */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              1. So sánh 3 mô hình Deploy Next.js trong môi trường sản xuất
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-zinc-300 text-zinc-900 font-mono">
                    <th className="py-2.5 px-3">Tiêu chí so sánh</th>
                    <th className="py-2.5 px-3 bg-zinc-50">Vercel (Managed Serverless)</th>
                    <th className="py-2.5 px-3 bg-orange-50/60 text-[#CC6745] font-bold">AWS ECS Fargate (Docker)</th>
                    <th className="py-2.5 px-3 bg-emerald-50/60 text-emerald-950 font-bold">Cloudflare Pages (Edge)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-700">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">Bản chất Runtime</td>
                    <td className="py-2.5 px-3 bg-zinc-50">AWS Lambda (Node.js microVM)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">Container Linux (Node.js LTS)</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-900">V8 Isolates (Edge Workers)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">Cold Start</td>
                    <td className="py-2.5 px-3 bg-zinc-50">200ms - 1500ms</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">0ms (Server luôn sống 24/7)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">&lt; 5ms (Siêu tốc toàn cầu)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">Hỗ trợ Node.js API</td>
                    <td className="py-2.5 px-3 bg-zinc-50">Đầy đủ (giới hạn 15p execution)</td>
                    <td className="py-2.5 px-3 font-bold text-zinc-900">100% đầy đủ (fs, native C++, threads)</td>
                    <td className="py-2.5 px-3 text-rose-700 font-medium">Bị hạn chế (Không có fs, TCP thô)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">Chi phí ở quy mô lớn</td>
                    <td className="py-2.5 px-3 bg-zinc-50 text-rose-700">Rất đắt khi bandwidth &gt; 1TB</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">Cực rẻ &amp; cố định theo tài nguyên</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">Miễn phí Bandwidth không giới hạn</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">Phù hợp nhất cho</td>
                    <td className="py-2.5 px-3 bg-zinc-50">Startup, MVPs, team nhỏ cần tốc độ</td>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">Doanh nghiệp lớn, ngân hàng, e-commerce</td>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">Landing page toàn cầu, Proxy BFF, Auth</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Docker Standalone with ALB Healthcheck */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              2. Chuẩn hoá Health Check Route cho AWS Application Load Balancer (ALB)
            </h3>
            <p className="text-sm text-zinc-700 leading-relaxed">
              Khi deploy Next.js trên Docker cluster (ECS/Kubernetes), Load Balancer liên tục ping route health check mỗi 15-30 giây để phát hiện container bị sập. Route này bắt buộc phải phản hồi cực nhanh, không chạm vào database nặng để tránh làm nghẽn CPU.
            </p>

            <div className="rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
              <pre>{`// app/api/health/route.ts
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    },
    { status: 200 }
  );
}`}</pre>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BẪY PHỎNG VẤN SENIOR CLOUD                                         */}
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
                    ? 'border-[#CC6745] bg-orange-50/40 ring-1 ring-[#CC6745]'
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
              <span className="text-xs font-mono font-bold text-[#CC6745] uppercase tracking-wider">
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
                <span className="text-xs font-mono text-zinc-600 font-semibold">Cấu hình &amp; Mã nguồn đối chiếu:</span>
                <button
                  onClick={() => handleCopy(`q-${activeQuestion}`, currentQ.code)}
                  className="text-xs font-semibold text-[#CC6745] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === `q-${activeQuestion}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
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
