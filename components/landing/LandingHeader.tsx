'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[#FAF8F5]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-900 group"
          title="FE Visualizer Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#CC6745] text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
            {'{ }'}
          </div>
          <span className="text-base tracking-tight font-serif font-bold text-zinc-900">
            FE Visualizer
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600" aria-label="Main Navigation">
          <a href="#modules" className="hover:text-zinc-950 transition-colors">
            Modules
          </a>
          <a href="#simulation" className="hover:text-zinc-950 transition-colors">
            Live Demo
          </a>
          <a href="#architecture" className="hover:text-zinc-950 transition-colors">
            How It Works
          </a>
          <a href="#comparison" className="hover:text-zinc-950 transition-colors">
            Comparison
          </a>
          <a href="#interview" className="hover:text-zinc-950 transition-colors">
            Interview Prep
          </a>
          <a href="#faq" className="hover:text-zinc-950 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-[var(--border)] bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors shadow-2xs"
            title="Mã nguồn GitHub"
            aria-label="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <Link
            href="/workbench"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#CC6745] hover:bg-[#B85635] text-white text-sm font-semibold shadow-xs transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            <span>Launch Interactive Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/workbench"
            className="px-3 py-1.5 rounded-lg bg-[#CC6745] text-white text-xs font-semibold"
          >
            Workbench
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[var(--border)] bg-white text-zinc-700"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-white px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-zinc-700">
            <a
              href="#modules"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-zinc-950"
            >
              11 Runtime Modules
            </a>
            <a
              href="#simulation"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-zinc-950"
            >
              Live Simulation Sandbox
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-zinc-950"
            >
              Mental Model Architecture
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-zinc-950"
            >
              Comparison Matrix
            </a>
            <a
              href="#interview"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-zinc-950"
            >
              Interview Questions
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-zinc-950"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-2 border-t border-zinc-100">
            <Link
              href="/workbench"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#CC6745] text-white text-sm font-semibold"
            >
              <span>Launch Interactive Visualizer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
