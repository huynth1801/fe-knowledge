'use client';

import React from 'react';
import Link from 'next/link';

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 font-serif font-bold text-lg text-[var(--text)]">
              <div className="w-7 h-7 rounded-md bg-[var(--accent)] text-white flex items-center justify-center font-mono font-bold text-xs">
                {'{ }'}
              </div>
              <span>FE Visualizer</span>
            </Link>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              An open-source mental model laboratory for frontend engineers. Every concept runs directly in the browser.
            </p>
          </div>

          {/* Col 1: Visualizers */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
              Visualizers
            </span>
            <ul className="space-y-2 text-xs font-medium text-[var(--text-muted)]">
              <li>
                <Link href="/workbench?topic=event-loop" className="hover:text-[var(--text)] transition-colors">
                  JavaScript Event Loop
                </Link>
              </li>
              <li>
                <Link href="/workbench?topic=fiber-tree" className="hover:text-[var(--text)] transition-colors">
                  React Fiber Reconciliation
                </Link>
              </li>
              <li>
                <Link href="/workbench?topic=closures" className="hover:text-[var(--text)] transition-colors">
                  Closures &amp; Scope Chain
                </Link>
              </li>
              <li>
                <Link href="/workbench?topic=stacking-context" className="hover:text-[var(--text)] transition-colors">
                  3D Stacking Context
                </Link>
              </li>
              <li>
                <Link href="/workbench?topic=nextjs-rendering" className="hover:text-[var(--text)] transition-colors">
                  Next.js Rendering Pipeline
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Architecture Notebooks */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
              Notebooks
            </span>
            <ul className="space-y-2 text-xs font-medium text-[var(--text-muted)]">
              <li>
                <Link href="/workbench?topic=bundle-optimization" className="hover:text-[var(--text)] transition-colors">
                  Tree Shaking &amp; Lazy Loading
                </Link>
              </li>
              <li>
                <Link href="/workbench?topic=http-cache" className="hover:text-[var(--text)] transition-colors">
                  HTTP Cache &amp; Storage Matrix
                </Link>
              </li>
              <li>
                <Link href="/workbench?topic=state-management" className="hover:text-[var(--text)] transition-colors">
                  State: Server vs Client State
                </Link>
              </li>
              <li>
                <Link href="/workbench?topic=cicd-github-actions" className="hover:text-[var(--text)] transition-colors">
                  CI/CD &amp; Docker Pipelines
                </Link>
              </li>
              <li>
                <Link href="/workbench?topic=core-web-vitals" className="hover:text-[var(--text)] transition-colors">
                  Core Web Vitals &amp; INP
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Open Source */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
              Project
            </span>
            <ul className="space-y-2 text-xs font-medium text-[var(--text-muted)]">
              <li>
                <a
                  href="https://github.com/huuhuy1801/fe-visualizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text)] transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/huuhuy1801/fe-visualizer/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text)] transition-colors"
                >
                  MIT License
                </a>
              </li>
              <li>
                <a
                  href="https://www.tasteskill.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text)] transition-colors"
                >
                  TasteSkill 2.5 Standard
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <p>© 2026 FE Visualizer. MIT Licensed. Open source for all engineers.</p>
          <p>No cookies collected. No external tracker scripts loaded.</p>
        </div>
      </div>
    </footer>
  );
}
