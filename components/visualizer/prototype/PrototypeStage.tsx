'use client';

import React from 'react';
import { SimulationStep } from '@/lib/types';
import { Layers, ArrowUp, CheckCircle2, XCircle, Search, Sparkles, HelpCircle } from 'lucide-react';

interface PrototypeStageProps {
  currentStep: SimulationStep;
  scenarioIndex?: number;
}

export function PrototypeStage({ currentStep, scenarioIndex = 0 }: PrototypeStageProps) {
  const stepIdx = currentStep.stepIndex;

  // Scenario 1: Chain Delegation
  const isScenario1 = scenarioIndex === 0;

  return (
    <div className="flex-1 bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shadow-2xs">
      {/* Stage Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#BD5332] flex items-center justify-center font-bold text-xs shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[15px] text-zinc-900 leading-none">
              {isScenario1 ? 'Sơ đồ tháp Prototype Chain & Delegation' : 'Bản đồ Call-Site & Ngữ cảnh "this"'}
            </h3>
            <span className="text-[12px] text-zinc-500 font-medium">
              {isScenario1
                ? 'Con trỏ [[Prototype]] leo thang theo thứ tự tìm kiếm thuộc tính'
                : 'Cách thức V8 phân giải từ khoá "this" dựa trên vị trí gọi hàm'}
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-mono font-bold">
          Bước {stepIdx + 1}/6
        </span>
      </div>

      {isScenario1 ? (
        /* ========================================================================= */
        /* SCENARIO 1: PROTOTYPE CHAIN LADDER VISUALIZATION                         */
        /* ========================================================================= */
        <div className="py-4 flex flex-col items-center justify-center space-y-3 max-w-lg mx-auto w-full">
          {/* Level 4: Terminus (null) */}
          <div
            className={`w-full max-w-md p-3 rounded-xl border transition-all text-center ${
              stepIdx === 5
                ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 shadow-xs'
                : 'bg-zinc-50 border-zinc-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                Đỉnh chuỗi kế thừa
              </span>
              <span className="text-xs font-mono font-bold text-zinc-600">null</span>
            </div>
            {stepIdx === 5 && (
              <div className="mt-1 text-[12px] text-rose-700 font-medium flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>dog.fly không tìm thấy trong chuỗi ➔ undefined</span>
              </div>
            )}
          </div>

          {/* Pointer Arrow 3 */}
          <div className="flex items-center justify-center text-zinc-400">
            <ArrowUp className={`w-4 h-4 ${stepIdx >= 4 ? 'text-[#BD5332] animate-bounce' : ''}`} />
            <span className="text-[10px] font-mono text-zinc-500 ml-1">Object.prototype.__proto__</span>
          </div>

          {/* Level 3: Object.prototype */}
          <div
            className={`w-full max-w-md p-3.5 rounded-xl border transition-all shadow-2xs ${
              stepIdx === 4
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100">
              <span className="text-[12px] font-mono font-bold text-zinc-900">
                Object.prototype
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                Built-in Root
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2 text-[12px] font-mono">
              <span className={`p-1 rounded ${stepIdx === 4 ? 'bg-emerald-200/60 font-bold text-emerald-950' : 'text-zinc-600'}`}>
                toString()
              </span>
              <span className="text-zinc-500 p-1">hasOwnProperty()</span>
              <span className="text-zinc-500 p-1">valueOf()</span>
              <span className="text-zinc-500 p-1">isPrototypeOf()</span>
            </div>
          </div>

          {/* Pointer Arrow 2 */}
          <div className="flex items-center justify-center text-zinc-400">
            <ArrowUp className={`w-4 h-4 ${stepIdx >= 3 ? 'text-[#BD5332] animate-bounce' : ''}`} />
            <span className="text-[10px] font-mono text-zinc-500 ml-1">animal.__proto__</span>
          </div>

          {/* Level 2: animal */}
          <div
            className={`w-full max-w-md p-3.5 rounded-xl border transition-all shadow-2xs ${
              stepIdx === 3
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[13px] font-mono font-bold text-zinc-900">animal</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                Prototype Object
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-[12px] font-mono">
              <span className="text-zinc-600">isAlive: true</span>
              <span className={`p-1 rounded ${stepIdx === 3 ? 'bg-emerald-200/60 font-bold text-emerald-950' : 'text-zinc-600'}`}>
                eat(): Function
              </span>
            </div>
          </div>

          {/* Pointer Arrow 1 */}
          <div className="flex items-center justify-center text-zinc-400">
            <ArrowUp className={`w-4 h-4 ${stepIdx >= 2 ? 'text-[#BD5332] animate-bounce' : ''}`} />
            <span className="text-[10px] font-mono text-zinc-500 ml-1">dog.__proto__ (Object.create)</span>
          </div>

          {/* Level 1: dog Instance */}
          <div
            className={`w-full max-w-md p-3.5 rounded-xl border transition-all shadow-2xs ${
              stepIdx === 2
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#BD5332]" />
                <span className="text-[13px] font-mono font-bold text-zinc-900">dog</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                Instance (Own Properties)
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[12px] font-mono">
              <span className={`p-1 rounded ${stepIdx === 2 ? 'bg-amber-200/60 font-bold text-amber-950' : 'text-zinc-600'}`}>
                breed: 'Golden'
              </span>
              <span className="text-zinc-400 italic text-[11px]">(không có hàm eat hay toString)</span>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* SCENARIO 2: THIS BINDING VISUALIZATION                                   */
        /* ========================================================================= */
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
          {/* Card 1: Implicit Binding */}
          <div
            className={`p-4 rounded-xl border transition-all shadow-2xs ${
              stepIdx === 1 ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="font-bold text-sm text-zinc-900">1. Implicit Binding</h4>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                user.regular()
              </span>
            </div>
            <p className="text-[13px] text-zinc-600 mt-2">
              Đối tượng đứng trước dấu chấm tại thời điểm gọi là <code className="font-bold text-zinc-900">user</code>.
            </p>
            <div className="mt-3 p-2 rounded-lg bg-zinc-100 font-mono text-xs">
              this = <span className="text-emerald-700 font-bold">{'{ name: "Alex" }'}</span>
            </div>
          </div>

          {/* Card 2: Detached Binding */}
          <div
            className={`p-4 rounded-xl border transition-all shadow-2xs ${
              stepIdx === 2 ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="font-bold text-sm text-zinc-900">2. Mất binding (Detached)</h4>
              <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                fn()
              </span>
            </div>
            <p className="text-[13px] text-zinc-600 mt-2">
              Gọi hàm độc lập không có dấu chấm. Áp dụng Default Binding.
            </p>
            <div className="mt-3 p-2 rounded-lg bg-zinc-100 font-mono text-xs">
              this = <span className="text-rose-700 font-bold">undefined (strict) / window</span>
            </div>
          </div>

          {/* Card 3: Explicit Binding */}
          <div
            className={`p-4 rounded-xl border transition-all shadow-2xs ${
              stepIdx === 3 ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="font-bold text-sm text-zinc-900">3. Explicit Binding</h4>
              <span className="text-[11px] font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                fn.call(Taylor)
              </span>
            </div>
            <p className="text-[13px] text-zinc-600 mt-2">
              Ép buộc ngữ cảnh bằng <code className="font-bold">call / apply / bind</code>.
            </p>
            <div className="mt-3 p-2 rounded-lg bg-zinc-100 font-mono text-xs">
              this = <span className="text-blue-700 font-bold">{'{ name: "Taylor" }'}</span>
            </div>
          </div>

          {/* Card 4: Arrow Function */}
          <div
            className={`p-4 rounded-xl border transition-all shadow-2xs ${
              stepIdx === 4 ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-200' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="font-bold text-sm text-zinc-900">4. Arrow Function</h4>
              <span className="text-[11px] font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                user.arrow()
              </span>
            </div>
            <p className="text-[13px] text-zinc-600 mt-2">
              Arrow function không có this riêng, nó kế thừa Lexical this của môi trường ngoài (Global).
            </p>
            <div className="mt-3 p-2 rounded-lg bg-zinc-100 font-mono text-xs">
              this = <span className="text-purple-700 font-bold">window / global</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Insight Box */}
      <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
        <span className="font-semibold text-zinc-800">Quy tắc vàng Strong Middle:</span>
        <span className="font-mono text-[#BD5332] font-semibold">
          {isScenario1
            ? 'dog.__proto__ === animal && animal.__proto__ === Object.prototype'
            : 'Call-site determines this, except for Arrow functions (lexical)'}
        </span>
      </div>
    </div>
  );
}
