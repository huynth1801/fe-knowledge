'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

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

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        scrolled
          ? 'border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md shadow-xs'
          : 'border-[var(--border)] bg-[var(--bg)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-[var(--text)] group focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-md"
          title="FE Visualizer"
        >
          <div className="w-8 h-8 rounded-md bg-[var(--accent)] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
            {'{ }'}
          </div>
          <span className="text-base tracking-tight font-serif font-bold text-[var(--text)]">
            FE Visualizer
          </span>
        </Link>

        {/* Center Navigation */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--text-muted)]"
          aria-label="Main Navigation"
        >
          <a
            href="#visualizers"
            className="hover:text-[var(--text)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-sm"
          >
            Visualizers
          </a>
          <a
            href="#topics"
            className="hover:text-[var(--text)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-sm"
          >
            Topics
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[var(--text)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-sm"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="hover:text-[var(--text)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-sm"
          >
            FAQ
          </a>
          <a
            href="https://github.com/huuhuy1801/fe-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text)] transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-sm"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </nav>

        {/* Right CTA & Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/workbench"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-semibold transition-all shadow-2xs focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          >
            <span>Start reviewing, free</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--bg)] px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col gap-2.5 text-sm font-medium text-[var(--text-muted)]">
            <a
              href="#visualizers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[var(--text)]"
            >
              Visualizers
            </a>
            <a
              href="#topics"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[var(--text)]"
            >
              Topics
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[var(--text)]"
            >
              How it works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[var(--text)]"
            >
              FAQ
            </a>
            <a
              href="https://github.com/huuhuy1801/fe-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 hover:text-[var(--text)] flex items-center gap-2"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </nav>
          <div className="pt-2">
            <Link
              href="/workbench"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[var(--accent)] text-white text-sm font-semibold shadow-2xs"
            >
              <span>Start reviewing, free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
