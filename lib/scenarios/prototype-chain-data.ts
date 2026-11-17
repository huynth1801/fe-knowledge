import { Scenario } from '../types';

export const prototypeScenarios: Scenario[] = [
  {
    id: 'proto-delegation',
    title: 'Tra cứu thuộc tính trên Prototype Chain',
    tagline: '__proto__ Pointer Climbing & Method Resolution',
    difficulty: 'Mid',
    description:
      'Khám phá cơ chế uỷ quyền (Delegation): Khi truy cập thuộc tính trên một Object, JavaScript engine tự động leo lên các mắt xích [[Prototype]] cho đến khi tìm thấy hoặc chạm tới null.',
    code: `const animal = {
  isAlive: true,
  eat() { return 'eating...'; }
};

const dog = Object.create(animal);
dog.breed = 'Golden';

// 1. Tìm thuộc tính của chính nó (Own property)
console.log(dog.breed); // 'Golden'

// 2. Tra cứu leo lên animal
console.log(dog.eat()); // 'eating...'

// 3. Tra cứu leo lên Object.prototype
console.log(dog.toString()); // '[object Object]'

// 4. Thuộc tính không tồn tại -> null
console.log(dog.fly); // undefined`,
    expectedOutput: [
      "'Golden'",
      "'eating...'",
      "'[object Object]'",
      'undefined'
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Khởi tạo đối tượng cha: animal',
        activeCodeLines: [1, 2, 3, 4],
        explanation:
          'animal được tạo ra trong bộ nhớ Heap. Nó có 2 thuộc tính riêng (own properties): isAlive và hàm eat(). Bản thân animal.[[Prototype]] trỏ tới Object.prototype.',
        interviewInsight:
          'Trong JS, không có class thực sự ở tầng engine. Class trong ES6 chỉ là cú pháp "đường bột" (syntactic sugar) bọc ngoài Prototype Chain.',
        state: {
          callStack: [{ id: '1', name: 'global()', isExecuting: true }],
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
        title: 'Tạo dog uỷ quyền từ animal bằng Object.create()',
        activeCodeLines: [6, 7],
        explanation:
          'Object.create(animal) tạo ra một object rỗng hoàn toàn mới, đồng thời thiết lập con trỏ nội bộ dog.[[Prototype]] (truy cập qua dog.__proto__) trỏ thẳng tới animal.',
        interviewInsight:
          'Sử dụng Object.create() là cách thuần khiết nhất để tạo quan hệ kế thừa nguyên mẫu mà không cần chạy constructor function.',
        state: {
          callStack: [{ id: '1', name: 'global()', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [],
          eventLoopPhase: 'idle',
          activeContainer: 'callStack',
        },
      },
      {
        stepIndex: 2,
        title: 'Truy cập dog.breed -> Tìm thấy ngay trên dog',
        activeCodeLines: [9, 10],
        explanation:
          'V8 kiểm tra dog.hasOwnProperty("breed"). Vì "breed" nằm trực tiếp trên instance dog, V8 trả về "Golden" ngay lập tức mà không cần leo thang.',
        interviewInsight:
          'Own property luôn có độ ưu tiên cao nhất, nó sẽ "che khuất" (shadowing) bất kỳ thuộc tính nào cùng tên ở tầng Prototype bên trên.',
        state: {
          callStack: [{ id: '1', name: 'global()', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [{ id: 'l1', text: 'Golden', step: 2, tag: 'dog (own)' }],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 3,
        title: 'Truy cập dog.eat() -> Leo thang lên animal',
        activeCodeLines: [12, 13],
        explanation:
          'dog không có thuộc tính "eat". V8 tiếp tục đi theo con trỏ dog.__proto__ đến animal. Tìm thấy hàm eat() trên animal, V8 thực thi hàm với `this` trỏ về dog.',
        interviewInsight:
          'Chú ý cực kỳ quan trọng: Dù hàm eat nằm trên animal, nhưng khi gọi dog.eat(), context `this` bên trong hàm eat vẫn trỏ về chính đối tượng gọi nó (dog)!',
        state: {
          callStack: [{ id: '1', name: 'global()', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'Golden', step: 2, tag: 'dog (own)' },
            { id: 'l2', text: 'eating...', step: 3, tag: 'via animal.__proto__' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 4,
        title: 'Truy cập dog.toString() -> Leo thang lên Object.prototype',
        activeCodeLines: [15, 16],
        explanation:
          'dog không có toString. animal cũng không có. V8 đi tiếp animal.__proto__ đến đỉnh của mọi object thông thường: Object.prototype. Tìm thấy phương thức toString().',
        interviewInsight:
          'Mọi object literal `{}` đều kế thừa từ Object.prototype. Đây là nơi chứa các hàm chuẩn: hasOwnProperty, toString, valueOf, isPrototypeOf.',
        state: {
          callStack: [{ id: '1', name: 'global()', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'Golden', step: 2, tag: 'dog (own)' },
            { id: 'l2', text: 'eating...', step: 3, tag: 'via animal.__proto__' },
            { id: 'l3', text: '[object Object]', step: 4, tag: 'via Object.prototype' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 5,
        title: 'Truy cập dog.fly -> Chạm mốc null, trả về undefined',
        activeCodeLines: [18, 19],
        explanation:
          'V8 leo từ dog -> animal -> Object.prototype. Tiếp theo Object.prototype.__proto__ chính là null (điểm kết thúc chuỗi). Không tìm thấy thuộc tính "fly" -> Trả về undefined.',
        interviewInsight:
          'Nếu bạn cố gọi dog.fly(), JS sẽ quăng lỗi TypeError: dog.fly is not a function vì nó cố thực thi undefined như một hàm.',
        state: {
          callStack: [{ id: '1', name: 'global()', isExecuting: true }],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'Golden', step: 2, tag: 'dog (own)' },
            { id: 'l2', text: 'eating...', step: 3, tag: 'via animal.__proto__' },
            { id: 'l3', text: '[object Object]', step: 4, tag: 'via Object.prototype' },
            { id: 'l4', text: 'undefined', step: 5, tag: 'End of chain (null)' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
    ],
  },
  {
    id: 'this-binding',
    title: 'Quy tắc xác định "this": 4 kịch bản kinh điển',
    tagline: 'Default, Implicit, Explicit (call/apply/bind) & Arrow Lexical',
    difficulty: 'Mid',
    description:
      'Giải mã bản chất từ khoá "this" trong JavaScript: this không phụ thuộc vào nơi hàm được khai báo, mà phụ thuộc hoàn toàn vào CÁCH HÀM ĐƯỢC GỌI (Call-site).',
    code: `const user = {
  name: 'Alex',
  regular() {
    return this.name;
  },
  arrow: () => {
    return this?.name;
  }
};

// 1. Implicit Binding (Gọi qua đối tượng)
console.log(user.regular()); // 'Alex'

// 2. Mất binding khi gán biến (Detached function)
const fn = user.regular;
console.log(fn()); // undefined (hoặc window/global)

// 3. Explicit Binding (call / apply / bind)
console.log(fn.call({ name: 'Taylor' })); // 'Taylor'

// 4. Arrow function (Kế thừa lexical this)
console.log(user.arrow()); // undefined`,
    expectedOutput: [
      "'Alex'",
      'undefined',
      "'Taylor'",
      'undefined'
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Khai báo Object chứa regular function và arrow function',
        activeCodeLines: [1, 2, 3, 4, 5, 6, 7, 8],
        explanation:
          'regular() được định nghĩa theo cú pháp phương thức chuẩn. arrow được định nghĩa bằng hàm mũi tên. Chú ý: Arrow function KHÔNG có context `this` của riêng nó!',
        interviewInsight:
          'Arrow function luôn bắt (capture) giá trị this từ Lexical Scope bao quanh nó tại thời điểm hàm được tạo ra.',
        state: {
          callStack: [{ id: '1', name: 'global()', isExecuting: true }],
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
        title: 'Implicit Binding: user.regular()',
        activeCodeLines: [10, 11],
        explanation:
          'Khi hàm được gọi với dấu chấm đứng trước (user.regular()), Call-site có đối tượng ngữ cảnh là user. V8 tự động gán `this = user`. Vì vậy this.name trả về "Alex".',
        interviewInsight:
          'Quy tắc 1: Đối tượng đứng ngay trước dấu chấm tại thời điểm gọi hàm chính là `this`.',
        state: {
          callStack: [
            { id: '1', name: 'global()' },
            { id: '2', name: 'user.regular()', isExecuting: true },
          ],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [{ id: 'l1', text: 'Alex', step: 1, tag: 'this = user' }],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 2,
        title: 'Mất ngữ cảnh: fn = user.regular; fn()',
        activeCodeLines: [13, 14, 15],
        explanation:
          'fn chỉ là một tham chiếu trỏ tới function trong bộ nhớ. Khi gọi fn(), không có dấu chấm nào phía trước (Default Binding). `this` trở thành undefined (strict mode) hoặc window.',
        interviewInsight:
          'Đây là nguyên nhân 90% lỗi trong React class components cũ (như onClick={this.handleClick} bị mất this) hoặc khi truyền hàm callback vào setTimeout.',
        state: {
          callStack: [
            { id: '1', name: 'global()' },
            { id: '3', name: 'fn() [Default Binding]', isExecuting: true },
          ],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'Alex', step: 1, tag: 'this = user' },
            { id: 'l2', text: 'undefined', step: 2, tag: 'this = global / undefined' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 3,
        title: 'Explicit Binding: fn.call({ name: "Taylor" })',
        activeCodeLines: [17, 18],
        explanation:
          'Bằng cách dùng .call(targetObj) hoặc .apply() hoặc .bind(), lập trình viên ép buộc V8 gán `this` của hàm chính xác là targetObj bất kể hàm được gọi từ đâu.',
        interviewInsight:
          'Sự khác biệt: call nhận tham số rời rạc fn.call(thisArg, a, b); apply nhận mảng fn.apply(thisArg, [a, b]); bind tạo ra hàm mới cố định this vĩnh viễn.',
        state: {
          callStack: [
            { id: '1', name: 'global()' },
            { id: '4', name: 'fn.call(Taylor)', isExecuting: true },
          ],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'Alex', step: 1, tag: 'this = user' },
            { id: 'l2', text: 'undefined', step: 2, tag: 'this = global / undefined' },
            { id: 'l3', text: 'Taylor', step: 3, tag: 'this = { name: Taylor }' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
      {
        stepIndex: 4,
        title: 'Arrow Function: user.arrow()',
        activeCodeLines: [20, 21],
        explanation:
          'Object literal `{}` KHÔNG tạo ra scope mới. Scope bao quanh arrow chính là Global scope. Do đó `this` bên trong arrow function trỏ ra ngoài global (window), không thể truy cập user.name.',
        interviewInsight:
          'Không bao giờ dùng arrow function làm method trong object literal. Hãy dùng cú pháp rút gọn method `method() {}` để this hoạt động tự nhiên.',
        state: {
          callStack: [
            { id: '1', name: 'global()' },
            { id: '5', name: 'user.arrow()', isExecuting: true },
          ],
          webApis: [],
          microtaskQueue: [],
          macrotaskQueue: [],
          consoleLogs: [
            { id: 'l1', text: 'Alex', step: 1, tag: 'this = user' },
            { id: 'l2', text: 'undefined', step: 2, tag: 'this = global / undefined' },
            { id: 'l3', text: 'Taylor', step: 3, tag: 'this = { name: Taylor }' },
            { id: 'l4', text: 'undefined', step: 4, tag: 'Lexical this = global' },
          ],
          eventLoopPhase: 'idle',
          activeContainer: 'console',
        },
      },
    ],
  },
];
