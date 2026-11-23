'use client';

import React from 'react';
import { ReactFiberState, FiberNodeItem } from '@/lib/scenarios/react-fiber-data';
import { ArrowRight, RefreshCw, AlertTriangle, Layers, GitCommit, CheckCircle2 } from 'lucide-react';

interface ReactFiberStageProps {
  state: ReactFiberState;
  className?: string;
}

export function ReactFiberStage({ state, className = '' }: ReactFiberStageProps) {
  const {
    currentTree,
    workInProgressTree,
    phase,
    activeFiberId,
    commitAction,
    hooksList,
    keyComparison,
    batchingState,
  } = state;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 flex flex-col justify-between shadow-xs select-none overflow-hidden ${className}`}
    >
      {/* Top Bar: Title & Phase Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 animate-pulse" />
          <h2 className="font-serif font-bold text-[15px] sm:text-[16px] text-[var(--foreground)] tracking-tight">
            Mô hình trực quan React Fiber Reconciler
          </h2>
        </div>

        {/* Phase Pill */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[12px] text-[var(--muted)] hidden sm:inline">Pha điều phối:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[12px] font-mono font-bold tracking-tight border ${
              phase === 'renderPhase'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : phase === 'commitPhase'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                : 'bg-zinc-100 text-zinc-700 border-zinc-200'
            }`}
          >
            {phase === 'renderPhase' && '⚡ Render Phase (Diffing ngầm trong RAM)'}
            {phase === 'commitPhase' && '✓ Commit Phase (Đồng bộ vào Real DOM)'}
            {phase === 'idle' && '○ Idle (Đã mount trên DOM)'}
          </span>
        </div>
      </div>

      {/* Main Content Area based on Scenario Data */}
      <div className="flex-1 min-h-0 py-2.5 flex items-center justify-center overflow-y-auto">
        {/* CASE 1: HOOKS SINGLY LINKED LIST VIEW */}
        {hooksList && hooksList.length > 0 ? (
          <div className="w-full flex flex-col gap-3.5 max-w-2xl mx-auto">
            <div className="flex items-center justify-between px-1">
              <span className="text-[13px] font-mono font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <span className="text-purple-600">fiber.memoizedState</span>
                <span className="text-[var(--muted)] font-normal">➔ Singly Linked List</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--muted)]">
                Con trỏ: workInProgressHook
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              {hooksList.map((hook, idx) => (
                <React.Fragment key={hook.id}>
                  <div
                    className={`flex-1 w-full sm:w-auto p-3 rounded-xl border transition-all ${
                      hook.hasError
                        ? 'border-rose-300 bg-rose-50/80 text-rose-900 ring-2 ring-rose-200'
                        : hook.isActive
                        ? 'border-purple-400 bg-purple-50/60 shadow-xs ring-1 ring-purple-300'
                        : 'border-[var(--border)] bg-[var(--background)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold">
                        Hook #{idx + 1}
                      </span>
                      {hook.hasError && (
                        <span className="text-[10px] font-mono font-bold text-rose-600 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> LỖI
                        </span>
                      )}
                    </div>

                    <div className="font-mono font-bold text-[13px] text-[var(--foreground)]">
                      {hook.hookName}
                    </div>

                    <div className="text-[12px] font-mono text-[var(--muted)] mt-1 truncate">
                      val: <span className="font-semibold text-zinc-800">{hook.value}</span>
                    </div>

                    {hook.errorMessage && (
                      <div className="mt-2 text-[11px] text-rose-700 font-sans font-medium bg-rose-100/70 p-1.5 rounded-lg border border-rose-200">
                        {hook.errorMessage}
                      </div>
                    )}
                  </div>

                  {idx < hooksList.length - 1 && (
                    <div className="shrink-0 flex items-center justify-center text-purple-400 font-mono text-[11px] gap-0.5">
                      <span className="hidden sm:inline">.next</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] text-[12px] text-[var(--muted)] flex items-center gap-2">
              <span className="font-bold text-purple-700 font-mono">Quy tắc vàng:</span>
              <span>
                React dựa 100% vào thứ tự duyệt <code className="font-mono text-zinc-800">.next</code> để lấy đúng state. Nếu nhảy cóc qua lệnh <code className="font-mono text-zinc-800">if</code>, toàn bộ pointer phía sau sẽ lệch!
              </span>
            </div>
          </div>
        ) : keyComparison ? (
          /* CASE 2: KEY={INDEX} TRAP COMPARISON VIEW */
          <div className="w-full flex flex-col gap-3 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-3">
              {/* Before */}
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <div className="text-[12px] font-mono font-bold text-zinc-700 pb-1.5 border-b border-[var(--border-subtle)] mb-2 flex items-center justify-between">
                  <span>Trước khi unshift (2 rows)</span>
                  <span className="text-[11px] text-[var(--muted)]">key = index</span>
                </div>
                <div className="space-y-1.5">
                  {keyComparison.before.map((item) => (
                    <div
                      key={item.key}
                      className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border-subtle)] text-[12px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[10px]">
                          key={item.key}
                        </span>
                        <span className="font-medium text-[var(--foreground)]">{item.label}</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">
                        input: &quot;{item.inputValue}&quot;
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* After */}
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <div className="text-[12px] font-mono font-bold text-rose-800 pb-1.5 border-b border-[var(--border-subtle)] mb-2 flex items-center justify-between">
                  <span>Sau khi unshift với key=index</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-mono font-bold">
                    State lệch!
                  </span>
                </div>
                <div className="space-y-1.5">
                  {keyComparison.after.length === 0 ? (
                    <div className="text-[12px] text-[var(--muted)] text-center py-4">
                      Chờ bước tiếp theo...
                    </div>
                  ) : (
                    keyComparison.after.map((item) => (
                      <div
                        key={item.key}
                        className={`p-2 rounded-lg border text-[12px] flex items-center justify-between ${
                          item.status === 'shifted-error'
                            ? 'bg-rose-50/80 border-rose-300 text-rose-900'
                            : 'bg-[var(--card)] border-[var(--border-subtle)] text-[var(--foreground)]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[10px]">
                            key={item.key}
                          </span>
                          <span className="font-medium truncate max-w-[100px]">{item.label}</span>
                        </div>
                        <span
                          className={`text-[11px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                            item.status === 'shifted-error'
                              ? 'bg-rose-200 text-rose-900'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          &quot;{item.inputValue}&quot;
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[12px] text-amber-900 font-sans">
              <span className="font-bold">Bài học phỏng vấn:</span> {keyComparison.note}
            </div>
          </div>
        ) : batchingState ? (
          /* CASE 3: REACT 18 AUTOMATIC BATCHING VIEW */
          <div className="w-full flex flex-col gap-3.5 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
              {/* Event / Trigger */}
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-[var(--muted)] uppercase mb-1">
                    1. Khởi phát
                  </div>
                  <div className="font-mono font-bold text-[13px] text-[var(--foreground)]">
                    setTimeout Callback
                  </div>
                  <div className="text-[12px] text-[var(--muted)] mt-1">
                    2 lệnh setState liên tiếp
                  </div>
                </div>
                <div className="mt-3 text-[11px] font-mono text-zinc-500 bg-zinc-100 p-1.5 rounded">
                  tick: Macrotask
                </div>
              </div>

              {/* React 18 Batch Queue */}
              <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-amber-800 uppercase mb-1 flex items-center justify-between">
                    <span>2. Batch Queue</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1 rounded font-bold">
                      React 18
                    </span>
                  </div>
                  {batchingState.updates.length === 0 ? (
                    <div className="text-[12px] text-zinc-400 italic py-2">
                      Queue trống
                    </div>
                  ) : (
                    <div className="space-y-1 mt-1">
                      {batchingState.updates.map((u, i) => (
                        <div
                          key={i}
                          className="text-[11px] font-mono bg-white p-1.5 rounded border border-amber-200 text-amber-950 font-medium"
                        >
                          + {u.setter}({u.payload})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[11px] text-amber-800 font-sans">
                  Gom vào 1 Microtask tick
                </div>
              </div>

              {/* Re-render Result */}
              <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-emerald-800 uppercase mb-1">
                    3. Kết quả Render
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl font-bold text-emerald-900">
                      {batchingState.renderCount}
                    </span>
                    <span className="text-[12px] text-emerald-800 font-medium">lần re-render</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">
                    (React 17 cũ sẽ tốn <strong>{batchingState.renderCount > 1 ? 3 : 1}</strong> lần!)
                  </div>
                </div>
                <div className="mt-2 text-[11px] font-mono text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> DOM update: 1 lần duy nhất
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] text-[12px] text-[var(--muted)]">
              <span className="font-bold text-[var(--foreground)]">Ghi chú:</span> {batchingState.note}
            </div>
          </div>
        ) : (
          /* CASE 4: DUAL BUFFERING (CURRENT TREE VS WORK-IN-PROGRESS TREE) */
          <div className="w-full grid grid-cols-1 md:grid-cols-11 gap-3 items-stretch max-w-4xl mx-auto">
            {/* Left: Current Tree (Mounted to DOM) */}
            <div className="md:col-span-5 rounded-xl border-2 border-dashed border-emerald-300/80 bg-emerald-50/20 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 mb-2.5">
                  <span className="text-[13px] font-mono font-bold text-emerald-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    Current Fiber Tree
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    root.current ➔ DOM
                  </span>
                </div>

                {/* Tree Nodes */}
                <div className="space-y-1.5">
                  {currentTree.map((node) => (
                    <div
                      key={node.id}
                      className="p-2 rounded-lg bg-[var(--card)] border border-emerald-200 text-[12px] flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-emerald-700 font-bold">{node.name}</span>
                        {node.props.count !== undefined && (
                          <span className="text-[11px] text-zinc-500">
                            (count: {node.props.count})
                          </span>
                        )}
                        {node.props.text && (
                          <span className="text-[11px] text-zinc-500">
                            &quot;{node.props.text}&quot;
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                        {node.flags || 'NoFlags'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-[11px] font-mono text-emerald-800 text-center bg-emerald-100/60 p-1.5 rounded-lg">
                Đang hiển thị trên màn hình người dùng
              </div>
            </div>

            {/* Middle: Diffing & Pointer Swap Channel */}
            <div className="md:col-span-1 flex md:flex-col items-center justify-center gap-2 py-2">
              {phase === 'renderPhase' ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center animate-spin">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-800 font-bold mt-1">
                    Diffing
                  </span>
                </div>
              ) : phase === 'commitPhase' ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs animate-bounce">
                    <GitCommit className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold mt-1">
                    Pointer Swap!
                  </span>
                </div>
              ) : (
                <div className="text-[11px] text-zinc-400 font-mono text-center">
                  ⇄
                </div>
              )}
            </div>

            {/* Right: WorkInProgress Tree (In RAM) */}
            <div className="md:col-span-5 rounded-xl border-2 border-dashed border-amber-300/80 bg-amber-50/20 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 mb-2.5">
                  <span className="text-[13px] font-mono font-bold text-amber-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-700" />
                    WorkInProgress Tree
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    V8 RAM Buffer
                  </span>
                </div>

                {/* Tree Nodes */}
                {workInProgressTree.length === 0 ? (
                  <div className="text-center py-8 text-[12px] text-zinc-400 italic">
                    {phase === 'commitPhase'
                      ? '✓ Đã commit và hoán đổi thành Current Tree!'
                      : 'Chưa có cập nhật ngầm. Cây này sẽ được dựng khi state thay đổi.'}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {workInProgressTree.map((node) => {
                      const isActive = node.id === activeFiberId;
                      const isModified = node.isModified;
                      return (
                        <div
                          key={node.id}
                          className={`p-2 rounded-lg border text-[12px] flex items-center justify-between transition-all ${
                            isActive
                              ? 'bg-amber-100/80 border-amber-400 shadow-2xs ring-1 ring-amber-300'
                              : isModified
                              ? 'bg-amber-50 border-amber-300 text-amber-950'
                              : 'bg-[var(--card)] border-[var(--border-subtle)] text-[var(--foreground)]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="font-bold">{node.name}</span>
                            {node.props.count !== undefined && (
                              <span className="text-[11px] font-bold text-amber-900">
                                (count: {node.props.count})
                              </span>
                            )}
                            {node.props.text && (
                              <span className="text-[11px] font-semibold text-amber-900">
                                &quot;{node.props.text}&quot;
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              node.flags === 'Update'
                                ? 'bg-amber-200 text-amber-900 border border-amber-300'
                                : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            flags: {node.flags || 'NoFlags'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {commitAction ? (
                <div className="mt-3 text-[11px] font-mono text-emerald-900 font-bold text-center bg-emerald-100 p-1.5 rounded-lg border border-emerald-300">
                  {commitAction}
                </div>
              ) : (
                <div className="mt-3 text-[11px] font-mono text-amber-800 text-center bg-amber-100/60 p-1.5 rounded-lg">
                  Bộ nhớ ngầm — Không làm giật lag giao diện
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Quote */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono shrink-0">
        <span>Dual Buffering = 2 bộ đệm: Render ngầm trong RAM ➔ Commit 1 lần vào DOM</span>
        <span className="text-[var(--accent)] font-semibold hidden sm:inline">React 19 Reconciler</span>
      </div>
    </div>
  );
}
