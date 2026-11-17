'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, ExternalLink } from 'lucide-react';

interface TopicItem {
  id: string;
  index: string;
  title: string;
  count: string;
  desc: string;
  codeSnippet: string;
  keyInsight: string;
}

const topicsData: TopicItem[] = [
  {
    id: 'event-loop',
    index: '01',
    title: 'JavaScript Runtime & Event Loop',
    count: '3 visualizers',
    desc: 'Call Stack LIFO execution, Microtask VIP queue draining, Macrotask timer dispatching.',
    codeSnippet: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\n// Output: 1 -> 3 -> 2`,
    keyInsight: 'Microtasks ALWAYS drain completely before the browser executes the next macrotask.',
  },
  {
    id: 'closures',
    index: '02',
    title: 'Closures & Scope Chain',
    count: '3 visualizers',
    desc: 'Lexical Environment nesting, Heap memory allocation, and persistent outer variable references.',
    codeSnippet: `function makeCounter() {\n  let count = 0; // Heap closure\n  return () => ++count;\n}`,
    keyInsight: 'Closed-over variables reside in the V8 Heap, persisting after parent execution contexts pop.',
  },
  {
    id: 'prototype',
    index: '03',
    title: 'Prototype Chain & this Binding',
    count: '3 visualizers',
    desc: 'Prototypal delegation via __proto__, Object.create(), and call-site this resolution.',
    codeSnippet: `const child = Object.create(parent);\nchild.sayName(); // Walks delegation chain`,
    keyInsight: 'JavaScript does not copy methods on instantiation; it delegates lookup up the prototype chain.',
  },
  {
    id: 'react-re-renders',
    index: '04',
    title: 'React Fiber & Re-render Blast Radius',
    count: '3 visualizers',
    desc: 'WorkInProgress dual buffering, dirty node marking, State Colocation, and memo skips.',
    codeSnippet: `// State colocation isolates re-renders\nfunction LocalInput() {\n  const [val, setVal] = useState('');\n  return <input value={val} ... />;\n}`,
    keyInsight: 'When parent state updates, all children re-render by default unless protected by React.memo.',
  },
  {
    id: 'nextjs-rendering',
    index: '05',
    title: 'Next.js Rendering: SSR vs SSG vs ISR vs RSC',
    count: '3 visualizers',
    desc: 'Server Request lifecycle, Edge CDN caches, Stale-While-Revalidate, and Streaming HTML.',
    codeSnippet: `export const revalidate = 60; // ISR cache window\nexport default async function Page() { ... }`,
    keyInsight: 'RSC streams serialized JSON UI payloads directly to the client without hydrating server components.',
  },
  {
    id: 'stacking-context',
    index: '06',
    title: 'CSS Geometry & 3D Stacking Context',
    count: '3 visualizers',
    desc: 'Z-index resolution in 3D space, opacity/transform trigger boundaries, and paint order.',
    codeSnippet: `.modal {\n  transform: translateZ(0); /* Spawns new context */\n  z-index: 9999;\n}`,
    keyInsight: 'A child element can never escape or out-index a parent stacking context layer.',
  },
  {
    id: 'bundle-optimization',
    index: '07',
    title: 'Tree Shaking & Lazy Loading',
    count: '3 visualizers',
    desc: 'ES Modules Static AST Analysis, sideEffects: false in package.json, and dynamic import().',
    codeSnippet: `// Named import allows Rollup/Turbopack to drop unused exports\nimport { debounce } from 'lodash-es';`,
    keyInsight: 'CommonJS require() cannot be safely tree-shaken due to runtime dynamic module evaluation.',
  },
  {
    id: 'http-cache',
    index: '08',
    title: 'HTTP Caching & Browser Storage Matrix',
    count: '3 visualizers',
    desc: 'Cache-Control headers, ETag validation, and security comparison of Cookies vs LocalStorage.',
    codeSnippet: `Cache-Control: public, max-age=31536000, immutable\nETag: W/"123-xyz"`,
    keyInsight: 'no-cache still stores files locally but requires 304 validation before each reuse.',
  },
  {
    id: 'core-web-vitals',
    index: '09',
    title: 'Performance & Core Web Vitals',
    count: '3 visualizers',
    desc: 'Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Layout Shift (CLS).',
    codeSnippet: `// Breaking long tasks to free the main thread\nawait scheduler.yield();`,
    keyInsight: 'Tasks blocking the Main Thread longer than 50ms degrade INP and cause visible input lag.',
  },
  {
    id: 'state-management',
    index: '10',
    title: 'State Architecture: Server vs Client State',
    count: '3 visualizers',
    desc: 'TanStack Query automatic caching vs Zustand atomic selectors and Context API re-renders.',
    codeSnippet: `// Atomic selector avoids re-render blast radius\nconst count = useStore((s) => s.count);`,
    keyInsight: 'Over 80% of application state is remote Server State that belongs in an HTTP cache, not Redux.',
  },
];

