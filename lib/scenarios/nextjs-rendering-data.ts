export interface RequestHop {
  id: string;
  source: 'Browser' | 'CDN / Edge Cache' | 'Node.js Server' | 'Database / API';
  target: 'Browser' | 'CDN / Edge Cache' | 'Node.js Server' | 'Database / API';
  action: string;
  status: 'pending' | 'hit' | 'miss' | 'stale' | 'streaming' | 'complete';
  latency?: string;
}

export interface RenderingArtifact {
  type: 'HTML' | 'JSON' | 'RSC Payload' | 'JS Bundle';
  size: string;
  source: string;
  isHydrated?: boolean;
}

export interface NextRenderingState {
  strategy: 'SSR' | 'SSG' | 'ISR' | 'RSC-Streaming';
  currentStepStage: string;
  hops: RequestHop[];
  browserView: {
    title: string;
    content: string;
    hasSkeleton?: boolean;
    isInteractive: boolean;
    hasMismatchError?: boolean;
  };
  serverState: {
    cacheStatus: 'HIT' | 'MISS' | 'STALE' | 'REGENERATING' | 'BYPASS';
    revalidateSeconds?: number;
    dbQueryStatus?: string;
  };
  artifacts: RenderingArtifact[];
  consoleLogs: { id: string; text: string; step: number; tag?: string }[];
}

export interface NextRenderingStep {
  stepIndex: number;
  title: string;
  activeCodeLines: number[];
  explanation: string;
  interviewInsight?: string;
  state: NextRenderingState;
}

export interface NextScenario {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  description: string;
  code: string;
  expectedOutput: string[];
  steps: NextRenderingStep[];
}

