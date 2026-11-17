export interface PixelDiffArea {
  id: string;
  component: string;
  diffType: 'color' | 'layout-shift' | 'font' | 'missing';
  mismatchPercentage: number;
  isAccepted?: boolean;
}

export interface ActionabilityCheck {
  name: string;
  status: 'passed' | 'failed' | 'checking';
  description: string;
}

export interface TestingState {
  mode: 'visual-diff' | 'e2e-actionability';
  baselineSnapshot: {
    title: string;
    commitHash: string;
    stylePreview: Record<string, string>;
  };
  prSnapshot: {
    title: string;
    commitHash: string;
    stylePreview: Record<string, string>;
  };
  diffAreas: PixelDiffArea[];
  actionabilityChecks: ActionabilityCheck[];
  testStatus: 'PASSED' | 'FAILED' | 'RUNNING';
  consoleLogs: { id: string; text: string; step: number; tag?: string }[];
}

export interface TestingStep {
  stepIndex: number;
  title: string;
  activeCodeLines: number[];
  explanation: string;
  interviewInsight?: string;
  state: TestingState;
}

export interface TestingScenario {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  description: string;
  code: string;
  expectedOutput: string[];
  steps: TestingStep[];
}

export const testingScenarios: TestingScenario[] = [
  // ==========================================
  // SCENARIO 1: PIXEL-BY-PIXEL VISUAL REGRESSION
  // ==========================================
  {
    id: 'testing-pixel-diff',
    title: 'Visual Regression: So sánh điểm ảnh Pixel-by-Pixel Diffing',
    tagline: 'Tự động phát hiện vỡ giao diện 1px trước khi code merge vào main',
    difficulty: 'Senior',
    description: 'So sánh bản ảnh chụp chuẩn (Baseline) và bản ảnh chụp PR mới: Nút bấm bị ai đó vô tình đổi padding làm lệch 4px ➔ Thuật toán Pixel Diff phát hiện và bôi đỏ vùng sai lệch!',
    code: `// PLAYWRIGHT VISUAL REGRESSION TEST
test('Kiểm tra giao diện Button không bị biến dạng', async ({ page }) => {
  await page.goto('/components/button');

  // Chụp ảnh màn hình và đối chiếu với Golden Master snapshot
  await expect(page.locator('.btn-primary')).toHaveScreenshot('button-primary.png', {
    maxDiffPixelRatio: 0.01, // Ngưỡng dung sai tối đa 1%
    threshold: 0.2           // Độ nhạy màu pixel
  });
});`,
    expectedOutput: [
      'So sánh Baseline Snapshot (Commit 8a1b) vs PR Snapshot (Commit 9c4d)',
      'Phát hiện sai lệch 4px padding ➔ Bôi đỏ vùng Pixel Mismatch!',
      'CI Test: FAILED (Chặn merge PR lên Production)',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Chụp ảnh màn hình PR mới & Đối chiếu với Baseline',
        activeCodeLines: [1, 2, 5],
        explanation: 'Test runner mở trình duyệt Headless Chromium, render component nút bấm trong môi trường cố định (độ phân giải 1280x720, tỷ lệ DPR 1.0) và chụp ảnh buffer.',
        interviewInsight: 'Visual Regression là tầng kiểm thử duy nhất bắt được các lỗi CSS thụ động (như `padding`, `margin`, `z-index`, `overflow: hidden`) mà Unit Test hay E2E thông thường hoàn toàn bỏ qua.',
        state: {
          mode: 'visual-diff',
          baselineSnapshot: {
            title: 'Baseline (Golden Master - main branch)',
            commitHash: '8a1b3f',
            stylePreview: {
              backgroundColor: '#2563EB',
              padding: '10px 20px',
              borderRadius: '8px',
            },
          },
          prSnapshot: {
            title: 'PR Candidate (feature/redesign)',
            commitHash: '9c4d8e',
            stylePreview: {
              backgroundColor: '#2563EB',
              padding: '14px 24px', // BỊ LỆCH PADDING!
              borderRadius: '8px',
            },
          },
          diffAreas: [],
          actionabilityChecks: [],
          testStatus: 'RUNNING',
          consoleLogs: [{ id: 't1', text: 'Capturing screenshot buffer in 1280x720 viewport...', step: 0, tag: 'test' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Phát hiện sai lệch: Bôi đỏ vùng Pixel Mismatch (Test FAILED)',
        activeCodeLines: [6, 7],
        explanation: 'Thuật toán `pixelmatch` so sánh từng cặp pixel RGBA. Nó phát hiện padding bị tăng thêm 4px làm kích thước nút phình to, vượt quá ngưỡng dung sai `maxDiffPixelRatio` ➔ Bôi đỏ cảnh báo!',
        interviewInsight: 'Nhờ có Visual Regression, đội ngũ UI không bao giờ phải sợ việc sửa một class CSS chung vô tình làm vỡ giao diện ở 50 trang khác.',
        state: {
          mode: 'visual-diff',
          baselineSnapshot: {
            title: 'Baseline (Golden Master - main branch)',
            commitHash: '8a1b3f',
            stylePreview: {
              backgroundColor: '#2563EB',
              padding: '10px 20px',
              borderRadius: '8px',
            },
          },
          prSnapshot: {
            title: 'PR Candidate (Bị phình to 4px)',
            commitHash: '9c4d8e',
            stylePreview: {
              backgroundColor: '#2563EB',
              padding: '14px 24px',
              borderRadius: '8px',
            },
          },
          diffAreas: [
            {
              id: 'd1',
              component: 'Button Padding',
              diffType: 'layout-shift',
              mismatchPercentage: 4.8,
            },
          ],
          actionabilityChecks: [],
          testStatus: 'FAILED',
          consoleLogs: [
            { id: 't1', text: 'Capturing screenshot buffer in 1280x720 viewport...', step: 0, tag: 'test' },
            { id: 't2', text: '❌ [Visual Regression] Pixel mismatch: 4.8% exceeds threshold 1.0%', step: 1, tag: 'error' },
            { id: 't3', text: '🛑 GitHub CI check failed. Merge blocked.', step: 1, tag: 'ci' },
          ],
        },
      },
    ],
  },

  // ==========================================
  // SCENARIO 2: PLAYWRIGHT E2E ACTIONABILITY
  // ==========================================
  {
    id: 'testing-playwright-actionability',
    title: 'Playwright E2E: 6 Bước kiểm tra Actionability trước khi Click',
    tagline: 'Tại sao Playwright không bao giờ bị lỗi Flaky Test như Selenium hay Cypress cũ?',
    difficulty: 'Senior',
    description: 'Khám phá cơ chế Auto-waiting của Playwright: Khi gọi page.click("#checkout"), nó tự động kiểm tra 6 tiêu chuẩn: Attached, Visible, Stable, Enabled, Receives Events, Editable.',
    code: `// PLAYWRIGHT AUTO-WAITING & ACTIONABILITY
// Không cần đặt sleep() hay waitForTimeout() ngớ ngẩn!
await page.locator('#checkout-btn').click();

// Playwright tự động chạy 6 bước kiểm tra ngầm:
// 1. Attached to DOM?
// 2. Visible on screen?
// 3. Stable (hết animation)?
// 4. Receives Events (không bị modal khác che)?
// 5. Enabled (không bị disabled)?`,
    expectedOutput: [
      'Auto-waiting: Tự động chờ nút xuất hiện và dừng animation',
      'Kiểm tra Receives Events: Phát hiện modal che lấp -> Chờ modal đóng',
      'Actionability PASSED -> Click an toàn 100%!',
    ],
    steps: [
      {
        stepIndex: 0,
        title: 'Bắt đầu kiểm tra: Nút đang chạy animation trượt vào',
        activeCodeLines: [3],
        explanation: 'Nút `#checkout-btn` vừa được thêm vào DOM nhưng đang chạy hiệu ứng CSS slide-in. Playwright phát hiện vị trí toạ độ đang thay đổi liên tục (chưa `Stable`) nên tự động chờ!',
        interviewInsight: 'Lý do lớn nhất khiến E2E test bị "Flaky" (lúc pass lúc fail) là lập trình viên click khi animation chưa dừng hẳn. Playwright giải quyết dứt điểm bằng cơ chế Auto-waiting.',
        state: {
          mode: 'e2e-actionability',
          baselineSnapshot: { title: '', commitHash: '', stylePreview: {} },
          prSnapshot: { title: '', commitHash: '', stylePreview: {} },
          diffAreas: [],
          actionabilityChecks: [
            { name: 'Attached to DOM', status: 'passed', description: 'Node đã gắn vào DOM' },
            { name: 'Visible', status: 'passed', description: 'Phần tử hiển thị trên màn hình' },
            { name: 'Stable (No animation)', status: 'checking', description: 'Đang chờ CSS animation dừng hẳn...' },
            { name: 'Receives Events', status: 'checking', description: 'Kiểm tra phần tử che lấp...' },
            { name: 'Enabled', status: 'checking', description: 'Kiểm tra cờ disabled...' },
          ],
          testStatus: 'RUNNING',
          consoleLogs: [{ id: 'p1', text: 'Actionability check: waiting for #checkout-btn to become stable...', step: 0, tag: 'e2e' }],
        },
      },
      {
        stepIndex: 1,
        title: 'Hoàn tất 6 tiêu chuẩn ➔ Click an toàn 100%!',
        activeCodeLines: [3, 7, 8, 9, 10, 11],
        explanation: 'Animation dừng hẳn, không có phần tử nào che lấp, nút ở trạng thái enabled. Playwright kích hoạt sự kiện Click chuẩn cấp độ hệ điều hành!',
        interviewInsight: 'Playwright không kích hoạt sự kiện giả lập `element.dispatchEvent("click")` như một số thư viện cũ, mà nó gửi tín hiệu chuột thật qua Chrome DevTools Protocol (CDP).',
        state: {
          mode: 'e2e-actionability',
          baselineSnapshot: { title: '', commitHash: '', stylePreview: {} },
          prSnapshot: { title: '', commitHash: '', stylePreview: {} },
          diffAreas: [],
          actionabilityChecks: [
            { name: 'Attached to DOM', status: 'passed', description: '✓ Node đã gắn vào DOM' },
            { name: 'Visible', status: 'passed', description: '✓ Không có display: none hay visibility: hidden' },
            { name: 'Stable', status: 'passed', description: '✓ Vị trí toạ độ đã cố định' },
            { name: 'Receives Events', status: 'passed', description: '✓ Điểm click trực tiếp nhận event' },
            { name: 'Enabled', status: 'passed', description: '✓ Không có thuộc tính disabled' },
          ],
          testStatus: 'PASSED',
          consoleLogs: [
            { id: 'p1', text: 'Actionability check: waiting for #checkout-btn to become stable...', step: 0, tag: 'e2e' },
            { id: 'p2', text: '✓ All 6 Actionability checks passed! Dispatching real mouse click.', step: 1, tag: 'success' },
          ],
        },
      },
    ],
  },
];
