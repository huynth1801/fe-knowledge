'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, CheckCircle2, ChevronRight, Clock, Layers, Sparkles, Zap } from 'lucide-react';

export function StateManagementCheatsheet() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'comparison' | 'traps'>('architecture');
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
      title: 'Bẫy lưu trữ API Response vào Redux / Zustand toàn cục',
      badge: 'Kiến trúc hiện đại',
      pipeline: [
        { label: 'Fetch API users', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Dispatch lưu vào Redux store', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Dữ liệu Stale, tự viết cache & loading', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
      ],
      code: `// ❌ LỖI THỜI: Tự quản lý Server State bằng Redux/Zustand
const useUserStore = create((set) => ({
  users: [],
  isLoading: false,
  error: null,
  fetchUsers: async () => {
    set({ isLoading: true });
    // Phải tự viết try/catch, tự viết deduplication, tự viết polling...
  }
}));

// ✅ CHUẨN SENIOR: Giao Server State cho TanStack Query!
const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000 // Tự động cache 5 phút!
});`,
      note: 'Hơn 80% dữ liệu trong app là Server State. Đừng dùng Redux để làm thay việc của HTTP cache.',
      answerSummary: 'Tách biệt tuyệt đối Server State và Client State',
      answerDetail:
        'Redux sinh ra để quản lý Client State phức tạp. Khi dùng Redux cho API data, bạn phải tự code lại những tính năng cực khó: Cache Invalidation, Deduplication (gộp 5 request giống nhau thành 1), Refetch on Window Focus, Polling, và Optimistic Rollback. Dùng TanStack Query giải quyết 100% các bài toán trên chỉ với 1 dòng code!',
    },
    {
      id: 1,
      title: 'Zustand Selector: Ngăn chặn Re-render 100% component không liên quan',
      badge: 'Hiệu năng Zustand',
      pipeline: [
        { label: 'const { count } = useStore()', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Mọi field khác đổi ➔ Bị render lây!', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'useStore(s => s.count) ➔ An toàn!', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `// ❌ SAI LẦM: Destructure toàn bộ store
// Khi 'theme' hoặc 'token' thay đổi, Component này VẪN BỊ RE-RENDER!
const { count } = useAppStore();

// ✅ CHUẨN STRONG MID: Luôn dùng Atomic Selector
// Chỉ re-render duy nhất khi giá trị count thay đổi!
const count = useAppStore((state) => state.count);`,
      note: 'Zustand sử dụng so sánh Strict Equality (===) trên kết quả trả về của selector function.',
      answerSummary: 'Luôn dùng Atomic Selector trong Zustand để cô lập re-render',
      answerDetail:
        'Nếu bạn gọi `useAppStore()` không truyền selector, hook sẽ trả về toàn bộ state object. Bất kỳ thuộc tính nào trong store thay đổi, object mới được sinh ra và ép component re-render. Viết `state => state.count` giúp Zustand lắng nghe riêng rẽ thuộc tính đó.',
    },
    {
      id: 2,
      title: 'Optimistic Updates: Cập nhật giao diện Like / Bookmark trong 0ms',
      badge: 'UX Cao cấp',
      pipeline: [
        { label: 'User click Tim / Like', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Tăng số Like ngay trên UI (0ms)', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
        { label: 'Nếu API lỗi ➔ Rollback dữ liệu cũ', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: toggleLikePost,
  onMutate: async (postId) => {
    // 1. Huỷ các query đang bay để tránh ghi đè
    await queryClient.cancelQueries({ queryKey: ['post', postId] });
    // 2. Lưu snapshot dữ liệu cũ để phòng khi lỗi rollback
    const prevPost = queryClient.getQueryData(['post', postId]);
    // 3. Ép cập nhật UI tức thì!
    queryClient.setQueryData(['post', postId], (old) => ({
      ...old,
      isLiked: !old.isLiked,
      likesCount: old.isLiked ? old.likesCount - 1 : old.likesCount + 1,
    }));
    return { prevPost };
  },
  onError: (err, newTodo, context) => {
    // 4. Rollback nếu server báo lỗi!
    queryClient.setQueryData(['post', postId], context.prevPost);
  },
});`,
      note: 'Optimistic UI biến ứng dụng web có độ mượt và phản hồi nhanh như ứng dụng native iOS/Android.',
      answerSummary: 'Snapshot ➔ Optimistic Write ➔ Rollback on Error',
      answerDetail:
        'Người dùng không muốn phải chờ 500ms network roundtrip chỉ để thấy nút Like đổi màu. Bằng cách cập nhật cache tức thì trong `onMutate` và chuẩn bị `context.prevPost` để rollback khi gặp lỗi mạng, app đạt tốc độ phản hồi 0ms tuyệt đối.',
    },
  ];

  const currentQ = questions[activeQuestion];

  return (
    <article className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12" aria-label="Sổ tay Quản lý State">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-zinc-600 font-semibold" aria-label="Breadcrumb">
        <span>React Core &amp; Performance</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-900 font-bold">State Architecture: Server vs Client State</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-serif">
              State Architecture: Server vs Client State
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-700 mt-1.5 leading-relaxed">
              Phân định ranh giới giữa Dữ liệu máy chủ (TanStack Query / SWR) và Trạng thái giao diện (Zustand / Redux Toolkit) để loại bỏ 90% boilerplate thừa.
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

        {/* Feature Visual Accent: Two State Worlds */}
        <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-4 sm:p-5 shadow-2xs" data-visual="state-architecture-split">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <Layers className="w-4 h-4 text-[#BD5332]" />
              <span>Hai thế giới State trong ứng dụng Frontend hiện đại</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold">
              Separation of Concerns
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-300 shadow-2xs space-y-1.5">
              <span className="text-xs font-mono font-bold text-blue-900 uppercase tracking-wider">
                1. Server State (Dữ liệu từ xa)
              </span>
              <h4 className="font-bold text-sm text-blue-950">TanStack Query / SWR / RTK Query</h4>
              <p className="text-[12px] text-blue-900 leading-relaxed">
                Dữ liệu do backend sở hữu, không đồng bộ, dễ bị cũ (stale), chia sẻ giữa nhiều client. Cần Caching, Deduping, Auto-retry, Revalidate on Focus.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-300 shadow-2xs space-y-1.5">
              <span className="text-xs font-mono font-bold text-purple-900 uppercase tracking-wider">
                2. Client State (Trạng thái giao diện)
              </span>
              <h4 className="font-bold text-sm text-purple-950">Zustand / Jotai / Context API</h4>
              <p className="text-[12px] text-purple-900 leading-relaxed">
                Dữ liệu do frontend sở hữu, đồng bộ, mất khi reload trang. Phục vụ UI thuần túy: Sidebar Open/Close, Modal đang mở, Dark Theme, Form wizard step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Underline Tab Bar */}
      <nav className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]" aria-label="Nội dung sổ tay">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'architecture'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Kiến trúc Tách biệt State
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'comparison'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Bảng So Sánh Thư Viện
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
            Đừng bao giờ sao chép dữ liệu từ TanStack Query (Server State) vào `useState` hoặc `useZustand` cục bộ trừ khi user đang ở chế độ chỉnh sửa nháp (Draft Editing). Sao chép state sẽ làm mất tính đồng bộ tự động của cache và sinh ra bug dữ liệu không đồng nhất (Data Inconsistency)!
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: KIẾN TRÚC TÁCH BIỆT STATE & SO SÁNH CODE RTK VS ZUSTAND            */}
      {/* ========================================================================= */}
      {activeTab === 'architecture' && (
        <section className="space-y-6 animate-in fade-in" aria-label="Kiến trúc State">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-3 shadow-2xs">
              <h3 className="font-bold text-[16px] text-zinc-950 font-serif">
                Tại sao Redux Thunk / Saga dần thoái trào?
              </h3>
              <p className="text-[13px] text-zinc-700 leading-relaxed font-medium">
                Trong các ứng dụng React cũ, lập trình viên tạo ra hàng nghìn dòng boilerplate: `FETCH_USER_REQUEST`, `FETCH_USER_SUCCESS`, `FETCH_USER_FAIL`. Họ biến Redux thành một database in-memory tồi tàn. Khi TanStack Query ra đời, 90% code quản lý API state trong Redux trở nên thừa thãi.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-3 shadow-2xs">
              <h3 className="font-bold text-[16px] text-zinc-950 font-serif">
                Sức mạnh của Zustand cho Client State
              </h3>
              <p className="text-[13px] text-zinc-700 leading-relaxed font-medium">
                Zustand không cần Context Provider bao bọc bên ngoài. Nó cho phép đọc và thay đổi state trực tiếp bên ngoài React component (như trong Axios interceptors hoặc websocket listener) bằng <code>useStore.getState()</code> và <code>useStore.setState()</code>.
              </p>
            </div>
          </div>

          {/* Direct Code Face-off: Redux Toolkit vs Zustand */}
          <div className="rounded-2xl border border-zinc-300 bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="space-y-0.5">
                <span className="font-mono text-[11px] font-bold text-[#BD5332] uppercase">
                  Code Face-off
                </span>
                <h3 className="font-serif font-bold text-lg text-zinc-950">
                  Cùng bài toán Shopping Cart: Redux Toolkit vs Zustand
                </h3>
              </div>
              <span className="text-xs bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md font-mono font-semibold">
                Client State Implementation
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
              {/* 1. Redux Toolkit */}
              <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 space-y-2.5 overflow-x-auto border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="text-purple-300 font-bold">1. Redux Toolkit (@reduxjs/toolkit)</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded">
                    Opinionated (~35KB)
                  </span>
                </div>
                <pre className="text-xs font-mono leading-relaxed text-zinc-200">
{`// 1. Tạo Slice với Immer tích hợp sẵn
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

interface CartState { items: { id: string; qty: number }[] }

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] } as CartState,
  reducers: {
    addItem: (state, action: PayloadAction<{ id: string }>) => {
      // ✅ Cho phép mutate state giả lập nhờ Immer
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) existing.qty += 1;
      else state.items.push({ id: action.payload.id, qty: 1 });
    },
  },
});

export const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

// 2. Sử dụng trong Component
// Phải bọc <Provider store={store}> ở root
function CartBadge() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(s => s.cart.items.length);
  return <button onClick={() => dispatch(cartSlice.actions.addItem({ id: 'p1' }))}>
    Cart ({count})
  </button>;
}`}
                </pre>
              </div>

              {/* 2. Zustand */}
              <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 space-y-2.5 overflow-x-auto border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                  <span className="text-amber-300 font-bold">2. Zustand (v5 / v4)</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded">
                    Unopinionated (~1.2KB)
                  </span>
                </div>
                <pre className="text-xs font-mono leading-relaxed text-zinc-200">
{`// 1. Tạo Store duy nhất trong 1 file (Zero-boilerplate)
import { create } from 'zustand';

interface CartStore {
  items: { id: string; qty: number }[];
  addItem: (id: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (id) => set((state) => {
    const existing = state.items.find(i => i.id === id);
    if (existing) {
      return {
        items: state.items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)
      };
    }
    return { items: [...state.items, { id, qty: 1 }] };
  }),
}));

// 2. Sử dụng trực tiếp - KHÔNG CẦN PROVIDER!
function CartBadge() {
  // ✅ Atomic selector: Chỉ re-render khi items.length đổi!
  const count = useCartStore((s) => s.items.length);
  const addItem = useCartStore((s) => s.addItem);
  return <button onClick={() => addItem('p1')}>Cart ({count})</button>;
}

// 3. Đọc/Ghi NGOÀI React (Axios / WebSocket):
// useCartStore.getState().addItem('p1');`}
                </pre>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BẢNG SO SÁNH THƯ VIỆN & CÂY QUYẾT ĐỊNH (DECISION TREE)              */}
      {/* ========================================================================= */}
      {activeTab === 'comparison' && (
        <section className="space-y-6 animate-in fade-in" aria-label="So sánh thư viện">
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-200 text-zinc-800 font-mono font-bold">
                  <th className="p-3">Giải pháp</th>
                  <th className="p-3">Phù hợp loại State nào?</th>
                  <th className="p-3">Cơ chế Selector chống Re-render</th>
                  <th className="p-3">Độ phức tạp Boilerplate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-medium">
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-blue-900">TanStack Query</td>
                  <td className="p-3">100% Server State (API data)</td>
                  <td className="p-3 text-emerald-700 font-bold">Có (`select: (data) =&gt; ...`)</td>
                  <td className="p-3 text-emerald-700 font-bold">Rất thấp (Chỉ cần queryFn)</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-amber-900">Zustand</td>
                  <td className="p-3">Client State (UI, Modals, Theme)</td>
                  <td className="p-3 text-emerald-700 font-bold">Có (`useStore(s =&gt; s.prop)`)</td>
                  <td className="p-3 text-emerald-700 font-bold">Cực thấp (1 hàm create)</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-purple-900">Redux Toolkit</td>
                  <td className="p-3">Enterprise Client State rất lớn</td>
                  <td className="p-3 text-emerald-700 font-bold">Có (`useSelector`)</td>
                  <td className="p-3 text-amber-700">Trung bình (Slice, Store, Provider)</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-700">React Context</td>
                  <td className="p-3">Low-frequency Client State (Theme, Lang)</td>
                  <td className="p-3 text-rose-700 font-bold">KHÔNG (Re-render cả subtree)</td>
                  <td className="p-3 text-emerald-700">Thấp (Có sẵn trong React)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Decision Matrix Grid */}
          <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-5 space-y-4 shadow-2xs">
            <h3 className="font-serif font-bold text-lg text-zinc-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BD5332]" />
              Cây quyết định: Khi nào chọn Redux Toolkit vs Zustand vs TanStack Query?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-amber-300 bg-white space-y-2">
                <span className="font-mono text-xs font-bold text-amber-900 uppercase">
                  🏆 Chọn Zustand khi:
                </span>
                <ul className="text-xs text-zinc-700 space-y-1.5 list-disc list-inside">
                  <li>Ứng dụng Next.js, Vite, React 19 hiện đại.</li>
                  <li>Cần sự tinh gọn, không muốn cấu hình Context Provider.</li>
                  <li>Cần truy cập state bên ngoài React (Axios interceptor, WebSocket handler).</li>
                  <li>Tối ưu Bundle size (&lt; 2KB).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-purple-300 bg-white space-y-2">
                <span className="font-mono text-xs font-bold text-purple-900 uppercase">
                  🏢 Chọn Redux Toolkit khi:
                </span>
                <ul className="text-xs text-zinc-700 space-y-1.5 list-disc list-inside">
                  <li>Dự án Enterprise quy mô lớn, nhiều team làm chung (50+ devs).</li>
                  <li>Yêu cầu quy chuẩn nghiêm ngặt về Action, Reducer bất biến.</li>
                  <li>Cần Time-travel debugging với Redux DevTools trong môi trường kiểm thử.</li>
                  <li>Dự án ngân hàng/tài chính có pipeline middleware phức tạp.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-blue-300 bg-white space-y-2">
                <span className="font-mono text-xs font-bold text-blue-900 uppercase">
                  ⚡ Luôn chọn TanStack Query khi:
                </span>
                <ul className="text-xs text-zinc-700 space-y-1.5 list-disc list-inside">
                  <li>Bất kỳ dữ liệu nào đến từ REST API hoặc GraphQL.</li>
                  <li>Cần Cache Invalidation, Deduplication tự động.</li>
                  <li>Cần Optimistic Updates, Polling, Infinite Scroll.</li>
                  <li><strong>Tuyệt đối không lưu API data vào Redux hay Zustand!</strong></li>
                </ul>
              </div>
            </div>
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
                Dự đoán kiến trúc state tối ưu trước khi mở đáp án chi tiết
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
                <span className="font-mono text-zinc-400 font-medium">tsx</span>
                <button
                  onClick={() => handleCopy(`state-q-${currentQ.id}`, currentQ.code)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
                  title="Sao chép mã"
                >
                  {copiedId === `state-q-${currentQ.id}` ? (
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
