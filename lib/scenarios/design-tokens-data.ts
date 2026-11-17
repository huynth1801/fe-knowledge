export interface TokenItem {
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'radius' | 'shadow';
  tier: 'global' | 'semantic' | 'component';
  resolvedHex?: string;
}

export interface DesignTokensState {
  activeTheme: 'light' | 'dark' | 'brand-accent';
  tokenChain: {
    globalToken: string;
    globalValue: string;
    semanticToken: string;
    semanticValue: string;
    componentToken: string;
    resolvedCss: string;
  };
  componentPreview: {
    name: string;
    variant: 'primary' | 'outline' | 'danger';
    previewStyle: Record<string, string>;
  };
  storybookArgs: Record<string, any>;
  consoleLogs: { id: string; text: string; step: number; tag?: string }[];
}

export interface DesignTokensStep {
  stepIndex: number;
  title: string;
  activeCodeLines: number[];
  explanation: string;
  interviewInsight?: string;
  state: DesignTokensState;
}

export interface DesignTokensScenario {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  description: string;
  code: string;
  expectedOutput: string[];
  steps: DesignTokensStep[];
}

export const designTokensScenarios: DesignTokensScenario[] = [
  // ==========================================
  // SCENARIO 1: 3-TIER DESIGN TOKENS ARCHITECTURE
  // ==========================================
  {
    id: 'tokens-3-tier-hierarchy',
    title: 'Kiến trúc Design Tokens 3 tầng: Global ➔ Semantic ➔ Component',
    tagline: 'Tại sao không bao giờ được hardcode màu như #3B82F6 vào component?',
    difficulty: 'Senior',
    description: 'Quan sát luồng kế thừa của Design Tokens: Tầng 1 (Global Brand Palette) -> Tầng 2 (Semantic: surface, foreground, action) -> Tầng 3 (Component: button-primary-bg). Thấy rõ khi đổi theme (Dark/Light), code component giữ nguyên 100%!',
    code: `/* 1. GLOBAL TOKENS (Giá trị thô, gắn liền với palette) */
:root {
  --color-blue-500: #3B82F6;
  --color-blue-600: #2563EB;
  --color-slate-900: #0F172A;
}

/* 2. SEMANTIC TOKENS (Ngữ nghĩa mục đích sử dụng) */
[data-theme="light"] {
  --color-action-primary: var(--color-blue-600);
  --color-surface-card: #FFFFFF;
}
[data-theme="dark"] {
  --color-action-primary: var(--color-blue-500);
  --color-surface-card: var(--color-slate-900);
}

/* 3. COMPONENT TOKENS (Ràng buộc scoped vào Component) */
.btn-primary {
  background-color: var(--color-action-primary);
}`,
    expectedOutput: [
      'Light Theme: --color-action-primary -> #2563EB (Blue 600)',
      'Dark Theme: Switch --color-action-primary -> #3B82F6 (Blue 500)',
      'Button component tự động cập nhật mà không cần sửa 1 dòng JSX!',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Chế độ Light Mode: Chuỗi phân giải 3 tầng',
        activeCodeLines: [7, 8, 9, 10, 18, 19, 20],
        explanation: 'Ở chế độ Light Mode, Component Token `--btn-bg` trỏ vào Semantic Token `--color-action-primary`, token này trỏ tiếp vào Global `--color-blue-600` (#2563EB).',
        interviewInsight: 'Quy tắc vàng của Design System: Developer và Designer giao tiếp bằng Semantic Tokens (ví dụ: `color.text.muted`), không bao giờ dùng tên màu cụ thể (như `gray-400`).',
        state: {
          activeTheme: 'light',
          tokenChain: {
            globalToken: '--color-blue-600',
            globalValue: '#2563EB',
            semanticToken: '--color-action-primary',
            semanticValue: 'var(--color-blue-600)',
            componentToken: '--btn-primary-bg',
            resolvedCss: '#2563EB',
          },
          componentPreview: {
            name: '<Button variant="primary">',
            variant: 'primary',
            previewStyle: {
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '10px 20px',
            },
          },
          storybookArgs: { label: 'Xác nhận đơn hàng', disabled: false },
          consoleLogs: [{ id: 't1', text: 'Resolved [Light]: --color-action-primary -> #2563EB', step: 0, tag: 'tokens' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Đổi sang Dark Mode: Chỉ đổi giá trị Semantic Token',
        activeCodeLines: [11, 12, 13, 14, 18, 19],
        explanation: 'Khi người dùng bật Dark Mode, thuộc tính `data-theme="dark"` kích hoạt. Semantic Token `--color-action-primary` được trỏ sang `--color-blue-500` (#3B82F6) để có độ tương phản (contrast ratio) đạt chuẩn WCAG AAA trên nền đen!',
        interviewInsight: 'Nhờ kiến trúc 3 tầng, khi Rebrand hoặc đổi Theme toàn hệ thống hàng nghìn components, bạn chỉ cần sửa 1 file Tokens JSON/CSS thay vì mở từng component ra sửa.',
        state: {
          activeTheme: 'dark',
          tokenChain: {
            globalToken: '--color-blue-500',
            globalValue: '#3B82F6',
            semanticToken: '--color-action-primary',
            semanticValue: 'var(--color-blue-500)',
            componentToken: '--btn-primary-bg',
            resolvedCss: '#3B82F6',
          },
          componentPreview: {
            name: '<Button variant="primary">',
            variant: 'primary',
            previewStyle: {
              backgroundColor: '#3B82F6',
              color: '#0F172A',
              borderRadius: '8px',
              padding: '10px 20px',
            },
          },
          storybookArgs: { label: 'Xác nhận đơn hàng', disabled: false },
          consoleLogs: [
            { id: 't1', text: 'Resolved [Light]: --color-action-primary -> #2563EB', step: 0, tag: 'tokens' },
            { id: 't2', text: 'Theme switch: [Dark Mode] activated. Contrast boosted.', step: 1, tag: 'dark' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 2: COMPOUND COMPONENTS PATTERN
  // ==========================================
  {
    id: 'compound-components-pattern',
    title: 'Compound Components: Thiết kế Component Library chuẩn Headless',
    tagline: 'Tại sao Radix UI và Shadcn chuộng Compound Pattern hơn Mega-props?',
    difficulty: 'Senior',
    description: 'So sánh Anti-pattern "1 component 40 props" vs Compound Pattern: Chia nhỏ <Select> thành <Select.Trigger>, <Select.Content>, <Select.Option> chia sẻ state ngầm qua React Context.',
    code: `// COMPOUND COMPONENT PATTERN (Đẳng cấp Design System)
<Select value={role} onValueChange={setRole}>
  {/* Trigger mở dropdown */}
  <Select.Trigger placeholder="Chọn quyền hạn" />

  {/* Khung nội dung */}
  <Select.Content>
    <Select.Option value="admin">Quản trị viên (Admin)</Select.Option>
    <Select.Option value="editor">Biên tập viên (Editor)</Select.Option>
    <Select.Option value="viewer">Người xem (Viewer)</Select.Option>
  </Select.Content>
</Select>`,
    expectedOutput: [
      '<Select> quản lý state isOpen, selectedValue qua Context ngầm',
      'Người dùng tự do bố trí JSX linh hoạt mà không bị giới hạn props',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Khởi tạo Select Context & Render Trigger',
        activeCodeLines: [2, 3, 4],
        explanation: 'Thẻ cha `<Select>` tạo ra một React Context lưu giữ state `{ isOpen: false, value: "admin" }`. Thẻ con `<Select.Trigger>` đọc state này và hiển thị nút bấm.',
        interviewInsight: 'Compound Components là cách mạng của FE UI: Tách biệt hoàn toàn phần Logic & State (Headless) khỏi phần Giao diện & Layout tùy biến của người dùng.',
        state: {
          activeTheme: 'light',
          tokenChain: {
            globalToken: '--radius-md',
            globalValue: '8px',
            semanticToken: '--component-radius',
            semanticValue: 'var(--radius-md)',
            componentToken: '--select-border-radius',
            resolvedCss: '8px',
          },
          componentPreview: {
            name: '<Select.Trigger />',
            variant: 'outline',
            previewStyle: {
              border: '1px solid #D4D4D8',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '8px 16px',
            },
          },
          storybookArgs: { isOpen: false, selectedValue: 'admin' },
          consoleLogs: [{ id: 'cc1', text: 'SelectContext initialized. isOpen: false', step: 0, tag: 'context' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Bấm Trigger ➔ Context isOpen = true ➔ Content mở ra!',
        activeCodeLines: [7, 8, 9, 10, 11],
        explanation: 'Khi click vào Trigger, Context cập nhật `isOpen = true`. Thẻ `<Select.Content>` lắng nghe thay đổi và tự động hiển thị danh sách 3 Options với animation mượt mà.',
        interviewInsight: 'Người dùng có thể chèn thêm Icon, Badge hoặc phân trang vào giữa các Option mà không cần xin tác giả thêm prop `renderCustomOption`!',
        state: {
          activeTheme: 'light',
          tokenChain: {
            globalToken: '--shadow-lg',
            globalValue: '0 10px 15px -3px rgba(0,0,0,0.1)',
            semanticToken: '--surface-elevation-popover',
            semanticValue: 'var(--shadow-lg)',
            componentToken: '--dropdown-shadow',
            resolvedCss: '0 10px 15px -3px rgba(0,0,0,0.1)',
          },
          componentPreview: {
            name: '<Select.Content> Open',
            variant: 'primary',
            previewStyle: {
              border: '1px solid #E4E4E7',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              padding: '6px',
            },
          },
          storybookArgs: { isOpen: true, selectedValue: 'admin' },
          consoleLogs: [
            { id: 'cc1', text: 'SelectContext initialized. isOpen: false', step: 0, tag: 'context' },
            { id: 'cc2', text: 'Select.Trigger clicked -> isOpen: true -> Content rendered', step: 1, tag: 'action' },
          ],
        },
      },
    ],
  },
];