export function TopicsListSection() {
  const [activeTopic, setActiveTopic] = useState<TopicItem>(topicsData[0]);

  return (
    <section className="py-20 sm:py-28 border-t border-[var(--border)]" id="topics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <span className="font-mono text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text)] tracking-tight">
            10 core frontend topics. All with runnable simulations.
          </h2>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            Hover or tap any topic to inspect code snippets and core mental models. Click to launch full interactive environments.
          </p>
        </div>

        {/* 2-Column: Left List + Right Interactive Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Numbered Topic List */}
          <div className="lg:col-span-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {topicsData.map((topic) => {
              const isActive = activeTopic.id === topic.id;
              return (
                <div key={topic.id} className="transition-colors">
                  <div
                    onMouseEnter={() => setActiveTopic(topic)}
                    onClick={() => setActiveTopic(topic)}
                    className={`group py-4 px-3 sm:px-4 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                      isActive ? 'bg-[var(--bg-subtle)]' : 'hover:bg-[var(--bg-subtle)]/50'
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveTopic(topic);
                      }
                    }}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="font-mono text-xs font-bold text-[var(--accent)] pt-0.5">
                        {topic.index}
                      </span>
                      <div>
                        <h3
                          className={`text-base font-serif font-bold transition-colors ${
                            isActive ? 'text-[var(--accent)]' : 'text-[var(--text)] group-hover:text-[var(--text)]'
                          }`}
                        >
                          {topic.title}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                          {topic.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <span className="text-[11px] font-mono text-[var(--text-muted)] hidden sm:inline">
                        {topic.count}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isActive
                            ? 'text-[var(--accent)] translate-x-1'
                            : 'text-[var(--text-muted)] group-hover:translate-x-0.5'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Mobile Inline Preview Accordion (< lg) */}
                  {isActive && (
                    <div className="lg:hidden p-4 bg-[var(--bg-subtle)]/80 border-t border-[var(--border)] space-y-3 animate-in fade-in">
                      <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] font-mono text-xs text-[var(--text)] overflow-x-auto">
                        <pre className="text-xs font-mono leading-relaxed">
                          {topic.codeSnippet}
                        </pre>
                      </div>

                      <div className="p-2.5 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-subtle)] text-xs text-[var(--text)] font-sans">
                        <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase block mb-0.5">
                          Mental model insight
                        </span>
                        {topic.keyInsight}
                      </div>

                      <Link
                        href={`/workbench?topic=${topic.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-md bg-[var(--accent)] text-white text-xs font-mono font-semibold shadow-2xs"
                      >
                        <span>Launch {topic.title} visualizer</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Live Topic Preview Card (Desktop: lg+) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-24 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--accent)]">
                  {activeTopic.index}
                </span>
                <span className="text-xs font-mono font-semibold text-[var(--text-muted)]">
                  Live Topic Preview
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold">
                {activeTopic.count}
              </span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-[var(--text)]">
                {activeTopic.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                {activeTopic.desc}
              </p>
            </div>

            {/* Code Block */}
            <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] font-mono text-xs text-[var(--text)] overflow-x-auto">
              <pre className="text-xs font-mono leading-relaxed">
                {activeTopic.codeSnippet}
              </pre>
            </div>

            {/* Mental model insight */}
            <div className="p-3 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-subtle)] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider block">
                Mental model insight
              </span>
              <p className="text-xs text-[var(--text)] font-sans leading-relaxed">
                {activeTopic.keyInsight}
              </p>
            </div>

            {/* Direct launch link */}
            <Link
              href={`/workbench?topic=${activeTopic.id}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono font-semibold transition-all shadow-2xs"
            >
              <span>Launch {activeTopic.title} visualizer</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
