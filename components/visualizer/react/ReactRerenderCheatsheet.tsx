'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, CheckCircle2, ChevronRight, Clock, Zap, ShieldAlert, Cpu } from 'lucide-react';

export function ReactRerenderCheatsheet() {
  const [activeTab, setActiveTab] = useState<'causes' | 'solutions' | 'traps'>('traps');
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
      title: 'Bẫy truyền Inline Object vào component bọc React.memo',
      badge: 'Shallow Compare',
      pipeline: [
        { label: 'Parent re-render', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Tạo object mới: style={{}}', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: '{} !== {} ➔ Memo hỏng!', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `const HeavyComponent = React.memo(function Heavy({ config }) {
  // Rất nặng...
  return <div>Data</div>;
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {/* ❌ BẪY: Mỗi lần App render, { dark: true } là object mới! */}
      <HeavyComponent config={{ dark: true }} />
    </div>
  );
}`,
      note: 'React.memo so sánh các props bằng Object.is (so sánh tham chiếu địa chỉ nhớ).',
      answerSummary: 'HeavyComponent VẪN RE-RENDER 100% các lần bấm nút!',
      answerDetail:
        'Trong JavaScript, `{ dark: true } !== { dark: true }` vì chúng nằm ở hai ô nhớ hoàn toàn khác nhau. Khi App re-render, một object config mới toanh được tạo ra, khiến React.memo kết luận rằng prop đã thay đổi! Để khắc phục: chuyển config ra ngoài component `const CONFIG = { dark: true };` hoặc bọc bằng `useMemo`.',
    },
    {
      id: 1,
      title: 'Context API Blast Radius: 1 giá trị đổi, cả app giật lag',
      badge: 'Context Splitting',
      pipeline: [
        { label: 'AppContext update: theme', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Component chỉ dùng userProfile', bg: 'bg-amber-100 text-amber-950 border border-amber-300' },
        { label: 'Vẫn bị ép buộc re-render!', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
      ],
      code: `const AppContext = createContext();

function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: 'Bob' });

  // ❌ Gom tất cả vào 1 context value
  return (
    <AppContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}`,
      note: 'useContext không thể chọn lọc (selector) một phần dữ liệu nếu không có thư viện bên ngoài.',
      answerSummary: 'Mọi component gọi useContext(AppContext) đều re-render khi theme đổi',
      answerDetail:
        'Khi theme thay đổi, object `value={{ theme, user, ... }}` thay đổi tham chiếu. Tất cả components tiêu thụ AppContext (dù chỉ đọc user) đều bị ép buộc re-render và KHÔNG THỂ BỊ CHẶN bởi React.memo! Giải pháp Strong Middle: Áp dụng Context Splitting (tách thành ThemeContext và UserContext riêng biệt) hoặc dùng Zustand.',
    },
    {
      id: 2,
      title: 'Kỹ thuật State Colocation: Tối ưu không cần dùng memo',
      badge: 'Kiến trúc sạch',
      pipeline: [
        { label: 'Input state nằm ở Parent', bg: 'bg-zinc-200 text-zinc-900' },
        { label: 'Gõ 1 phím ➔ Cả trang re-render', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
        { label: 'Đẩy state xuống component con', bg: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
      ],
      code: `// ❌ KÉM: State text đặt ở Root, mỗi phím gõ re-render toàn app
function Page() {
  const [text, setText] = useState('');
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <HeavyAnalyticsChart />
    </div>
  );
}

// ✅ CHUẨN (State Colocation): Cô lập state vào đúng nơi nó thuộc về
function SearchInput() {
  const [text, setText] = useState('');
  return <input value={text} onChange={e => setText(e.target.value)} />;
}

