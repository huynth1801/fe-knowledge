import { Scenario } from '../types';

export const reactRerenderScenarios: Scenario[] = [
  {
    id: 'parent-state-blast',
    title: 'Hiệu ứng lan truyền Re-render (Blast Radius)',
    tagline: 'Mặc định: State cha đổi ➔ Toàn bộ cây con Re-render',
    difficulty: 'Mid',
    description:
      'Trong React, khi một component re-render, mặc định TOÀN BỘ các component con của nó cũng sẽ re-render đệ quy theo, bất kể props của chúng có thay đổi hay không!',
    code: `function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Tăng: {count}
      </button>
      {/* Cả 2 con này đều bị re-render! */}
      <ChildExpensiveList />
      <ChildSimpleDisplay title="Footer" />
    </div>
  );
}`,
    expectedOutput: [
      '[Render] Parent (count = 1)',
      '[Render] ChildExpensiveList (Tính toán lại DOM)',
      '[Render] ChildSimpleDisplay (Thừa thãi)',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Trạng thái ban đầu: Cây component ổn định',
        activeCodeLines: [1, 2],
        explanation:
          'Parent khởi tạo state count = 0. Cả Parent, ChildExpensiveList và ChildSimpleDisplay đều được mount lần đầu trên Virtual DOM.',
        interviewInsight:
          'Mount lần đầu tiên (Initial Mount) luôn luôn render 100% tất cả các component trong cây, điều này hoàn toàn bình thường.',
        state: {
          callStack: [{ id: '1', name: 'Parent() [Initial Mount]', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [{ id: 'l0', text: 'Initial Render complete', step: 0, tag: 'Mount' }],
          eventLoopPhase: 'idle',
          activeContainer: 'callStack',
        },
      },
      {
        stepIndex: 1,
        title: 'Người dùng click button: setCount(1)',
        activeCodeLines: [6, 7],
        explanation:
          'Event handler onClick kích hoạt. React lên lịch (schedule) một lần Re-render mới cho component Parent.',
        interviewInsight:
          'Trong React 18+, các cập nhật state bên trong event handlers luôn được Automatic Batching tự động gom lại thành 1 lượt render duy nhất.',
        state: {
          callStack: [{ id: '2', name: 'setCount(1)', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [{ id: 'l1', text: 'Event click -> setCount(1)', step: 1, tag: 'Action' }],
          eventLoopPhase: 'idle',
          activeContainer: 'callStack',
        },
      },
      {
        stepIndex: 2,
        title: 'Parent Re-render: Tạo element mới',
        activeCodeLines: [1, 5],
        explanation:
          'Parent chạy lại thân hàm. Khởi tạo lại JSX: <ChildExpensiveList /> và <ChildSimpleDisplay title="Footer" />. Bản chất JSX là React.createElement() tạo ra object mới trong Heap.',
        interviewInsight:
          'Bởi vì object JSX mới được tạo ra (khác tham chiếu memory), React mặc định coi như prop đã thay đổi nếu không có React.memo bảo vệ.',
        state: {
          callStack: [{ id: '3', name: 'Parent() [Re-render]', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'Event click -> setCount(1)', step: 1, tag: 'Action' },
            { id: 'l2', text: '[Render] Parent (count = 1)', step: 2, tag: 'Parent' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 3,
        title: 'Lan truyền: ChildExpensiveList re-render',
        activeCodeLines: [10],
        explanation:
          'ChildExpensiveList nhận lệnh render từ cha. Toàn bộ logic tính toán danh sách nặng nề bên trong hàm này bị chạy lại từ đầu, gây lãng phí CPU!',
        interviewInsight:
          'Nếu component con này chứa logic filter/sort mảng 5000 phần tử, CPU Main Thread sẽ bị drop FPS (lag giao diện).',
        state: {
          callStack: [{ id: '4', name: 'ChildExpensiveList() [Re-render]', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'Event click -> setCount(1)', step: 1, tag: 'Action' },
            { id: 'l2', text: '[Render] Parent (count = 1)', step: 2, tag: 'Parent' },
            { id: 'l3', text: '[Render] ChildExpensiveList (CPU Heavy)', step: 3, tag: 'Child 1' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 4,
        title: 'Lan truyền tiếp: ChildSimpleDisplay re-render',
        activeCodeLines: [11],
        explanation:
          'Dù prop title="Footer" là chuỗi tĩnh không đổi, ChildSimpleDisplay vẫn bị gọi lại. Đây chính là khái niệm Re-render Blast Radius (bán kính ảnh hưởng).',
        interviewInsight:
          'Cách giải quyết: Bọc React.memo, hoặc đẩy state count xuống component con (State Colocation), hoặc truyền component tĩnh dưới dạng {children}.',
        state: {
          callStack: [{ id: '5', name: 'ChildSimpleDisplay() [Re-render]', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'Event click -> setCount(1)', step: 1, tag: 'Action' },
            { id: 'l2', text: '[Render] Parent (count = 1)', step: 2, tag: 'Parent' },
            { id: 'l3', text: '[Render] ChildExpensiveList (CPU Heavy)', step: 3, tag: 'Child 1' },
            { id: 'l4', text: '[Render] ChildSimpleDisplay (Wasted render)', step: 4, tag: 'Child 2' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
    ],
  },
  {
    id: 'memo-bailout',
    title: 'Giải pháp: React.memo & Bẫy Function Prop',
    tagline: 'Shallow Equal & Tham chiếu hàm vô hình phá hỏng memo',
    difficulty: 'Mid',
    description:
      'Tìm hiểu cách thức React.memo so sánh nông (Shallow Compare) các props cũ và mới. Tại sao chỉ một inline callback `() => doSomething()` sẽ làm vô hiệu hoá 100% React.memo.',
    code: `const ChildExpensive = React.memo(function Child({ onItemClick }) {
  // Logic nặng...
  return <div>List</div>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // ❌ BẪY: Mỗi lần render tạo hàm mới -> Memo hỏng!
  // const handleClick = () => console.log('clicked');

  // ✅ CHUẨN: Giữ nguyên tham chiếu giữa các lần render
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ChildExpensive onItemClick={handleClick} />
    </div>
  );
}`,
    expectedOutput: [
      '[Render] Parent (count++)',
      '[Bailout] ChildExpensive bails out (Props shallow equal = true)',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Bọc component với React.memo',
        activeCodeLines: [1, 2, 3, 4],
        explanation:
          'React.memo tạo một Higher Order Component (HOC). Trước khi re-render Child, React sẽ lấy prevProps so sánh shallow với nextProps.',
        interviewInsight:
          'Shallow compare chỉ dùng so sánh === (Object.is). Với primitive (number, string, boolean), nó so sánh giá trị. Nhưng với object/array/function, nó so sánh ĐỊA CHỈ BỘ NHỚ.',
        state: {
          callStack: [{ id: '1', name: 'App Init', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [],
          eventLoopPhase: 'idle',
          activeContainer: 'callStack',
        },
      },
      {
        stepIndex: 1,
        title: 'Ổn định tham chiếu hàm với useCallback',
        activeCodeLines: [11, 12, 13],
        explanation:
          'useCallback lưu trữ (cache) instance của function trong Fiber node. Dù Parent re-render, biến handleClick vẫn trỏ tới đúng ô nhớ cũ trong Heap.',
        interviewInsight:
          'Chỉ dùng useCallback khi truyền hàm đó xuống một component con ĐÃ ĐƯỢC BỌC React.memo hoặc dùng trong dependency array của useEffect.',
        state: {
          callStack: [{ id: '2', name: 'useCallback cache', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [{ id: 'l1', text: 'useCallback initialized with [] deps', step: 1, tag: 'Cache' }],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 2,
        title: 'Parent Re-render: So sánh prevProps === nextProps',
        activeCodeLines: [17, 18],
        explanation:
          'Parent tăng count. React chạy kiểm tra memo: prevProps.onItemClick === nextProps.onItemClick. Kết quả: TRUE (chung địa chỉ nhớ)!',
        interviewInsight:
          'Khi kết quả so sánh là TRUE, React kích hoạt cơ chế BAILOUT (bỏ qua render), tiết kiệm 100% thời gian xử lý của cây con.',
        state: {
          callStack: [{ id: '3', name: 'React.memo Shallow Comparison', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'useCallback initialized with [] deps', step: 1, tag: 'Cache' },
            { id: 'l2', text: 'Shallow diff: prevProps.onItemClick === nextProps.onItemClick (TRUE)', step: 2, tag: 'Diff' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 3,
        title: 'ChildExpensive BAILOUT thành công!',
        activeCodeLines: [18],
        explanation:
          'ChildExpensive không bị re-render. Cây DOM được tái sử dụng trực tiếp từ lần render trước. Hiệu năng đạt tối đa.',
        interviewInsight:
          'Bẫy phỏng vấn: Nếu truyền inline object như style={{ color: "red" }} hay data={{ id: 1 }}, React.memo sẽ LUÔN THẤT BẠI vì {} !== {} trong JavaScript.',
        state: {
          callStack: [{ id: '4', name: 'Bailout Success', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'useCallback initialized with [] deps', step: 1, tag: 'Cache' },
            { id: 'l2', text: 'Shallow diff: prevProps.onItemClick === nextProps.onItemClick (TRUE)', step: 2, tag: 'Diff' },
            { id: 'l3', text: '✅ [BAILOUT] ChildExpensive skipped re-render!', step: 3, tag: 'Success' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
    ],
  },
];
