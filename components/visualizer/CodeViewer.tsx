'use client';

import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  activeLines: number[];
  scenarioTitle?: string;
}

export function CodeViewer({ code, activeLines, scenarioTitle }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[#1F1E1D] text-[#EBE6DE] overflow-hidden flex flex-col shadow-xs">
      {/* Code Header */}
      <div className="px-4 py-2.5 bg-[#2A2826] border-b border-[#3B3835] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-xs font-mono font-medium text-[#D1CCC4]">
            {scenarioTitle || 'script.js'}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded bg-[#363330] hover:bg-[#433F3B] text-[#BFB8AE] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Đã sao chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Sao chép</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3 font-mono text-xs overflow-x-auto leading-relaxed">
        {lines.map((lineText, idx) => {
          const lineNumber = idx + 1;
          const isActive = activeLines.includes(lineNumber);

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                isActive
                  ? 'bg-[var(--accent)]/20 text-[#FFF5EB] border-l-2 border-[var(--accent)] -ml-[2px] font-semibold'
                  : 'text-[#C9C3B9] hover:bg-[#282624]'
              }`}
            >
              {/* Line number */}
              <span
                className={`w-6 shrink-0 text-right select-none text-[11px] ${
                  isActive ? 'text-[var(--accent)] font-bold' : 'text-[#69645E]'
                }`}
              >
                {lineNumber}
              </span>

              {/* Line text */}
              <pre className="flex-1 font-mono">{lineText || ' '}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
