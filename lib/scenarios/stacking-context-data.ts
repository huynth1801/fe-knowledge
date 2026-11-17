export interface StackingLayerItem {
  id: string;
  name: string;
  zIndex: number | 'auto';
  elevationLevel: number; // 1, 2, 3, 4, 5
  color: string;
  contextOwner: string;
  isWinning?: boolean;
  trapWarning?: string;
  computedOrder: number;
}

export interface StackingContextState {
  layers: StackingLayerItem[];
  activeRule: string;
  createdContexts: { id: string; triggerProperty: string; parentId?: string }[];
  consoleLogs: { id: string; text: string; step: number; tag?: string }[];
}

export interface StackingContextStep {
  stepIndex: number;
  title: string;
  activeCodeLines: number[];
  explanation: string;
  interviewInsight?: string;
  state: StackingContextState;
}

export interface StackingContextScenario {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  description: string;
  code: string;
  expectedOutput: string[];
  steps: StackingContextStep[];
}

export const stackingContextScenarios: StackingContextScenario[] = [
  // ==========================================
  // SCENARIO 1: THE Z-INDEX 9999 PARENT TRAP
  // ==========================================
  {
    id: 'stacking-parent-trap',
    title: 'Bẫy kinh điển: Tại sao z-index: 9999 vẫn nằm dưới z-index: 1?',
    tagline: 'Phần tử con không thể thoát ra khỏi tầng Z của phần tử cha',
    difficulty: 'Mid',
    description: 'Quan sát 2 container: Hộp A có z-index: 1 chứa nút con z-index: 9999. Hộp B có z-index: 2 chứa thẻ thông báo. Tại sao nút z-index 9999 lại bị Hộp B đè bẹp?',
    code: `/* HỘP A: z-index: 1 */
.box-a {
  position: relative;
  z-index: 1;
}

/* Con của Hộp A: z-index cực khủng */
.box-a .super-button {
  position: absolute;
  z-index: 9999; /* ⚠️ VÔ NGHĨA NGOÀI HỘP A! */
}

/* HỘP B: z-index: 2 (Sinh sau, z-index cao hơn Hộp A) */
.box-b {
  position: relative;
  z-index: 2; /* ĐÈ LÊN TOÀN BỘ HỘP A! */
}`,
    expectedOutput: [
      'Trình duyệt so sánh cha trước: Hộp B (z: 2) > Hộp A (z: 1)',
      'super-button (z: 9999) bị giới hạn trong Hộp A -> Vẫn nằm dưới Hộp B!',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Môi trường 2D thông thường: Các hộp nằm cạnh nhau',
        activeCodeLines: [1, 2, 3, 4],
        explanation: 'Hộp A được gán `position: relative` và `z-index: 1`. Điều này chính thức tạo ra một **Stacking Context** mới trong bộ nhớ trình duyệt.',
        interviewInsight: 'Stacking Context giống như một tòa nhà chung cư: Dù bạn ở tầng penthouse (9999) của chung cư 1, bạn vẫn thấp hơn người đứng ở tầng 1 của chung cư 2 xây trên đồi cao!',
        state: {
          layers: [
            {
              id: 'root',
              name: 'HTML Root Context',
              zIndex: 0,
              elevationLevel: 0,
              color: '#F4F4F5',
              contextOwner: 'Root',
              computedOrder: 1,
            },
            {
              id: 'box-a',
              name: '.box-a (z-index: 1)',
              zIndex: 1,
              elevationLevel: 1,
              color: '#93C5FD',
              contextOwner: 'Root Context',
              computedOrder: 2,
            },
          ],
          activeRule: 'Root Stacking Context',
          createdContexts: [
            { id: 'box-a', triggerProperty: 'position: relative + z-index: 1' },
          ],
          consoleLogs: [{ id: 's1', text: 'Created Stacking Context: .box-a (z: 1)', step: 0, tag: 'css' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Thêm nút con .super-button với z-index: 9999 bên trong Hộp A',
        activeCodeLines: [7, 8, 9, 10],
        explanation: 'Nút `.super-button` có `z-index: 9999`. Tuy nhiên, tầm ảnh hưởng của con số 9999 này CHỈ có hiệu lực so với các phần tử anh em CÙNG NẰM TRONG Hộp A!',
        interviewInsight: 'Không có z-index "toàn cầu" nếu cha của nó đã tạo một Stacking Context cục bộ.',
        state: {
          layers: [
            {
              id: 'box-a',
              name: '.box-a (Stacking Context 1)',
              zIndex: 1,
              elevationLevel: 1,
              color: '#93C5FD',
              contextOwner: 'Root Context',
              computedOrder: 2,
            },
            {
              id: 'btn-9999',
              name: '.super-button (z: 9999)',
              zIndex: 9999,
              elevationLevel: 2,
              color: '#FDE047',
              contextOwner: '.box-a Context',
              trapWarning: 'Bị giam cầm bên trong .box-a!',
              computedOrder: 3,
            },
          ],
          activeRule: 'Local Stacking Boundary inside .box-a',
          createdContexts: [
            { id: 'box-a', triggerProperty: 'position: relative + z-index: 1' },
          ],
          consoleLogs: [
            { id: 's1', text: 'Created Stacking Context: .box-a (z: 1)', step: 0, tag: 'css' },
            { id: 's2', text: 'Rendered .super-button (z: 9999) inside .box-a', step: 1, tag: 'layer' },
          ],
        },
      },
      {
        stepIndex: 2,
        title: 'Hộp B xuất hiện với z-index: 2 ➔ ĐÈ BẸP nút 9999!',
        activeCodeLines: [13, 14, 15, 16],
        explanation: 'Trình duyệt so sánh: Hộp B (`z-index: 2`) cao hơn Hộp A (`z-index: 1`). Do đó, TOÀN BỘ Hộp B và con cháu của nó được vẽ ĐÈ LÊN TOÀN BỘ Hộp A và con cháu của Hộp A!',
        interviewInsight: 'Cách sửa chuẩn mực trong thực tế: Đưa Modal hoặc Tooltip ra khỏi Hộp A bằng React Portal (`createPortal(..., document.body)`) để nó thuộc Root Context.',
        state: {
          layers: [
            {
              id: 'box-a',
              name: '.box-a (z: 1)',
              zIndex: 1,
              elevationLevel: 1,
              color: '#93C5FD',
              contextOwner: 'Root Context',
              computedOrder: 2,
            },
            {
              id: 'btn-9999',
              name: '.super-button (z: 9999)',
              zIndex: 9999,
              elevationLevel: 2,
              color: '#FDE047',
              contextOwner: '.box-a Context',
              trapWarning: 'BỊ HỘP B ĐÈ BẸP DO CHA (z:1) THUA (z:2)!',
              computedOrder: 3,
            },
            {
              id: 'box-b',
              name: '.box-b (z: 2)',
              zIndex: 2,
              elevationLevel: 4,
              color: '#86EFAC',
              contextOwner: 'Root Context',
              isWinning: true,
              computedOrder: 4,
            },
          ],
          activeRule: 'Root Context comparison: Box B (2) > Box A (1)',
          createdContexts: [
            { id: 'box-a', triggerProperty: 'position: relative + z-index: 1' },
            { id: 'box-b', triggerProperty: 'position: relative + z-index: 2' },
          ],
          consoleLogs: [
            { id: 's1', text: 'Created Stacking Context: .box-a (z: 1)', step: 0, tag: 'css' },
            { id: 's2', text: 'Rendered .super-button (z: 9999) inside .box-a', step: 1, tag: 'layer' },
            { id: 's3', text: '⚔️ Collision: .box-b (z: 2) paints OVER .super-button!', step: 2, tag: 'warning' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 2: ACCIDENTAL STACKING CONTEXTS
  // ==========================================
  {
    id: 'stacking-accidental-triggers',
    title: 'Những thuộc tính vô tình sinh ra Stacking Context',
    tagline: 'Tại sao opacity: 0.99 hoặc transform lại phá hủy bố cục z-index?',
    difficulty: 'Senior',
    description: 'Nhiều lập trình viên nghĩ chỉ có position + z-index mới tạo Stacking Context. Thực tế, opacity < 1, transform: scale(1), filter, và isolation: isolate đều âm thầm tạo ngữ cảnh phân tầng!',
    code: `/* Vô tình kích hoạt Stacking Context mà không hay biết! */
.card-wrapper {
  /* position: static; Không hề có z-index! */
  opacity: 0.99; /* ⚠️ Kích hoạt Stacking Context mới! */
  /* hoặc: transform: translateZ(0); */
  /* hoặc: filter: blur(0px); */
  /* hoặc: isolation: isolate; */
}

.card-wrapper .dropdown-menu {
  position: absolute;
  z-index: 9999; /* Bị kẹt lại phía dưới header trang! */
}`,
    expectedOutput: [
      'opacity: 0.99 tạo Stacking Context ngầm',
      'dropdown-menu bị giam cầm không thể nổi lên trên thanh Header',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Khi chưa có opacity: Dropdown nổi tự do trên Root',
        activeCodeLines: [1, 2],
        explanation: 'Khi `.card-wrapper` là phần tử bình thường, `.dropdown-menu` (`z-index: 9999`) thuộc Root Stacking Context và dễ dàng hiển thị đè lên mọi phần tử khác trên website.',
        interviewInsight: 'Ở trạng thái này, menu nổi lên đúng như mong muốn.',
        state: {
          layers: [
            {
              id: 'card',
              name: '.card-wrapper (Normal Flow)',
              zIndex: 'auto',
              elevationLevel: 1,
              color: '#E4E4E7',
              contextOwner: 'Root',
              computedOrder: 1,
            },
            {
              id: 'menu',
              name: '.dropdown-menu (z: 9999)',
              zIndex: 9999,
              elevationLevel: 4,
              color: '#FDE047',
              contextOwner: 'Root',
              isWinning: true,
              computedOrder: 4,
            },
          ],
          activeRule: 'Dropdown thuộc Root Context',
          createdContexts: [],
          consoleLogs: [{ id: 'a1', text: 'Dropdown menu rendered at Top level (z: 9999)', step: 0, tag: 'css' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Thêm animation opacity: 0.99 ➔ Ngữ cảnh phân tầng ngầm sinh ra!',
        activeCodeLines: [4, 5, 11, 12, 13],
        explanation: 'Để tạo animation mờ dần, ai đó thêm `opacity: 0.99`. Bùm! Trình duyệt bắt buộc gom toàn bộ con của `.card-wrapper` vào một Layer riêng trên GPU ➔ Dropdown bị hạ gục xuống tầng Z thấp!',
        interviewInsight: 'Trình duyệt cần tạo Stacking Context cho `opacity < 1` để trộn màu (Alpha Blending) toàn bộ cây con thành một mặt phẳng điểm ảnh trước khi áp dụng độ mờ.',
        state: {
          layers: [
            {
              id: 'card',
              name: '.card-wrapper (opacity: 0.99)',
              zIndex: 'auto',
              elevationLevel: 1,
              color: '#FCA5A5',
              contextOwner: 'New Context (GPU Layer)',
              trapWarning: 'Stacking Context sinh ra bởi opacity < 1!',
              computedOrder: 1,
            },
            {
              id: 'menu',
              name: '.dropdown-menu (z: 9999)',
              zIndex: 9999,
              elevationLevel: 2,
              color: '#FDE047',
              contextOwner: '.card-wrapper',
              trapWarning: 'Không còn đè lên được Header trang!',
              computedOrder: 2,
            },
          ],
          activeRule: 'New Stacking Context triggered by opacity < 1',
          createdContexts: [
            { id: 'card', triggerProperty: 'opacity: 0.99 (GPU Alpha Blending)' },
          ],
          consoleLogs: [
            { id: 'a1', text: 'Dropdown menu rendered at Top level (z: 9999)', step: 0, tag: 'css' },
            { id: 'a2', text: '⚠️ Trapped: opacity < 1 created new Stacking Context!', step: 1, tag: 'warning' },
          ],
        },
      },
    ],
  },
];
