import { TopicCategory } from './types';

export const curriculumCategories: TopicCategory[] = [
  {
    id: 'js-engine',
    title: 'JavaScript Engine & Runtime',
    description: 'Bản chất cơ chế thực thi, quản lý bộ nhớ và luồng bất đồng bộ trong V8',
    topics: [
      {
        id: 'event-loop',
        title: 'Event Loop & Task Queues',
        subtitle: 'Call Stack, Microtask vs Macrotask, Render phase',
        level: 'Junior',
        isReady: true,
        badge: 'Phổ biến nhất',
      },
      {
        id: 'closures',
        title: 'Closures & Scope Chain',
        subtitle: 'Lexical Environment & Heap Memory Allocation',
        level: 'Junior',
        isReady: false,
      },
      {
        id: 'prototype',
        title: 'Prototype Chain & Inheritance',
        subtitle: '__proto__, Prototype Object & Method Resolution',
        level: 'Mid',
        isReady: false,
      },
    ],
  },
  {
    id: 'perf-vitals',
    title: 'Performance & Core Web Vitals',
    description: 'Tối ưu hóa tốc độ tải trang, Main Thread và trải nghiệm tương tác mượt mà',
    topics: [
      {
        id: 'core-web-vitals',
        title: 'Core Web Vitals (LCP, INP, CLS)',
        subtitle: 'Mô phỏng Long Tasks, Main Thread Blocking & Layout Shift',
        level: 'Senior',
        isReady: false,
        badge: 'Hiệu năng cao',
      },
      {
        id: 'rendering-pipeline',
        title: 'Rendering Pipeline & Reflow',
        subtitle: 'DOM/CSSOM -> Render Tree -> Layout -> Paint -> Composite',
        level: 'Mid',
        isReady: false,
      },
    ],
  },
  {
    id: 'design-system',
    title: 'Design System & Architecture',
    description: 'Xây dựng Component Library, Design Tokens và Storybook',
    topics: [
      {
        id: 'design-tokens',
        title: 'Design Tokens & Component Matrix',
        subtitle: 'Global -> Semantic -> Component Tokens & Compound Components',
        level: 'Senior',
        isReady: false,
        badge: 'Kiến trúc',
      },
    ],
  },
  {
    id: 'realtime-dataviz',
    title: 'Real-time, Data Viz & Maps',
    description: 'WebSocket hai chiều, xử lý dữ liệu lớn (D3/Canvas) và bản đồ vector',
    topics: [
      {
        id: 'websocket-realtime',
        title: 'WebSocket Lifecycle & Stream',
        subtitle: 'Handshake 101, Full-Duplex, Heartbeat & Exponential Backoff',
        level: 'Senior',
        isReady: false,
        badge: 'Real-time',
      },
      {
        id: 'dataviz-maps',
        title: 'Data Viz: SVG vs Canvas vs Maps',
        subtitle: '100k data points rendering & Tiled Vector Maps (Mapbox/MapLibre)',
        level: 'Senior',
        isReady: false,
      },
    ],
  },
  {
    id: 'testing-qa',
    title: 'Testing & Visual Regression',
    description: 'Component Testing, Pixel-by-pixel Diffing và Playwright E2E',
    topics: [
      {
        id: 'testing-visual-regression',
        title: 'Visual Regression & E2E Testing',
        subtitle: 'Pixel Diffing, Storybook Test Runner & Playwright Actionability',
        level: 'Senior',
        isReady: false,
        badge: 'Chất lượng',
      },
    ],
  },
  {
    id: 'react-internals',
    title: 'React Core Internals',
    description: 'Thuật toán điều phối ngầm (Fiber Reconciliation) và vòng đời Hook',
    topics: [
      {
        id: 'fiber-tree',
        title: 'React Fiber & Diffing',
        subtitle: 'Current vs WorkInProgress tree, Render vs Commit Phase',
        level: 'Senior',
        isReady: false,
      },
    ],
  },
  {
    id: 'css-mechanics',
    title: 'CSS & Layout Engines',
    description: 'Cách trình duyệt tính toán toạ độ, phân lớp z-index và hộp phần tử',
    topics: [
      {
        id: 'stacking-context',
        title: '3D Stacking Context & Z-Index',
        subtitle: 'Mô hình phân tầng không gian 3 chiều giải mã bug z-index',
        level: 'Mid',
        isReady: false,
      },
    ],
  },
];
