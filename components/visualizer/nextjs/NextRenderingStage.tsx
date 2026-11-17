'use client';

import React from 'react';
import { NextRenderingState } from '@/lib/scenarios/nextjs-rendering-data';
import {
  Globe,
  Server,
  Database,
  Layers,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Clock,
} from 'lucide-react';

interface NextRenderingStageProps {
  state: NextRenderingState;
  className?: string;
}

export function NextRenderingStage({ state, className = '' }: NextRenderingStageProps) {
  const { strategy, currentStepStage, hops, browserView, serverState, artifacts } = state;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 flex flex-col justify-between shadow-xs select-none overflow-hidden ${className}`}
    >
      {/* Top Bar: Title & Strategy Pill */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h2 className="font-serif font-bold text-[15px] sm:text-[16px] text-[var(--foreground)] tracking-tight">
            Luồng xử lý mạng &amp; Kết xuất Next.js
          </h2>
        </div>

        {/* Strategy Pill */}
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-[var(--muted)] hidden sm:inline">Chiến lược:</span>
          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-mono font-bold tracking-tight border bg-blue-50 text-blue-900 border-blue-200">
            {strategy === 'SSR' && 'SSR (Server-Side Rendering)'}
            {strategy === 'ISR' && 'ISR (Incremental Static Regeneration)'}
            {strategy === 'RSC-Streaming' && 'RSC + HTML Streaming'}
            {strategy === 'SSG' && 'SSG (Static Site Generation)'}
          </span>
        </div>
      </div>

      {/* Main Visual: Network Topology & Node Pipeline */}
      <div className="flex-1 min-h-0 py-2.5 flex flex-col justify-between gap-3 overflow-y-auto">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[13px] font-medium text-[var(--foreground)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="font-bold">{currentStepStage}</span>
          </span>
          {serverState.cacheStatus && (
            <span
              className={`text-[11px] font-mono px-2 py-0.2 rounded-full font-bold border ${
                serverState.cacheStatus === 'HIT'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : serverState.cacheStatus === 'STALE'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : serverState.cacheStatus === 'REGENERATING'
                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}
            >
              Edge Cache: {serverState.cacheStatus}
            </span>
          )}
        </div>

        {/* 4-Node Network Diagram: Browser -> Edge -> Node Server -> Database */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-stretch">
          {/* Node 1: Browser */}
          <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[12px] font-mono font-bold flex items-center gap-1 text-[var(--foreground)]">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> Trình duyệt
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                  browserView.isInteractive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {browserView.isInteractive ? 'Interactive' : 'Chưa gắn JS'}
              </span>
            </div>

            <div className="py-2 space-y-1">
              <div className="text-[11px] font-semibold text-[var(--foreground)] truncate">
                {browserView.title}
              </div>
              <div
                className={`text-[11px] p-1.5 rounded-lg border leading-tight ${
                  browserView.hasMismatchError
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-mono text-[10px]'
                    : browserView.hasSkeleton
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-500 animate-pulse'
                    : 'bg-[var(--card)] border-[var(--border-subtle)] text-[var(--muted)]'
                }`}
              >
                {browserView.content}
              </div>
            </div>

            <div className="text-[10px] text-[var(--muted)] font-mono text-center pt-1 border-t border-[var(--border-subtle)]">
              Client Viewport
            </div>
          </div>

          {/* Node 2: CDN / Edge Cache */}
          <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[12px] font-mono font-bold flex items-center gap-1 text-[var(--foreground)]">
                <Zap className="w-3.5 h-3.5 text-amber-600" /> CDN / Edge
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {serverState.revalidateSeconds ? `${serverState.revalidateSeconds}s TTL` : 'Global'}
              </span>
            </div>

            <div className="py-2 flex flex-col items-center justify-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-[12px] shadow-2xs ${
                  serverState.cacheStatus === 'HIT'
                    ? 'bg-emerald-500 text-white animate-bounce'
                    : serverState.cacheStatus === 'STALE'
                    ? 'bg-amber-500 text-white'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                {serverState.cacheStatus === 'HIT' && '✓'}
                {serverState.cacheStatus === 'STALE' && '↻'}
                {serverState.cacheStatus === 'BYPASS' && '—'}
                {serverState.cacheStatus === 'REGENERATING' && '⚙'}
              </div>
              <span className="text-[11px] font-mono font-bold mt-1 text-[var(--foreground)]">
                {serverState.cacheStatus === 'HIT'
                  ? 'HIT (<20ms)'
                  : serverState.cacheStatus === 'STALE'
                  ? 'STALE (Trả cũ, build mới)'
                  : serverState.cacheStatus === 'REGENERATING'
                  ? 'Rebuilding ngầm'
                  : 'Pass-through'}
              </span>
            </div>

            <div className="text-[10px] text-[var(--muted)] font-mono text-center pt-1 border-t border-[var(--border-subtle)]">
              Cloudflare / Vercel Edge
            </div>
          </div>

          {/* Node 3: Node.js Server */}
          <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[12px] font-mono font-bold flex items-center gap-1 text-[var(--foreground)]">
                <Server className="w-3.5 h-3.5 text-purple-600" /> Node Server
              </span>
              <span className="text-[10px] font-mono text-purple-700 font-bold">
                App Router
              </span>
            </div>

            <div className="py-2 space-y-1 text-center">
              <div className="text-[11px] font-mono font-semibold text-zinc-800">
                renderToReadableStream
              </div>
              <div className="text-[10px] text-[var(--muted)]">
                React Server Components (RSC)
              </div>
            </div>

            <div className="text-[10px] text-[var(--muted)] font-mono text-center pt-1 border-t border-[var(--border-subtle)]">
              Server Environment
            </div>
          </div>

          {/* Node 4: Database / API */}
          <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subtle)]">
              <span className="text-[12px] font-mono font-bold flex items-center gap-1 text-[var(--foreground)]">
                <Database className="w-3.5 h-3.5 text-emerald-600" /> Database
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                Postgres / API
              </span>
            </div>

            <div className="py-2 text-center">
              <div className="text-[11px] font-mono text-[var(--foreground)] truncate font-medium">
                {serverState.dbQueryStatus || 'Chờ truy vấn...'}
              </div>
            </div>

            <div className="text-[10px] text-[var(--muted)] font-mono text-center pt-1 border-t border-[var(--border-subtle)]">
              Data Storage
            </div>
          </div>
        </div>

        {/* Hops Pipeline Tracker */}
        <div className="p-2.5 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] space-y-1.5">
          <div className="text-[11px] font-mono font-bold text-[var(--muted)] uppercase tracking-wider">
            Các chặng truyền tải mạng (Network Hops)
          </div>
          <div className="space-y-1">
            {hops.map((hop) => (
              <div
                key={hop.id}
                className="text-[12px] flex items-center justify-between bg-[var(--card)] p-1.5 rounded-lg border border-[var(--border-subtle)]"
              >
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-bold text-[var(--foreground)]">{hop.source}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span className="font-bold text-[var(--foreground)]">{hop.target}</span>
                  <span className="text-zinc-600 text-[11px] ml-1">: {hop.action}</span>
                </div>
                {hop.latency && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {hop.latency}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Artifacts Payload Bar */}
        {artifacts.length > 0 && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px] font-mono text-[var(--muted)]">Gói dữ liệu:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {artifacts.map((art, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono text-[11px] font-semibold flex items-center gap-1"
                >
                  <FileCode2 className="w-3 h-3 text-blue-600" />
                  {art.type} ({art.size})
                  {art.isHydrated && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Quote */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono shrink-0">
        <span>SSR = Mỗi request tính lại | ISR = Stale cache + Background build | RSC = 0 KB client JS</span>
        <span className="text-[var(--accent)] font-semibold hidden sm:inline">Next.js 16 App Router</span>
      </div>
    </div>
  );
}
