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
        badge: 'Sắp ra mắt',
      },
      {
        id: 'prototype',
        title: 'Prototype Chain & Inheritance',
        subtitle: '__proto__, Prototype Object & Method Resolution',
        level: 'Mid',
        isReady: false,
        badge: 'Sắp ra mắt',
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
        badge: '3D Interactive',
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
        badge: 'Chuyên sâu',
      },
    ],
  },
  {
    id: 'browser-network',
    title: 'Browser & Performance',
    description: 'Từ byte mạng tới khung hình hiển thị 60fps',
    topics: [
      {
        id: 'rendering-pipeline',
        title: 'Critical Rendering Path',
        subtitle: 'DOM/CSSOM -> Render Tree -> Layout -> Paint -> Composite',
        level: 'Mid',
        isReady: false,
        badge: 'Sắp ra mắt',
      },
      {
        id: 'http-cache',
        title: 'HTTP Cache Flow',
        subtitle: 'Cache-Control, ETag, 304 Not Modified & SWR',
        level: 'Mid',
        isReady: false,
        badge: 'Sắp ra mắt',
      },
    ],
  },
];
