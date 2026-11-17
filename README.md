# ✦ Front-End Visualizer ("FE Under The Hood")

Nền tảng trực quan hoá các cơ chế hoạt động cốt lõi của Front-End và JavaScript Engine, được thiết kế theo phong cách giao diện tối giản, ấm áp và thanh lịch của **Claude (Anthropic)**.

---

## ✨ Điểm nổi bật

1. **Giao diện chuẩn Claude Editorial Aesthetic**:
   - Tông màu ấm: Kem ngà (`#FBF9F5`), than chì (`#22201E`), điểm nhấn đất nung Warm Coral / Terracotta (`#D96B43`).
   - Font Serif học thuật kết hợp Monospace kỹ thuật tinh tế.
   - Bố cục 3 phân vùng rõ ràng: Sidebar giáo trình, Sân khấu mô phỏng trung tâm, Bảng phân tích cơ chế & Code sync.

2. **Mô phỏng JavaScript Event Loop (MVP đã hoàn thiện)**:
   - **Call Stack**: Mô phỏng LIFO với frame push/pop động và highlight trạng thái `isExecuting`.
   - **Web APIs**: Trực quan hóa timers (`0ms`, background dispatch).
   - **Microtask Queue (VIP Lane)**: Làn đường ưu tiên cao nhất dành cho `Promise.then`, `async/await`, `queueMicrotask`.
   - **Macrotask Queue**: Task queue cho `setTimeout`, `setInterval`.
   - **Event Loop Ticker**: Vòng tròn trung tâm mô phỏng thứ tự kiểm tra: Call Stack Empty -> Dọn sạch toàn bộ Microtasks -> Lấy 1 Macrotask -> Lặp lại.
   - **Live Console Output**: Terminal theo dõi log in ra từng bước kèm badge `[sync]`, `[microtask]`, `[macrotask]`.
   - **Code Sync**: Tô màu dòng code đang chạy tương ứng với từng snapshot trạng thái.
   - **Claude Explanation & Interview Insights**: Lời giải thích sâu sắc, phân tích bản chất và mẹo trả lời phỏng vấn thực tế.

3. **3 Kịch bản phỏng vấn kinh điển tích hợp sẵn**:
   - 🌟 **Kịch bản 1 (Junior)**: Tam Giác Vàng: Sync vs setTimeout 0ms vs Promise Chain.
   - ⚡ **Kịch bản 2 (Mid)**: Microtask lồng nhau bên trong callback Macrotask (Loop Starvation & Processing Order).
   - 🧠 **Kịch bản 3 (Senior)**: Bản chất ngầm của `async / await` khi bị desugar thành Microtask.

4. **Chế độ Thử thách: Predict The Output (Quiz Mode)**:
   - Cho phép người học tự suy đoán thứ tự Console log trước khi bấm chạy mô phỏng.

---

## 🚀 Khởi chạy dự án

Dự án sử dụng **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** và **pnpm**:

```bash
# 1. Di chuyển vào thư mục dự án
cd /Users/tgm-mac007/fe-visualizer

# 2. Khởi chạy dev server
pnpm dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) để trải nghiệm.

---

## 🗺️ Lộ trình các module tiếp theo (Roadmap)

- [x] **Module 1**: JavaScript Event Loop & Task Queues (Đã hoàn thiện)
- [ ] **Module 2**: 3D Stacking Context & Z-Index Visualizer (Isometric Layered View)
- [ ] **Module 3**: Closures & Scope Chain (Heap Memory Pointer & Backpack Simulation)
- [ ] **Module 4**: React Fiber Tree & Diffing Algorithm (WorkInProgress vs Current Tree)
- [ ] **Module 5**: Critical Rendering Path (Pixel Pipeline: Reflow vs Repaint vs Composite)
- [ ] **Module 6**: HTTP Caching (Cache-Control, ETag, 304 Not Modified & SWR)
