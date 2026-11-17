'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SimulationPlayer } from '@/components/visualizer/SimulationPlayer';
import { EventLoopDiagramStage } from '@/components/visualizer/EventLoopDiagramStage';
import { TaskCheatsheet } from '@/components/visualizer/TaskCheatsheet';
import { CodeViewer } from '@/components/visualizer/CodeViewer';
import { ExplanationPanel } from '@/components/visualizer/ExplanationPanel';
import { ConsoleCard } from '@/components/visualizer/ConsoleCard';
import { PredictModal } from '@/components/visualizer/PredictModal';
import { TopicRoadmapView } from '@/components/visualizer/TopicRoadmapView';
import { eventLoopScenarios } from '@/lib/scenarios/event-loop-data';
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

  const scenario = eventLoopScenarios[selectedScenarioIndex];
  const totalSteps = scenario.steps.length;
  const currentStep = scenario.steps[currentStepIndex];

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

  return (
    <div className="h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Top Header with Sidebar Toggle button */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        activeTopicTitle={scenario.title}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Topic Navigation Sidebar */}
        <Sidebar
          currentTopic={currentTopic}
          onSelectTopic={(id) => {
            setIsPlaying(false);
            setCurrentTopic(id);
          }}
          isOpen={isSidebarOpen}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-hidden transition-all duration-200 ${
            activeView === 'cheatsheet' || currentTopic !== 'event-loop'
              ? 'overflow-y-auto p-6 sm:p-8'
              : 'p-3 sm:p-4 flex flex-col gap-2.5 h-[calc(100vh-61px)]'
          }`}
        >
          {currentTopic !== 'event-loop' ? (
            <div className="max-w-5xl mx-auto w-full">
              <TopicRoadmapView
                topicId={currentTopic}
                onBackToEventLoop={() => setCurrentTopic('event-loop')}
              />
            </div>
          ) : activeView === 'cheatsheet' ? (
            /* Dedicated Cheatsheet Mode */
            <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in">
              {/* Header Title & CTA Button */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
                <div>
                  <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[var(--foreground)] tracking-tight">
                    Microtask vs Macrotask
                  </h1>
                  <p className="text-[17px] text-[var(--muted)] mt-1.5 leading-relaxed">
                    Tài liệu cô đọng để ôn phỏng vấn Front-End: Event Loop chạy việc nào trước, việc nào sau.
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('simulation')}
                  className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[15px] font-semibold transition-all cursor-pointer shadow-xs shrink-0 self-start"
                >
                  Mở sân khấu mô phỏng
                </button>
              </div>

              {/* Cheatsheet Component */}
              <TaskCheatsheet />
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
                  {eventLoopScenarios.map((sc, idx) => {
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
                  {/* Code Viewer */}
                  <CodeViewer
                    code={scenario.code}
                    activeLines={currentStep.activeCodeLines}
                    scenarioTitle={`scenario-${selectedScenarioIndex + 1}.js`}
                    className="flex-[3] min-h-[180px]"
                  />

                  {/* Console Terminal: always visible! */}
                  <ConsoleCard
                    logs={currentStep.state.consoleLogs}
                    className="flex-[2] min-h-[140px]"
                  />
                </div>

                {/* Right Column: Player + Event Loop Stage + Explanation Panel */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-3 min-h-0 h-full">
                  {/* Player Controller Bar */}
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

                  {/* Visual Event Loop Architecture Diagram */}
                  <EventLoopDiagramStage
                    state={currentStep.state}
                    className="flex-1 min-h-0"
                  />

                  {/* Step Explanation & Interview Tip */}
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
        scenario={scenario}
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
