import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Search } from 'lucide-react';

const steps = [
  "Collecting company information",
  "Reviewing recent developments",
  "Analyzing market position",
  "Evaluating opportunities",
  "Assessing risks",
  "Preparing meeting strategy",
  "Generating final report"
];

const ROTATING_MESSAGES = [
  "Analyzing trusted sources...",
  "Reviewing company developments...",
  "Preparing meeting intelligence...",
  "Generating strategic recommendations..."
];

const STEP_TIMINGS = [0, 1500, 3000, 4500, 6000, 7500, 9000];

export default function LoadingScreen({
  company,
  apiFinished,
  pendingBrief,
  apiError,
  onTransitionToResult,
  onTransitionToError
}) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  // 1. Core clock timer
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - start);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Rotating messages timer
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(messageInterval);
  }, []);

  // 2. Logic to coordinate step states and transitions
  useEffect(() => {
    let activeStepIndex = 0;
    for (let i = 0; i < STEP_TIMINGS.length; i++) {
      if (elapsedTime >= STEP_TIMINGS[i]) {
        activeStepIndex = i;
      }
    }

    const isLongerThan15s = elapsedTime >= 15000;

    if (isLongerThan15s) {
      if (!allDone) setAllDone(true);
      if (apiFinished) {
        if (apiError) onTransitionToError(apiError);
        else if (pendingBrief) onTransitionToResult(pendingBrief);
      }
      return;
    }

    // Move ahead faster if API finished early, but ensure we show at least some progress
    if (apiFinished && activeStepIndex >= 4) {
      if (!allDone) {
        setAllDone(true);
        const timer = setTimeout(() => {
          if (apiError) onTransitionToError(apiError);
          else if (pendingBrief) onTransitionToResult(pendingBrief);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [elapsedTime, apiFinished, pendingBrief, apiError, allDone, onTransitionToResult, onTransitionToError]);

  let activeStepIndex = 0;
  for (let i = 0; i < STEP_TIMINGS.length; i++) {
    if (elapsedTime >= STEP_TIMINGS[i]) activeStepIndex = i;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 font-sans text-left animate-fade-in bg-[#FAFAFA]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Researching {company}...
          </h2>
          <p className="text-sm text-gray-500 mt-2 h-5 transition-opacity duration-300">
            {ROTATING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isPending = !allDone && idx > activeStepIndex;
            const isActive = !allDone && idx === activeStepIndex;
            const isDone = allDone || idx < activeStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 transition-opacity duration-500 ${
                  isPending ? 'opacity-30' : 'opacity-100'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-gray-900 transition-transform duration-300 scale-100" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  )}
                </div>

                <span
                  className={`text-sm transition-colors duration-300 ${
                    isPending ? 'text-gray-400' : ''
                  } ${
                    isActive ? 'text-gray-900 font-medium' : ''
                  } ${
                    isDone ? 'text-gray-600' : ''
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
