'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, CheckCircle2, ChevronRight, Clock, GitPullRequest, Container, Rocket, ShieldCheck } from 'lucide-react';

export function CiCdCheatsheet() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'docker' | 'traps'>('pipeline');
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
      title: 'Next.js Docker Image nặng 1.5 GB vs Tinh gọn 120 MB với Standalone',
      badge: 'Docker Best Practice',
      pipeline: [
        { label: 'pnpm build thông thường (1.5 GB)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Bật output: "standalone"', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'Multi-stage Docker chỉ copy node_modules cần thiết (120 MB)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `// next.config.ts
const nextConfig = {
  output: 'standalone', // Tự động truy vết và chỉ gom các file thực sự chạy vào .next/standalone
};

// Dockerfile:
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]`,
      note: 'Chế độ standalone giảm kích thước Docker image từ 1.5GB xuống dưới 120MB, deploy siêu tốc.',
      answerSummary: 'Kích hoạt `output: "standalone"` và Multi-stage build',
      answerDetail:
        'Mặc định Next.js yêu cầu toàn bộ thư mục `node_modules` (thường hơn 1GB) để chạy. Khi bật `output: "standalone"`, Next.js sử dụng kỹ thuật tĩnh phân tích AST để chỉ gom đúng những file .js và package thực tế được import vào `.next/standalone`. Kết quả image Docker siêu nhẹ, bảo mật cao và khởi động trong vài giây.',
    },
    {
      id: 1,
      title: 'Bẫy rò rỉ API Keys bí mật vào mã nguồn Frontend (Client Bundle)',
      badge: 'Bảo mật CI/CD & Env',
      pipeline: [
        { label: 'Định nghĩa biến môi trường trong CI', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Đặt tiền tố NEXT_PUBLIC_DATABASE_URL', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Bị Webpack in cứng vào file JS client!', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `// ❌ THẢM HOẠ BẢO MẬT: Bất kỳ biến nào có tiền tố NEXT_PUBLIC_
// đều bị Next.js nhúng thẳng chuỗi plain-text vào file client bundle .js!
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_123456 // BỊ LỘ 100%!

// ✅ CHUẨN XÁC: Biến bí mật chỉ nằm ở Node.js Server Environment
STRIPE_SECRET_KEY=sk_live_123456 // Client bundle không thể thấy.
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_123456 // Chỉ dành cho public key.`,
      note: 'Kiểm tra bundle bằng source-map-explorer hoặc grep file .next/static để chống rò rỉ bí mật.',
      answerSummary: 'Tuyệt đối không gán tiền tố NEXT_PUBLIC_ cho Secret Key / Database URL',
      answerDetail:
        'Trong quá trình build, Next.js sẽ thay thế chuỗi `process.env.NEXT_PUBLIC_*` bằng giá trị thật. Bất kỳ ai mở F12 DevTools -> Sources đều có thể đọc được key bí mật của bạn. Các secret key chỉ được đọc ở Server Components, Server Actions hoặc Route Handlers.',
    },
    {
      id: 2,
      title: 'Tối ưu hoá Cache trong GitHub Actions: Giảm thời gian CI từ 8p xuống 45s',
      badge: 'Tối ưu hóa CI/CD',
      pipeline: [
        { label: 'Mỗi PR tải lại 100% dependencies (8 phút)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Cấu hình pnpm store cache trong GitHub Action', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'Kết hợp .next/cache ➔ CI hoàn tất sau 45s', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `- name: Setup pnpm
  uses: pnpm/action-setup@v3
  with:
    version: 9

- name: Setup Node.js with pnpm cache
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: 'pnpm' # Tự động cache thư mục ~/.pnpm-store theo hash pnpm-lock.yaml!

- name: Restore Next.js build cache
  uses: actions/cache@v4
  with:
    path: \${{ github.workspace }}/.next/cache
    key: \${{ runner.os }}-nextjs-\${{ hashFiles('**/pnpm-lock.yaml') }}-\${{ hashFiles('**/*.ts', '**/*.tsx') }}
    restore-keys: |
      \${{ runner.os }}-nextjs-\${{ hashFiles('**/pnpm-lock.yaml') }}-`,
      note: 'Cache cả package store và Turbopack/Next build cache để tăng tốc tối đa.',
      answerSummary: 'Kết hợp `actions/setup-node (cache: pnpm)` và `.next/cache`',
      answerDetail:
        'Phần lớn thời gian chạy CI bị lãng phí vào việc tải lại các gói npm qua internet và biên dịch lại các file không đổi. Sử dụng cache store của pnpm giúp bước `pnpm install` giảm từ 3 phút xuống 4 giây, và `.next/cache` giúp bỏ qua biên dịch lại các page tĩnh.',
    },
  ];

  const currentQ = questions[activeQuestion];

  return (
    <article className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12" aria-label="Sổ tay CI/CD">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-zinc-600 font-semibold" aria-label="Breadcrumb">
        <span>DevOps, CI/CD &amp; Deployments</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-900 font-bold">CI/CD Pipeline, GitHub Actions &amp; Deployments</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-serif">
              CI/CD Pipeline, GitHub Actions &amp; Deployments
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-700 mt-1.5 leading-relaxed">
              Thiết lập quy trình tự động hoá Quality Gates trên GitHub Actions (Lint, Typecheck, Test, Build), đóng gói Docker container tinh gọn và chiến lược Preview Deployments.
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

        {/* Feature Visual Accent: 5-Stage CI/CD Pipeline */}
        <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-4 sm:p-5 shadow-2xs" data-visual="cicd-pipeline-flow">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <GitPullRequest className="w-4 h-4 text-[#BD5332]" />
              <span>Chuỗi Quality Gates tự động trên Pull Request (GitHub Actions)</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold">
              Zero-defect PR Flow
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-3">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-[#BD5332]">1. Lint &amp; Format</span>
              <p className="text-[11px] text-zinc-600">Kiểm tra code style bằng ESLint / Biome, ngăn chặn lỗi cú pháp.</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-blue-900">2. Typecheck</span>
              <p className="text-[11px] text-blue-900">Chạy `tsc --noEmit`, đảm bảo 100% an toàn kiểu dữ liệu TypeScript.</p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-purple-900">3. Unit &amp; RTL</span>
              <p className="text-[11px] text-purple-900">Vitest chạy song song kiểm thử component logic &amp; user interactions.</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-amber-900">4. Build Check</span>
              <p className="text-[11px] text-amber-900">Chạy `next build`, phân tích bundle size delta so sánh với main branch.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-900">5. Preview Deploy</span>
              <p className="text-[11px] text-emerald-900">Tạo URL preview riêng biệt (Vercel/Cloudflare) kèm bot comment lên PR.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Underline Tab Bar */}
      <nav className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]" aria-label="Nội dung sổ tay">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'pipeline'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Workflow GitHub Actions Chuẩn
        </button>

        <button
          onClick={() => setActiveTab('docker')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'docker'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Multi-stage Dockerfile
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
            Trong file Dockerfile production, <strong>tuyệt đối không chạy container bằng tài khoản `root`</strong>! Luôn tạo user hệ thống không có quyền root (ví dụ: `USER nextjs` với UID 1001) để triệt tiêu nguy cơ bị khai thác container breakout chiếm quyền kiểm soát server host.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: WORKFLOW GITHUB ACTIONS CHUẨN                                      */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <section className="space-y-4 animate-in fade-in" aria-label="Workflow GitHub Actions">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="font-mono text-xs text-zinc-600 font-bold">.github/workflows/ci.yml</span>
              <button
                onClick={() =>
                  handleCopy(
                    'ci-yaml',
                    `name: CI Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:run
      - run: pnpm build`
                  )
                }
                className="text-xs font-semibold text-[#BD5332] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'ci-yaml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Sao chép template</span>
              </button>
            </div>
            <pre className="text-zinc-800 font-mono text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200 overflow-x-auto leading-relaxed">
{`name: CI Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js 22 with pnpm cache
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies (Strict frozen lockfile)
        run: pnpm install --frozen-lockfile

      - name: Lint Check
        run: pnpm lint

      - name: TypeScript Check
        run: pnpm typecheck

      - name: Unit & Component Tests
        run: pnpm test:run

      - name: Production Build Check
        run: pnpm build`}
            </pre>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MULTI-STAGE DOCKERFILE                                             */}
      {/* ========================================================================= */}
      {activeTab === 'docker' && (
        <section className="space-y-4 animate-in fade-in" aria-label="Multi-stage Dockerfile">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="font-mono text-xs text-zinc-600 font-bold">Dockerfile (Next.js Standalone ~120MB)</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-bold">
                Non-root UID 1001
              </span>
            </div>
            <pre className="text-zinc-800 font-mono text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200 overflow-x-auto leading-relaxed">
{`# 1. Giai đoạn cài đặt phụ thuộc (Deps Stage)
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# 2. Giai đoạn biên dịch (Builder Stage)
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && pnpm build

# 3. Giai đoạn thực thi tinh gọn (Runner Stage ~120MB)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Bảo mật: Tạo user không có quyền root
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]`}
            </pre>
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
                Câu hỏi bẫy thường gặp (DevOps cho FE)
              </h3>
              <p className="text-[14px] text-zinc-700 mt-0.5">
                Dự đoán chiến lược CI/CD tối ưu trước khi mở đáp án chi tiết
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
              <span className="font-bold text-zinc-700 uppercase tracking-wider text-[11px]">Luồng phân tích:</span>
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
                <span className="font-mono text-zinc-400 font-medium">docker / yaml</span>
                <button
                  onClick={() => handleCopy(`cicd-q-${currentQ.id}`, currentQ.code)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
                  title="Sao chép mã"
                >
                  {copiedId === `cicd-q-${currentQ.id}` ? (
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
