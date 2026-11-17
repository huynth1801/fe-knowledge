export type TopicId =
  | 'event-loop'
  | 'closures'
  | 'prototype'
  | 'stacking-context'
  | 'fiber-tree'
  | 'nextjs-rendering'
  | 'rendering-pipeline'
  | 'http-cache'
  | 'core-web-vitals'
  | 'design-tokens'
  | 'websocket-realtime'
  | 'dataviz-maps'
  | 'testing-visual-regression';

export interface TopicCategory {
  id: string;
  title: string;
  description: string;
  topics: {
    id: TopicId;
    title: string;
    subtitle: string;
    level: 'Junior' | 'Mid' | 'Senior';
    isReady: boolean;
    badge?: string;
    hasSimulation?: boolean;
    estimatedMinutes?: number;
  }[];
}

export interface StackFrame {
  id: string;
  name: string;
  desc?: string;
  isExecuting?: boolean;
}

export interface WebApiItem {
  id: string;
  name: string;
  timer?: string;
  status: 'ticking' | 'completed';
}

export interface QueueItem {
  id: string;
  name: string;
  source: 'Promise' | 'queueMicrotask' | 'setTimeout' | 'setInterval' | 'async/await';
  detail?: string;
}

export type EventLoopPhase = 
  | 'idle' 
  | 'callStackCheck' 
  | 'microtaskDrain' 
  | 'renderPhase' 
  | 'macrotaskPick';

export interface SimulationState {
  callStack: StackFrame[];
  webApis: WebApiItem[];
  microtaskQueue: QueueItem[];
  macrotaskQueue: QueueItem[];
  consoleLogs: { id: string; text: string; step: number; tag?: string }[];
  eventLoopPhase: EventLoopPhase;
  activeContainer?: 'callStack' | 'webApis' | 'microtasks' | 'macrotasks' | 'eventLoop' | 'console';
}

export interface SimulationStep {
  stepIndex: number;
  title: string;
  activeCodeLines: number[];
  explanation: string;
  interviewInsight?: string;
  state: SimulationState;
}

export interface Scenario {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  description: string;
  code: string;
  expectedOutput: string[];
  steps: SimulationStep[];
}