function Page() {
  return (
    <div>
      <SearchInput />
      <HeavyAnalyticsChart /> {/* Hoàn toàn không bao giờ re-render khi gõ phím! */}
    </div>
  );
}`,
      note: 'State Colocation là kỹ thuật tối ưu hóa số 1 trong React trước khi nghĩ đến memo.',
      answerSummary: 'Cô lập Re-render trong phạm vi hẹp nhất có thể',
      answerDetail:
        'Strong Middle dev không lạm dụng `useMemo` hay `React.memo` vô tội vạ. Bằng cách đẩy state xuống đúng component trực tiếp sử dụng nó (hoặc truyền component nặng dưới dạng `{children}`), React tự nhiên không bao giờ phải re-render phần còn lại của trang web!',
    },
  ];

  const currentQ = questions[activeQuestion];

  return (
    <article className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-12" aria-label="Sổ tay React Re-render">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-zinc-600 font-semibold" aria-label="Breadcrumb">
        <span>React Core &amp; Performance</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-900 font-bold">React Re-render &amp; Blast Radius</span>
      </nav>

      {/* 2. Hero Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-serif">
              React Re-render Mechanics &amp; Blast Radius
            </h1>
            <p className="text-[15px] sm:text-[16px] text-zinc-700 mt-1.5 leading-relaxed">
              Giải mã cơ chế lan truyền re-render, nguyên tắc so sánh nông (Shallow Compare) của React.memo, và chiến lược State Colocation để tối ưu hiệu năng không cần lạm dụng hook.
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

        {/* Feature Visual Accent: Re-render Pipeline Diagram */}
        <div className="rounded-2xl border border-zinc-300 bg-[#FBF9F5] p-4 sm:p-5 shadow-2xs" data-visual="react-rerender-pipeline">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
              <Zap className="w-4 h-4 text-[#BD5332]" />
              <span>Các giai đoạn của một chu kỳ Re-render trong React</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200 font-semibold">
              Trigger ➔ Render ➔ Commit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
            <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-[#BD5332]">1. Trigger Phase</span>
              <p className="text-[11px] text-zinc-600">Gọi setState, đổi Props cha, đổi Context value hoặc component mount.</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-amber-900">2. Render Phase (Pure)</span>
              <p className="text-[11px] text-amber-900">React gọi component function để lấy JSX mới và chạy Diffing với Fiber cũ.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-2xs space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-900">3. Commit Phase (DOM)</span>
              <p className="text-[11px] text-emerald-900">Chỉ cập nhật đúng những DOM node có thay đổi thực tế vào trình duyệt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Underline Tab Bar */}
      <nav className="flex items-center gap-8 border-b border-zinc-200 pt-1 text-[15px]" aria-label="Nội dung sổ tay">
        <button
          onClick={() => setActiveTab('causes')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'causes'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          3 Lý do Re-render
        </button>

        <button
          onClick={() => setActiveTab('solutions')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'solutions'
              ? 'border-b-2 border-[#BD5332] font-bold text-zinc-950'
              : 'text-zinc-600 hover:text-zinc-950 font-semibold'
          }`}
        >
          Kỹ thuật tối ưu
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
            <strong>Re-render không đồng nghĩa với DOM Update!</strong> Component re-render chỉ là việc chạy lại hàm JavaScript. React có bộ Diffing cực nhanh để tránh chạm vào real DOM. Đừng tối ưu non (premature optimization) bằng <code>useMemo/useCallback</code> khắp nơi; chi phí khởi tạo và so sánh dependencies của chúng đôi khi còn tốn CPU hơn một lượt re-render thông thường!
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: 3 LÝ DO RE-RENDER                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'causes' && (
        <section className="space-y-4 animate-in fade-in" aria-label="3 lý do Re-render">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-1 shadow-2xs">
              <span className="text-xs font-mono font-bold text-[#BD5332]">LÝ DO 1</span>
              <h3 className="font-bold text-[15px] text-zinc-950">State Thay Đổi</h3>
              <p className="text-[12px] text-zinc-700">Khi gọi setState với giá trị mới khác Object.is với giá trị cũ.</p>
            </div>

            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1 shadow-2xs">
              <span className="text-xs font-mono font-bold text-amber-800">LÝ DO 2 (Phổ biến nhất)</span>
              <h3 className="font-bold text-[15px] text-amber-950">Component Cha Re-render</h3>
              <p className="text-[12px] text-amber-950">Mặc định component cha render sẽ kéo theo toàn bộ cây con re-render.</p>
            </div>

            <div className="p-4 rounded-xl border border-purple-300 bg-purple-50/50 space-y-1 shadow-2xs">
              <span className="text-xs font-mono font-bold text-purple-800">LÝ DO 3</span>
              <h3 className="font-bold text-[15px] text-purple-950">Context Value Đổi</h3>
              <p className="text-[12px] text-purple-950">Mọi component tiêu thụ useContext đều bị render khi Provider đổi giá trị.</p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KỸ THUẬT TỐI ƯU                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'solutions' && (
        <section className="space-y-4 animate-in fade-in" aria-label="Kỹ thuật tối ưu">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-2 shadow-2xs">
              <h3 className="font-bold text-[16px] text-zinc-950 font-serif">
                1. State Colocation (Đẩy state xuống dưới)
              </h3>
              <p className="text-[13px] text-zinc-700 leading-relaxed font-medium">
                Nếu một state chỉ phục vụ một phần nhỏ của UI (như ô input tìm kiếm, menu dropdown, modal), hãy đóng gói state đó vào bên trong component con thay vì giữ ở Component cha.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-2 shadow-2xs">
              <h3 className="font-bold text-[16px] text-zinc-950 font-serif">
                2. Component Composition (Truyền qua children)
              </h3>
              <p className="text-[13px] text-zinc-700 leading-relaxed font-medium">
                Khi component nặng được truyền vào dưới dạng <code>&lt;Parent&gt;&lt;HeavyChild /&gt;&lt;/Parent&gt;</code>, prop <code>children</code> không bị tạo mới khi Parent đổi state, giúp HeavyChild tự động tránh được re-render mà không cần <code>React.memo</code>!
              </p>
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
                Dự đoán kết quả re-render trước khi mở đáp án chi tiết
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
                  onClick={() => handleCopy(`rerender-q-${currentQ.id}`, currentQ.code)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
                  title="Sao chép mã"
                >
                  {copiedId === `rerender-q-${currentQ.id}` ? (
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
