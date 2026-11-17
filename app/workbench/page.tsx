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
import { PrototypeStage } from '@/components/visualizer/prototype/PrototypeStage';
import { PrototypeCheatsheet } from '@/components/visualizer/prototype/PrototypeCheatsheet';
import { ReactRerenderStage } from '@/components/visualizer/react/ReactRerenderStage';
import { ReactRerenderCheatsheet } from '@/components/visualizer/react/ReactRerenderCheatsheet';
import { HttpCacheCheatsheet } from '@/components/visualizer/cache/HttpCacheCheatsheet';
import { StateManagementCheatsheet } from '@/components/visualizer/state/StateManagementCheatsheet';
import { CiCdCheatsheet } from '@/components/visualizer/cicd/CiCdCheatsheet';
import { BundleOptimizationCheatsheet } from '@/components/visualizer/perf/BundleOptimizationCheatsheet';
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
import { prototypeScenarios } from '@/lib/scenarios/prototype-chain-data';
import { reactRerenderScenarios } from '@/lib/scenarios/react-rerender-data';
import { curriculumCategories } from '@/lib/curriculum';
import { TopicId } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function WorkbenchContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic') as TopicId | null;
  const viewParam = searchParams.get('view') as ('simulation' | 'cheatsheet') | null;

  // Meta lookup
  const allTopics = curriculumCategories.flatMap((c) => c.topics);

  const [currentTopic, setCurrentTopic] = useState<TopicId>(topicParam || 'event-loop');
  const [activeView, setActiveView] = useState<'simulation' | 'cheatsheet'>(viewParam || 'cheatsheet');

  useEffect(() => {
    if (topicParam) {
      setCurrentTopic(topicParam);
      const targetMeta = allTopics.find((t) => t.id === topicParam);
      if (targetMeta && !targetMeta.hasSimulation) {
        setActiveView('cheatsheet');
      }
    }
    if (viewParam) {
      setActiveView(viewParam);
    }
  }, [topicParam, viewParam, allTopics]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPredictModalOpen, setIsPredictModalOpen] = useState(false);

  const currentTopicMeta = allTopics.find((t) => t.id === currentTopic);
  const hasSimulation = currentTopicMeta?.hasSimulation ?? true;

  // Active Scenarios based on topic
  const isPrototypeTopic = currentTopic === 'prototype';
  const isRerenderTopic = currentTopic === 'react-re-renders';
  const isStateMgmtTopic = currentTopic === 'state-management';
  const isHttpCacheTopic = currentTopic === 'http-cache';
  const isCiCdTopic = currentTopic === 'cicd-github-actions';
  const isTestingTopic = currentTopic === 'testing-visual-regression';
  const isRealtimeTopic = currentTopic === 'websocket-realtime';
  const isDesignTopic = currentTopic === 'design-tokens';
  const isVitalsTopic = currentTopic === 'core-web-vitals';
  const isBundleOptTopic = currentTopic === 'bundle-optimization';
  const isCssTopic = currentTopic === 'stacking-context';
  const isNextTopic = currentTopic === 'nextjs-rendering';
  const isFiberTopic = currentTopic === 'fiber-tree';
  const isClosuresTopic = currentTopic === 'closures';

  const activeScenarios = isPrototypeTopic
    ? prototypeScenarios
    : isRerenderTopic
    ? reactRerenderScenarios
    : isTestingTopic
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

    const targetMeta = allTopics.find((t) => t.id === id);
    if (targetMeta && !targetMeta.hasSimulation) {
      setActiveView('cheatsheet');
    }
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

  const isInteractiveTopicReady = currentTopicMeta?.isReady ?? false;

  return (
    <div className="h-screen flex flex-col bg-white text-zinc-900 overflow-hidden font-sans">
      {/* Top Header matching pen.dev layout */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenPredictModal={() => setIsPredictModalOpen(true)}
        hasSimulation={hasSimulation}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Topic Navigation Sidebar matching pen.dev */}
        <Sidebar
          currentTopic={currentTopic}
          onSelectTopic={handleSelectTopic}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-200 ${
            activeView === 'cheatsheet' || !hasSimulation || !isInteractiveTopicReady
              ? 'overflow-y-auto p-4 sm:p-6 md:p-8 bg-white'
              : 'p-2.5 sm:p-4 flex flex-col gap-2.5 h-auto lg:h-[calc(100vh-53px)] overflow-y-auto lg:overflow-hidden bg-[#FAF8F5]'
          }`}
        >
          {!isInteractiveTopicReady ? (
            <section className="wrap max-w-5xl mx-auto w-full">
              <TopicRoadmapView
                topicId={currentTopic}
                onBackToEventLoop={() => handleSelectTopic('event-loop')}
              />
            </section>
          ) : activeView === 'cheatsheet' || !hasSimulation ? (
            /* Dedicated Cheatsheet Mode matching pen.dev design */
            <section className="wrap max-w-4xl mx-auto w-full space-y-6 animate-in fade-in" aria-label="Nội dung bài học">
              {/* Render corresponding Cheatsheet */}
              {currentTopic === 'event-loop' ? (
                <TaskCheatsheet />
              ) : isPrototypeTopic ? (
                <PrototypeCheatsheet />
              ) : isRerenderTopic ? (
                <ReactRerenderCheatsheet />
              ) : isStateMgmtTopic ? (
                <StateManagementCheatsheet />
              ) : isHttpCacheTopic ? (
                <HttpCacheCheatsheet />
              ) : isBundleOptTopic ? (
                <BundleOptimizationCheatsheet />
              ) : isCiCdTopic ? (
                <CiCdCheatsheet />
              ) : isNextTopic ? (
                <NextRenderingCheatsheet />
              ) : isFiberTopic ? (
                <ReactCheatsheet />
              ) : isClosuresTopic ? (
                <ClosureCheatsheet />
              ) : isCssTopic ? (
                <StackingContextCheatsheet />
              ) : isVitalsTopic ? (
                <WebVitalsCheatsheet />
              ) : isDesignTopic ? (
                <DesignTokensCheatsheet />
              ) : isRealtimeTopic ? (
                <WebSocketCheatsheet />
              ) : isTestingTopic ? (
                <TestingCheatsheet />
              ) : (
                <TaskCheatsheet />
              )}
            </section>
          ) : (
            /* 100% SINGLE-VIEWPORT WORKBENCH on desktop, fluid vertical scroll on mobile */
            <div className="flex flex-col gap-3 w-full lg:flex-1 lg:min-h-0 animate-in fade-in">
              {/* Top Compact Scenario Selection Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0 pb-1.5 border-b border-zinc-200">
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="font-serif font-bold text-[16px] sm:text-[18px] text-zinc-900 tracking-tight truncate">
                    {scenario.title}
                  </h1>
                  <span className="px-2 py-0.2 rounded-full bg-orange-50 text-[#CC6745] border border-orange-200 font-semibold text-[10px] sm:text-[11px] font-mono shrink-0">
                    {scenario.difficulty}
                  </span>
                  <span className="text-[13px] text-zinc-500 hidden md:inline truncate">
                    • {scenario.tagline}
                  </span>
                </div>

                {/* Scenario tabs */}
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-zinc-100 border border-zinc-200 text-[12px] sm:text-[13px] overflow-x-auto max-w-full shrink-0">
                  {activeScenarios.map((sc, idx) => {
                    const isActive = idx === selectedScenarioIndex;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => handleSelectScenario(idx)}
                        className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer font-mono text-[11px] sm:text-[12px] shrink-0 ${
                          isActive
                            ? 'bg-white text-[#CC6745] font-bold shadow-2xs border border-zinc-200'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        Bài {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2-Column Grid (Responsive: Mobile stacked with Player/Stage first, Desktop side-by-side) */}
              <div className="flex flex-col gap-3.5 items-stretch lg:grid lg:grid-cols-12 lg:flex-1 lg:min-h-0">
                {/* Stage + Player Column (Top on Mobile, Right on Desktop) */}
                <div className="w-full flex flex-col gap-3 shrink-0 lg:shrink lg:col-span-7 lg:h-full lg:min-h-0 order-1 lg:order-2">
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
                  {isRealtimeTopic ? (
                    <WebSocketStage
                      state={currentStep.state as any}
                      className="h-auto min-h-[300px] lg:flex-1 lg:min-h-0"
                    />
                  ) : isVitalsTopic ? (
                    <WebVitalsStage
                      state={currentStep.state as any}
                      className="h-auto min-h-[300px] lg:flex-1 lg:min-h-0"
                    />
                  ) : isCssTopic ? (
                    <StackingContextStage
                      state={currentStep.state as any}
                      className="h-auto min-h-[300px] lg:flex-1 lg:min-h-0"
                    />
                  ) : isNextTopic ? (
                    <NextRenderingStage
                      state={currentStep.state as any}
                      className="h-auto min-h-[300px] lg:flex-1 lg:min-h-0"
                    />
                  ) : isFiberTopic ? (
                    <ReactFiberStage
                      state={currentStep.state as any}
                      className="h-auto min-h-[300px] lg:flex-1 lg:min-h-0"
                    />
                  ) : isRerenderTopic ? (
                    <ReactRerenderStage
                      currentStep={currentStep as any}
                      scenarioIndex={selectedScenarioIndex}
                    />
                  ) : isPrototypeTopic ? (
                    <PrototypeStage
                      currentStep={currentStep as any}
                      scenarioIndex={selectedScenarioIndex}
                    />
                  ) : isClosuresTopic ? (
                    <ClosureStage
                      state={currentStep.state as any}
                      className="h-auto min-h-[300px] lg:flex-1 lg:min-h-0"
                    />
                  ) : (
                    <EventLoopDiagramStage
                      state={currentStep.state as any}
                      className="h-auto min-h-[300px] lg:flex-1 lg:min-h-0"
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

                {/* Code + Console Column (Bottom on Mobile, Left on Desktop) */}
                <div className="w-full flex flex-col gap-3 shrink-0 lg:shrink lg:col-span-5 lg:h-full lg:min-h-0 order-2 lg:order-1">
                  <CodeViewer
                    code={scenario.code}
                    activeLines={currentStep.activeCodeLines}
                    scenarioTitle={
                      isRealtimeTopic
                        ? `socket-stream.ts`
                        : isPrototypeTopic
                        ? `prototype-chain-${selectedScenarioIndex + 1}.js`
                        : isRerenderTopic
                        ? `re-render-tree-${selectedScenarioIndex + 1}.tsx`
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
                    className="min-h-[220px] max-h-[360px] lg:max-h-none lg:flex-[3]"
                  />

                  <ConsoleCard
                    logs={currentStep.state.consoleLogs}
                    className="min-h-[160px] max-h-[240px] lg:max-h-none lg:flex-[2]"
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

export default function WorkbenchPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white text-zinc-500 font-mono text-sm">Loading Workbench...</div>}>
      <WorkbenchContent />
    </Suspense>
  );
}
