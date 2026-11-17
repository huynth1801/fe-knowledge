export interface FiberNodeItem {
  id: string;
  name: string;
  type: 'HostRoot' | 'FunctionComponent' | 'HostComponent';
  props: Record<string, any>;
  stateNode?: string;
  flags?: 'NoFlags' | 'Placement' | 'Update' | 'Deletion';
  child?: string;
  sibling?: string;
  returnId?: string;
  isModified?: boolean;
}

export interface HookItem {
  id: string;
  hookName: string;
  value: string;
  type: 'useState' | 'useEffect' | 'useMemo' | 'useRef';
  nextId?: string;
  isActive?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export interface KeyComparisonItem {
  key: string | number;
  label: string;
  inputValue: string;
  status?: 'matched' | 'created' | 'shifted-error';
}

export interface BatchingUpdateItem {
  setter: string;
  payload: string;
  queuedAt: string;
}

export interface ReactFiberState {
  currentTree: FiberNodeItem[];
  workInProgressTree: FiberNodeItem[];
  phase: 'idle' | 'renderPhase' | 'commitPhase';
  activeFiberId?: string;
  commitAction?: string;
  consoleLogs: { id: string; text: string; step: number; tag?: string }[];
  hooksList?: HookItem[];
  keyComparison?: {
    strategy: 'index' | 'unique-id';
    before: KeyComparisonItem[];
    after: KeyComparisonItem[];
    note: string;
  };
  batchingState?: {
    updates: BatchingUpdateItem[];
    renderCount: number;
    isBatched: boolean;
    note: string;
  };
}

export interface ReactFiberStep {
  stepIndex: number;
  title: string;
  activeCodeLines: number[];
  explanation: string;
  interviewInsight?: string;
  state: ReactFiberState;
}

export interface ReactScenario {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  description: string;
  code: string;
  expectedOutput: string[];
  steps: ReactFiberStep[];
}

export const reactFiberScenarios: ReactScenario[] = [
  // ==========================================
  // SCENARIO 1: DUAL BUFFERING & RECONCILIATION
  // ==========================================
  {
    id: 'fiber-dual-buffering',
    title: 'Dual Buffering: Current vs WorkInProgress Tree',
    tagline: 'Kỹ thuật 2 bộ đệm đồ họa giải mã cơ chế Reconciler ngầm',
    difficulty: 'Senior',
    description: 'Quan sát cách React tạo cây WorkInProgress trong bộ nhớ ngầm ở Render Phase, tính toán diffing, rồi hoán đổi con trỏ sang DOM thật ở Commit Phase.',
    code: `function CounterApp() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // Kích hoạt Re-render
  };

  return (
    <div className="container">
      <h1>Đếm số</h1>
      <button onClick={handleClick}>
        Đã bấm {count} lần
      </button>
    </div>
  );
}`,
    expectedOutput: ['Mount: count = 0', 'Render Phase: diffing', 'Commit Phase: swap tree -> count = 1'],
    steps: [
      {
        stepIndex: 0,
        title: 'Trạng thái Mount ban đầu (Current Tree)',
        activeCodeLines: [1, 2, 8, 9, 10, 11],
        explanation: 'Ứng dụng đã render xong lần đầu. Cây Fiber hoàn chỉnh được gọi là `Current Tree` đang ánh xạ trực tiếp với DOM thật trên trình duyệt (count = 0).',
        interviewInsight: 'Kỹ thuật Dual Buffering mượn từ đồ họa game: 1 bộ đệm hiển thị cho người xem, 1 bộ đệm vẽ ngầm trong RAM để tránh giật lag.',
        state: {
          phase: 'idle',
          currentTree: [
            { id: 'root', name: 'HostRoot', type: 'HostRoot', props: {}, flags: 'NoFlags' },
            { id: 'app', name: '<CounterApp />', type: 'FunctionComponent', props: { count: 0 }, flags: 'NoFlags' },
            { id: 'div', name: '<div.container>', type: 'HostComponent', props: {}, flags: 'NoFlags' },
            { id: 'h1', name: '<h1>', type: 'HostComponent', props: { text: 'Đếm số' }, flags: 'NoFlags' },
            { id: 'btn', name: '<button>', type: 'HostComponent', props: { text: 'Đã bấm 0 lần' }, flags: 'NoFlags' },
          ],
          workInProgressTree: [],
          consoleLogs: [{ id: 'm1', text: 'Mount: CounterApp (count: 0)', step: 0, tag: 'mount' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Người dùng click button ➔ Kích hoạt setCount(1)',
        activeCodeLines: [4, 5],
        explanation: 'Hàm setCount(1) được gọi. React đặt lịch một lượt điều phối mới và bắt đầu bước vào **Render Phase**.',
        interviewInsight: 'Render Phase hoàn toàn bất đồng bộ (Asynchronous) trong Concurrent React: React có thể tạm dừng hoặc hủy bỏ lượt render này nếu có tương tác người dùng quan trọng hơn xuất hiện!',
        state: {
          phase: 'renderPhase',
          currentTree: [
            { id: 'root', name: 'HostRoot', type: 'HostRoot', props: {}, flags: 'NoFlags' },
            { id: 'app', name: '<CounterApp />', type: 'FunctionComponent', props: { count: 0 }, flags: 'NoFlags' },
            { id: 'div', name: '<div.container>', type: 'HostComponent', props: {}, flags: 'NoFlags' },
            { id: 'h1', name: '<h1>', type: 'HostComponent', props: { text: 'Đếm số' }, flags: 'NoFlags' },
            { id: 'btn', name: '<button>', type: 'HostComponent', props: { text: 'Đã bấm 0 lần' }, flags: 'NoFlags' },
          ],
          workInProgressTree: [
            { id: 'w-root', name: 'HostRoot', type: 'HostRoot', props: {}, flags: 'NoFlags' },
          ],
          consoleLogs: [{ id: 'm1', text: 'Mount: CounterApp (count: 0)', step: 0, tag: 'mount' }],
        },
      },
      {
        stepIndex: 2,
        title: 'Render Phase: Tạo cây WorkInProgress ngầm trong RAM',
        activeCodeLines: [1, 2, 8],
        explanation: 'React sao chép và tái sử dụng các node từ Current Tree sang WorkInProgress Tree. Node `<CounterApp>` được tính toán lại với giá trị `count = 1`.',
        interviewInsight: 'Nhờ cơ chế Fiber, mỗi Fiber node là một đơn vị công việc (Unit of Work). React duyệt qua cây bằng liên kết đơn: child, sibling, return.',
        state: {
          phase: 'renderPhase',
          activeFiberId: 'w-app',
          currentTree: [
            { id: 'root', name: 'HostRoot', type: 'HostRoot', props: {}, flags: 'NoFlags' },
            { id: 'app', name: '<CounterApp />', type: 'FunctionComponent', props: { count: 0 }, flags: 'NoFlags' },
            { id: 'div', name: '<div.container>', type: 'HostComponent', props: {}, flags: 'NoFlags' },
            { id: 'h1', name: '<h1>', type: 'HostComponent', props: { text: 'Đếm số' }, flags: 'NoFlags' },
            { id: 'btn', name: '<button>', type: 'HostComponent', props: { text: 'Đã bấm 0 lần' }, flags: 'NoFlags' },
          ],
          workInProgressTree: [
            { id: 'w-root', name: 'HostRoot', type: 'HostRoot', props: {}, flags: 'NoFlags' },
            { id: 'w-app', name: '<CounterApp />', type: 'FunctionComponent', props: { count: 1 }, flags: 'Update', isModified: true },
            { id: 'w-div', name: '<div.container>', type: 'HostComponent', props: {}, flags: 'NoFlags' },
          ],
          consoleLogs: [{ id: 'm1', text: 'Mount: CounterApp (count: 0)', step: 0, tag: 'mount' }],
        },
      },
      {
        stepIndex: 3,
        title: 'Diffing Heuristics: Đánh dấu cờ (Flags) trên Node thay đổi',
        activeCodeLines: [9, 10, 11, 12],
        explanation: 'Thuật toán Diffing so sánh: Node `<h1>` không đổi props ➔ giữ nguyên `NoFlags`. Node `<button>` đổi text từ 0 ➔ 1 ➔ Đánh dấu cờ `flags = Update`!',
        interviewInsight: 'React không sửa DOM ngay lúc này! Nó chỉ gắn cờ (Side-effect Flags) lên Fiber node trong RAM để chuẩn bị cho Commit Phase.',
        state: {
          phase: 'renderPhase',
          activeFiberId: 'w-btn',
          currentTree: [
            { id: 'root', name: 'HostRoot', type: 'HostRoot', props: {}, flags: 'NoFlags' },
            { id: 'app', name: '<CounterApp />', type: 'FunctionComponent', props: { count: 0 }, flags: 'NoFlags' },
            { id: 'div', name: '<div.container>', type: 'HostComponent', props: {}, flags: 'NoFlags' },
            { id: 'h1', name: '<h1>', type: 'HostComponent', props: { text: 'Đếm số' }, flags: 'NoFlags' },
            { id: 'btn', name: '<button>', type: 'HostComponent', props: { text: 'Đã bấm 0 lần' }, flags: 'NoFlags' },
          ],
          workInProgressTree: [
            { id: 'w-root', name: 'HostRoot', type: 'HostRoot', props: {}, flags: 'NoFlags' },
            { id: 'w-app', name: '<CounterApp />', type: 'FunctionComponent', props: { count: 1 }, flags: 'Update', isModified: true },
            { id: 'w-div', name: '<div.container>', type: 'HostComponent', props: {}, flags: 'NoFlags' },
            { id: 'w-h1', name: '<h1>', type: 'HostComponent', props: { text: 'Đếm số' }, flags: 'NoFlags' },
            { id: 'w-btn', name: '<button>', type: 'HostComponent', props: { text: 'Đã bấm 1 lần' }, flags: 'Update', isModified: true },
          ],
          consoleLogs: [
            { id: 'm1', text: 'Mount: CounterApp (count: 0)', step: 0, tag: 'mount' },
            { id: 'd1', text: 'Diffing: button gắn cờ Update (0 -> 1)', step: 3, tag: 'diff' },
          ],
        },
      },
      {
        stepIndex: 4,
        title: 'Commit Phase: Hoán đổi con trỏ (Pointer Swap) & Ghi vào DOM thật',
        activeCodeLines: [10, 11],
        explanation: 'Render Phase kết thúc, React bước vào **Commit Phase (Đồng bộ, không thể ngắt)**. React quét qua các node có cờ `Update`, cập nhật text trên DOM thật, và trỏ `root.current = workInProgress`!',
        interviewInsight: 'Commit Phase luôn chạy đồng bộ trong một lần duy nhất để người dùng không bao giờ nhìn thấy giao diện dở dang, chấp vá.',
        state: {
          phase: 'commitPhase',
          commitAction: 'root.current = workInProgress (DOM Updated!)',
          currentTree: [
            { id: 'root', name: 'HostRoot', type: 'HostRoot', props: {}, flags: 'NoFlags' },
            { id: 'app', name: '<CounterApp />', type: 'FunctionComponent', props: { count: 1 }, flags: 'NoFlags' },
            { id: 'div', name: '<div.container>', type: 'HostComponent', props: {}, flags: 'NoFlags' },
            { id: 'h1', name: '<h1>', type: 'HostComponent', props: { text: 'Đếm số' }, flags: 'NoFlags' },
            { id: 'btn', name: '<button>', type: 'HostComponent', props: { text: 'Đã bấm 1 lần' }, flags: 'NoFlags' },
          ],
          workInProgressTree: [],
          consoleLogs: [
            { id: 'm1', text: 'Mount: CounterApp (count: 0)', step: 0, tag: 'mount' },
            { id: 'd1', text: 'Diffing: button gắn cờ Update (0 -> 1)', step: 3, tag: 'diff' },
            { id: 'c1', text: 'Commit: DOM mutated ➔ Đã bấm 1 lần', step: 4, tag: 'commit' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 2: HOOKS SINGLY LINKED LIST
  // ==========================================
  {
    id: 'hooks-linked-list',
    title: 'Bản chất ngầm của Hooks: Danh sách liên kết (Linked List)',
    tagline: 'Tại sao không bao giờ được đặt Hook bên trong câu lệnh if / else?',
    difficulty: 'Senior',
    description: 'Giải mã cấu trúc fiber.memoizedState lưu trữ các Hook dưới dạng Singly Linked List: Hook 1 -> Hook 2 -> Hook 3. Điều gì xảy ra nếu thứ tự này bị đảo lộn?',
    code: `function Profile() {
  const [name, setName] = useState('Alice'); // Hook 1
  
  // NGUY HIỂM: Đặt Hook trong câu lệnh if
  if (name !== '') {
    useEffect(() => {                        // Hook 2 (?)
      document.title = name;
    }, [name]);
  }

  const [age, setAge] = useState(25);        // Hook 3
  return <div>{name} - {age}</div>;
}`,
    expectedOutput: [
      'Render 1: Hook 1 (name) -> Hook 2 (effect) -> Hook 3 (age)',
      'Render 2: if false ➔ Hook 2 bị nhảy cóc ➔ Hook mismatch error!',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Lần Render 1: React xây dựng con trỏ Linked List',
        activeCodeLines: [2, 5, 6, 7, 11],
        explanation: 'React không lưu hook theo tên biến. Nó lưu trong một con trỏ danh sách liên kết: `fiber.memoizedState`. Lần 1: Hook 1 (useState name) ➔ trỏ tới Hook 2 (useEffect) ➔ trỏ tới Hook 3 (useState age).',
        interviewInsight: 'React dựa HOÀN TOÀN vào thứ tự gọi (Call Order) tuần tự để biết state nào thuộc về hook nào.',
        state: {
          phase: 'idle',
          currentTree: [],
          workInProgressTree: [],
          hooksList: [
            { id: 'h1', hookName: 'useState("Alice")', value: '"Alice"', type: 'useState', nextId: 'h2', isActive: true },
            { id: 'h2', hookName: 'useEffect(title)', value: 'fn, deps: ["Alice"]', type: 'useEffect', nextId: 'h3', isActive: false },
            { id: 'h3', hookName: 'useState(25)', value: '25', type: 'useState', isActive: false },
          ],
          consoleLogs: [{ id: 'h1', text: 'Linked List: Hook 1 -> Hook 2 -> Hook 3', step: 0, tag: 'hooks' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Khi name = "" ➔ Câu lệnh if bỏ qua Hook 2!',
        activeCodeLines: [5, 11],
        explanation: 'Khi `name` rỗng, câu lệnh `if` không chạy. React gọi dòng tiếp theo: `useState(25)`. React mong đợi duyệt tiếp Hook 2 trong danh sách, nhưng Hook 2 lại là useEffect của lần trước!',
        interviewInsight: 'Lỗi kinh điển: "Rendered fewer hooks than expected. This may be caused by an accidental early return or conditionally calling hooks."',
        state: {
          phase: 'renderPhase',
          currentTree: [],
          workInProgressTree: [],
          hooksList: [
            { id: 'h1', hookName: 'useState("")', value: '""', type: 'useState', nextId: 'h2', isActive: false },
            { id: 'h2', hookName: 'useEffect (BỊ BỎ QUA!)', value: 'Bị nhảy cóc bởi if', type: 'useEffect', nextId: 'h3', isActive: false, hasError: true, errorMessage: 'Hook bị nhảy cóc!' },
            { id: 'h3', hookName: 'useState(25) LỆCH VỊ TRÍ', value: 'Crash: Nhầm lẫn state!', type: 'useState', isActive: true, hasError: true, errorMessage: 'Expected useEffect but got useState' },
          ],
          consoleLogs: [
            { id: 'h1', text: 'Linked List: Hook 1 -> Hook 2 -> Hook 3', step: 0, tag: 'hooks' },
            { id: 'err', text: '❌ Error: Rendered fewer hooks than expected!', step: 1, tag: 'error' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 3: DIFFING & KEY={INDEX} TRAP
  // ==========================================
  {
    id: 'diffing-key-index',
    title: 'Bẫy phỏng vấn: Tại sao không dùng key={index}?',
    tagline: 'Hiểu cặn kẽ thuật toán Diffing O(n) và lỗi lưu nhầm State trong Form',
    difficulty: 'Mid',
    description: 'Khi chèn 1 item vào đầu danh sách, nếu dùng key={index}, React so sánh key 0 cũ với key 0 mới ➔ dữ liệu input chưa lưu bị gán sai người dùng!',
    code: `// DANH SÁCH TODO: Chèn thêm việc vào ĐẦU mảng (unshift)
const [todos, setTodos] = useState([
  { id: 't1', title: 'Học React Fiber' },
  { id: 't2', title: 'Luyện Event Loop' }
]);

const prependTodo = () => {
  setTodos([{ id: 't3', title: 'Học Web Vitals' }, ...todos]);
};

// Trường hợp SAI: key={index}
{todos.map((todo, index) => (
  <TodoRow key={index} todo={todo} /> // ⚠️ BUG STATE INPUT!
))}`,
    expectedOutput: [
      'Mount: Row 0 (Học React Fiber), Row 1 (Luyện Event Loop)',
      'Prepend với key={index}: Key 0 cũ đè Key 0 mới -> State input giữ nguyên sai vị trí!',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Ban đầu: 2 phần tử với key={index}',
        activeCodeLines: [2, 3, 4, 12, 13, 14],
        explanation: 'Người dùng nhập ghi chú "Đã hiểu 80%" vào ô input của hàng 0 (Học React Fiber). Trình duyệt lưu state input vào DOM node tại vị trí key=0.',
        interviewInsight: 'Key là "danh tính" (Identity) duy nhất React dùng để nhận diện một DOM node qua các lần re-render.',
        state: {
          phase: 'idle',
          currentTree: [],
          workInProgressTree: [],
          keyComparison: {
            strategy: 'index',
            before: [
              { key: 0, label: 'Học React Fiber', inputValue: 'Đã hiểu 80%', status: 'matched' },
              { key: 1, label: 'Luyện Event Loop', inputValue: 'Chưa làm bài test', status: 'matched' },
            ],
            after: [],
            note: 'Trạng thái ban đầu: 2 item với key 0 và 1.',
          },
          consoleLogs: [{ id: 'k1', text: 'Rendered: [0: Fiber, 1: EventLoop]', step: 0, tag: 'mount' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Chèn thêm "Học Web Vitals" vào đầu danh sách',
        activeCodeLines: [7, 8, 12, 13],
        explanation: 'Với `key={index}`, item mới chiếm vị trí `key=0`. React so sánh: Cả 2 lần render đều có `key=0` ➔ React TÁI SỬ DỤNG DOM Node cũ và giữ nguyên ô input "Đã hiểu 80%" cho việc mới!',
        interviewInsight: 'React nghĩ rằng item 0 chỉ đổi prop title chứ không phải là item mới hoàn toàn. Hậu quả: Dữ liệu form của người dùng bị dính vào item mới!',
        state: {
          phase: 'renderPhase',
          currentTree: [],
          workInProgressTree: [],
          keyComparison: {
            strategy: 'index',
            before: [
              { key: 0, label: 'Học React Fiber', inputValue: 'Đã hiểu 80%', status: 'matched' },
              { key: 1, label: 'Luyện Event Loop', inputValue: 'Chưa làm bài test', status: 'matched' },
            ],
            after: [
              { key: 0, label: 'Học Web Vitals (MỚI)', inputValue: 'Đã hiểu 80% (BỊ NHẦM!)', status: 'shifted-error' },
              { key: 1, label: 'Học React Fiber', inputValue: 'Chưa làm bài test (BỊ NHẦM!)', status: 'shifted-error' },
              { key: 2, label: 'Luyện Event Loop', inputValue: '(Trống)', status: 'created' },
            ],
            note: '⚠️ BUG: Item mới "Học Web Vitals" thừa hưởng nhầm input "Đã hiểu 80%"!',
          },
          consoleLogs: [
            { id: 'k1', text: 'Rendered: [0: Fiber, 1: EventLoop]', step: 0, tag: 'mount' },
            { id: 'k2', text: '⚠️ Diffing warning: key=0 reused for new item!', step: 1, tag: 'diff' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 4: AUTOMATIC BATCHING (REACT 18)
  // ==========================================
  {
    id: 'automatic-batching',
    title: 'Automatic Batching trong React 18',
    tagline: 'Gom các cập nhật setState trong setTimeout và Promise thành 1 lượt render',
    difficulty: 'Senior',
    description: 'So sánh cơ chế Batching giữa React 17 và 18: Tại sao trước đây setTimeout gây nhiều lần re-render, còn React 18 lại tự động gom nhóm?',
    code: `function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    setTimeout(() => {
      // Trong React 17: Gây 2 lần Re-render riêng biệt!
      // Trong React 18: Tự động gom vào 1 Microtask ➔ Chỉ 1 lần Re-render!
      setCount((c) => c + 1);
      setFlag((f) => !f);
    }, 100);
  };

  console.log("Component Rendered!");
  return <button onClick={handleClick}>Bấm để cập nhật</button>;
}`,
    expectedOutput: [
      'Click button -> setTimeout scheduled',
      'React 18: Gom setCount + setFlag -> Chỉ re-render 1 lần duy nhất!',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Người dùng click button ➔ setTimeout được hẹn giờ',
        activeCodeLines: [5, 6, 7],
        explanation: 'Callback nằm trong `setTimeout` được WebAPIs đưa vào Macrotask Queue. Component đang ở trạng thái ban đầu: `count = 0, flag = false`.',
        interviewInsight: 'Trước React 18, React chỉ batch các cập nhật nằm trực tiếp trong React Synthetic Event handler (như onClick thông thường). Mọi code bên trong Promise hay setTimeout đều re-render ngay lập tức.',
        state: {
          phase: 'idle',
          currentTree: [],
          workInProgressTree: [],
          batchingState: {
            updates: [],
            renderCount: 1,
            isBatched: false,
            note: 'Mount lần đầu. Render count: 1.',
          },
          consoleLogs: [{ id: 'b0', text: 'Component Rendered! (Mount)', step: 0, tag: 'mount' }],
        },
      },
      {
        stepIndex: 1,
        title: 'setTimeout kích hoạt ➔ Gọi liên tiếp setCount và setFlag',
        activeCodeLines: [9, 10],
        explanation: 'Cả `setCount` và `setFlag` đều được đẩy vào hàng đợi `updateQueue` của React 18. React KHÔNG re-render ngay lập tức sau dòng 9!',
        interviewInsight: 'React 18 sử dụng microtask scheduling ngầm để gom toàn bộ các state updates trong cùng một tick trước khi bước vào Render Phase.',
        state: {
          phase: 'renderPhase',
          currentTree: [],
          workInProgressTree: [],
          batchingState: {
            updates: [
              { setter: 'setCount', payload: 'c => c + 1', queuedAt: 'setTimeout tick' },
              { setter: 'setFlag', payload: 'f => !f', queuedAt: 'setTimeout tick' },
            ],
            renderCount: 1,
            isBatched: true,
            note: 'Đang gom 2 lệnh cập nhật vào 1 batch duy nhất.',
          },
          consoleLogs: [
            { id: 'b0', text: 'Component Rendered! (Mount)', step: 0, tag: 'mount' },
            { id: 'b1', text: 'Queued: setCount(1), setFlag(true)', step: 1, tag: 'batch' },
          ],
        },
      },
      {
        stepIndex: 2,
        title: 'Commit Phase: Chỉ Re-render và cập nhật DOM đúng 1 lần!',
        activeCodeLines: [14, 15],
        explanation: 'React 18 xử lý xong cả 2 cập nhật và chỉ kích hoạt Re-render ĐÚNG 1 LẦN. `console.log("Component Rendered!")` chỉ in ra thêm 1 dòng!',
        interviewInsight: 'Nếu cần ép buộc cập nhật ngay lập tức đồng bộ (ví dụ: đo đạc kích thước DOM trước khi animation chạy), ta có thể dùng `flushSync(() => { setCount(...) })`.',
        state: {
          phase: 'commitPhase',
          commitAction: 'Batch flushed: count=1, flag=true in 1 single render pass',
          currentTree: [],
          workInProgressTree: [],
          batchingState: {
            updates: [],
            renderCount: 2,
            isBatched: true,
            note: 'Hoàn tất! Render count chỉ tăng từ 1 lên 2 thay vì 3 như React 17.',
          },
          consoleLogs: [
            { id: 'b0', text: 'Component Rendered! (Mount)', step: 0, tag: 'mount' },
            { id: 'b1', text: 'Queued: setCount(1), setFlag(true)', step: 1, tag: 'batch' },
            { id: 'b2', text: 'Component Rendered! (Total renders: 2)', step: 2, tag: 'commit' },
          ],
        },
      },
    ],
  },
];
