'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SimulationPlayer } from '@/components/visualizer/SimulationPlayer';
import { EventLoopStage } from '@/components/visualizer/EventLoopStage';
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
  const [activeView, setActiveView] = useState<'simulation' | 'cheatsheet'>('cheatsheet');
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
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Top Header with Segmented View Switcher */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        activeTopicTitle={scenario.title}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Topic Navigation Sidebar */}
        <Sidebar
          currentTopic={currentTopic}
          onSelectTopic={(id) => {
            setIsPlaying(false);
            setCurrentTopic(id);
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {currentTopic !== 'event-loop' ? (
            <TopicRoadmapView
              topicId={currentTopic}
              onBackToEventLoop={() => setCurrentTopic('event-loop')}
            />
          ) : activeView === 'cheatsheet' ? (
            /* Dedicated Cheatsheet Mode (Matching the exact uploaded screenshot) */
            <div className="space-y-6 animate-in fade-in">
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
            /* Simulation Workbench Mode (Clean, focused 2-column layout) */
            <div className="space-y-5 animate-in fade-in">
              {/* Scenario Selection Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-2xl text-[var(--foreground)] tracking-tight">
                      {scenario.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent-border)] font-semibold text-[11px] font-mono">
                      {scenario.difficulty}
                    </span>
                  </div>
                  <p className="text-[15px] text-[var(--muted)] mt-0.5 line-clamp-1">
                    {scenario.tagline}
                  </p>
                </div>

                {/* Scenario tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--card-subtle)] border border-[var(--border-subtle)] text-[14px] font-medium">
                  {eventLoopScenarios.map((sc, idx) => {
                    const isActive = idx === selectedScenarioIndex;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => handleSelectScenario(idx)}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-mono text-[13px] ${
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

              {/* 2-Column Split Workbench */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column: Code & Thought Process (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <CodeViewer
                    code={scenario.code}
                    activeLines={currentStep.activeCodeLines}
                    scenarioTitle={`scenario-${selectedScenarioIndex + 1}.js`}
                  />

                  <ExplanationPanel
                    stepIndex={currentStepIndex}
                    totalSteps={totalSteps}
                    title={currentStep.title}
                    explanation={currentStep.explanation}
                    interviewInsight={currentStep.interviewInsight}
                  />

                  <ConsoleCard logs={currentStep.state.consoleLogs} />
                </div>

                {/* Right Column: Visual Stage & Playback Controller (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Simulation Player */}
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

                  {/* Clean Visual Stage */}
                  <EventLoopStage state={currentStep.state} />
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
