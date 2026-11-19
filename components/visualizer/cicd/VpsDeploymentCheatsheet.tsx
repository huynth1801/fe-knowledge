'use client';

import React, { useState } from 'react';
import {
  Server,
  Terminal,
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
  Lock,
  Globe,
  HardDrive,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export function VpsDeploymentCheatsheet() {
  const [activeTab, setActiveTab] = useState<'nginx-pm2' | 'github-actions-vps' | 'traps'>('nginx-pm2');
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
      title: 'Lệnh build Next.js trên VPS 1GB/2GB RAM bị dừng đột ngột với thông báo "Killed"',
      badge: 'Linux OOM Killer',
      pipeline: [
        { label: 'Chạy next build trên VPS $5', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Node.js ngốn > 1.4 GB RAM biên dịch AST', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Linux Kernel kích hoạt OOM Killer ➔ Terminated!', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `// ❌ LỖI KINH ĐIỂN TRÊN VPS:
$ pnpm build
▲ Next.js 16.4.6
Creating an optimized production build ...
Killed  // ➔ Tiến trình biên dịch bị hệ điều hành tiêu diệt vì cạn kiệt RAM!

// ✅ GIẢI PHÁP 1: Bật 2GB SWAP (RAM ảo từ ổ đĩa SSD)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

// ✅ GIẢI PHÁP 2 (CHUẨN SENIOR): Không build trên VPS!
// Hãy để GitHub Actions runner (có sẵn 7GB RAM miễn phí) build xong
// rồi mới rsync thư mục .next/standalone sang VPS để chạy.
// VPS chỉ đóng vai trò chạy server, không tốn 1MB RAM nào để build!`,
      note: 'Dùng lệnh `free -h` và `dmesg -T | grep -i oom` để kiểm tra log tiến trình bị Linux OOM tiêu diệt.',
      answerSummary: 'Tạo Swap RAM ảo trên VPS và chuyển hoàn toàn tác vụ nặng sang GitHub Actions Runner.',
      answerDetail:
        'Biên dịch JavaScript/TypeScript và đóng gói Webpack/Turbopack là tác vụ cực kỳ nặng về CPU và RAM. Trên các gói VPS giá rẻ (1GB - 2GB RAM), tiến trình Node.js vượt quá giới hạn RAM khả dụng khiến Linux Out-of-Memory (OOM) Killer can thiệp bắn chết tiến trình (`SIGKILL`). Kiến trúc chuẩn của Senior là: Tận dụng runner 7GB RAM của GitHub Actions để build ra bundle standalone siêu nhẹ, sau đó chỉ việc chuyển bundle đó qua VPS và reload trong 1 giây.',
    },
    {
      id: 1,
      title: 'Dùng "pm2 restart" làm khách hàng bị lỗi 502 Bad Gateway trong 3-5 giây',
      badge: 'Zero-Downtime Reload',
      pipeline: [
        { label: 'pm2 restart app', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'PM2 lập tức ngắt tiến trình cũ (Port 3000 đóng)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'User vào web gặp 502 Bad Gateway!', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `// ❌ SAI LẦM: "pm2 restart" ngắt hoàn toàn tiến trình cũ trước:
pm2 restart my-app
// HẬU QUẢ: Trong 3-5 giây Next.js khởi động và kết nối DB,
// không có bất kỳ tiến trình nào lắng nghe ở port 3000!
// Nginx không thể kết nối tới upstream ➔ Trả về "502 Bad Gateway".

// ✅ CHUẨN XÁC: "pm2 reload" với Cluster Mode (Zero-Downtime)
pm2 reload ecosystem.config.js --update-env

// Trong ecosystem.config.js:
module.exports = {
  apps: [{
    name: 'my-app',
    script: 'server.js', // Chế độ standalone
    instances: 'max',    // Chạy theo số nhân CPU (Cluster Mode)
    exec_mode: 'cluster',
    wait_ready: true,    // Chờ server báo sẵn sàng mới ngắt worker cũ!
    listen_timeout: 10000,
  }]
};`,
      note: '`pm2 reload` khởi động worker mới trước, đợi worker mới bind port thành công rồi mới ngắt worker cũ.',
      answerSummary: 'Sử dụng `pm2 reload` kết hợp Cluster Mode thay vì `pm2 restart`.',
      answerDetail:
        '`pm2 restart` thực hiện hành vi: Kill PID cũ ➔ Spawn PID mới. Khoảng thời gian giữa lúc Kill và lúc Spawn xong là "downtime window", mọi request từ khách hàng đều bị Nginx trả về lỗi 502. Ngược lại, `pm2 reload` (chỉ chạy trong cluster mode) sử dụng chiến thuật Rolling Update: Giữ nguyên worker cũ tiếp tục nhận request, sinh ra worker mới. Chỉ khi worker mới báo tín hiệu sẵn sàng lắng nghe (ready), PM2 mới điều hướng traffic sang và nhẹ nhàng giải phóng worker cũ (Graceful Shutdown).',
    },
    {
      id: 2,
      title: 'Tại sao phải để Nginx đọc trực tiếp thư mục static thay vì để Node.js phục vụ?',
      badge: 'Tối ưu Nginx Reverse Proxy',
      pipeline: [
        { label: 'Request /_next/static/chunk.js', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Nếu qua Node.js (Tốn Event Loop CPU)', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Nếu qua Nginx (Kernel Zero-Copy Sendfile)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `// ❌ KÉM HIỆU QUẢ: Đẩy mọi request static qua Node.js:
location / {
  proxy_pass http://localhost:3000; // Node.js phải gánh cả file ảnh, JS, CSS
}

// ✅ CHUẨN SENIOR: Nginx phục vụ trực tiếp từ ổ đĩa SSD
location /_next/static/ {
  alias /var/www/my-app/.next/static/;
  expires 365d;
  access_log off;
  add_header Cache-Control "public, max-age=31536000, immutable";
}

location /public/ {
  alias /var/www/my-app/public/;
  expires 30d;
  access_log off;
}

location / {
  proxy_pass http://localhost:3000; // Node.js CHỈ XỬ LÝ SSR VÀ API LOGIC!
}`,
      note: 'Nginx dùng hàm syscall `sendfile()` ở tầng Linux Kernel để chuyển file trực tiếp từ đĩa sang socket mạng.',
      answerSummary: 'Nginx phục vụ file tĩnh nhanh hơn 10 lần và tiết kiệm 80% CPU cho Node.js.',
      answerDetail:
        'Node.js chạy trên cơ chế đơn luồng (Single-threaded Event Loop). Khi có 100 người dùng cùng tải hàng trăm file JS chunks, CSS và hình ảnh qua Node.js, luồng Event Loop bị nghẽn (I/O bounded), làm chậm trễ các request render trang SSR hoặc xử lý API logic. Nginx được viết bằng C với kiến trúc Event-driven bất đồng bộ và kỹ thuật Linux Kernel Zero-copy (`sendfile`), cho phép đọc và bắn thẳng file từ ổ đĩa ra card mạng mà không cần nạp vào bộ nhớ ứng dụng. Việc cấu hình `alias` trong Nginx giúp giải phóng hoàn toàn gánh nặng tĩnh cho server Node.',
    },
  ];

  const currentQ = questions[activeQuestion];

  return (
    <article className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12" aria-label="Sổ tay VPS Deploy">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-zinc-600 font-semibold" aria-label="Breadcrumb">
        <span>DevOps, CI/CD &amp; Deployments</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-900 font-bold">Deploy trên VPS: Linux, Nginx, PM2 &amp; CI/CD</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-serif">
              Deploy trên VPS: Linux, Nginx, PM2 &amp; CI/CD
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-700 mt-1.5 leading-relaxed">
              Toàn bộ kiến thức vận hành thực chiến ứng dụng Next.js / Node.js trên máy chủ ảo VPS (Ubuntu/Debian): Cấu hình Nginx Reverse Proxy với SSL Certbot, cụm tiến trình PM2 Cluster Zero-Downtime, Swap RAM ảo chống crash OOM và quy trình CI/CD tự động bằng GitHub Actions qua SSH.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-[#CC6745] text-[12px] font-semibold flex items-center gap-1 shadow-2xs font-mono">
              🐧 Thực chiến VPS Linux
            </span>
            <span className="px-3 py-1 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-800 text-[12px] font-semibold flex items-center gap-1 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              15 phút
            </span>
          </div>
        </div>

        {/* Feature Visual Accent: 5-Stage VPS Pipeline */}
        <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-4 sm:p-5 shadow-2xs" data-visual="vps-pipeline-flow">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <Server className="w-4 h-4 text-[#CC6745]" />
              <span>Chuỗi triển khai tự động từ GitHub sang VPS Linux (Automated SSH Flow)</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold">
              Production VPS Setup
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-3">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-[#CC6745]">1. GitHub Build</span>
              <p className="text-[11px] text-zinc-600">Runner 7GB RAM biên dịch Next.js Standalone (tiết kiệm 100% RAM cho VPS).</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-blue-900">2. SSH &amp; Rsync</span>
              <p className="text-[11px] text-blue-900">Bắn file nén qua SSH Key an toàn, giải nén vào thư mục `/var/www/`.</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-amber-900">3. PM2 Reload</span>
              <p className="text-[11px] text-amber-900">Rolling update cluster mode, reload worker không làm gián đoạn traffic.</p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-purple-900">4. Nginx Reverse Proxy</span>
              <p className="text-[11px] text-purple-900">SSL Let&apos;s Encrypt, nén Gzip và phục vụ trực tiếp static files từ SSD.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-900">5. OS Hardening</span>
              <p className="text-[11px] text-emerald-900">Tường lửa UFW, Fail2ban chống brute-force, Swap 2GB chống crash.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Underline Tab Bar */}
      <nav className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]" aria-label="Nội dung sổ tay">
        <button
          onClick={() => setActiveTab('nginx-pm2')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'nginx-pm2'
              ? 'border-b-2 border-[#CC6745] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Cấu hình Nginx &amp; PM2 Cluster
        </button>

        <button
          onClick={() => setActiveTab('github-actions-vps')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'github-actions-vps'
              ? 'border-b-2 border-[#CC6745] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          GitHub Actions SSH Deploy
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'traps'
              ? 'border-b-2 border-[#CC6745] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Bẫy phỏng vấn Senior VPS
        </button>
      </nav>

      {/* 4. Alert Banner */}
      <section className="rounded-2xl border border-red-300 bg-red-50 p-4 flex items-start gap-3.5 shadow-2xs" aria-label="Quy tắc quan trọng">
        <div className="w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
          !
        </div>
        <div>
          <h2 className="font-bold text-[15px] text-red-950">Quy tắc vàng bảo mật VPS Linux</h2>
          <p className="text-[14px] text-red-950 mt-0.5 leading-relaxed font-medium">
            <strong>Tuyệt đối không để cổng SSH (Port 22) mở bằng mật khẩu thường và cho phép tài khoản `root` đăng nhập trực tiếp</strong>! Hàng triệu botnet trên internet liên tục quét các dải IP VPS để dò mật khẩu. Luôn thiết lập SSH Key (Ed25519), đặt <code>PermitRootLogin no</code> trong <code>/etc/ssh/sshd_config</code>, bật tường lửa <code>ufw</code> chỉ mở port 80, 443 và port SSH tuỳ chỉnh!
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: CẤU HÌNH NGINX & PM2 CLUSTER                                       */}
      {/* ========================================================================= */}
      {activeTab === 'nginx-pm2' && (
        <section className="space-y-6 animate-in fade-in" aria-label="Nginx and PM2">
          {/* Section 1: Nginx Configuration */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div>
                <h3 className="text-xl font-bold font-serif text-zinc-900">
                  1. File cấu hình Nginx Reverse Proxy chuẩn sản xuất
                </h3>
                <span className="text-xs font-mono text-zinc-500">/etc/nginx/sites-available/my-app.conf</span>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    'nginx-conf',
                    `server {
    listen 80;
    server_name my-domain.com www.my-domain.com;
    return 301 https://$host$request_uri; # Ép buộc chuyển hướng sang HTTPS
}

server {
    listen 443 ssl http2;
    server_name my-domain.com www.my-domain.com;

    # SSL do Certbot tự động sinh
    ssl_certificate /etc/letsencrypt/live/my-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/my-domain.com/privkey.pem;

    # Bật nén Gzip để giảm 70% dung lượng HTML/JSON
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # TỐI ƯU SIÊU TỐC: Nginx phục vụ trực tiếp static files từ SSD!
    location /_next/static/ {
        alias /var/www/my-app/.next/static/;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public/ {
        alias /var/www/my-app/public/;
        expires 30d;
        access_log off;
    }

    # REVERSE PROXY VỀ NEXT.JS / NODE CONTAINER
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        # Hỗ trợ WebSocket / Server-Sent Events (SSE)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Forward đúng IP gốc và Host của khách hàng
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts tránh treo request
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}`
                  )
                }
                className="text-xs font-semibold text-[#CC6745] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'nginx-conf' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Sao chép Nginx Config</span>
              </button>
            </div>

            <pre className="text-zinc-800 font-mono text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200 overflow-x-auto leading-relaxed">
{`# 1. Chuyển hướng HTTP sang HTTPS
server {
    listen 80;
    server_name my-domain.com;
    return 301 https://$host$request_uri;
}

# 2. Server HTTPS với HTTP/2 và SSL
server {
    listen 443 ssl http2;
    server_name my-domain.com;

    # Nginx phục vụ trực tiếp file tĩnh, Node.js không cần đụng tay:
    location /_next/static/ {
        alias /var/www/my-app/.next/static/;
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Reverse proxy chuyển request SSR/API về port 3000:
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`}
            </pre>
          </div>

          {/* Section 2: PM2 Cluster Ecosystem */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div>
                <h3 className="text-xl font-bold font-serif text-zinc-900">
                  2. Cấu hình PM2 Cluster Zero-Downtime (ecosystem.config.js)
                </h3>
                <span className="text-xs font-mono text-zinc-500">Quản lý tiến trình, tự hồi sinh khi crash, giới hạn RAM</span>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    'pm2-conf',
                    `module.exports = {
  apps: [
    {
      name: 'my-app',
      script: '.next/standalone/server.js', // Chạy file standalone của Next.js
      instances: 'max',                     // Tự động scale theo số nhân CPU của VPS
      exec_mode: 'cluster',                 // Bắt buộc bật cluster để reload không downtime!
      wait_ready: true,
      listen_timeout: 10000,
      max_memory_restart: '500M',           // Tự động khởi động lại nếu dính memory leak > 500MB
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};`
                  )
                }
                className="text-xs font-semibold text-[#CC6745] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'pm2-conf' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Sao chép ecosystem.config.js</span>
              </button>
            </div>

            <pre className="text-zinc-800 font-mono text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200 overflow-x-auto leading-relaxed">
{`module.exports = {
  apps: [
    {
      name: 'my-app',
      script: '.next/standalone/server.js',
      instances: 'max',           // Chạy tối đa nhân CPU (Dual core = 2 workers)
      exec_mode: 'cluster',       // Cluster Mode cho phép Zero-downtime Rolling Reload
      max_memory_restart: '500M', // Chống sập VPS khi dính memory leak
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};`}
            </pre>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong>Lệnh reload chuẩn:</strong> Luôn dùng lệnh <code>pm2 reload ecosystem.config.js --update-env</code> thay vì <code>restart</code> để đảm bảo 0 mili-giây downtime.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GITHUB ACTIONS SSH DEPLOY                                          */}
      {/* ========================================================================= */}
      {activeTab === 'github-actions-vps' && (
        <section className="space-y-6 animate-in fade-in" aria-label="GitHub Actions Deploy">
          {/* Section: Complete Workflow */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div>
                <h3 className="text-xl font-bold font-serif text-zinc-900">
                  1. Workflow GitHub Actions SSH Deploy tự động (.github/workflows/deploy.yml)
                </h3>
                <span className="text-xs font-mono text-zinc-500">Tự động kích hoạt khi push code vào nhánh `main`</span>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    'gh-vps-yaml',
                    `name: Deploy to Production VPS

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js with cache
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build Next.js (Standalone)
        run: pnpm build

      - name: Copy static files vào thư mục standalone
        run: |
          cp -r public .next/standalone/
          cp -r .next/static .next/standalone/.next/

      - name: Sync bundle sang VPS qua SSH Rsync
        uses: appleboy/scp-action@v0.1.7
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          port: \${{ secrets.VPS_PORT || 22 }}
          source: ".next/standalone/*"
          target: "/var/www/my-app"
          strip_components: 2

      - name: Reload PM2 trên VPS không gián đoạn
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          port: \${{ secrets.VPS_PORT || 22 }}
          script: |
            cd /var/www/my-app
            pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js`
                  )
                }
                className="text-xs font-semibold text-[#CC6745] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'gh-vps-yaml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Sao chép Workflow YAML</span>
              </button>
            </div>

            <pre className="text-zinc-800 font-mono text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200 overflow-x-auto leading-relaxed">
{`name: Deploy to Production VPS

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest # Runner 7GB RAM lo việc build nặng
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build # Output: standalone

      # Đồng bộ file tĩnh vào standalone trước khi gửi:
      - run: |
          cp -r public .next/standalone/
          cp -r .next/static .next/standalone/.next/

      # Bắn file sang VPS qua SSH:
      - uses: appleboy/scp-action@v0.1.7
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          source: ".next/standalone/*"
          target: "/var/www/my-app"

      # Kích hoạt zero-downtime reload trên VPS:
      - uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/my-app
            pm2 reload ecosystem.config.js --update-env`}
            </pre>
          </div>

          {/* Setup SSH Key Guide */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-2xs">
            <h3 className="text-xl font-bold font-serif text-zinc-900">
              2. Thiết lập SSH Key Ed25519 cho GitHub Secrets trong 3 bước
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-700">
              <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-xs">
                <span className="text-zinc-500 block mb-1"># Bước 1: Tạo cặp SSH key hiện đại trên máy hoặc VPS:</span>
                <code>ssh-keygen -t ed25519 -C &quot;github-actions-deploy&quot; -f ~/.ssh/github_deploy</code>
              </div>
              <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-xs">
                <span className="text-zinc-500 block mb-1"># Bước 2: Thêm Public Key vào VPS để cấp quyền đăng nhập:</span>
                <code>cat ~/.ssh/github_deploy.pub &gt;&gt; ~/.ssh/authorized_keys</code>
              </div>
              <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-xs">
                <span className="text-zinc-500 block mb-1"># Bước 3: Copy toàn bộ nội dung Private Key nạp vào GitHub Repo Secrets:</span>
                <code>cat ~/.ssh/github_deploy # Copy vào Secret: VPS_SSH_KEY</code>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BẪY PHỎNG VẤN SENIOR VPS                                           */}
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
                <span className="text-xs font-mono text-zinc-600 font-semibold">Cấu hình &amp; Lệnh hệ thống đối chiếu:</span>
                <button
                  onClick={() => handleCopy(`vps-q-${activeQuestion}`, currentQ.code)}
                  className="text-xs font-semibold text-[#CC6745] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === `vps-q-${activeQuestion}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
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
