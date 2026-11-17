import { Scenario } from '../types';

export const eventLoopScenarios: Scenario[] = [
  {
    id: 'basic-priority',
    title: 'Tam Giác Vàng: Sync, setTimeout và Promise Chain',
    tagline: 'Bài toán kinh điển xuất hiện trong 90% buổi phỏng vấn FE',
    difficulty: 'Junior',
    description: 'Khám phá sự khác biệt căn bản giữa code đồng bộ, Microtask (Promise) và Macrotask (setTimeout).',
    code: `console.log("1: Bắt đầu");

setTimeout(() => {
  console.log("2: setTimeout 0ms");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("3: Promise Microtask 1");
  })
  .then(() => {
    console.log("4: Promise Microtask 2");
  });

console.log("5: Kết thúc script");`,
    expectedOutput: [
      '1: Bắt đầu',
      '5: Kết thúc script',
      '3: Promise Microtask 1',
      '4: Promise Microtask 2',
      '2: setTimeout 0ms',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Khởi tạo môi trường thực thi (Global Script)',
        activeCodeLines: [1],
        explanation: 'Script chính bắt đầu chạy. Call Stack tạo Global Execution Context (main). Lệnh đồng bộ đầu tiên chuẩn bị được thực thi.',
        interviewInsight: 'Mọi mã JavaScript ban đầu đều chạy đồng bộ trong Global Execution Context trước khi bất kỳ tác vụ bất đồng bộ nào được kích hoạt.',
        state: {
          callStack: [{ id: 'global', name: 'global() / main', desc: 'Mã nguồn tổng quát' }],
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
        title: 'Thực thi console.log("1: Bắt đầu")',
        activeCodeLines: [1],
        explanation: 'Hàm console.log được đẩy vào Call Stack và thực thi ngay lập tức. Kết quả xuất hiện tức thì trên Console.',
        interviewInsight: 'Lệnh đồng bộ (synchronous) luôn chạy trước và chặn (block) Call Stack cho tới khi hoàn tất.',
        state: {
          callStack: [
            { id: 'global', name: 'global()', desc: 'Global context' },
            { id: 'log-1', name: 'console.log("1: Bắt đầu")', isExecuting: true },
          ],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [{ id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' }],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 2,
        title: 'Gặp setTimeout(...) - Chuyển giao cho Web APIs',
        activeCodeLines: [3, 4, 5],
        explanation: 'setTimeout được gọi. V8 Engine không tự đếm thời gian, nó chuyển hàm timer này sang Web APIs của trình duyệt với thời gian chờ 0ms.',
        interviewInsight: 'setTimeout() là một Web API (trong browser) hoặc Node API (trong Node.js), không thuộc đặc tả cốt lõi của ECMAScript.',
        state: {
          callStack: [
            { id: 'global', name: 'global()', desc: 'Global context' },
            { id: 'set-timeout', name: 'setTimeout(cb, 0)', isExecuting: true },
          ],
          webApis: [{ id: 'w1', name: 'Timer (0ms)', timer: '0ms', status: 'ticking' }],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [{ id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' }],
          eventLoopPhase: 'idle',
          activeContainer: 'webApis',
        },
      },
      {
        stepIndex: 3,
        title: 'Timer hết hạn -> Đẩy callback vào Macrotask Queue',
        activeCodeLines: [3, 4, 5],
        explanation: 'Timer 0ms hoàn tất ngay lập tức tại Web APIs. Web APIs đẩy callback của nó vào Macrotask Queue (Task Queue). Lưu ý: Callback KHÔNG nhảy thẳng vào Call Stack!',
        interviewInsight: 'Nhiều ứng viên nhầm rằng setTimeout(fn, 0) sẽ chạy sau đúng 0ms. Thực tế nó chỉ có nghĩa là: "đẩy callback vào task queue sau tối thiểu 0ms".',
        state: {
          callStack: [{ id: 'global', name: 'global()', desc: 'Global context' }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [{ id: 'macro-1', name: '() => console.log("2: setTimeout...")', source: 'setTimeout' }],
          consoleLogs: [{ id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' }],
          eventLoopPhase: 'idle',
          activeContainer: 'macrotasks',
        },
      },
      {
        stepIndex: 4,
        title: 'Promise.resolve().then(...) -> Đẩy vào Microtask Queue',
        activeCodeLines: [7, 8, 9],
        explanation: 'Promise.resolve() tạo ra một Promise đã fulfilled. Phương thức .then() đăng ký callback đầu tiên ("3: Promise Microtask 1") và lập tức đưa vào Microtask Queue (Làn đường ưu tiên VIP).',
        interviewInsight: 'Microtask Queue có mức ưu tiên cao hơn Macrotask Queue. Trình duyệt bắt buộc dọn sạch Microtask Queue trước khi lấy bất kỳ Macrotask nào.',
        state: {
          callStack: [
            { id: 'global', name: 'global()', desc: 'Global context' },
            { id: 'promise-then', name: 'Promise.then(...)', isExecuting: true },
          ],
          webApis: [],
          microtaskQueue: [{ id: 'micro-1', name: '() => console.log("3: Promise 1")', source: 'Promise' }],
          macrotaskQueue: [{ id: 'macro-1', name: '() => console.log("2: setTimeout...")', source: 'setTimeout' }],
          consoleLogs: [{ id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' }],
          eventLoopPhase: 'idle',
          activeContainer: 'microtasks',
        },
      },
      {
        stepIndex: 5,
        title: 'Thực thi console.log("5: Kết thúc script")',
        activeCodeLines: [15],
        explanation: 'Mã đồng bộ cuối cùng được đẩy vào Call Stack và chạy. Script chính in ra "5: Kết thúc script".',
        interviewInsight: 'Dù cả Microtask và Macrotask đều đang xếp hàng chờ, chúng không thể ngắt quãng mã đồng bộ đang chạy trên Call Stack.',
        state: {
          callStack: [
            { id: 'global', name: 'global()', desc: 'Global context' },
            { id: 'log-5', name: 'console.log("5: Kết thúc script")', isExecuting: true },
          ],
          webApis: [],
          microtaskQueue: [{ id: 'micro-1', name: '() => console.log("3: Promise 1")', source: 'Promise' }],
          macrotaskQueue: [{ id: 'macro-1', name: '() => console.log("2: setTimeout...")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' },
            { id: 'l5', text: '5: Kết thúc script', step: 5, tag: 'sync' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 6,
        title: 'Call Stack Rỗng -> Event Loop kiểm tra Microtask Queue',
        activeCodeLines: [7, 8, 9],
        explanation: 'Global script kết thúc, Call Stack rỗng (Empty). Lúc này Event Loop "tỉnh giấc". Nó kiểm tra Microtask Queue trước tiên và thấy callback "Promise 1".',
        interviewInsight: 'Nguyên tắc vàng của Event Loop: Chỉ khi Call Stack hoàn toàn rỗng, Event Loop mới bắt đầu chuyển callback từ Queue vào Stack.',
        state: {
          callStack: [],
          webApis: [],
          microtaskQueue: [{ id: 'micro-1', name: '() => console.log("3: Promise 1")', source: 'Promise' }],
          macrotaskQueue: [{ id: 'macro-1', name: '() => console.log("2: setTimeout...")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' },
            { id: 'l5', text: '5: Kết thúc script', step: 5, tag: 'sync' },
          ],
          eventLoopPhase: 'microtaskDrain',
          activeContainer: 'eventLoop',
        },
      },
      {
        stepIndex: 7,
        title: 'Chạy Microtask 1 & Kích hoạt Chain tiếp theo',
        activeCodeLines: [8, 9, 10, 11],
        explanation: 'Callback Promise 1 được chuyển vào Call Stack và chạy: in ra "3: Promise Microtask 1". Khi callback này return, phương thức .then() thứ 2 lập tức đẩy Promise Microtask 2 vào hàng đợi Microtask!',
        interviewInsight: 'Microtask được sinh ra trong lúc dọn Microtask Queue sẽ được xử lý ngay trong cùng một lượt (tick) hiện tại!',
        state: {
          callStack: [{ id: 'cb-promise-1', name: 'cb: Promise 1', isExecuting: true }],
          webApis: [],
          microtaskQueue: [{ id: 'micro-2', name: '() => console.log("4: Promise 2")', source: 'Promise' }],
          macrotaskQueue: [{ id: 'macro-1', name: '() => console.log("2: setTimeout...")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' },
            { id: 'l5', text: '5: Kết thúc script', step: 5, tag: 'sync' },
            { id: 'l3', text: '3: Promise Microtask 1', step: 7, tag: 'microtask' },
          ],
          eventLoopPhase: 'microtaskDrain',
          activeContainer: 'microtasks',
        },
      },
      {
        stepIndex: 8,
        title: 'Dọn sạch Microtask Queue: Chạy Microtask 2',
        activeCodeLines: [11, 12, 13],
        explanation: 'Event Loop vẫn chưa chuyển sang Macrotask vì Microtask Queue vẫn còn tác vụ. Callback Promise 2 được đẩy vào Call Stack và in ra "4: Promise Microtask 2".',
        interviewInsight: 'Microtask Queue phải được "drain" (dọn sạch đến 0 phần tử) thì Event Loop mới được phép chuyển sang kiểm tra Render/Macrotask.',
        state: {
          callStack: [{ id: 'cb-promise-2', name: 'cb: Promise 2', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [{ id: 'macro-1', name: '() => console.log("2: setTimeout...")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' },
            { id: 'l5', text: '5: Kết thúc script', step: 5, tag: 'sync' },
            { id: 'l3', text: '3: Promise Microtask 1', step: 7, tag: 'microtask' },
            { id: 'l4', text: '4: Promise Microtask 2', step: 8, tag: 'microtask' },
          ],
          eventLoopPhase: 'microtaskDrain',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 9,
        title: 'Event Loop lấy 1 tác vụ từ Macrotask Queue',
        activeCodeLines: [3, 4, 5],
        explanation: 'Call Stack rỗng, Microtask Queue rỗng. Event Loop chuyển sang Macrotask Queue, lấy DUY NHẤT 1 tác vụ (callback của setTimeout) đưa vào Call Stack để thực thi.',
        interviewInsight: 'Khác với Microtask (dọn sạch toàn bộ), mỗi chu kỳ (turn) Event Loop chỉ lấy 1 Macrotask duy nhất, sau đó lại quay lại kiểm tra Microtask queue và Render pipeline.',
        state: {
          callStack: [{ id: 'cb-timeout', name: 'cb: setTimeout 0ms', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' },
            { id: 'l5', text: '5: Kết thúc script', step: 5, tag: 'sync' },
            { id: 'l3', text: '3: Promise Microtask 1', step: 7, tag: 'microtask' },
            { id: 'l4', text: '4: Promise Microtask 2', step: 8, tag: 'microtask' },
            { id: 'l2', text: '2: setTimeout 0ms', step: 9, tag: 'macrotask' },
          ],
          eventLoopPhase: 'macrotaskPick',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 10,
        title: 'Hoàn tất kịch bản - Toàn bộ hàng đợi sạch sẽ',
        activeCodeLines: [],
        explanation: 'Call Stack rỗng, mọi hàng đợi đều rỗng. Chương trình kết thúc chu kỳ thực thi hoàn hảo!',
        interviewInsight: 'Kết quả in ra chứng minh quy tắc: Đồng bộ > Microtask (Toàn bộ) > 1 Macrotask > Lặp lại.',
        state: {
          callStack: [],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: '1: Bắt đầu', step: 1, tag: 'sync' },
            { id: 'l5', text: '5: Kết thúc script', step: 5, tag: 'sync' },
            { id: 'l3', text: '3: Promise Microtask 1', step: 7, tag: 'microtask' },
            { id: 'l4', text: '4: Promise Microtask 2', step: 8, tag: 'microtask' },
            { id: 'l2', text: '2: setTimeout 0ms', step: 9, tag: 'macrotask' },
          ],
          eventLoopPhase: 'idle',
        },
      },
    ],
  },
  {
    id: 'nested-micro-in-macro',
    title: 'Microtask lồng trong Macrotask',
    tagline: 'Khi setTimeout lại sinh ra Promise bên trong',
    difficulty: 'Mid',
    description: 'Quan sát cách Event Loop ưu tiên dọn sạch Microtask mới sinh ra ngay giữa hai tác vụ setTimeout liên tiếp.',
    code: `console.log("A: Start");

setTimeout(() => {
  console.log("B: Timeout 1");
  Promise.resolve().then(() => {
    console.log("C: Microtask lồng");
  });
}, 0);

setTimeout(() => {
  console.log("D: Timeout 2");
}, 0);

Promise.resolve().then(() => {
  console.log("E: Microtask ngoài");
});

console.log("F: End");`,
    expectedOutput: [
      'A: Start',
      'F: End',
      'E: Microtask ngoài',
      'B: Timeout 1',
      'C: Microtask lồng',
      'D: Timeout 2',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Bắt đầu: Global Context',
        activeCodeLines: [1],
        explanation: 'Bắt đầu chạy script từ dòng 1.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [],
          eventLoopPhase: 'idle',
        },
      },
      {
        stepIndex: 1,
        title: 'Chạy sync: console.log("A: Start")',
        activeCodeLines: [1],
        explanation: 'In ra "A: Start" ngay lập tức.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }, { id: 'lA', name: 'console.log("A")', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [{ id: 'a', text: 'A: Start', step: 1, tag: 'sync' }],
          eventLoopPhase: 'idle',
        },
      },
      {
        stepIndex: 2,
        title: 'Đăng ký Timeout 1 và Timeout 2 vào Macrotask Queue',
        activeCodeLines: [3, 10],
        explanation: 'Cả 2 lệnh setTimeout(..., 0) chuyển timer sang Web APIs và sau đó lần lượt đẩy 2 callback vào Macrotask Queue.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [
            { id: 'm1', name: 'Timeout 1 callback', source: 'setTimeout' },
            { id: 'm2', name: 'Timeout 2 callback', source: 'setTimeout' },
          ],
          consoleLogs: [{ id: 'a', text: 'A: Start', step: 1, tag: 'sync' }],
          eventLoopPhase: 'idle',
          activeContainer: 'macrotasks',
        },
      },
      {
        stepIndex: 3,
        title: 'Promise ngoài đăng ký Microtask E',
        activeCodeLines: [14, 15, 16],
        explanation: 'Promise.resolve().then(...) đăng ký callback in "E: Microtask ngoài" vào Microtask Queue.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }],
          webApis: [],
          microtaskQueue: [{ id: 'me', name: 'Microtask E', source: 'Promise' }],
          macrotaskQueue: [
            { id: 'm1', name: 'Timeout 1 callback', source: 'setTimeout' },
            { id: 'm2', name: 'Timeout 2 callback', source: 'setTimeout' },
          ],
          consoleLogs: [{ id: 'a', text: 'A: Start', step: 1, tag: 'sync' }],
          eventLoopPhase: 'idle',
          activeContainer: 'microtasks',
        },
      },
      {
        stepIndex: 4,
        title: 'Chạy sync cuối: in "F: End"',
        activeCodeLines: [18],
        explanation: 'Dòng cuối cùng của script chạy đồng bộ và in "F: End". Global context kết thúc.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }, { id: 'lF', name: 'console.log("F")', isExecuting: true }],
          webApis: [],
          microtaskQueue: [{ id: 'me', name: 'Microtask E', source: 'Promise' }],
          macrotaskQueue: [
            { id: 'm1', name: 'Timeout 1 callback', source: 'setTimeout' },
            { id: 'm2', name: 'Timeout 2 callback', source: 'setTimeout' },
          ],
          consoleLogs: [
            { id: 'a', text: 'A: Start', step: 1, tag: 'sync' },
            { id: 'f', text: 'F: End', step: 4, tag: 'sync' },
          ],
          eventLoopPhase: 'idle',
        },
      },
      {
        stepIndex: 5,
        title: 'Event Loop dọn Microtask: Chạy Microtask E',
        activeCodeLines: [15],
        explanation: 'Call Stack rỗng, Event Loop dọn Microtask trước: in ra "E: Microtask ngoài". Giờ Microtask Queue trống.',
        interviewInsight: 'Đến đây chúng ta đã có: A -> F -> E.',
        state: {
          callStack: [{ id: 'cb-e', name: 'Microtask E', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [
            { id: 'm1', name: 'Timeout 1 callback', source: 'setTimeout' },
            { id: 'm2', name: 'Timeout 2 callback', source: 'setTimeout' },
          ],
          consoleLogs: [
            { id: 'a', text: 'A: Start', step: 1, tag: 'sync' },
            { id: 'f', text: 'F: End', step: 4, tag: 'sync' },
            { id: 'e', text: 'E: Microtask ngoài', step: 5, tag: 'microtask' },
          ],
          eventLoopPhase: 'microtaskDrain',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 6,
        title: 'Event Loop lấy Macrotask 1 -> Sinh ra Microtask C lồng!',
        activeCodeLines: [4, 5, 6, 7],
        explanation: 'Event Loop lấy 1 Macrotask: Timeout 1 chạy. Nó in "B: Timeout 1", đồng thời dòng 5 lại gọi Promise.resolve().then(...) tạo ra một Microtask mới C!',
        interviewInsight: 'Điểm mấu chốt: Microtask C vừa sinh ra được đẩy ngay vào Microtask Queue!',
        state: {
          callStack: [{ id: 'cb-m1', name: 'Timeout 1 cb', isExecuting: true }],
          webApis: [],
          microtaskQueue: [{ id: 'mc', name: 'Microtask C (lồng)', source: 'Promise' }],
          macrotaskQueue: [{ id: 'm2', name: 'Timeout 2 callback', source: 'setTimeout' }],
          consoleLogs: [
            { id: 'a', text: 'A: Start', step: 1, tag: 'sync' },
            { id: 'f', text: 'F: End', step: 4, tag: 'sync' },
            { id: 'e', text: 'E: Microtask ngoài', step: 5, tag: 'microtask' },
            { id: 'b', text: 'B: Timeout 1', step: 6, tag: 'macrotask' },
          ],
          eventLoopPhase: 'macrotaskPick',
          activeContainer: 'microtasks',
        },
      },
      {
        stepIndex: 7,
        title: 'Event Loop KHÔNG chạy Timeout 2 ngay, mà dọn Microtask C trước!',
        activeCodeLines: [6],
        explanation: 'Sau khi Timeout 1 xong, Event Loop kiểm tra lại và phát hiện Microtask Queue có Microtask C. Theo quy tắc, nó dọn Microtask C trước khi được phép chạm vào Timeout 2!',
        interviewInsight: 'Đây là câu hỏi phân loại rất mạnh! Người mới hay nghĩ Timeout 2 chạy ngay sau Timeout 1 vì cùng ở trong Task queue. Nhưng Microtask luôn có quyền ưu tiên chen ngang giữa các Macrotask.',
        state: {
          callStack: [{ id: 'cb-mc', name: 'Microtask C', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [{ id: 'm2', name: 'Timeout 2 callback', source: 'setTimeout' }],
          consoleLogs: [
            { id: 'a', text: 'A: Start', step: 1, tag: 'sync' },
            { id: 'f', text: 'F: End', step: 4, tag: 'sync' },
            { id: 'e', text: 'E: Microtask ngoài', step: 5, tag: 'microtask' },
            { id: 'b', text: 'B: Timeout 1', step: 6, tag: 'macrotask' },
            { id: 'c', text: 'C: Microtask lồng', step: 7, tag: 'microtask' },
          ],
          eventLoopPhase: 'microtaskDrain',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 8,
        title: 'Cuối cùng: Chạy Macrotask 2 (Timeout 2)',
        activeCodeLines: [11],
        explanation: 'Microtask Queue đã dọn sạch hoàn toàn, Event Loop lấy Macrotask tiếp theo (Timeout 2) vào Call Stack và in ra "D: Timeout 2".',
        interviewInsight: 'Thứ tự chung cuộc: A -> F -> E -> B -> C -> D.',
        state: {
          callStack: [{ id: 'cb-m2', name: 'Timeout 2 cb', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'a', text: 'A: Start', step: 1, tag: 'sync' },
            { id: 'f', text: 'F: End', step: 4, tag: 'sync' },
            { id: 'e', text: 'E: Microtask ngoài', step: 5, tag: 'microtask' },
            { id: 'b', text: 'B: Timeout 1', step: 6, tag: 'macrotask' },
            { id: 'c', text: 'C: Microtask lồng', step: 7, tag: 'microtask' },
            { id: 'd', text: 'D: Timeout 2', step: 8, tag: 'macrotask' },
          ],
          eventLoopPhase: 'macrotaskPick',
          activeContainer: 'console',
        },
      },
    ],
  },
  {
    id: 'async-await-under-the-hood',
    title: 'Bản chất của async / await trong Event Loop',
    tagline: 'Hiểu cặn kẽ cách await biến đổi mã phía sau thành Microtask',
    difficulty: 'Senior',
    description: 'Thao tác await thực chất tương đương với Promise.resolve(x).then(() => ...). Mọi dòng mã nằm dưới await đều bị trì hoãn thành microtask callback.',
    code: `async function async1() {
  console.log("1: async1 start");
  await async2();
  console.log("2: async1 end (sau await)");
}

async function async2() {
  console.log("3: async2 run sync");
}

console.log("4: Script start");
setTimeout(() => console.log("5: Timeout"), 0);
async1();
new Promise((resolve) => {
  console.log("6: Promise executor");
  resolve();
}).then(() => {
  console.log("7: Promise.then");
});
console.log("8: Script end");`,
    expectedOutput: [
      '4: Script start',
      '1: async1 start',
      '3: async2 run sync',
      '6: Promise executor',
      '8: Script end',
      '2: async1 end (sau await)',
      '7: Promise.then',
      '5: Timeout',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Script khởi động - Chạy dòng đồng bộ 4',
        activeCodeLines: [10],
        explanation: 'Gặp console.log("4: Script start") đồng bộ. In ra kết quả số 4.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [{ id: 's4', text: '4: Script start', step: 0, tag: 'sync' }],
          eventLoopPhase: 'idle',
        },
      },
      {
        stepIndex: 1,
        title: 'Gặp setTimeout -> Đẩy vào Macrotask Queue',
        activeCodeLines: [11],
        explanation: 'setTimeout được bàn giao qua Web APIs và callback in "5: Timeout" chuyển vào Macrotask Queue.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [{ id: 'm5', name: '() => log("5: Timeout")', source: 'setTimeout' }],
          consoleLogs: [{ id: 's4', text: '4: Script start', step: 0, tag: 'sync' }],
          eventLoopPhase: 'idle',
        },
      },
      {
        stepIndex: 2,
        title: 'Gọi async1() -> Chạy đồng bộ phần đầu',
        activeCodeLines: [1, 2, 12],
        explanation: 'Hàm async khi mới gọi vẫn chạy ĐỒNG BỘ cho tới khi gặp từ khoá `await`. Dòng 2 in "1: async1 start".',
        interviewInsight: 'Lỗi phổ biến: Nhiều người tưởng gọi async function là cả hàm sẽ chạy bất đồng bộ ngay. Thực tế nó chạy đồng bộ cho tới điểm await đầu tiên.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }, { id: 'a1', name: 'async1()', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [{ id: 'm5', name: '() => log("5: Timeout")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 's4', text: '4: Script start', step: 0, tag: 'sync' },
            { id: 's1', text: '1: async1 start', step: 2, tag: 'sync' },
          ],
          eventLoopPhase: 'idle',
        },
      },
      {
        stepIndex: 3,
        title: 'Gặp await async2() -> Chạy async2 đồng bộ',
        activeCodeLines: [3, 7, 8],
        explanation: 'Lệnh await async2() gọi hàm async2. Thân hàm async2 chạy đồng bộ và in "3: async2 run sync".',
        state: {
          callStack: [
            { id: 'main', name: 'main()' },
            { id: 'a1', name: 'async1()' },
            { id: 'a2', name: 'async2()', isExecuting: true },
          ],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [{ id: 'm5', name: '() => log("5: Timeout")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 's4', text: '4: Script start', step: 0, tag: 'sync' },
            { id: 's1', text: '1: async1 start', step: 2, tag: 'sync' },
            { id: 's3', text: '3: async2 run sync', step: 3, tag: 'sync' },
          ],
          eventLoopPhase: 'idle',
        },
      },
      {
        stepIndex: 4,
        title: 'Điểm mấu chốt của await: Tạm dừng async1 & Đăng ký Microtask',
        activeCodeLines: [3, 4],
        explanation: 'async2 trả về Promise (đã resolve). Từ khoá await TẠM DỪNG thực thi async1, gói phần mã còn lại của async1 (dòng 4) vào một Microtask và đẩy vào Microtask Queue. Quyền điều khiển trả về cho main script!',
        interviewInsight: 'Bản chất của "await fn()" chính là "Promise.resolve(fn()).then(() => { resume async1 })".',
        state: {
          callStack: [{ id: 'main', name: 'main()' }],
          webApis: [],
          microtaskQueue: [{ id: 'resume-a1', name: 'Resume async1 (dòng 4)', source: 'async/await' }],
          macrotaskQueue: [{ id: 'm5', name: '() => log("5: Timeout")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 's4', text: '4: Script start', step: 0, tag: 'sync' },
            { id: 's1', text: '1: async1 start', step: 2, tag: 'sync' },
            { id: 's3', text: '3: async2 run sync', step: 3, tag: 'sync' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'microtasks',
        },
      },
      {
        stepIndex: 5,
        title: 'new Promise executor chạy ĐỒNG BỘ',
        activeCodeLines: [13, 14, 15],
        explanation: 'Hàm executor truyền vào constructor `new Promise(...)` chạy đồng bộ ngay lập tức! Dòng 14 in "6: Promise executor". resolve() được gọi, callback .then() ở dòng 16 được đẩy vào Microtask Queue SAU Microtask của async1.',
        interviewInsight: 'Ghi nhớ: "new Promise(executor)" chạy đồng bộ, chỉ có các callback trong ".then/.catch/.finally" mới là Microtask.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }, { id: 'prom-exec', name: 'Promise executor', isExecuting: true }],
          webApis: [],
          microtaskQueue: [
            { id: 'resume-a1', name: 'Resume async1 (dòng 4)', source: 'async/await' },
            { id: 'prom-then', name: 'Promise.then callback', source: 'Promise' },
          ],
          macrotaskQueue: [{ id: 'm5', name: '() => log("5: Timeout")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 's4', text: '4: Script start', step: 0, tag: 'sync' },
            { id: 's1', text: '1: async1 start', step: 2, tag: 'sync' },
            { id: 's3', text: '3: async2 run sync', step: 3, tag: 'sync' },
            { id: 's6', text: '6: Promise executor', step: 5, tag: 'sync' },
          ],
          eventLoopPhase: 'idle',
        },
      },
      {
        stepIndex: 6,
        title: 'Chạy đồng bộ cuối cùng: in "8: Script end"',
        activeCodeLines: [18],
        explanation: 'Script chính hoàn thành với dòng in "8: Script end". Call stack rỗng. Giờ là lúc Event Loop vào việc.',
        state: {
          callStack: [{ id: 'main', name: 'main()' }],
          webApis: [],
          microtaskQueue: [
            { id: 'resume-a1', name: 'Resume async1 (dòng 4)', source: 'async/await' },
            { id: 'prom-then', name: 'Promise.then callback', source: 'Promise' },
          ],
          macrotaskQueue: [{ id: 'm5', name: '() => log("5: Timeout")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 's4', text: '4: Script start', step: 0, tag: 'sync' },
            { id: 's1', text: '1: async1 start', step: 2, tag: 'sync' },
            { id: 's3', text: '3: async2 run sync', step: 3, tag: 'sync' },
            { id: 's6', text: '6: Promise executor', step: 5, tag: 'sync' },
            { id: 's8', text: '8: Script end', step: 6, tag: 'sync' },
          ],
          eventLoopPhase: 'idle',
        },
      },
      {
        stepIndex: 7,
        title: 'Dọn Microtask 1: Tiếp tục hàm async1 (in dòng 2)',
        activeCodeLines: [4],
        explanation: 'Microtask Queue có 2 phần tử: [Resume async1, Promise.then]. Tác vụ đầu tiên được lấy ra: tiếp tục hàm async1 sau await, in ra "2: async1 end (sau await)".',
        state: {
          callStack: [{ id: 'resume-a1', name: 'async1() [resumed]', isExecuting: true }],
          webApis: [],
          microtaskQueue: [{ id: 'prom-then', name: 'Promise.then callback', source: 'Promise' }],
          macrotaskQueue: [{ id: 'm5', name: '() => log("5: Timeout")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 's4', text: '4: Script start', step: 0, tag: 'sync' },
            { id: 's1', text: '1: async1 start', step: 2, tag: 'sync' },
            { id: 's3', text: '3: async2 run sync', step: 3, tag: 'sync' },
            { id: 's6', text: '6: Promise executor', step: 5, tag: 'sync' },
            { id: 's8', text: '8: Script end', step: 6, tag: 'sync' },
            { id: 's2', text: '2: async1 end (sau await)', step: 7, tag: 'microtask' },
          ],
          eventLoopPhase: 'microtaskDrain',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 8,
        title: 'Dọn Microtask 2: Chạy Promise.then callback',
        activeCodeLines: [16, 17],
        explanation: 'Microtask Queue còn lại callback của Promise.then. Nó được lấy vào Call Stack và in "7: Promise.then". Toàn bộ Microtask queue giờ đã rỗng!',
        state: {
          callStack: [{ id: 'prom-then', name: 'cb: Promise.then', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [{ id: 'm5', name: '() => log("5: Timeout")', source: 'setTimeout' }],
          consoleLogs: [
            { id: 's4', text: '4: Script start', step: 0, tag: 'sync' },
            { id: 's1', text: '1: async1 start', step: 2, tag: 'sync' },
            { id: 's3', text: '3: async2 run sync', step: 3, tag: 'sync' },
            { id: 's6', text: '6: Promise executor', step: 5, tag: 'sync' },
            { id: 's8', text: '8: Script end', step: 6, tag: 'sync' },
            { id: 's2', text: '2: async1 end (sau await)', step: 7, tag: 'microtask' },
            { id: 's7', text: '7: Promise.then', step: 8, tag: 'microtask' },
          ],
          eventLoopPhase: 'microtaskDrain',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 9,
        title: 'Chạy Macrotask: setTimeout in "5: Timeout"',
        activeCodeLines: [11],
        explanation: 'Microtask sạch bóng. Event Loop sang Macrotask Queue, lấy callback setTimeout và in "5: Timeout". Hoàn tất!',
        interviewInsight: 'Thứ tự cuối cùng chuẩn xác: 4 -> 1 -> 3 -> 6 -> 8 -> 2 -> 7 -> 5.',
        state: {
          callStack: [{ id: 'm5', name: 'cb: setTimeout 0', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 's4', text: '4: Script start', step: 0, tag: 'sync' },
            { id: 's1', text: '1: async1 start', step: 2, tag: 'sync' },
            { id: 's3', text: '3: async2 run sync', step: 3, tag: 'sync' },
            { id: 's6', text: '6: Promise executor', step: 5, tag: 'sync' },
            { id: 's8', text: '8: Script end', step: 6, tag: 'sync' },
            { id: 's2', text: '2: async1 end (sau await)', step: 7, tag: 'microtask' },
            { id: 's7', text: '7: Promise.then', step: 8, tag: 'microtask' },
            { id: 's5', text: '5: Timeout', step: 9, tag: 'macrotask' },
          ],
          eventLoopPhase: 'macrotaskPick',
          activeContainer: 'console',
        },
      },
    ],
  },
];
