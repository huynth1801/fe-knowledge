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
import { Code, Flame } from 'lucide-react';

export default function Home() {
  const [currentTopic, setCurrentTopic] = useState<TopicId>('event-loop');
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

    // Interval time based on speed: 1x = 1200ms, 1.5x = 800ms, 2x = 600ms, 0.5x = 2400ms
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
      {/* Top Bar */}
      <Header
        activeTopicTitle={
          currentTopic === 'event-loop' ? scenario.title : currentTopic
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTopic={currentTopic}
          onSelectTopic={(id) => {
            setIsPlaying(false);
            setCurrentTopic(id);
          }}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {currentTopic !== 'event-loop' ? (
            <TopicRoadmapView
              topicId={currentTopic}
              onBackToEventLoop={() => setCurrentTopic('event-loop')}
            />
          ) : (
            <>
              {/* Header Title Section */}
              <div className="space-y-3 pb-2 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent-border)] font-semibold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-[var(--accent)]" /> Phỏng vấn HOT
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]">
                    Độ khó: <strong>{scenario.difficulty}</strong>
                  </span>
                  <span className="text-[var(--muted)]">•</span>
                  <span className="text-[var(--muted)]">{scenario.tagline}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--foreground)] tracking-tight">
                      {scenario.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-[var(--muted)] mt-1 max-w-3xl leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>
                </div>

                {/* Scenario Tabs Bar */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {eventLoopScenarios.map((sc, idx) => {
                    const isActive = idx === selectedScenarioIndex;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => handleSelectScenario(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                          isActive
                            ? 'bg-[var(--card)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-xs'
                            : 'bg-[var(--card-subtle)] border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--foreground)]'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-[var(--border)] text-[10px] flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span>{sc.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

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

              {/* Interactive Simulation Stage (Event Loop / Call Stack / Queues) */}
              <EventLoopStage state={currentStep.state} />

              {/* Cheatsheet: What are Microtasks & Macrotasks & Lifecycle */}
              <TaskCheatsheet />

              {/* Bottom Grid: Code Sync + Explanation + Console Output */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Code Viewer (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)]">
                    <span className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                      <Code className="w-4 h-4 text-[var(--accent)]" /> Mã nguồn đồng bộ theo step
                    </span>
                    <span className="text-[11px]">Dòng thực thi tô màu viền cam</span>
                  </div>
                  <CodeViewer
                    code={scenario.code}
                    activeLines={currentStep.activeCodeLines}
                    scenarioTitle={`scenario-${selectedScenarioIndex + 1}.js`}
                  />
                </div>

                {/* Right: Explanation & Console (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <ExplanationPanel
                    stepIndex={currentStepIndex}
                    totalSteps={totalSteps}
                    title={currentStep.title}
                    explanation={currentStep.explanation}
                    interviewInsight={currentStep.interviewInsight}
                  />

                  <ConsoleCard logs={currentStep.state.consoleLogs} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Quiz / Predict Modal */}
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
