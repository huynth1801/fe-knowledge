export interface PacketFrame {
  id: string;
  direction: 'client-to-server' | 'server-to-client';
  type: 'handshake' | 'data' | 'ping' | 'pong' | 'close';
  payload: string;
  timestamp: string;
}

export interface WebSocketState {
  connectionStatus: 'CONNECTING' | 'OPEN' | 'RECONNECTING' | 'CLOSED';
  protocol: 'HTTP/1.1' | 'WebSocket (RFC 6455)';
  packets: PacketFrame[];
  dataVizEngine: {
    type: 'SVG' | 'Canvas' | 'WebGL';
    nodeCount: number;
    fps: number;
    memoryMb: number;
  };
  reconnectAttempts: number;
  backoffDelayMs: number;
  consoleLogs: { id: string; text: string; step: number; tag?: string }[];
}

export interface WebSocketStep {
  stepIndex: number;
  title: string;
  activeCodeLines: number[];
  explanation: string;
  interviewInsight?: string;
  state: WebSocketState;
}

export interface WebSocketScenario {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  description: string;
  code: string;
  expectedOutput: string[];
  steps: WebSocketStep[];
}

export const webSocketScenarios: WebSocketScenario[] = [
  // ==========================================
  // SCENARIO 1: WEBSOCKET FULL-DUPLEX LIFECYCLE
  // ==========================================
  {
    id: 'ws-handshake-lifecycle',
    title: 'WebSocket Lifecycle: Bắt tay HTTP 101 & Dòng dữ liệu hai chiều',
    tagline: 'Từ HTTP Upgrade bắt tay 101 đến kênh truyền 2 chiều Full-Duplex thời gian thực',
    difficulty: 'Senior',
    description: 'Quan sát chi tiết 4 giai đoạn: Gửi Header Upgrade -> Server phản hồi 101 Switching Protocols -> Kênh hai chiều mở liên tục -> Heartbeat Ping/Pong giữ kết nối.',
    code: `// KHỞI TẠO WEBSOCKET & XỬ LÝ HEARTBEAT
const socket = new WebSocket('wss://api.market.com/stream');

// 1. Bắt tay thành công (HTTP 101 -> WebSocket)
socket.addEventListener('open', () => {
  console.log('Kênh truyền hai chiều đã mở!');
  socket.send(JSON.stringify({ action: 'subscribe', symbol: 'BTC/USDT' }));
});

// 2. Nhận dữ liệu giá liên tục (Push từ Server)
socket.addEventListener('message', (event) => {
  const ticker = JSON.parse(event.data);
  updatePriceDisplay(ticker.price);
});`,
    expectedOutput: [
      'HTTP GET Upgrade: websocket -> 101 Switching Protocols',
      'Kênh Full-Duplex sẵn sàng: Độ trễ < 5ms thay vì HTTP Polling',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Bước 1: Bắt tay nâng cấp giao thức (HTTP Upgrade 101)',
        activeCodeLines: [1, 2],
        explanation: 'Client gửi một HTTP GET Request thông thường kèm các Headers: `Upgrade: websocket` và `Connection: Upgrade`. Server phản hồi mã `101 Switching Protocols`.',
        interviewInsight: 'WebSocket bắt đầu bằng một HTTP Request để có thể dễ dàng đi qua các Firewall, Proxy và cổng 80/443 thông thường.',
        state: {
          connectionStatus: 'CONNECTING',
          protocol: 'HTTP/1.1',
          packets: [
            {
              id: 'p1',
              direction: 'client-to-server',
              type: 'handshake',
              payload: 'GET /stream (Upgrade: websocket)',
              timestamp: '00:00.010',
            },
            {
              id: 'p2',
              direction: 'server-to-client',
              type: 'handshake',
              payload: 'HTTP/1.1 101 Switching Protocols',
              timestamp: '00:00.035',
            },
          ],
          dataVizEngine: { type: 'Canvas', nodeCount: 500, fps: 60, memoryMb: 24 },
          reconnectAttempts: 0,
          backoffDelayMs: 0,
          consoleLogs: [
            { id: 'w1', text: 'Client -> GET /stream [Upgrade: websocket]', step: 0, tag: 'http' },
            { id: 'w2', text: 'Server -> 101 Switching Protocols. Upgrade success!', step: 0, tag: 'ws' },
          ],
        },
      },
      {
        stepIndex: 1,
        title: 'Bước 2: Kênh Full-Duplex mở ➔ Trao đổi dữ liệu thời gian thực',
        activeCodeLines: [4, 5, 6, 7, 10, 11, 12, 13],
        explanation: 'Kết nối TCP bên dưới được giữ nguyên liên tục. Cả Client và Server có thể bắn dữ liệu cho nhau bất kỳ lúc nào mà không cần bắt tay lại!',
        interviewInsight: 'So với HTTP Polling (gửi request liên tục tốn header 1KB), mỗi frame WebSocket chỉ tốn 2 đến 10 bytes overhead, tiết kiệm 98% băng thông mạng.',
        state: {
          connectionStatus: 'OPEN',
          protocol: 'WebSocket (RFC 6455)',
          packets: [
            {
              id: 'p3',
              direction: 'client-to-server',
              type: 'data',
              payload: 'subscribe: BTC/USDT',
              timestamp: '00:00.050',
            },
            {
              id: 'p4',
              direction: 'server-to-client',
              type: 'data',
              payload: 'BTC/USDT: $96,500 (+3.2%)',
              timestamp: '00:00.080',
            },
            {
              id: 'p5',
              direction: 'server-to-client',
              type: 'data',
              payload: 'BTC/USDT: $96,520 (+3.3%)',
              timestamp: '00:00.120',
            },
          ],
          dataVizEngine: { type: 'Canvas', nodeCount: 1200, fps: 60, memoryMb: 28 },
          reconnectAttempts: 0,
          backoffDelayMs: 0,
          consoleLogs: [
            { id: 'w3', text: 'socket.onopen: Channel established.', step: 1, tag: 'ws' },
            { id: 'w4', text: 'Received tick: BTC $96,500 (Latency: 4ms)', step: 1, tag: 'data' },
          ],
        },
      },
      {
        stepIndex: 2,
        title: 'Bước 3: Mất mạng ➔ Tự động kết nối lại (Exponential Backoff)',
        activeCodeLines: [1, 2],
        explanation: 'Mạng chập chờn, socket bị đứt. Client không bắn request dồn dập (tránh làm sập server - Thundering Herd), mà lùi dần thời gian chờ: 1s -> 2s -> 4s -> 8s kèm độ nhiễu Jitter ngẫu nhiên.',
        interviewInsight: 'Thuật toán `delay = Math.min(maxDelay, baseDelay * 2 ** attempt) + Math.random() * jitter` là tiêu chuẩn vàng cho mọi ứng dụng Real-time cấp doanh nghiệp.',
        state: {
          connectionStatus: 'RECONNECTING',
          protocol: 'WebSocket (RFC 6455)',
          packets: [
            {
              id: 'p6',
              direction: 'client-to-server',
              type: 'close',
              payload: 'Connection lost. Backoff: 2000ms',
              timestamp: '00:01.400',
            },
          ],
          dataVizEngine: { type: 'Canvas', nodeCount: 1200, fps: 60, memoryMb: 28 },
          reconnectAttempts: 2,
          backoffDelayMs: 2000,
          consoleLogs: [
            { id: 'w5', text: '⚠️ Connection lost! Socket closed.', step: 2, tag: 'warning' },
            { id: 'w6', text: '🔄 Reconnecting attempt #2 in 2000ms (Exponential Backoff)...', step: 2, tag: 'retry' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 2: BIG DATA VIZ ENGINE (SVG VS CANVAS VS MAPS)
  // ==========================================
  {
    id: 'dataviz-svg-vs-canvas',
    title: 'Data Viz Engine: Tại sao SVG sụp đổ ở 50.000 điểm dữ liệu?',
    tagline: 'So sánh hiệu năng DOM-heavy (SVG) vs Pixel-buffer (Canvas) vs GPU Tiled Maps',
    difficulty: 'Senior',
    description: 'Quan sát hiển thị 50.000 tọa độ bản đồ / điểm dữ liệu: SVG tạo 50.000 thẻ <circle> trong DOM khiến FPS tụt về 4; trong khi HTML5 Canvas vẽ trực tiếp bitmap giữ vững 60 FPS!',
    code: `// SO SÁNH HIỆU NĂNG VẼ 50.000 ĐIỂM DỮ LIỆU
// Cách 1: SVG (D3.js truyền thống) -> 50.000 DOM Nodes!
svg.selectAll('circle')
  .data(points50k)
  .enter()
  .append('circle'); // ⚠️ BROWSER TREO ĐƠ (4 FPS)!

// Cách 2: HTML5 Canvas (1 thẻ DOM duy nhất, vẽ bitmap)
const ctx = canvas.getContext('2d');
points50k.forEach(p => {
  ctx.fillRect(p.x, p.y, 2, 2); // ⚡ 60 FPS MƯỢT MÀ!
});`,
    expectedOutput: [
      'SVG: 50.000 DOM elements -> Memory 480MB -> 4 FPS (Jank)',
      'Canvas: 1 DOM element -> Memory 35MB -> 60 FPS (Butter)',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Cách 1: Vẽ bằng SVG ➔ 50.000 thẻ DOM làm sập trình duyệt',
        activeCodeLines: [3, 4, 5, 6],
        explanation: 'SVG lưu mỗi điểm là một thẻ XML `<circle>` trong cây DOM. Khi có 50.000 thẻ, trình duyệt phải tính toán toạ độ và giữ 50.000 bộ lắng nghe sự kiện ➔ Bộ nhớ tăng vọt 480MB, FPS tụt còn 4!',
        interviewInsight: 'SVG chỉ tối ưu khi số lượng phần tử dưới 1.000 nodes và cần gắn event listener (onClick, hover) trực tiếp lên từng shape.',
        state: {
          connectionStatus: 'OPEN',
          protocol: 'WebSocket (RFC 6455)',
          packets: [],
          dataVizEngine: {
            type: 'SVG',
            nodeCount: 50000,
            fps: 4,
            memoryMb: 485,
          },
          reconnectAttempts: 0,
          backoffDelayMs: 0,
          consoleLogs: [
            { id: 'd1', text: 'Rendering 50,000 points via SVG DOM Nodes...', step: 0, tag: 'svg' },
            { id: 'd2', text: '❌ FPS dropped to 4 FPS! DOM Tree overloaded (485MB RAM)', step: 0, tag: 'error' },
          ],
        },
      },
      {
        stepIndex: 1,
        title: 'Cách 2: Chuyển sang HTML5 Canvas ➔ 60 FPS mượt mà!',
        activeCodeLines: [9, 10, 11, 12],
        explanation: 'HTML5 Canvas chỉ là một thẻ `<canvas>` duy nhất. Dữ liệu được vẽ trực tiếp thành điểm ảnh trên bộ đệm Bitmap. Trình duyệt không cần quản lý 50.000 DOM nodes ➔ FPS hồi sinh ở 60 FPS mượt mà!',
        interviewInsight: 'Với bản đồ vector hàng triệu điểm (Mapbox/MapLibre), họ sử dụng kỹ thuật Vector Tiles (cắt bản đồ thành các ô vuông nhị phân Protobuf theo cấp zoom Z/X/Y) kết hợp WebGL GPU shaders.',
        state: {
          connectionStatus: 'OPEN',
          protocol: 'WebSocket (RFC 6455)',
          packets: [],
          dataVizEngine: {
            type: 'Canvas',
            nodeCount: 50000,
            fps: 60,
            memoryMb: 36,
          },
          reconnectAttempts: 0,
          backoffDelayMs: 0,
          consoleLogs: [
            { id: 'd1', text: 'Rendering 50,000 points via SVG DOM Nodes...', step: 0, tag: 'svg' },
            { id: 'd3', text: '✓ Switched to HTML5 Canvas bitmap buffer', step: 1, tag: 'success' },
            { id: 'd4', text: '⚡ Performance restored: 60 FPS steady (36MB RAM)', step: 1, tag: 'perf' },
          ],
        },
      },
    ],
  },
];
