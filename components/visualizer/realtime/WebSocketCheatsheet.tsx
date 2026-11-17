'use client';

import React, { useState } from 'react';
import { Radio, Cpu, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function WebSocketCheatsheet() {
  const [activeTab, setActiveTab] = useState<'ws-arch' | 'dataviz-maps' | 'traps'>('traps');

  // Answers toggle state for Tab 3 (Quiz questions)
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  return (
    <div className="space-y-7 animate-in fade-in max-w-5xl">
      {/* 1. Tóm tắt ngay đầu trang */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-2xs">
        <p className="text-[17px] leading-relaxed text-[var(--foreground)] font-medium">
          <strong>Bản chất của Real-time &amp; Data Visualization:</strong> Duy trì kết nối hai chiều liên tục (<strong>WebSocket Full-Duplex</strong>) với chi phí truyền tải thấp nhất và lựa chọn đúng động cơ vẽ đồ thị (<strong>Canvas / WebGL</strong>) để giải phóng hoàn toàn DOM.
        </p>

        {/* 3 khối đánh số nhất quán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Khối 1: Bắt tay 101 */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                1
              </span>
              <span className="text-[16px] font-bold text-blue-900">
                HTTP 101 Handshake
              </span>
            </div>
            <p className="text-[15px] text-blue-800 leading-snug">
              Bắt đầu bằng HTTP request, nâng cấp lên WebSocket TCP socket bền vững không bao giờ ngắt.
            </p>
          </div>

          {/* Khối 2: Backoff & Heartbeat */}
          <div className="p-3.5 rounded-xl border border-purple-300 bg-purple-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                2
              </span>
              <span className="text-[16px] font-bold text-purple-950">
                Backoff &amp; Heartbeat
              </span>
            </div>
            <p className="text-[15px] text-purple-900 leading-snug">
              Ping/Pong giữ kết nối qua router. Tự động kết nối lại theo thuật toán lũy thừa (Exponential Backoff).
            </p>
          </div>

          {/* Khối 3: Data Viz Matrix */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[12px] flex items-center justify-center font-bold font-mono">
                3
              </span>
              <span className="text-[16px] font-bold text-emerald-950">
                Data Viz Engine Matrix
              </span>
            </div>
            <p className="text-[15px] text-emerald-900 leading-snug">
              &lt;1k nodes: Dùng SVG (D3, Recharts). &gt;10k nodes: Dùng Canvas (ECharts). Triệu điểm: Dùng WebGL (Mapbox).
            </p>
          </div>
        </div>
      </div>

      {/* 2. Clean Underline Tabs */}
      <div className="flex items-center border-b border-[var(--border)] gap-8">
        <button
          onClick={() => setActiveTab('ws-arch')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'ws-arch'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Kiến trúc WebSocket &amp; Backoff
        </button>

        <button
          onClick={() => setActiveTab('dataviz-maps')}
          className={`pb-3 text-[17px] transition-all cursor-pointer ${
            activeTab === 'dataviz-maps'
              ? 'border-b-2 border-[var(--foreground)] font-bold text-[var(--foreground)]'
              : 'text-[var(--muted)] hover:text-[var(--foreground)] font-medium'
          }`}
        >
          Ma trận Data Viz &amp; Vector Maps
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

      {/* 3. TAB 1: WEBSOCKET ARCHITECTURE */}
      {activeTab === 'ws-arch' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Thuật toán Exponential Backoff kèm Full Jitter
            </h3>
            <p className="text-[17px] text-[var(--foreground)] leading-relaxed">
              Khi server sập và khởi động lại, nếu 100.000 client cùng kết nối lại sau đúng 1 giây, lượng request khổng lồ sẽ đánh sập server ngay lập tức (**Thundering Herd Problem**).
            </p>
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-950 font-mono text-[14px] leading-relaxed">
              <code>const delay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt)) + Math.random() * jitter;</code>
            </div>
            <p className="text-[16px] text-[var(--muted)] leading-relaxed">
              Thành phần <code>Math.random() * jitter</code> phân tán thời điểm kết nối của các client ngẫu nhiên trên dòng thời gian, giúp máy chủ tiếp nhận tải mượt mà.
            </p>
          </div>
        </div>
      )}

      {/* 4. TAB 2: DATA VIZ & MAPS */}
      {activeTab === 'dataviz-maps' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              So sánh SVG vs HTML5 Canvas vs WebGL cho Data Visualization &amp; Maps
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[15px]">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] font-mono text-[13px]">
                    <th className="py-2.5 pr-3 font-semibold">Công nghệ</th>
                    <th className="py-2.5 px-3 font-semibold">Cơ chế đồ họa</th>
                    <th className="py-2.5 px-3 font-semibold">Giới hạn phần tử</th>
                    <th className="py-2.5 pl-3 font-semibold">Thư viện phổ biến</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[15px]">
                  <tr>
                    <td className="py-3 pr-3 font-bold text-blue-900 font-mono">SVG</td>
                    <td className="py-3 px-3">Mỗi shape là 1 DOM Node (Vector)</td>
                    <td className="py-3 px-3 text-rose-700 font-semibold">&lt; 1.000 điểm</td>
                    <td className="py-3 pl-3 text-[var(--muted)]">D3.js, Recharts, Victory</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-3 font-bold text-emerald-900 font-mono">Canvas 2D</td>
                    <td className="py-3 px-3">Vẽ trực tiếp lên Bitmap Buffer (Raster)</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">10.000 - 100.000 điểm</td>
                    <td className="py-3 pl-3 text-[var(--muted)]">Apache ECharts, Chart.js</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-3 font-bold text-purple-900 font-mono">WebGL</td>
                    <td className="py-3 px-3">GPU Shaders &amp; Vector Tiling Pipeline</td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">&gt; 1.000.000 điểm (Bản đồ)</td>
                    <td className="py-3 pl-3 text-[var(--muted)]">Mapbox GL, MapLibre, Deck.gl, Three.js</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: CÂU HỎI BẪY PHỎNG VẤN */}
      {activeTab === 'traps' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[var(--foreground)]">
              Câu hỏi bẫy phỏng vấn Real-time &amp; Bản đồ
            </h3>
            <p className="text-[17px] text-[var(--muted)] mt-1">
              Kiểm tra kiến thức mạng WebSocket, giao thức SSE và xử lý dữ liệu quy mô lớn.
            </p>
          </div>

          {/* Bẫy 1: SSE vs WebSocket */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              1. Khi nào nên dùng Server-Sent Events (SSE) thay vì WebSocket?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer1((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer1 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer1 ? 'Đã hiển thị phân tích' : 'Đơn hướng vs Hai chiều, tích hợp HTTP/2'}
              </span>
            </div>

            {showAnswer1 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Đáp án:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>SSE (Server-Sent Events) là kênh ĐƠN HƯỚNG (Server ➔ Client):</strong> Chạy trên nền HTTP/2 thông thường, tự động hỗ trợ kết nối lại (Auto-reconnect), không cần mở kết nối TCP riêng biệt, đi qua mọi tường lửa doanh nghiệp dễ dàng. Lý tưởng cho: <strong>AI Streaming Token (như ChatGPT/Claude chat), bảng tin thông báo, theo dõi trạng thái đơn hàng</strong>.
                  </li>
                  <li>
                    <strong>WebSocket là kênh HAI CHIỀU (Full-Duplex):</strong> Cần thiết khi Client cũng phải liên tục gửi dữ liệu lên server với độ trễ tối thiểu (như: <strong>Game nhiều người chơi, Chat thời gian thực, bảng đặt lệnh chứng khoán/crypto</strong>).
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Bẫy 2: Heartbeat Ping/Pong */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              2. Tại sao WebSocket đã mở kết nối TCP mà vẫn bắt buộc phải có cơ chế Ping/Pong Heartbeat định kỳ?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer2((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer2 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer2 ? 'Đã hiển thị phân tích' : 'NAT Routers timeout và Half-open socket'}
              </span>
            </div>

            {showAnswer2 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>2 Lý do sống còn:</strong>
                </p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>
                    <strong>Các thiết bị trung gian (NAT Routers / Load Balancers) tự động ngắt kết nối:</strong> Nếu không có dữ liệu qua lại trong 30-60 giây, các firewall/router sẽ âm thầm đóng cổng để giải phóng RAM. Ping/Pong giữ luồng dữ liệu luôn hoạt động.
                  </li>
                  <li>
                    <strong>Phát hiện lỗi Half-Open Socket:</strong> Nếu điện thoại người dùng đi vào thang máy mất sóng đột ngột, TCP socket không kịp gửi cờ FIN. Cả client và server đều tưởng socket vẫn mở. Nhờ có Heartbeat (nếu sau 5s gửi Ping mà không thấy Pong), socket mới kích hoạt cờ đóng để dọn dẹp bộ nhớ và kết nối lại!
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Bẫy 3: Vector Tiling trong Mapbox */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-[var(--foreground)]">
              3. Cơ chế Vector Tiles (MVT) trong Mapbox/MapLibre hoạt động như thế nào để hiển thị dữ liệu địa lý toàn cầu mà không quá tải RAM?
            </h4>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setShowAnswer3((p) => !p)}
                className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-[15px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showAnswer3 ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
              <span className="text-[15px] text-[var(--muted)]">
                {showAnswer3 ? 'Đã hiển thị phân tích' : 'Cắt lát toạ độ Z/X/Y và định dạng nhị phân Protobuf'}
              </span>
            </div>

            {showAnswer3 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[16px] text-emerald-950 space-y-2 animate-in fade-in">
                <p>
                  <strong>Nguyên lý Vector Tiling:</strong>
                </p>
                <p>
                  Bản đồ toàn cầu được chia thành một lưới hình kim tự tháp theo cấp độ phóng to: <code>Z (Zoom level) / X (Tọa độ ngang) / Y (Tọa độ dọc)</code>.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Dữ liệu hình học (đường xá, tòa nhà, ranh giới) được mã hóa dưới dạng file nhị phân nén <strong>Protocol Buffers (.pbf)</strong> siêu nhẹ (chỉ vài chục KB mỗi tile).
                  </li>
                  <li>
                    Trình duyệt chỉ tải đúng các tile nằm trong khung nhìn (Viewport) và giao cho <strong>GPU Shader qua WebGL</strong> vẽ điểm ảnh trực tiếp, cho phép xoay 3D và đổi góc nghiêng (Pitch/Bearing) ở 60 FPS mượt mà!
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
