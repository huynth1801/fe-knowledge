'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SimulationPlayer } from '@/components/visualizer/SimulationPlayer';
import { EventLoopDiagramStage } from '@/components/visualizer/EventLoopDiagramStage';
import { TaskCheatsheet } from '@/components/visualizer/TaskCheatsheet';
import { ClosureStage } from '@/components/visualizer/closures/ClosureStage';
import { ClosureCheatsheet } from '@/components/visualizer/closures/ClosureCheatsheet';
import { ReactFiberStage } from '@/components/visualizer/react/ReactFiberStage';
import { ReactCheatsheet } from '@/components/visualizer/react/ReactCheatsheet';
import { NextRenderingStage } from '@/components/visualizer/nextjs/NextRenderingStage';
import { NextRenderingCheatsheet } from '@/components/visualizer/nextjs/NextRenderingCheatsheet';
import { StackingContextStage } from '@/components/visualizer/css/StackingContextStage';
import { StackingContextCheatsheet } from '@/components/visualizer/css/StackingContextCheatsheet';
import { WebVitalsStage } from '@/components/visualizer/perf/WebVitalsStage';
import { WebVitalsCheatsheet } from '@/components/visualizer/perf/WebVitalsCheatsheet';
import { DesignTokensStage } from '@/components/visualizer/design/DesignTokensStage';
import { DesignTokensCheatsheet } from '@/components/visualizer/design/DesignTokensCheatsheet';
import { WebSocketStage } from '@/components/visualizer/realtime/WebSocketStage';
import { WebSocketCheatsheet } from '@/components/visualizer/realtime/WebSocketCheatsheet';
import { TestingStage } from '@/components/visualizer/testing/TestingStage';
import { TestingCheatsheet } from '@/components/visualizer/testing/TestingCheatsheet';
import { CodeViewer } from '@/components/visualizer/CodeViewer';
import { ExplanationPanel } from '@/components/visualizer/ExplanationPanel';
import { ConsoleCard } from '@/components/visualizer/ConsoleCard';
import { PredictModal } from '@/components/visualizer/PredictModal';
import { TopicRoadmapView } from '@/components/visualizer/TopicRoadmapView';
import { eventLoopScenarios } from '@/lib/scenarios/event-loop-data';
import { closureScenarios } from '@/lib/scenarios/closure-data';
import { reactFiberScenarios } from '@/lib/scenarios/react-fiber-data';
import { nextjsRenderingScenarios } from '@/lib/scenarios/nextjs-rendering-data';
import { stackingContextScenarios } from '@/lib/scenarios/stacking-context-data';
import { webVitalsScenarios } from '@/lib/scenarios/web-vitals-data';
import { designTokensScenarios } from '@/lib/scenarios/design-tokens-data';
import { webSocketScenarios } from '@/lib/scenarios/websocket-realtime-data';
import { testingScenarios } from '@/lib/scenarios/testing-regression-data';
import { TopicId } from '@/lib/types';

