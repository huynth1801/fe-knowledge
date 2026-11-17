'use client';

import React, { useState } from 'react';
import { SimulationStep } from '@/lib/types';
import { Zap, ShieldCheck, RefreshCw, Layers, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

interface ReactRerenderStageProps {
  currentStep: SimulationStep;
  scenarioIndex?: number;
}

export function ReactRerenderStage({ currentStep, scenarioIndex = 0 }: ReactRerenderStageProps) {
  const stepIdx = currentStep.stepIndex;
  const isScenario1 = scenarioIndex === 0;

  // Interactive Live Playground State
  const [interactiveCount, setInteractiveCount] = useState(0);
  const [isMemoEnabled, setIsMemoEnabled] = useState(!isScenario1);
  const [parentRenderCount, setParentRenderCount] = useState(1);
  const [childExpensiveRenderCount, setChildExpensiveRenderCount] = useState(1);
  const [childSimpleRenderCount, setChildSimpleRenderCount] = useState(1);
  const [lastAction, setLastAction] = useState<string>('Khởi tạo ban đầu');

  const handleTriggerRender = () => {
    setInteractiveCount((c) => c + 1);
    setParentRenderCount((c) => c + 1);

    if (isMemoEnabled) {
      // With memo, ChildExpensive bails out!
      setLastAction('Parent re-render. ChildExpensive được React.memo bảo vệ (Bailout)!');
    } else {
      // Without memo, whole subtree re-renders
      setChildExpensiveRenderCount((c) => c + 1);
      setChildSimpleRenderCount((c) => c + 1);
      setLastAction('Parent re-render kéo theo TOÀN BỘ con re-render!');
    }
  };

  const handleReset = () => {
    setInteractiveCount(0);
    setParentRenderCount(1);
    setChildExpensiveRenderCount(1);
    setChildSimpleRenderCount(1);
    setLastAction('Đã reset cây component');
  };

  return (
    <div className="flex-1 bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#BD5332] flex items-center justify-center font-bold text-xs shadow-2xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[15px] text-zinc-900 leading-none">
              {isScenario1
                ? 'Mô phỏng Re-render Blast Radius (Không có Memo)'
                : 'Mô phỏng Cơ chế Bailout với React.memo & useCallback'}
            </h3>
            <span className="text-[12px] text-zinc-500 font-medium">
              Quan sát sự lan truyền re-render qua các tầng Virtual DOM
            </span>
          </div>
        </div>

        {/* Live Playground Quick Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMemoEnabled(!isMemoEnabled)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-colors border cursor-pointer ${
              isMemoEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-zinc-100 text-zinc-700 border-zinc-300'
            }`}
          >
            {isMemoEnabled ? '🛡️ React.memo: BẬT' : '⚠️ React.memo: TẮT'}
          </button>
        </div>
      </div>

      {/* Interactive Trigger Bar */}
      <div className="my-3 p-3 rounded-xl bg-[#FBF9F5] border border-zinc-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerRender}
            className="px-3.5 py-1.5 rounded-lg bg-[#BD5332] hover:bg-[#A84526] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Click setCount({interactiveCount + 1})</span>
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium cursor-pointer"
          >
            Reset
          </button>
        </div>

        <div className="text-xs font-mono text-zinc-600">
          <span className="font-bold text-zinc-800">Sự kiện:</span> {lastAction}
        </div>
      </div>

      {/* Component Tree Visual Representation */}
      <div className="py-4 flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto w-full">
        {/* Level 0: Parent Node */}
        <div className="w-full max-w-sm p-4 rounded-2xl border-2 border-[#BD5332] bg-orange-50/50 shadow-xs text-center space-y-1 relative">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-200 text-[#BD5332] font-bold uppercase tracking-wider">
            Root Component
          </span>
          <h4 className="font-mono font-bold text-sm text-zinc-900">&lt;Parent /&gt;</h4>
          <div className="flex items-center justify-center gap-3 text-xs font-mono text-zinc-700 pt-1">
            <span>state: count = {interactiveCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-orange-200 font-bold text-[#BD5332]">
              Renders: {parentRenderCount}
            </span>
          </div>
        </div>

        {/* Tree Connectors */}
        <div className="w-48 h-6 border-b-2 border-l-2 border-r-2 border-zinc-300 rounded-b-xl" />

        {/* Level 1: Children Subtree */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* Child 1: Expensive List */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all shadow-xs space-y-1.5 text-center ${
              isMemoEnabled
                ? 'border-emerald-400 bg-emerald-50/50'
                : 'border-amber-400 bg-amber-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Child A</span>
              {isMemoEnabled ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" /> Bailout
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-bold">
                  Re-rendered
                </span>
              )}
            </div>

            <h4 className="font-mono font-bold text-sm text-zinc-900">&lt;ChildExpensiveList /&gt;</h4>
            <p className="text-[11px] text-zinc-600">
              {isMemoEnabled
                ? 'Props giữ nguyên tham chiếu ➔ Bỏ qua tính toán!'
                : 'Tính toán lại filter 5,000 items (CPU Waste)'}
            </p>

            <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-center gap-2 text-xs font-mono">
              <span className="text-zinc-600">Tổng Render:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  isMemoEnabled ? 'bg-emerald-200 text-emerald-950' : 'bg-amber-200 text-amber-950'
                }`}
              >
                {childExpensiveRenderCount}
              </span>
            </div>
          </div>

          {/* Child 2: Simple Display */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all shadow-xs space-y-1.5 text-center ${
              isMemoEnabled
                ? 'border-emerald-400 bg-emerald-50/50'
                : 'border-zinc-300 bg-zinc-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Child B</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 font-medium">
                title="Footer"
              </span>
            </div>

            <h4 className="font-mono font-bold text-sm text-zinc-900">&lt;ChildSimpleDisplay /&gt;</h4>
            <p className="text-[11px] text-zinc-600">
              {isMemoEnabled ? 'Giữ nguyên DOM cũ' : 'Bị gọi lại đệ quy theo Parent'}
            </p>

            <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-center gap-2 text-xs font-mono">
              <span className="text-zinc-600">Tổng Render:</span>
              <span className="font-bold px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                {childSimpleRenderCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
        <span className="font-semibold text-zinc-800">Bài học Strong Middle:</span>
        <span className="font-mono text-[#BD5332] font-semibold">
          {isMemoEnabled
            ? 'React.memo + useCallback = Zero wasted re-renders'
            : 'Mặc định state thay đổi làm re-render toàn bộ cây con'}
        </span>
      </div>
    </div>
  );
}
