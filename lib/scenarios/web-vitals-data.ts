export interface VitalsMetric {
  name: 'INP' | 'LCP' | 'CLS';
  value: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  thresholdText: string;
}

export interface MainThreadFrame {
  id: string;
  durationMs: number;
  type: 'task' | 'long-task' | 'yield' | 'paint' | 'idle';
  label: string;
}

export interface WebVitalsState {
  metrics: VitalsMetric[];
  timelineFrames: MainThreadFrame[];
  fps: number;
  layoutShiftOffsetPx?: number;
  isMainThreadBlocked: boolean;
  activeOptimization: string;
  consoleLogs: { id: string; text: string; step: number; tag?: string }[];
}

export interface WebVitalsStep {
  stepIndex: number;
  title: string;
  activeCodeLines: number[];
  explanation: string;
  interviewInsight?: string;
  state: WebVitalsState;
}

export interface WebVitalsScenario {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  description: string;
  code: string;
  expectedOutput: string[];
  steps: WebVitalsStep[];
}

export const webVitalsScenarios: WebVitalsScenario[] = [
  // ==========================================
  // SCENARIO 1: INP & LONG TASKS
  // ==========================================
  {
    id: 'vitals-inp-long-task',
    title: 'INP & Long Tasks: Nghẽn Main Thread khi click nút',
    tagline: 'Tại sao tác vụ chạy > 50ms làm đơ giao diện và giết chết điểm INP?',
    difficulty: 'Senior',
    description: 'Quan sát người dùng click nút lọc 50.000 sản phẩm: Vòng lặp nặng chiếm dụng Main Thread 180ms khiến trình duyệt không thể vẽ (Next Paint) ➔ INP chuyển đỏ Poor.',
    code: `// XỬ LÝ SỰ KIỆN NẶNG TRÊN MAIN THREAD
button.addEventListener('click', () => {
  // 1. Phản hồi giao diện ngay lập tức
  setLoading(true);

  // 2. ⚠️ LONG TASK: Vòng lặp tính toán 50.000 items
  // Chặn Main Thread suốt 180ms!
  const results = filterHeavyItems(items); // > 50ms!
  renderList(results);
});`,
    expectedOutput: [
      'Click event phát sinh',
      'Long Task 180ms (> 50ms) khóa chặt Main Thread',
      'Next Paint bị trì hoãn ➔ INP = 210ms (Poor ⚠️)',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Trạng thái bình thường: Main Thread nhàn rỗi (60 FPS)',
        activeCodeLines: [1, 2],
        explanation: 'Trang web đang ở trạng thái mượt mà. Main Thread rảnh rỗi xử lý các khung hình nhỏ (< 16.6ms) đảm bảo 60 FPS.',
        interviewInsight: 'INP (Interaction to Next Paint) là chỉ số Core Web Vitals đo lường độ trễ từ lúc người dùng tương tác (click, gõ phím) đến khi khung hình tiếp theo được vẽ ra.',
        state: {
          metrics: [
            { name: 'INP', value: '35ms', rating: 'good', thresholdText: 'Tốt (< 200ms)' },
            { name: 'LCP', value: '1.2s', rating: 'good', thresholdText: 'Tốt (< 2.5s)' },
            { name: 'CLS', value: '0.01', rating: 'good', thresholdText: 'Tốt (< 0.1)' },
          ],
          timelineFrames: [
            { id: 'f1', durationMs: 12, type: 'idle', label: 'Frame 1 (12ms)' },
            { id: 'f2', durationMs: 14, type: 'idle', label: 'Frame 2 (14ms)' },
          ],
          fps: 60,
          isMainThreadBlocked: false,
          activeOptimization: 'Main thread rảnh',
          consoleLogs: [{ id: 'v1', text: 'Page idle at 60 FPS. INP: 35ms (Good)', step: 0, tag: 'perf' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Người dùng click nút ➔ Long Task 180ms làm nghẽn Main Thread!',
        activeCodeLines: [7, 8],
        explanation: 'Hàm `filterHeavyItems` chạy một vòng lặp nặng mất 180ms. Vì JavaScript đơn luồng, Main Thread bị đóng băng, trình duyệt không thể vẽ hiệu ứng click hay spinner!',
        interviewInsight: 'Mọi tác vụ chiếm Main Thread > 50ms đều bị Chrome DevTools đánh dấu là **Long Task**. Khi người dùng tương tác trúng Long Task, sự kiện bị xếp hàng chờ dẫn tới INP kém.',
        state: {
          metrics: [
            { name: 'INP', value: '215ms', rating: 'poor', thresholdText: 'Kém (> 200ms) ⚠️' },
            { name: 'LCP', value: '1.2s', rating: 'good', thresholdText: 'Tốt' },
            { name: 'CLS', value: '0.01', rating: 'good', thresholdText: 'Tốt' },
          ],
          timelineFrames: [
            { id: 'f1', durationMs: 12, type: 'idle', label: 'Idle' },
            { id: 'f2', durationMs: 180, type: 'long-task', label: 'LONG TASK: filterHeavyItems (180ms)' },
          ],
          fps: 12,
          isMainThreadBlocked: true,
          activeOptimization: 'Cần chia nhỏ bằng scheduler.yield()',
          consoleLogs: [
            { id: 'v1', text: 'Page idle at 60 FPS. INP: 35ms (Good)', step: 0, tag: 'perf' },
            { id: 'v2', text: '⚠️ [Long Task] Main thread blocked for 180ms!', step: 1, tag: 'warning' },
            { id: 'v3', text: '❌ INP degradation: 215ms exceeds 200ms threshold', step: 1, tag: 'error' },
          ],
        },
      },
      {
        stepIndex: 2,
        title: 'Tối ưu: Chia nhỏ tác vụ bằng scheduler.yield()',
        activeCodeLines: [3, 4],
        explanation: 'Nhờ chèn `await scheduler.yield()`, JavaScript tạm nhường quyền điều khiển cho Main Thread vẽ khung hình `Loading...` trước, sau đó mới tính tiếp. Điểm INP giảm về 45ms (Xanh mượt)!',
        interviewInsight: 'API mới `scheduler.yield()` (hoặc polyfill `setTimeout`) giúp chia nhỏ 1 Long Task 180ms thành nhiều sub-tasks 30ms, cho phép trình duyệt xen kẽ các lượt Paint mượt mà.',
        state: {
          metrics: [
            { name: 'INP', value: '45ms', rating: 'good', thresholdText: 'Tốt (< 200ms)' },
            { name: 'LCP', value: '1.2s', rating: 'good', thresholdText: 'Tốt' },
            { name: 'CLS', value: '0.01', rating: 'good', thresholdText: 'Tốt' },
          ],
          timelineFrames: [
            { id: 'f1', durationMs: 15, type: 'task', label: 'setLoading' },
            { id: 'f2', durationMs: 8, type: 'yield', label: 'yield() -> Paint Spinner' },
            { id: 'f3', durationMs: 35, type: 'task', label: 'Chunk 1' },
            { id: 'f4', durationMs: 32, type: 'task', label: 'Chunk 2' },
          ],
          fps: 58,
          isMainThreadBlocked: false,
          activeOptimization: 'scheduler.yield() active (Tối ưu thành công)',
          consoleLogs: [
            { id: 'v1', text: 'Page idle at 60 FPS. INP: 35ms (Good)', step: 0, tag: 'perf' },
            { id: 'v2', text: '⚠️ [Long Task] Main thread blocked for 180ms!', step: 1, tag: 'warning' },
            { id: 'v4', text: '✓ Task yielded to Main Thread! INP recovered to 45ms', step: 2, tag: 'success' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 2: CLS & UNSHOT LAYOUT SHIFTS
  // ==========================================
  {
    id: 'vitals-cls-layout-shift',
    title: 'CLS: Hiện tượng giật nhảy Layout khi tải ảnh thiếu kích thước',
    tagline: 'Tại sao quên thuộc tính aspect-ratio hoặc width/height phá nát điểm CLS?',
    difficulty: 'Mid',
    description: 'Quan sát người dùng đang đọc bài báo: Một banner quảng cáo động và 1 thẻ <img> tải xong muộn mà không có kích thước đặt trước, đẩy toàn bộ nội dung tụt xuống 180px.',
    code: `/* LỖI THIẾU KÍCH THƯỚC TRÊN ẢNH / BANNER */
/* SAI: Trình duyệt không biết kích thước trước khi tải ảnh xong */
<img src="hero-banner.jpg" alt="Banner" />

/* ĐÚNG: Dự phòng không gian trước bằng aspect-ratio hoặc width/height */
<img
  src="hero-banner.jpg"
  alt="Banner"
  width="1200"
  height="400"
  style={{ aspectRatio: '1200 / 400' }}
/>`,
    expectedOutput: [
      'Nội dung chữ render trước ở vị trí Y = 100px',
      'Ảnh tải xong đột ngột đẩy chữ xuống Y = 280px (Shift 180px!)',
      'CLS score = 0.32 (Poor ⚠️) -> Người dùng bấm nhầm nút!',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Nội dung chữ hiển thị trước: Ảnh đang tải dở',
        activeCodeLines: [3],
        explanation: 'Do không có thuộc tính `width/height` hay `aspect-ratio`, trình duyệt gán chiều cao tạm của thẻ `<img>` là 0px. Đoạn văn bản nằm ngay sát trên cùng.',
        interviewInsight: 'CLS đo lường tổng điểm số của tất cả các lần dịch chuyển bố cục bất ngờ xảy ra trong toàn bộ vòng đời của trang.',
        state: {
          metrics: [
            { name: 'INP', value: '25ms', rating: 'good', thresholdText: 'Tốt' },
            { name: 'LCP', value: '1.4s', rating: 'good', thresholdText: 'Tốt' },
            { name: 'CLS', value: '0.00', rating: 'good', thresholdText: 'Tốt (< 0.1)' },
          ],
          timelineFrames: [],
          fps: 60,
          layoutShiftOffsetPx: 0,
          isMainThreadBlocked: false,
          activeOptimization: 'Chờ ảnh hoàn tất',
          consoleLogs: [{ id: 'c1', text: 'Initial layout: Text at Y=0, Img height=0', step: 0, tag: 'perf' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Ảnh tải xong ➔ ĐẨY NỘI DUNG TỤT XUỐNG 180px!',
        activeCodeLines: [3],
        explanation: 'Ảnh tải xong có chiều cao 180px. Bố cục bị giật nảy đột ngột. Nếu người dùng vừa định bấm vào nút "Hủy", cú nhảy này có thể khiến họ bấm nhầm vào nút "Xác nhận chuyển tiền"!',
        interviewInsight: 'Công thức tính CLS: `layout shift score = impact fraction * distance fraction`. Cú nhảy càng lớn trên màn hình, điểm CLS càng nát.',
        state: {
          metrics: [
            { name: 'INP', value: '25ms', rating: 'good', thresholdText: 'Tốt' },
            { name: 'LCP', value: '2.8s', rating: 'needs-improvement', thresholdText: 'Cần cải thiện' },
            { name: 'CLS', value: '0.34', rating: 'poor', thresholdText: 'Kém (> 0.25) ⚠️' },
          ],
          timelineFrames: [],
          fps: 40,
          layoutShiftOffsetPx: 180,
          isMainThreadBlocked: false,
          activeOptimization: 'BỊ LỖI CLS NGHIÊM TRỌNG',
          consoleLogs: [
            { id: 'c1', text: 'Initial layout: Text at Y=0, Img height=0', step: 0, tag: 'perf' },
            { id: 'c2', text: '⚠️ [Layout Shift] Elements shifted down 180px unexpectedly', step: 1, tag: 'error' },
            { id: 'c3', text: '❌ CLS score = 0.34 (Poor). Bad UX!', step: 1, tag: 'warning' },
          ],
        },
      },
    ],
  },
];
