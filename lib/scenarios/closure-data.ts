export interface ScopeVariable {
  key: string;
  value: string;
  type: 'primitive' | 'function' | 'object';
  isHighlighted?: boolean;
}

export interface LexicalScopeItem {
  id: string;
  name: string;
  type: 'local' | 'closure' | 'global' | 'block';
  variables: ScopeVariable[];
  isReferenced: boolean;
  desc?: string;
}

export interface ClosureSimulationState {
  callStack: { id: string; name: string; isExecuting?: boolean }[];
  lexicalScopes: LexicalScopeItem[];
  activeLookup?: {
    variable: string;
    foundInScopeId?: string;
    status: 'searching' | 'found' | 'not-found';
  };
  consoleLogs: { id: string; text: string; step: number; tag?: string }[];
}

export interface ClosureSimulationStep {
  stepIndex: number;
  title: string;
  activeCodeLines: number[];
  explanation: string;
  interviewInsight?: string;
  state: ClosureSimulationState;
}

export interface ClosureScenario {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  description: string;
  code: string;
  expectedOutput: string[];
  steps: ClosureSimulationStep[];
}

export const closureScenarios: ClosureScenario[] = [
  {
    id: 'counter-factory',
    title: 'Counter Factory: Cơ chế "Balo" (Backpack) của Closure',
    tagline: 'Cách hàm con ghi nhớ và giữ sống biến của hàm cha',
    difficulty: 'Junior',
    description: 'Quan sát hàm cha createCounter() chạy xong và rút khỏi Call Stack, nhưng biến `count` vẫn được giữ sống trong bộ nhớ Heap nhờ Closure.',
    code: `function createCounter() {
  let count = 0;
  return function increment() {
    count++;
    console.log("Count:", count);
  };
}

const counter = createCounter();
counter(); // Lần 1: in ra 1
counter(); // Lần 2: in ra 2`,
    expectedOutput: ['Count: 1', 'Count: 2'],
    steps: [
      {
        stepIndex: 0,
        title: 'Khởi tạo Global Execution Context',
        activeCodeLines: [1, 9],
        explanation: 'Chương trình bắt đầu. Global Context khởi tạo và nạp định nghĩa hàm `createCounter` vào bộ nhớ.',
        interviewInsight: 'Ở giai đoạn Creation Phase của Global Context, hàm createCounter được hoisted.',
        state: {
          callStack: [{ id: 'global', name: 'Global Context', isExecuting: true }],
          lexicalScopes: [
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [
                { key: 'createCounter', value: 'ƒ ()', type: 'function' },
                { key: 'counter', value: 'undefined', type: 'primitive' },
              ],
            },
          ],
          consoleLogs: [],
        },
      },
      {
        stepIndex: 1,
        title: 'Gọi createCounter() -> Tạo Local Scope của hàm cha',
        activeCodeLines: [1, 2, 9],
        explanation: 'Hàm `createCounter()` được đẩy vào Call Stack. Một Local Execution Context mới được tạo với biến `count = 0`.',
        interviewInsight: 'Mỗi lần hàm được gọi, một Lexical Environment riêng biệt được sinh ra trên bộ nhớ.',
        state: {
          callStack: [
            { id: 'global', name: 'Global Context' },
            { id: 'createCounter', name: 'createCounter()', isExecuting: true },
          ],
          lexicalScopes: [
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [
                { key: 'createCounter', value: 'ƒ ()', type: 'function' },
                { key: 'counter', value: 'undefined', type: 'primitive' },
              ],
            },
            {
              id: 'createCounter-scope',
              name: 'createCounter [Local Scope]',
              type: 'local',
              isReferenced: true,
              variables: [{ key: 'count', value: '0', type: 'primitive', isHighlighted: true }],
            },
          ],
          consoleLogs: [],
        },
      },
      {
        stepIndex: 2,
        title: 'createCounter return hàm increment() -> Sinh ra Closure!',
        activeCodeLines: [3, 4, 5, 9],
        explanation: 'Hàm trả về hàm con `increment`. Hàm con này bí mật mang theo một liên kết [[Scopes]] trỏ vào môi trường của cha chứa biến `count`.',
        interviewInsight: 'Closure được hình thành ngay tại thời điểm hàm con được ĐỊNH NGHĨA bên trong hàm cha, không phải lúc nó được gọi.',
        state: {
          callStack: [
            { id: 'global', name: 'Global Context' },
            { id: 'createCounter', name: 'createCounter() [returning]', isExecuting: true },
          ],
          lexicalScopes: [
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [
                { key: 'createCounter', value: 'ƒ ()', type: 'function' },
                { key: 'counter', value: 'ƒ increment()', type: 'function' },
              ],
            },
            {
              id: 'createCounter-scope',
              name: 'Closure (createCounter)',
              type: 'closure',
              isReferenced: true,
              desc: 'Được giữ sống bởi counter() trong Heap Memory!',
              variables: [{ key: 'count', value: '0', type: 'primitive' }],
            },
          ],
          consoleLogs: [],
        },
      },
      {
        stepIndex: 3,
        title: 'createCounter() kết thúc & RÚT KHỎI Call Stack',
        activeCodeLines: [9],
        explanation: 'createCounter() đã chạy xong và bay màu khỏi Call Stack! TUY NHIÊN, bộ thu dọn rác (Garbage Collector) KHÔNG THỂ xóa biến `count` vì hàm con `counter` vẫn đang giữ tham chiếu tới nó!',
        interviewInsight: 'Đây là câu hỏi phân loại cốt lõi: Tại sao biến trong hàm cha không bị GC giải phóng? Vì vẫn còn một tham chiếu hoạt động (reachable reference) từ hàm con.',
        state: {
          callStack: [{ id: 'global', name: 'Global Context', isExecuting: true }],
          lexicalScopes: [
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [
                { key: 'createCounter', value: 'ƒ ()', type: 'function' },
                { key: 'counter', value: 'ƒ increment()', type: 'function' },
              ],
            },
            {
              id: 'createCounter-scope',
              name: 'Closure (createCounter)',
              type: 'closure',
              isReferenced: true,
              desc: 'Tồn tại bền vững trong Heap Memory',
              variables: [{ key: 'count', value: '0', type: 'primitive' }],
            },
          ],
          consoleLogs: [],
        },
      },
      {
        stepIndex: 4,
        title: 'Gọi counter() lần 1 -> Tìm kiếm biến theo Scope Chain',
        activeCodeLines: [3, 4, 10],
        explanation: 'Gọi `counter()`. Hàm `increment` được đẩy vào Call Stack. Nó gặp lệnh `count++`. Trong Local của increment không có `count` ➔ Nó tìm ngược lên Scope Chain và thấy `count = 0` trong Closure của createCounter!',
        interviewInsight: 'Cơ chế tìm kiếm biến theo Scope Chain: Local ➔ Outer Closure ➔ Global ➔ ReferenceError nếu không tìm thấy.',
        state: {
          callStack: [
            { id: 'global', name: 'Global Context' },
            { id: 'counter-1', name: 'counter() [increment]', isExecuting: true },
          ],
          lexicalScopes: [
            {
              id: 'counter-local',
              name: 'increment [Local Scope]',
              type: 'local',
              isReferenced: true,
              variables: [],
            },
            {
              id: 'createCounter-scope',
              name: 'Closure (createCounter)',
              type: 'closure',
              isReferenced: true,
              variables: [{ key: 'count', value: '1 (tăng từ 0)', type: 'primitive', isHighlighted: true }],
            },
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [{ key: 'counter', value: 'ƒ increment()', type: 'function' }],
            },
          ],
          activeLookup: {
            variable: 'count',
            foundInScopeId: 'createCounter-scope',
            status: 'found',
          },
          consoleLogs: [{ id: 'c1', text: 'Count: 1', step: 4, tag: 'closure' }],
        },
      },
      {
        stepIndex: 5,
        title: 'counter() lần 1 xong ➔ Call Stack rỗng, count giữ nguyên là 1',
        activeCodeLines: [10],
        explanation: 'Hàm increment hoàn thành và rút khỏi Stack. Biến `count` trong Closure lúc này đang lưu giữ giá trị mới là `1`.',
        state: {
          callStack: [{ id: 'global', name: 'Global Context', isExecuting: true }],
          lexicalScopes: [
            {
              id: 'createCounter-scope',
              name: 'Closure (createCounter)',
              type: 'closure',
              isReferenced: true,
              variables: [{ key: 'count', value: '1', type: 'primitive' }],
            },
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [{ key: 'counter', value: 'ƒ increment()', type: 'function' }],
            },
          ],
          consoleLogs: [{ id: 'c1', text: 'Count: 1', step: 4, tag: 'closure' }],
        },
      },
      {
        stepIndex: 6,
        title: 'Gọi counter() lần 2 ➔ count tăng tiếp lên 2',
        activeCodeLines: [3, 4, 11],
        explanation: 'Gọi `counter()` lần 2. Lại tìm thấy biến `count` trong Closure (hiện là 1) và tăng lên thành 2. In ra "Count: 2".',
        interviewInsight: 'Điều này chứng minh Closure cung cấp khả năng đóng gói trạng thái riêng tư (Private State Encapsulation) mà không thể bị sửa từ bên ngoài.',
        state: {
          callStack: [
            { id: 'global', name: 'Global Context' },
            { id: 'counter-2', name: 'counter() [increment]', isExecuting: true },
          ],
          lexicalScopes: [
            {
              id: 'counter-local-2',
              name: 'increment [Local Scope]',
              type: 'local',
              isReferenced: true,
              variables: [],
            },
            {
              id: 'createCounter-scope',
              name: 'Closure (createCounter)',
              type: 'closure',
              isReferenced: true,
              variables: [{ key: 'count', value: '2 (tăng từ 1)', type: 'primitive', isHighlighted: true }],
            },
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [{ key: 'counter', value: 'ƒ increment()', type: 'function' }],
            },
          ],
          activeLookup: {
            variable: 'count',
            foundInScopeId: 'createCounter-scope',
            status: 'found',
          },
          consoleLogs: [
            { id: 'c1', text: 'Count: 1', step: 4, tag: 'closure' },
            { id: 'c2', text: 'Count: 2', step: 6, tag: 'closure' },
          ],
        },
      },
    ],
  },
  {
    id: 'var-vs-let-loop',
    title: 'Bẫy phỏng vấn số 1: `var` vs `let` trong vòng lặp',
    tagline: 'Tại sao var in ra 3 lần số 3, còn let in ra 0, 1, 2?',
    difficulty: 'Mid',
    description: 'Khám phá sự khác biệt cốt tử giữa Function Scope (1 biến dùng chung) và Block Scope (mỗi vòng lặp tạo 1 closure riêng).',
    code: `// Trường hợp var:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var i:", i), 0);
}

// Trường hợp let:
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let j:", j), 0);
}`,
    expectedOutput: [
      'var i: 3',
      'var i: 3',
      'var i: 3',
      'let j: 0',
      'let j: 1',
      'let j: 2',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Chạy vòng lặp var: Biến i được gắn vào Function / Global Scope',
        activeCodeLines: [2],
        explanation: 'Từ khóa `var` KHÔNG có Block Scope. Toàn bộ vòng lặp dùng CHUNG DUY NHẤT một biến `i` trong Global Scope.',
        interviewInsight: 'var được hoisted lên đầu hàm hoặc Global, không bị giới hạn trong dấu ngoặc nhọn {}.',
        state: {
          callStack: [{ id: 'global', name: 'Global Context', isExecuting: true }],
          lexicalScopes: [
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [{ key: 'i', value: '0', type: 'primitive', isHighlighted: true }],
            },
          ],
          consoleLogs: [],
        },
      },
      {
        stepIndex: 1,
        title: '3 callback setTimeout đều đóng (closure) trỏ vào CÙNG 1 biến i',
        activeCodeLines: [3],
        explanation: 'Vòng lặp chạy từ 0 -> 1 -> 2 và kết thúc khi `i = 3`. Cả 3 callback setTimeout đều tham chiếu tới cùng 1 ô nhớ của biến `i`.',
        state: {
          callStack: [{ id: 'global', name: 'Global Context', isExecuting: true }],
          lexicalScopes: [
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [{ key: 'i', value: '3 (kết thúc vòng lặp)', type: 'primitive', isHighlighted: true }],
            },
          ],
          consoleLogs: [],
        },
      },
      {
        stepIndex: 2,
        title: 'Khi setTimeout chạy: Đọc biến i hiện tại là 3 ➔ In ra 3, 3, 3!',
        activeCodeLines: [3],
        explanation: 'Khi Event Loop lấy callback setTimeout ra chạy, nó tìm `i`. Lúc này `i` đã bằng 3 từ lâu! Do đó in ra 3 lần: "var i: 3".',
        interviewInsight: 'Đây là câu hỏi xuất hiện trong 95% buổi phỏng vấn JavaScript.',
        state: {
          callStack: [{ id: 'cb-var', name: 'cb: setTimeout', isExecuting: true }],
          lexicalScopes: [
            {
              id: 'global-scope',
              name: 'Global Scope',
              type: 'global',
              isReferenced: true,
              variables: [{ key: 'i', value: '3', type: 'primitive' }],
            },
          ],
          consoleLogs: [
            { id: 'v1', text: 'var i: 3', step: 2, tag: 'var' },
            { id: 'v2', text: 'var i: 3', step: 2, tag: 'var' },
            { id: 'v3', text: 'var i: 3', step: 2, tag: 'var' },
          ],
        },
      },
      {
        stepIndex: 3,
        title: 'Với `let`: Mỗi vòng lặp tự động sinh ra một Block Scope mới!',
        activeCodeLines: [7, 8],
        explanation: 'Với `let`, ECMAScript quy định mỗi lần lặp tạo ra một Block Scope độc lập hoàn toàn. Callback của lần lặp 0 giữ `j = 0`, lần lặp 1 giữ `j = 1`, lần 2 giữ `j = 2`.',
        interviewInsight: 'Bản chất `let` trong vòng lặp giống như trình duyệt tự động bọc một IIFE (Immediately Invoked Function Expression) xung quanh mỗi vòng lặp!',
        state: {
          callStack: [{ id: 'global', name: 'Global Context', isExecuting: true }],
          lexicalScopes: [
            {
              id: 'block-0',
              name: 'Block Scope (Lần lặp 0)',
              type: 'block',
              isReferenced: true,
              variables: [{ key: 'j', value: '0', type: 'primitive' }],
            },
            {
              id: 'block-1',
              name: 'Block Scope (Lần lặp 1)',
              type: 'block',
              isReferenced: true,
              variables: [{ key: 'j', value: '1', type: 'primitive' }],
            },
            {
              id: 'block-2',
              name: 'Block Scope (Lần lặp 2)',
              type: 'block',
              isReferenced: true,
              variables: [{ key: 'j', value: '2', type: 'primitive' }],
            },
          ],
          consoleLogs: [
            { id: 'v1', text: 'var i: 3', step: 2, tag: 'var' },
            { id: 'v2', text: 'var i: 3', step: 2, tag: 'var' },
            { id: 'v3', text: 'var i: 3', step: 2, tag: 'var' },
          ],
        },
      },
      {
        stepIndex: 4,
        title: 'Khi setTimeout của let chạy: In ra chuẩn 0, 1, 2!',
        activeCodeLines: [8],
        explanation: 'Mỗi callback tìm ngược lên Scope Chain của riêng nó và lấy được giá trị `j` tương ứng tại thời điểm lặp: 0, 1, 2.',
        state: {
          callStack: [{ id: 'cb-let', name: 'cb: setTimeout (let)', isExecuting: true }],
          lexicalScopes: [
            {
              id: 'block-0',
              name: 'Block Scope (Lần lặp 0)',
              type: 'block',
              isReferenced: true,
              variables: [{ key: 'j', value: '0', type: 'primitive' }],
            },
          ],
          consoleLogs: [
            { id: 'v1', text: 'var i: 3', step: 2, tag: 'var' },
            { id: 'v2', text: 'var i: 3', step: 2, tag: 'var' },
            { id: 'v3', text: 'var i: 3', step: 2, tag: 'var' },
            { id: 'j0', text: 'let j: 0', step: 4, tag: 'let' },
            { id: 'j1', text: 'let j: 1', step: 4, tag: 'let' },
            { id: 'j2', text: 'let j: 2', step: 4, tag: 'let' },
          ],
        },
      },
    ],
  },
];
