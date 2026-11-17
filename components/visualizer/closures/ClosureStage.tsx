'use client';

import React from 'react';
import { ClosureSimulationState } from '@/lib/scenarios/closure-data';
import { Layers, Database, Search, CheckCircle2, Lock } from 'lucide-react';

interface ClosureStageProps {
  state: ClosureSimulationState;
  className?: string;
}

export function ClosureStage({ state, className = '' }: ClosureStageProps) {
  const { callStack, lexicalScopes, activeLookup } = state;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[#FDFCFB] p-3.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-visible lg:overflow-hidden ${className}`}
    >
      {/* Top Banner with Scope Chain Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <h2 className="font-serif font-bold text-[15px] sm:text-[16px] text-[var(--foreground)]">
            Bộ nhớ Call Stack & Lexical Scope Chain
          </h2>
        </div>

        {activeLookup ? (
          <div className="text-[12px] font-mono px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-2xs flex items-center gap-1.5 font-semibold animate-in fade-in self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scope Lookup: Tìm thấy biến `{activeLookup.variable}`!</span>
          </div>
        ) : (
          <div className="text-[12px] font-mono px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] shadow-2xs self-start sm:self-auto">
            Trạng thái bộ nhớ: <strong className="text-indigo-700">Đang thực thi</strong>
          </div>
        )}
      </div>

      {/* Main 2-Column Split: Call Stack & Heap / Lexical Scopes */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 gap-4 flex-1 min-h-0 sm:items-stretch py-2.5">
        {/* ======================================================== */}
        {/* 1. Execution Context Stack                               */}
        {/* ======================================================== */}
        <div className="w-full sm:col-span-4 rounded-2xl border-2 border-dashed border-[#D1CCC4] bg-white/70 p-3 flex flex-col min-h-[140px] sm:h-full sm:min-h-0">
          <div className="flex items-center gap-2 mb-2.5 shrink-0">
            <div className="w-6 h-6 rounded bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center font-mono shadow-2xs">
              EC
            </div>
            <h3 className="font-bold text-[14px] text-[var(--foreground)]">
              Call Stack
            </h3>
            <span className="text-[10px] text-[var(--muted)] font-mono ml-auto">
              (Contexts)
            </span>
          </div>

          {/* Stack frames */}
          <div className="flex-1 min-h-0 rounded-xl border border-[var(--border)] bg-[#FAF8F5] p-2 flex flex-col-reverse justify-start gap-2 overflow-y-auto">
            {callStack.map((ctx) => (
              <div
                key={ctx.id}
                className={`px-3 py-2 rounded-lg text-[12px] font-mono font-semibold transition-all shadow-2xs flex items-center justify-between gap-1.5 ${
                  ctx.isExecuting
                    ? 'bg-indigo-600 border border-indigo-700 text-white ring-2 ring-indigo-200'
                    : 'bg-[#EDE9FE] border border-[#DDD6FE] text-[#4C1D95]'
                }`}
              >
                <span className="truncate">{ctx.name}</span>
                {ctx.isExecuting && (
                  <span className="text-[9px] bg-white/20 px-1 rounded uppercase font-sans">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. Lexical Environment & Heap Memory                     */}
        {/* ======================================================== */}
        <div className="w-full sm:col-span-8 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/15 p-3.5 flex flex-col min-h-[200px] sm:h-full sm:min-h-0">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-700" />
              <h3 className="font-serif font-bold text-[14px] text-[var(--foreground)]">
                Scope Chain & Heap Memory (Môi trường Lexical)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
              Bền vững qua Closure
            </span>
          </div>

          {/* Scope Chain cards container */}
          <div className="flex-1 min-h-0 rounded-xl border border-[var(--border)] bg-[#FAF8F5] p-2.5 flex flex-col gap-2 overflow-y-auto">
            {lexicalScopes.map((scope) => {
              const isClosure = scope.type === 'closure';
              const isBlock = scope.type === 'block';

              return (
                <div
                  key={scope.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isClosure
                      ? 'border-amber-400 bg-amber-50/80 shadow-2xs ring-1 ring-amber-300'
                      : isBlock
                      ? 'border-sky-300 bg-sky-50/60'
                      : 'border-[var(--border)] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[13px]">
                      {isClosure ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span className="text-amber-950 font-serif">
                            {scope.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-[var(--foreground)]">
                          {scope.name}
                        </span>
                      )}
                    </div>

                    {isClosure && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900 font-bold">
                        Heap Retained
                      </span>
                    )}
                  </div>

                  {/* Variables in this scope */}
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {scope.variables.length === 0 ? (
                      <span className="text-[11px] text-[var(--muted)] italic">
                        Không có biến cục bộ
                      </span>
                    ) : (
                      scope.variables.map((v) => (
                        <div
                          key={v.key}
                          className={`px-2.5 py-1 rounded-md text-[12px] font-mono flex items-center gap-1.5 border ${
                            v.isHighlighted
                              ? 'bg-amber-200 border-amber-400 text-amber-950 font-bold ring-1 ring-amber-400 animate-pulse'
                              : 'bg-white/90 border-[var(--border)] text-[var(--foreground)]'
                          }`}
                        >
                          <span className="text-amber-800 font-semibold">
                            {v.key}:
                          </span>
                          <span>{v.value}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {scope.desc && (
                    <p className="text-[11px] text-amber-800/80 italic mt-1 font-sans">
                      💡 {scope.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
