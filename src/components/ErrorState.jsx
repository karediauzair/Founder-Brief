import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center font-sans">
      <div className="text-amber text-6xl md:text-7xl mb-6 select-none animate-bounce">
        ⚠
      </div>
      
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink leading-tight max-w-lg">
        We couldn't find enough data.
      </h2>
      
      <p className="text-stone text-base mt-4 max-w-md leading-relaxed">
        Try a more specific company name, or paste the company's website URL.
      </p>



      <button
        onClick={onRetry}
        className="mt-8 rounded-lg px-6 py-3 bg-amber text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200"
      >
        Try Again
      </button>
    </div>
  );
}
