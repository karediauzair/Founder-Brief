import React, { useState, useEffect } from 'react';

const STEP_TIMINGS = [0, 2200, 4800, 7500, 10500];

const steps = [
  "Searching the web for company data...",
  "Reading recent news and updates...",
  "Analyzing business model and competitors...",
  "Identifying risks and red flags...",
  "Writing your brief..."
];

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

  // 1. Core clock timer (runs independent of the API call)
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - start);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // 2. Logic to coordinate step states and transitions
  useEffect(() => {
    // Determine the current active step index based on timings
    let activeStepIndex = 0;
    for (let i = 0; i < STEP_TIMINGS.length; i++) {
      if (elapsedTime >= STEP_TIMINGS[i]) {
        activeStepIndex = i;
      }
    }

    const isLongerThan12s = elapsedTime >= 12000;

    // RULE: If the API takes longer than 12 seconds
    if (isLongerThan12s) {
      if (!allDone) {
        setAllDone(true);
      }
      if (apiFinished) {
        if (apiError) {
          onTransitionToError(apiError);
        } else if (pendingBrief) {
          onTransitionToResult(pendingBrief);
        }
      }
      return;
    }

    // RULE: When the API returns a result AND the current active step index is >= 3
    if (apiFinished && activeStepIndex >= 3) {
      if (!allDone) {
        setAllDone(true);
        const timer = setTimeout(() => {
          if (apiError) {
            onTransitionToError(apiError);
          } else if (pendingBrief) {
            onTransitionToResult(pendingBrief);
          }
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [elapsedTime, apiFinished, pendingBrief, apiError, allDone, onTransitionToResult, onTransitionToError]);

  // Determine current active step index for UI state matching
  let activeStepIndex = 0;
  for (let i = 0; i < STEP_TIMINGS.length; i++) {
    if (elapsedTime >= STEP_TIMINGS[i]) {
      activeStepIndex = i;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 font-sans text-left animate-fade-in">
      <div className="w-full max-w-md">
        {/* Researching Company Header */}
        <h2 className="text-xl md:text-2xl font-serif text-ink mb-10 text-center font-bold">
          Researching <span className="text-amber">{company}</span>...
        </h2>

        {/* Steps List */}
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const isPending = !allDone && idx > activeStepIndex;
            const isActive = !allDone && idx === activeStepIndex;
            const isDone = allDone || idx < activeStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-4 transition-opacity duration-700 ${
                  isPending ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {/* Status Indicator Icon */}
                <div className="w-6 h-6 flex items-center justify-center shrink-0 relative">
                  {/* Pending dot */}
                  <span className={`text-stone/40 text-2xl leading-none select-none transition-all duration-300 ${
                    isPending ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}>
                    ·
                  </span>
                  
                  {/* Active spinner */}
                  {isActive && (
                    <div className="absolute w-4 h-4 border-2 border-chalk border-t-amber rounded-full animate-spin"></div>
                  )}
                  
                  {/* Done checkmark */}
                  <span className={`absolute text-amber text-lg font-bold select-none transform transition-transform duration-300 ${
                    isDone ? 'scale-100' : 'scale-0'
                  }`}>
                    ✓
                  </span>
                </div>

                {/* Step Text */}
                <span
                  className={`text-sm md:text-base transition-colors duration-300 ${
                    isPending ? 'text-stone' : ''
                  } ${
                    isActive ? 'text-ink font-medium animate-pulse' : ''
                  } ${
                    isDone ? 'text-amber/60 line-through decoration-amber/30 italic font-light' : ''
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
