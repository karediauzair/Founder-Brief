import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center font-sans">
      <div className="text-gray-300 mb-6 select-none flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
        </svg>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight max-w-lg tracking-tight">
        We couldn't find enough data.
      </h2>
      
      <p className="text-gray-500 text-base mt-4 max-w-md leading-relaxed">
        Try a more specific company name, or paste the company's website URL.
      </p>



      <button
        onClick={onRetry}
        className="mt-8 rounded-xl px-6 py-3 bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
      >
        Try Again
      </button>
    </div>
  );
}
