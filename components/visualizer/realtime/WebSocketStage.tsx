'use client';

import React from 'react';
import { WebSocketState } from '@/lib/scenarios/websocket-realtime-data';
import { Radio, ArrowLeftRight, Server, Globe, Activity, Cpu, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface WebSocketStageProps {
  state: WebSocketState;
  className?: string;
}

export function WebSocketStage({ state, className = '' }: WebSocketStageProps) {
  const { connectionStatus, protocol, packets, dataVizEngine, reconnectAttempts, backoffDelayMs } = state;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 flex flex-col justify-between shadow-xs select-none overflow-hidden ${className}`}
    >
      {/* Top Bar: Title & Connection Status */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-serif font-bold text-[15px] sm:text-[16px] text-[var(--foreground)] tracking-tight">
            WebSocket Full-Duplex &amp; Big Data Engine
          </h2>
        </div>

        {/* Connection Status Pill */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[var(--muted)] font-mono hidden sm:inline">Trạng thái Socket:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[12px] font-mono font-bold tracking-tight border flex items-center gap-1 ${
              connectionStatus === 'OPEN'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : connectionStatus === 'RECONNECTING'
                ? 'bg-purple-50 text-purple-800 border-purple-300 animate-pulse'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {connectionStatus === 'OPEN' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            {connectionStatus === 'RECONNECTING' && <RefreshCw className="w-3.5 h-3.5 text-purple-600 animate-spin" />}
            {connectionStatus}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 py-2.5 flex flex-col justify-between gap-3 overflow-y-auto">
        {/* Topology: Client (Left) <---> Server (Right) */}
        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] mb-2">
            <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold text-blue-700">
              <Globe className="w-4 h-4" /> Browser Client
            </div>
            <div className="text-[11px] font-mono text-[var(--muted)]">
              Giao thức: <span className="font-bold text-[var(--foreground)]">{protocol}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold text-emerald-700">
              <Server className="w-4 h-4" /> WebSocket Server
            </div>
          </div>

          {/* Bi-directional Channel stream */}
          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {packets.length === 0 ? (
              <div className="text-center py-4 text-[12px] text-zinc-400 font-mono italic">
                Chưa có gói tin truyền tải...
              </div>
            ) : (
              packets.map((pkt) => (
                <div
                  key={pkt.id}
                  className={`p-1.5 rounded-lg text-[11px] font-mono flex items-center justify-between border ${
                    pkt.direction === 'client-to-server'
                      ? 'bg-blue-50/60 border-blue-200 text-blue-950 ml-4'
                      : 'bg-emerald-50/60 border-emerald-200 text-emerald-950 mr-4'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">
                      {pkt.direction === 'client-to-server' ? '➔ OUT:' : '⬅ IN:'}
                    </span>
                    <span>{pkt.payload}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">{pkt.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Data Viz Performance Benchmark Box */}
        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] mb-2.5">
            <span className="text-[12px] font-mono font-bold text-[var(--foreground)] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-600" />
              Hiệu năng Vẽ Dữ liệu lớn (Data Viz Engine Benchmark)
            </span>
            <span className="text-[11px] font-mono text-zinc-600 font-semibold">
              Động cơ: <strong className="text-[var(--accent)]">{dataVizEngine.type}</strong>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border-subtle)]">
              <div className="text-[10px] font-mono text-[var(--muted)] uppercase">Số lượng điểm</div>
              <div className="font-serif text-xl font-bold text-[var(--foreground)] mt-0.5">
                {dataVizEngine.nodeCount.toLocaleString()}
              </div>
            </div>

            <div
              className={`p-2 rounded-lg border ${
                dataVizEngine.fps >= 50
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/60 border-rose-300 text-rose-950 ring-1 ring-rose-300'
              }`}
            >
              <div className="text-[10px] font-mono uppercase">Tốc độ khung hình</div>
              <div className="font-serif text-xl font-bold mt-0.5">
                {dataVizEngine.fps} FPS
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border-subtle)]">
              <div className="text-[10px] font-mono text-[var(--muted)] uppercase">Tiêu thụ RAM</div>
              <div className="font-serif text-xl font-bold text-[var(--foreground)] mt-0.5">
                {dataVizEngine.memoryMb} MB
              </div>
            </div>
          </div>

          <div className="mt-2 text-[11px] font-mono text-zinc-600 text-center">
            {dataVizEngine.type === 'SVG'
              ? '⚠️ 50.000 thẻ DOM làm sụp đổ Main Thread và gây giật hình!'
              : '⚡ Canvas/WebGL vẽ trực tiếp bitmap giải phóng 100% gánh nặng DOM!'}
          </div>
        </div>
      </div>

      {/* Footer Info Quote */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono shrink-0">
        <span>Handshake 101 ➔ Full-Duplex TCP ➔ Exponential Backoff Reconnection</span>
        <span className="text-[var(--accent)] font-semibold hidden sm:inline">RFC 6455 &amp; Canvas Pipeline</span>
      </div>
    </div>
  );
}