export const nextjsRenderingScenarios: NextScenario[] = [
  // ==========================================
  // SCENARIO 1: SSR (SERVER-SIDE RENDERING)
  // ==========================================
  {
    id: 'nextjs-ssr',
    title: 'SSR: Server-Side Rendering & Hydration',
    tagline: 'Mỗi request sinh ra HTML mới trên Server ➔ Hydrate trên Client',
    difficulty: 'Mid',
    description: 'Quan sát luồng đi của 1 Request SSR: Trình duyệt gửi request -> Node Server truy vấn DB -> Render chuỗi HTML gửi về (FCP) -> Client tải JS bundle và chạy Hydration.',
    code: `// Next.js Server Component (SSR on demand)
export default async function ProductPage({ params }) {
  // fetch với { cache: 'no-store' } ép buộc SSR mỗi request
  const res = await fetch(\`https://api.store.com/items/\${params.id}\`, {
    cache: 'no-store'
  });
  const product = await res.json();

  return (
    <main>
      <h1>{product.name}</h1>
      <p>Giá: {product.price}đ (Tồn kho: {product.stock})</p>
      <AddToCartButton productId={product.id} />
    </main>
  );
}`,
    expectedOutput: [
      '1. Browser gửi GET /items/42',
      '2. Server fetch DB (cache: no-store) -> Render HTML',
      '3. Browser nhận HTML (FCP), tải AddToCartButton.js',
      '4. Hydration hoàn tất -> Button có thể click tương tác!',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Trình duyệt gửi HTTP GET Request tới Server',
        activeCodeLines: [1, 2],
        explanation: 'Người dùng gõ URL `store.com/items/42`. Trình duyệt gửi HTTP GET request qua mạng tới máy chủ Next.js.',
        interviewInsight: 'SSR thích hợp nhất cho các trang có dữ liệu cá nhân hóa cao (theo user session, giỏ hàng, thông tin thay đổi từng giây) và cần SEO tốt.',
        state: {
          strategy: 'SSR',
          currentStepStage: '1. Gửi HTTP Request',
          hops: [
            {
              id: 'h1',
              source: 'Browser',
              target: 'Node.js Server',
              action: 'GET /items/42',
              status: 'pending',
              latency: '35ms',
            },
          ],
          browserView: {
            title: 'store.com/items/42',
            content: 'Đang kết nối tới máy chủ...',
            isInteractive: false,
          },
          serverState: {
            cacheStatus: 'BYPASS',
            dbQueryStatus: 'Sắp truy vấn DB',
          },
          artifacts: [],
          consoleLogs: [{ id: 'l1', text: 'Browser -> HTTP GET /items/42', step: 0, tag: 'http' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Node.js Server fetch DB & Render HTML tĩnh',
        activeCodeLines: [3, 4, 5, 6, 8, 9, 10, 11, 12, 13],
        explanation: 'Do có cấu hình `{ cache: "no-store" }`, máy chủ Next.js truy vấn dữ liệu mới nhất từ Database và render toàn bộ JSX thành chuỗi HTML chuẩn.',
        interviewInsight: 'TTFB (Time To First Byte) của SSR luôn phụ thuộc vào thời gian phản hồi của Database + thời gian máy chủ render HTML. Nếu DB chậm 500ms, người dùng phải chờ 500ms màn hình trắng!',
        state: {
          strategy: 'SSR',
          currentStepStage: '2. Server Fetch & Render HTML',
          hops: [
            {
              id: 'h1',
              source: 'Browser',
              target: 'Node.js Server',
              action: 'GET /items/42',
              status: 'complete',
            },
            {
              id: 'h2',
              source: 'Node.js Server',
              target: 'Database / API',
              action: 'SELECT * FROM items WHERE id = 42',
              status: 'complete',
              latency: '80ms',
            },
          ],
          browserView: {
            title: 'store.com/items/42',
            content: 'Chờ nhận phản hồi HTML từ Server (TTFB)...',
            isInteractive: false,
          },
          serverState: {
            cacheStatus: 'BYPASS',
            dbQueryStatus: 'OK (MacBook Pro M3, Giá: 45tr, Kho: 5)',
          },
          artifacts: [
            { type: 'HTML', size: '14 KB', source: 'Node.js Server' },
          ],
          consoleLogs: [
            { id: 'l1', text: 'Browser -> HTTP GET /items/42', step: 0, tag: 'http' },
            { id: 'l2', text: 'Server DB query: 80ms (stock: 5)', step: 1, tag: 'server' },
            { id: 'l3', text: 'Server renderToString completed', step: 1, tag: 'render' },
          ],
        },
      },
      {
        stepIndex: 2,
        title: 'Trình duyệt nhận HTML & Hiển thị khung nhìn (FCP)',
        activeCodeLines: [9, 10, 11],
        explanation: 'HTML tĩnh về tới trình duyệt. Người dùng nhìn thấy ngay lập tức tiêu đề sản phẩm và giá bán (FCP/LCP cực nhanh!). Tuy nhiên, nút "Thêm vào giỏ" chưa bấm được vì chưa tải JS!',
        interviewInsight: 'Đây là giai đoạn "Uncanny Valley" (Thung lũng kỳ lạ): Giao diện trông đã sẵn sàng nhưng các nút bấm chưa hề hoạt động vì chưa qua bước Hydration.',
        state: {
          strategy: 'SSR',
          currentStepStage: '3. FCP (HTML hiển thị, chưa tương tác)',
          hops: [
            {
              id: 'h3',
              source: 'Node.js Server',
              target: 'Browser',
              action: '200 OK + Transfer HTML payload',
              status: 'complete',
              latency: '45ms',
            },
          ],
          browserView: {
            title: 'MacBook Pro M3 — 45.000.000đ',
            content: 'Tồn kho: 5 cái. [Nút: Thêm vào giỏ (chưa bấm được!)]',
            isInteractive: false,
          },
          serverState: {
            cacheStatus: 'BYPASS',
            dbQueryStatus: 'Hoàn tất',
          },
          artifacts: [
            { type: 'HTML', size: '14 KB', source: 'Browser DOM' },
            { type: 'JS Bundle', size: '38 KB (Đang tải...)', source: 'CDN' },
          ],
          consoleLogs: [
            { id: 'l1', text: 'Browser -> HTTP GET /items/42', step: 0, tag: 'http' },
            { id: 'l2', text: 'Server DB query: 80ms (stock: 5)', step: 1, tag: 'server' },
            { id: 'l4', text: 'FCP: HTML parsed and painted on screen', step: 2, tag: 'fcp' },
          ],
        },
      },
      {
        stepIndex: 3,
        title: 'Tải JS Bundle & Hoàn tất Hydration trên Client',
        activeCodeLines: [12],
        explanation: 'Trình duyệt tải xong file `AddToCartButton.js`. React chạy trên client, quét qua cây DOM và gắn các event listener (onClick). Trang web chính thức có thể tương tác (TTI)!',
        interviewInsight: 'Hydration là quá trình React trên client đối chiếu cây DOM có sẵn với cây Virtual DOM sinh ra từ JS bundle để gắn các event listeners mà không phải tạo lại DOM từ đầu.',
        state: {
          strategy: 'SSR',
          currentStepStage: '4. Hydration hoàn tất (TTI)',
          hops: [
            {
              id: 'h4',
              source: 'CDN / Edge Cache',
              target: 'Browser',
              action: 'Download AddToCartButton.bundle.js',
              status: 'complete',
              latency: '30ms',
            },
          ],
          browserView: {
            title: 'MacBook Pro M3 — 45.000.000đ',
            content: 'Tồn kho: 5 cái. [Nút: Thêm vào giỏ (SẴN SÀNG CLICK!)]',
            isInteractive: true,
          },
          serverState: {
            cacheStatus: 'BYPASS',
          },
          artifacts: [
            { type: 'HTML', size: '14 KB', source: 'Browser DOM', isHydrated: true },
            { type: 'JS Bundle', size: '38 KB', source: 'Browser Memory', isHydrated: true },
          ],
          consoleLogs: [
            { id: 'l1', text: 'Browser -> HTTP GET /items/42', step: 0, tag: 'http' },
            { id: 'l2', text: 'Server DB query: 80ms (stock: 5)', step: 1, tag: 'server' },
            { id: 'l4', text: 'FCP: HTML parsed and painted on screen', step: 2, tag: 'fcp' },
            { id: 'l5', text: 'React Hydration finished! Page is fully interactive.', step: 3, tag: 'hydration' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 2: ISR (INCREMENTAL STATIC REGENERATION)
  // ==========================================
  {
    id: 'nextjs-isr',
    title: 'ISR: Incremental Static Regeneration (Stale-While-Revalidate)',
    tagline: 'Tốc độ siêu nhanh như SSG (Static) + Khả năng tự động làm mới ngầm',
    difficulty: 'Senior',
    description: 'Khám phá cơ chế Stale-While-Revalidate với { next: { revalidate: 60 } }: Trả về cache cũ tức thì cho người dùng, đồng thời âm thầm gọi Server cập nhật bản mới trong nền.',
    code: `// Next.js App Router: ISR với thời gian sống 60 giây
export default async function NewsArticle({ params }) {
  const res = await fetch(\`https://api.news.com/articles/\${params.slug}\`, {
    next: { revalidate: 60 } // Hết hạn sau 60 giây
  });
  const article = await res.json();

  return (
    <article>
      <h1>{article.title}</h1>
      <p>Số lượt xem: {article.views}</p>
    </article>
  );
}`,
    expectedOutput: [
      'User 1 (t=10s): Cache HIT từ CDN Edge (TTFB < 20ms)',
      'User 2 (t=75s): Cache STALE -> Trả bài cũ ngay, kích hoạt Rebuild ngầm',
      'User 3 (t=80s): Cache HIT bản mới cập nhật (views: 1200)',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'User 1 truy cập ở giây thứ 10: Cache HIT tại CDN Edge',
        activeCodeLines: [3, 4],
        explanation: 'Trang đã được sinh tĩnh trước đó. Khi User 1 truy cập (t = 10s < 60s), CDN Edge trả về ngay bản HTML lưu sẵn. Không cần gọi tới Node Server hay Database!',
        interviewInsight: 'ISR mang lại TTFB cực đại (thường < 30ms trên toàn cầu qua Vercel Edge Network / Cloudflare) và giúp server không bao giờ bị nghẽn DB kể cả khi triệu user vào cùng lúc.',
        state: {
          strategy: 'ISR',
          currentStepStage: '1. Cache HIT tại Edge (t=10s)',
          hops: [
            {
              id: 'h1',
              source: 'Browser',
              target: 'CDN / Edge Cache',
              action: 'GET /news/tech-2026',
              status: 'hit',
              latency: '18ms',
            },
          ],
          browserView: {
            title: 'Kỷ nguyên AI Agent 2026',
            content: 'Số lượt xem: 1.000 lượt (Bản cache tại build)',
            isInteractive: true,
          },
          serverState: {
            cacheStatus: 'HIT',
            revalidateSeconds: 60,
          },
          artifacts: [{ type: 'HTML', size: '12 KB', source: 'CDN Edge Cache' }],
          consoleLogs: [{ id: 'i1', text: 'CDN: 200 OK (X-Nextjs-Cache: HIT) in 18ms', step: 0, tag: 'cdn' }],
        },
      },
      {
        stepIndex: 1,
        title: 'User 2 truy cập ở giây thứ 75: Stale-While-Revalidate kích hoạt!',
        activeCodeLines: [4, 5, 8, 9],
        explanation: 'Thời gian đã trôi qua 75s (> 60s). Cache bị coi là "Cũ" (Stale). CDN vẫn TRẢ NGAY bản cũ cho User 2 (không để user chờ!), nhưng đồng thời gửi tín hiệu ngầm cho Node Server sinh lại trang!',
        interviewInsight: 'Cơ chế "Stale-While-Revalidate" (SWR) giải quyết hoàn hảo bài toán hiệu năng: Người dùng không bao giờ phải chịu độ trễ render lại trang.',
        state: {
          strategy: 'ISR',
          currentStepStage: '2. Trả Stale Cache + Kích hoạt Background Build (t=75s)',
          hops: [
            {
              id: 'h1',
              source: 'Browser',
              target: 'CDN / Edge Cache',
              action: 'GET /news/tech-2026',
              status: 'stale',
              latency: '22ms',
            },
            {
              id: 'h2',
              source: 'CDN / Edge Cache',
              target: 'Node.js Server',
              action: 'Background Revalidate Trigger',
              status: 'pending',
            },
          ],
          browserView: {
            title: 'Kỷ nguyên AI Agent 2026',
            content: 'Số lượt xem: 1.000 lượt (Bản cũ được trả ngay lập tức)',
            isInteractive: true,
          },
          serverState: {
            cacheStatus: 'STALE',
            revalidateSeconds: 60,
            dbQueryStatus: 'Đang fetch dữ liệu mới trong nền...',
          },
          artifacts: [{ type: 'HTML', size: '12 KB', source: 'CDN Edge Cache (Stale)' }],
          consoleLogs: [
            { id: 'i1', text: 'CDN: 200 OK (X-Nextjs-Cache: STALE) in 22ms', step: 0, tag: 'cdn' },
            { id: 'i2', text: '⚡ Edge triggered background revalidation', step: 1, tag: 'server' },
          ],
        },
      },
      {
        stepIndex: 2,
        title: 'Background Rebuild hoàn tất ➔ Cập nhật CDN Cache mới',
        activeCodeLines: [9, 10],
        explanation: 'Node Server fetch DB ra số lượt xem mới là 1.250 và render ra file HTML mới, sau đó đẩy lên đè cache trên CDN Edge.',
        interviewInsight: 'Nếu quá trình background rebuild bị lỗi (ví dụ DB sập), Next.js sẽ tiếp tục phục vụ bản stale cache cũ an toàn cho tới khi DB phục hồi!',
        state: {
          strategy: 'ISR',
          currentStepStage: '3. Hoàn tất Rebuild ngầm',
          hops: [
            {
              id: 'h3',
              source: 'Node.js Server',
              target: 'CDN / Edge Cache',
              action: 'Upload fresh HTML (views = 1250)',
              status: 'complete',
              latency: '110ms',
            },
          ],
          browserView: {
            title: 'Kỷ nguyên AI Agent 2026',
            content: 'Số lượt xem: 1.000 lượt (User 2 đã đọc xong)',
            isInteractive: true,
          },
          serverState: {
            cacheStatus: 'REGENERATING',
            dbQueryStatus: 'Rebuild thành công (views: 1250)',
          },
          artifacts: [{ type: 'HTML', size: '12.2 KB', source: 'New CDN Cache' }],
          consoleLogs: [
            { id: 'i1', text: 'CDN: 200 OK (X-Nextjs-Cache: STALE) in 22ms', step: 0, tag: 'cdn' },
            { id: 'i2', text: '⚡ Edge triggered background revalidation', step: 1, tag: 'server' },
            { id: 'i3', text: '✓ Rebuild complete! New cache published to Edge.', step: 2, tag: 'build' },
          ],
        },
      },
      {
        stepIndex: 3,
        title: 'User 3 truy cập ở giây thứ 80: Nhận ngay bản cache mới!',
        activeCodeLines: [3, 4, 9, 10],
        explanation: 'User 3 truy cập sau đó nhận ngay lập tức bản HTML mới với số views 1.250 từ CDN Edge chỉ trong 18ms!',
        interviewInsight: 'Next.js còn hỗ trợ On-Demand Revalidation (`revalidateTag` hoặc `revalidatePath`) qua Webhook từ CMS/Database mà không cần đợi hết 60s.',
        state: {
          strategy: 'ISR',
          currentStepStage: '4. User 3 nhận Cache mới (t=80s)',
          hops: [
            {
              id: 'h4',
              source: 'Browser',
              target: 'CDN / Edge Cache',
              action: 'GET /news/tech-2026',
              status: 'hit',
              latency: '19ms',
            },
          ],
          browserView: {
            title: 'Kỷ nguyên AI Agent 2026',
            content: 'Số lượt xem: 1.250 lượt (Dữ liệu tươi mới từ Edge!)',
            isInteractive: true,
          },
          serverState: {
            cacheStatus: 'HIT',
          },
          artifacts: [{ type: 'HTML', size: '12.2 KB', source: 'Fresh CDN Cache' }],
          consoleLogs: [
            { id: 'i4', text: 'User 3: CDN 200 OK (X-Nextjs-Cache: HIT - Fresh) in 19ms', step: 3, tag: 'cdn' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 3: RSC & HTML STREAMING (REACT SERVER COMPONENTS)
  // ==========================================
  {
    id: 'nextjs-rsc-streaming',
    title: 'RSC & Streaming: Tải trước Shell HTML với Suspense',
    tagline: 'Không để dữ liệu chậm làm nghẽn toàn bộ trang web (HTTP Chunked Stream)',
    difficulty: 'Senior',
    description: 'Xem cách App Router tách Server Component và Client Component: Server gửi ngay khung trang kèm Skeleton, sau đó stream component dữ liệu nặng qua kết nối HTTP mở.',
    code: `import { Suspense } from 'react';
import SlowReviews from './SlowReviews'; // Server Component mất 2 giây

export default function Dashboard() {
  return (
    <div className="layout">
      {/* 1. Phần nhanh: Header & Navbar gửi về NGAY LẬP TỨC */}
      <Header title="Bảng điều khiển" />

      {/* 2. Phần chậm: Bọc trong Suspense để Streaming */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <SlowReviews />
      </Suspense>
    </div>
  );
}`,
    expectedOutput: [
      'Chunk 1 (0ms): Header HTML + ReviewsSkeleton hiển thị ngay',
      'Chunk 2 (2000ms): SlowReviews tính xong -> Stream HTML thay thế Skeleton',
      'Zero Client Bundle: Code SlowReviews chỉ chạy ở Server, 0 KB JS gửi về client!',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Chunk 1: Server stream ngay lập tức Shell HTML + Skeleton',
        activeCodeLines: [6, 7, 8, 10],
        explanation: 'Nhờ có thẻ `<Suspense>`, Server không cần đợi `SlowReviews` hoàn thành. Nó gửi ngay chunk đầu tiên gồm Header và `<ReviewsSkeleton />` qua kết nối HTTP mở.',
        interviewInsight: 'Kỹ thuật HTTP Chunked Transfer Encoding cho phép Server gửi từng phần của trang HTML khi sẵn sàng, cải thiện chỉ số TTFB và FCP xuống gần như tức thì.',
        state: {
          strategy: 'RSC-Streaming',
          currentStepStage: '1. Chunk 1: Shell + Skeleton (0-50ms)',
          hops: [
            {
              id: 'h1',
              source: 'Node.js Server',
              target: 'Browser',
              action: 'Stream Chunk 1: <Header> + <Skeleton>',
              status: 'streaming',
              latency: '40ms',
            },
          ],
          browserView: {
            title: 'Bảng điều khiển',
            content: 'Header đã tải xong. Đang hiển thị Skeleton chờ đánh giá...',
            hasSkeleton: true,
            isInteractive: true,
          },
          serverState: {
            cacheStatus: 'BYPASS',
            dbQueryStatus: 'SlowReviews đang query DB phức tạp...',
          },
          artifacts: [
            { type: 'HTML', size: '4.5 KB (Chunk 1)', source: 'HTTP Stream' },
          ],
          consoleLogs: [
            { id: 's1', text: 'HTTP 200 (Transfer-Encoding: chunked)', step: 0, tag: 'http' },
            { id: 's2', text: 'Chunk 1 received: Rendered Header & Skeleton', step: 0, tag: 'fcp' },
          ],
        },
      },
      {
        stepIndex: 1,
        title: 'Chunk 2 (2000ms sau): Dữ liệu sẵn sàng ➔ Stream thay thế Skeleton',
        activeCodeLines: [10, 11, 12],
        explanation: 'Sau 2 giây, DB trả về kết quả. Node Server render `SlowReviews` thành payload RSC và script nội tuyến, stream tiếp Chunk 2 để thay thế Skeleton trên màn hình mà KHÔNG reload trang!',
        interviewInsight: 'Toàn bộ mã nguồn, thư viện markdown, hay icon của `SlowReviews` đều giữ ở Server, không hề đóng gói vào JavaScript bundle gửi tới trình duyệt (0 KB bundle size)!',
        state: {
          strategy: 'RSC-Streaming',
          currentStepStage: '2. Chunk 2: Thay thế Skeleton (2000ms)',
          hops: [
            {
              id: 'h2',
              source: 'Node.js Server',
              target: 'Browser',
              action: 'Stream Chunk 2: <SlowReviews> + inline swap script',
              status: 'complete',
              latency: '2000ms',
            },
          ],
          browserView: {
            title: 'Bảng điều khiển',
            content: 'Header + 1.500 Đánh giá (5★ Khách hàng rất hài lòng!)',
            hasSkeleton: false,
            isInteractive: true,
          },
          serverState: {
            cacheStatus: 'BYPASS',
            dbQueryStatus: 'Hoàn tất query (2000ms)',
          },
          artifacts: [
            { type: 'HTML', size: '4.5 KB (Chunk 1)', source: 'Browser DOM' },
            { type: 'RSC Payload', size: '8.2 KB (Chunk 2)', source: 'HTTP Stream' },
          ],
          consoleLogs: [
            { id: 's1', text: 'HTTP 200 (Transfer-Encoding: chunked)', step: 0, tag: 'http' },
            { id: 's3', text: 'Chunk 2 received: Swap skeleton -> SlowReviews', step: 1, tag: 'stream' },
            { id: 's4', text: 'Client bundle savings: ~45KB third-party libs kept on server', step: 1, tag: 'rsc' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 4: HYDRATION MISMATCH ERROR
  // ==========================================
  {
    id: 'nextjs-hydration-mismatch',
    title: 'Bẫy Hydration Mismatch: Server HTML khác Client DOM',
    tagline: 'Tại sao dùng window, localStorage hay new Date() làm nổ Warning đỏ?',
    difficulty: 'Mid',
    description: 'Phân tích lỗi phỏng vấn kinh điển: Server render ra múi giờ UTC hoặc rỗng, còn Client render ra giờ địa phương hoặc localStorage ➔ React phát hiện bất đồng bộ và xóa DOM!',
    code: `// LỖI KINH ĐIỂN: Truy cập API trình duyệt lúc render
export default function UserGreeting() {
  // ⚠️ LỖI: Server không có window.localStorage!
  // Server render: "Xin chào Khách"
  // Client render: "Xin chào Alice"
  const username = typeof window !== 'undefined'
    ? localStorage.getItem('user') || 'Khách'
    : 'Khách';

  return <div>Xin chào, {username}!</div>;
}`,
    expectedOutput: [
      'Server Render HTML: <div>Xin chào, Khách!</div>',
      'Client Hydration: <div>Xin chào, Alice!</div>',
      '❌ Error: Text content did not match. Server: "Khách" Client: "Alice"',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Server render chuỗi HTML với giá trị mặc định',
        activeCodeLines: [5, 6, 7, 8, 10],
        explanation: 'Khi chạy trên Node.js Server, `typeof window` là undefined. Hàm render ra chuỗi HTML tĩnh: `<div>Xin chào, Khách!</div>`.',
        interviewInsight: 'Mọi component trong SSR phải đảm bảo tính ĐỒNG NHẤT (Deterministic) giữa Server và lần Render đầu tiên của Client.',
        state: {
          strategy: 'SSR',
          currentStepStage: '1. Server Render HTML',
          hops: [
            {
              id: 'h1',
              source: 'Node.js Server',
              target: 'Browser',
              action: 'Send HTML: <div>Xin chào, Khách!</div>',
              status: 'complete',
            },
          ],
          browserView: {
            title: 'Greeting App',
            content: 'Xin chào, Khách!',
            isInteractive: false,
          },
          serverState: {
            cacheStatus: 'BYPASS',
          },
          artifacts: [{ type: 'HTML', size: '2 KB', source: 'Node.js Server' }],
          consoleLogs: [{ id: 'm1', text: 'Server rendered: "Xin chào, Khách!"', step: 0, tag: 'server' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Client chạy Hydration: Đọc localStorage và sinh lỗi Mismatch!',
        activeCodeLines: [5, 6, 7, 10],
        explanation: 'Trình duyệt chạy mã JavaScript. Lúc này `window` đã tồn tại, React đọc `localStorage.getItem("user")` ra chữ "Alice". React so sánh với cây DOM hiện tại ("Khách") và phát hiện không trùng khớp!',
        interviewInsight: 'React 18/19 sẽ ném warning: "Hydration failed because the initial UI does not match what was rendered on the server." và buộc phải bỏ qua DOM cũ để đập đi render lại, làm giảm mạnh hiệu năng!',
        state: {
          strategy: 'SSR',
          currentStepStage: '2. Hydration Mismatch Error!',
          hops: [
            {
              id: 'h2',
              source: 'Browser',
              target: 'Browser',
              action: 'Hydrate DOM: Compare Server HTML vs Client Virtual DOM',
              status: 'stale',
            },
          ],
          browserView: {
            title: 'Greeting App',
            content: 'Xin chào, Alice! (Đã bị đập bỏ DOM để render lại)',
            isInteractive: true,
            hasMismatchError: true,
          },
          serverState: {
            cacheStatus: 'BYPASS',
          },
          artifacts: [{ type: 'HTML', size: '2 KB', source: 'Client Repainted DOM' }],
          consoleLogs: [
            { id: 'm1', text: 'Server rendered: "Xin chào, Khách!"', step: 0, tag: 'server' },
            {
              id: 'm2',
              text: '❌ Warning: Text content did not match. Server: "Khách" Client: "Alice"',
              step: 1,
              tag: 'error',
            },
            {
              id: 'm3',
              text: '💡 Fix: Đặt đọc localStorage trong useEffect(() => { setUsername(...) }, [])',
              step: 1,
              tag: 'tip',
            },
          ],
        },
      },
    ],
  },
];
