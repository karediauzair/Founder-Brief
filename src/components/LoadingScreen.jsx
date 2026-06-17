import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Search } from 'lucide-react';

const steps = [
  "Collecting company information",
  "Reviewing official sources",
  "Analyzing recent developments",
  "Evaluating opportunities",
  "Assessing risks",
  "Generating meeting strategy",
  "Preparing final intelligence brief"
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
  const [allDone, setAllDone] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [fastForward, setFastForward] = useState(false);

  // Rotating messages timer
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(messageInterval);
  }, []);

  // Fast forward trigger
  useEffect(() => {
    if (apiFinished && !fastForward) {
      setFastForward(true);
    }
  }, [apiFinished, fastForward]);

  // Natural progression logic (handles both normal and fast-forward speeds)
  useEffect(() => {
    if (allDone) return;

    if (activeStepIndex >= steps.length - 1) {
      // Reached the end of steps, wait for API to finish
      if (apiFinished) {
        setAllDone(true);
      }
      return;
    }

    // Determine delay based on mode
    let delay;
    if (fastForward) {
      // Fast forward takes 200ms-500ms per step
      delay = Math.floor(Math.random() * 300) + 200;
    } else {
      // Natural progression takes 1000ms-2500ms per step
      delay = Math.floor(Math.random() * 1500) + 1000;
    }

    const timer = setTimeout(() => {
      setActiveStepIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [activeStepIndex, fastForward, allDone, apiFinished]);

  // Transition logic
  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => {
        if (apiError) onTransitionToError(apiError);
        else if (pendingBrief) onTransitionToResult(pendingBrief);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [allDone, apiError, pendingBrief, onTransitionToError, onTransitionToResult]);

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