export default function Home() {
  const [currentTopic, setCurrentTopic] = useState<TopicId>('event-loop');
  const [activeView, setActiveView] = useState<'simulation' | 'cheatsheet'>('simulation');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPredictModalOpen, setIsPredictModalOpen] = useState(false);

  // Active Scenarios based on topic
  const isTestingTopic = currentTopic === 'testing-visual-regression';
  const isRealtimeTopic = currentTopic === 'websocket-realtime';
  const isDesignTopic = currentTopic === 'design-tokens';
  const isVitalsTopic = currentTopic === 'core-web-vitals';
  const isCssTopic = currentTopic === 'stacking-context';
  const isNextTopic = currentTopic === 'nextjs-rendering';
  const isFiberTopic = currentTopic === 'fiber-tree';
  const isClosuresTopic = currentTopic === 'closures';

  const activeScenarios = isTestingTopic
    ? testingScenarios
    : isRealtimeTopic
    ? webSocketScenarios
    : isDesignTopic
    ? designTokensScenarios
    : isVitalsTopic
    ? webVitalsScenarios
    : isCssTopic
    ? stackingContextScenarios
    : isNextTopic
    ? nextjsRenderingScenarios
    : isFiberTopic
    ? reactFiberScenarios
    : isClosuresTopic
    ? closureScenarios
    : eventLoopScenarios;

  const scenario = activeScenarios[selectedScenarioIndex] || activeScenarios[0];
  const totalSteps = scenario.steps.length;
  const currentStep = scenario.steps[currentStepIndex] || scenario.steps[0];

  // Auto-play interval engine
  useEffect(() => {
    if (!isPlaying) return;

    const intervalDuration = Math.round(1200 / playbackSpeed);

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalDuration);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalSteps]);

  // Actions
  const handleSelectTopic = (id: TopicId) => {
    setIsPlaying(false);
    setCurrentTopic(id);
    setSelectedScenarioIndex(0);
    setCurrentStepIndex(0);
  };

  const handleSelectScenario = (index: number) => {
    setIsPlaying(false);
    setSelectedScenarioIndex(index);
    setCurrentStepIndex(0);
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleSelectStep = (step: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(step);
  };

  const handlePlayToggle = () => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const isInteractiveTopicReady =
    currentTopic === 'event-loop' ||
    currentTopic === 'closures' ||
    currentTopic === 'fiber-tree' ||
    currentTopic === 'nextjs-rendering' ||
    currentTopic === 'stacking-context' ||
    currentTopic === 'core-web-vitals' ||
    currentTopic === 'design-tokens' ||
    currentTopic === 'websocket-realtime' ||
    currentTopic === 'testing-visual-regression';

  return (
    <div className="h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Top Header with Sidebar Toggle button */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        activeTopicTitle={scenario.title}
        cheatsheetLabel={
          isTestingTopic
            ? 'Sổ tay Testing & QA'
            : isRealtimeTopic
            ? 'Sổ tay WebSocket & Viz'
            : isDesignTopic
            ? 'Sổ tay Design System'
            : isVitalsTopic
            ? 'Sổ tay Web Vitals'
            : isCssTopic
            ? 'Sổ tay 3D Z-Index'
            : isNextTopic
            ? 'Sổ tay Next.js SSR'
            : isFiberTopic
            ? 'Sổ tay React Fiber'
            : isClosuresTopic
            ? 'Sổ tay Closures'
            : 'Sổ tay Micro / Macrotask'
        }
        runtimeBadge={
          isTestingTopic
            ? 'Playwright Test Runner'
            : isRealtimeTopic
            ? 'RFC 6455 Engine'
            : isDesignTopic
            ? 'Design Tokens W3C'
            : isVitalsTopic
            ? 'Chrome CrUX'
            : isCssTopic
            ? 'Blink Compositor'
            : isNextTopic
            ? 'Next.js 16 App Router'
            : isFiberTopic
            ? 'React 19 Reconciler'
            : 'V8 Runtime'
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Topic Navigation Sidebar */}
        <Sidebar
          currentTopic={currentTopic}
          onSelectTopic={handleSelectTopic}
          isOpen={isSidebarOpen}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-hidden transition-all duration-200 ${
            activeView === 'cheatsheet' || !isInteractiveTopicReady
              ? 'overflow-y-auto p-6 sm:p-8'
              : 'p-3 sm:p-4 flex flex-col gap-2.5 h-[calc(100vh-61px)]'
          }`}
        >
          {!isInteractiveTopicReady ? (
            <div className="max-w-5xl mx-auto w-full">
              <TopicRoadmapView
                topicId={currentTopic}
                onBackToEventLoop={() => handleSelectTopic('event-loop')}
              />
            </div>
          ) : activeView === 'cheatsheet' ? (
            /* Dedicated Cheatsheet Mode */
            <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
                <div>
                  <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[var(--foreground)] tracking-tight">
                    {isTestingTopic
                      ? 'Visual Regression & E2E Testing'
                      : isRealtimeTopic
                      ? 'WebSocket Lifecycle & Data Viz Engine'
                      : isDesignTopic
                      ? 'Design Tokens & Component Architecture'
                      : isVitalsTopic
                      ? 'Core Web Vitals & Main Thread'
                      : isCssTopic
                      ? '3D Stacking Context & Z-Index'
                      : isNextTopic
                      ? 'Next.js: SSR, SSG, ISR & RSC'
                      : isFiberTopic
                      ? 'React Fiber & Reconciliation'
                      : isClosuresTopic
                      ? 'Closures & Scope Chain'
                      : 'Microtask vs Macrotask'}
                  </h1>
                  <p className="text-[17px] text-[var(--muted)] mt-1.5 leading-relaxed">
                    {isTestingTopic
                      ? 'Tài liệu cô đọng: Pixel-by-pixel Diffing, 6 Tiêu chuẩn Actionability Playwright và Testing Trophy.'
                      : isRealtimeTopic
                      ? 'Tài liệu cô đọng: Vòng đời WebSocket 101, Exponential Backoff và so sánh SVG vs Canvas vs WebGL.'
                      : isDesignTopic
                      ? 'Tài liệu cô đọng: 3 tầng Tokens, Compound Components Pattern, Storybook và kiểm thử a11y.'
                      : isVitalsTopic
                      ? 'Tài liệu cô đọng: 3 chỉ số vàng INP, LCP, CLS, kỹ thuật chia nhỏ tác vụ và bẫy phỏng vấn.'
                      : isCssTopic
                      ? 'Tài liệu cô đọng: 7 tầng phân lớp chuẩn W3C, thuộc tính kích hoạt ngầm và bẫy z-index.'
                      : isNextTopic
                      ? 'Tài liệu cô đọng: So sánh SSR, SSG, ISR, cơ chế Streaming HTML và các bẫy phỏng vấn Hydration.'
                      : isFiberTopic
                      ? 'Tài liệu cô đọng: Kiến trúc Fiber Dual Buffering, thuật toán Diffing và quy tắc Hooks.'
                      : isClosuresTopic
                      ? 'Tài liệu cô đọng: Cơ chế bộ nhớ Heap, Scope Chain và các bẫy phỏng vấn Closures.'
                      : 'Tài liệu cô đọng để ôn phỏng vấn Front-End: Event Loop chạy việc nào trước, việc nào sau.'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('simulation')}
                  className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[15px] font-semibold transition-all cursor-pointer shadow-xs shrink-0 self-start"
                >
                  Mở sân khấu mô phỏng
                </button>
              </div>

              {/* Render corresponding Cheatsheet */}
              {isTestingTopic ? (
                <TestingCheatsheet />
              ) : isRealtimeTopic ? (
                <WebSocketCheatsheet />
              ) : isDesignTopic ? (
                <DesignTokensCheatsheet />
              ) : isVitalsTopic ? (
                <WebVitalsCheatsheet />
              ) : isCssTopic ? (
                <StackingContextCheatsheet />
              ) : isNextTopic ? (
                <NextRenderingCheatsheet />
              ) : isFiberTopic ? (
                <ReactCheatsheet />
              ) : isClosuresTopic ? (
                <ClosureCheatsheet />
              ) : (
                <TaskCheatsheet />
              )}
            </div>
          ) : (
            /* 100% SINGLE-VIEWPORT WORKBENCH (No page scroll needed!) */
            <div className="flex-1 flex flex-col gap-2.5 min-h-0 w-full animate-in fade-in">
              {/* Top Compact Scenario Selection Bar */}
              <div className="flex items-center justify-between gap-3 shrink-0 pb-1 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-serif font-bold text-[18px] text-[var(--foreground)] tracking-tight">
                    {scenario.title}
                  </h1>
                  <span className="px-2 py-0.2 rounded-full bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent-border)] font-semibold text-[11px] font-mono">
                    {scenario.difficulty}
                  </span>
                  <span className="text-[13px] text-[var(--muted)] hidden md:inline">
                    • {scenario.tagline}
                  </span>
                </div>

                {/* Scenario tabs */}
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] text-[13px]">
                  {activeScenarios.map((sc, idx) => {
                    const isActive = idx === selectedScenarioIndex;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => handleSelectScenario(idx)}
                        className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer font-mono text-[12px] ${
                          isActive
                            ? 'bg-[var(--card)] text-[var(--accent)] font-bold shadow-2xs border border-[var(--border)]'
                            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                        }`}
                      >
                        Bài {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2-Column Grid filling remaining height */}
              <div className="flex-1 min-h-0 grid grid-cols-12 gap-3.5 items-stretch">
                {/* Left Column: Code (Top) + Live Console Terminal (Bottom) */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-3 min-h-0 h-full">
                  <CodeViewer
                    code={scenario.code}
                    activeLines={currentStep.activeCodeLines}
                    scenarioTitle={
                      isTestingTopic
                        ? `button.spec.ts`
                        : isRealtimeTopic
                        ? `socket-stream.ts`
                        : isDesignTopic
                        ? `tokens-schema-${selectedScenarioIndex + 1}.css`
                        : isVitalsTopic
                        ? `perf-task-${selectedScenarioIndex + 1}.js`
                        : isCssTopic
                        ? `style-${selectedScenarioIndex + 1}.css`
                        : isNextTopic
                        ? `page-${selectedScenarioIndex + 1}.tsx`
                        : isFiberTopic
                        ? `counter-app-${selectedScenarioIndex + 1}.tsx`
                        : `scenario-${selectedScenarioIndex + 1}.js`
                    }
                    className="flex-[3] min-h-[180px]"
                  />

                  <ConsoleCard
                    logs={currentStep.state.consoleLogs}
                    className="flex-[2] min-h-[140px]"
                  />
                </div>

                {/* Right Column: Player + Stage + Explanation Panel */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-3 min-h-0 h-full">
                  <SimulationPlayer
                    currentStep={currentStepIndex}
                    totalSteps={totalSteps}
                    isPlaying={isPlaying}
                    playbackSpeed={playbackSpeed}
                    onPlayToggle={handlePlayToggle}
                    onStepNext={handleStepNext}
                    onStepPrev={handleStepPrev}
                    onReset={handleReset}
                    onSelectStep={handleSelectStep}
                    onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
                    onOpenPredictModal={() => setIsPredictModalOpen(true)}
                  />

                  {/* Render Visual Stage according to Topic */}
                  {isTestingTopic ? (
                    <TestingStage
                      state={currentStep.state as any}
                      className="flex-1 min-h-0"
                    />
                  ) : isRealtimeTopic ? (
                    <WebSocketStage
                      state={currentStep.state as any}
                      className="flex-1 min-h-0"
                    />
                  ) : isDesignTopic ? (
                    <DesignTokensStage
                      state={currentStep.state as any}
                      className="flex-1 min-h-0"
                    />
                  ) : isVitalsTopic ? (
                    <WebVitalsStage
                      state={currentStep.state as any}
                      className="flex-1 min-h-0"
                    />
                  ) : isCssTopic ? (
                    <StackingContextStage
                      state={currentStep.state as any}
                      className="flex-1 min-h-0"
                    />
                  ) : isNextTopic ? (
                    <NextRenderingStage
                      state={currentStep.state as any}
                      className="flex-1 min-h-0"
                    />
                  ) : isFiberTopic ? (
                    <ReactFiberStage
                      state={currentStep.state as any}
                      className="flex-1 min-h-0"
                    />
                  ) : isClosuresTopic ? (
                    <ClosureStage
                      state={currentStep.state as any}
                      className="flex-1 min-h-0"
                    />
                  ) : (
                    <EventLoopDiagramStage
                      state={currentStep.state as any}
                      className="flex-1 min-h-0"
                    />
                  )}

                  <ExplanationPanel
                    stepIndex={currentStepIndex}
                    totalSteps={totalSteps}
                    title={currentStep.title}
                    explanation={currentStep.explanation}
                    interviewInsight={currentStep.interviewInsight}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quiz Modal */}
      <PredictModal
        scenario={scenario as any}
        isOpen={isPredictModalOpen}
        onClose={() => setIsPredictModalOpen(false)}
        onStartSimulation={() => {
          setCurrentStepIndex(0);
          setIsPlaying(true);
        }}
      />
    </div>
  );
}
