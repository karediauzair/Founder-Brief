import React from 'react';

export default function BriefCard({ label, content }) {
  const isRedFlag = label === 'RISKS';
  const isOpp = label === 'OPPORTUNITIES';
  const isQuestion = label === 'RECOMMENDED QUESTIONS';
  const isStarter = label === 'CONVERSATION STARTERS';
  const isSnapshot = label === 'COMPANY SNAPSHOT';
  const isExecutive = label === 'EXECUTIVE SUMMARY';
  const isGoalSpecific = label === 'GOAL-SPECIFIC INTELLIGENCE';
  const isSources = label === 'SOURCES';

  const renderContent = () => {
    if (!content) return <p className="text-stone italic text-sm">No details available.</p>;

    // Handle Sources array format
    if (isSources) {
      if (Array.isArray(content) && content.length > 0) {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {content.map((src, idx) => (
              <a
                key={idx}
                href={src.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-chalk rounded-lg flex items-center justify-between group transition-all duration-200 hover:border-amber/40 hover:bg-[#F9F7F3] premium-shadow"
              >
                <div className="flex flex-col text-left overflow-hidden mr-3">
                  <span className="text-xs font-semibold text-ink group-hover:text-amber truncate">
                    {src.title}
                  </span>
                  <span className="text-[9px] text-stone mt-0.5 truncate max-w-[200px]">
                    {src.link}
                  </span>
                </div>
                <span className="text-xs text-stone group-hover:text-amber transition-colors select-none">↗</span>
              </a>
            ))}
          </div>
        );
      }
      return <p className="text-stone italic text-xs">No references linked.</p>;
    }

    // Handle string content split by line breaks for lists or headers
    if (typeof content === 'string' && content.includes('\n')) {
      const items = content.split('\n').filter(item => item.trim() !== '');
      
      return (
        <div className="space-y-3.5 mt-4 text-left font-sans">
          {items.map((item, idx) => {
            const trimmed = item.trim();
            
            // Check if it's a markdown-style header (e.g. ### Focus On)
            if (trimmed.startsWith('###')) {
              const headerText = trimmed.replace(/^###\s*/, '').trim();
              return (
                <h4 key={idx} className="font-bold text-ink text-xs tracking-wider uppercase mt-6 mb-2.5 first:mt-0 font-sans border-b border-chalk pb-1 text-[#E8622A]">
                  {headerText}
                </h4>
              );
            }

            const cleanItem = item.replace(/^[-*•\d.]\s*/, '').trim();
            
            // Check if the item is explicitly structured as a list item (starts with marker)
            const isListItem = item.trim().startsWith('-') || item.trim().startsWith('•') || item.trim().startsWith('*') || item.trim().match(/^\d+\./);
            
            if (!isListItem && !isOpp && !isRedFlag && !isQuestion && !isStarter) {
              return (
                <p key={idx} className="text-ink text-sm md:text-base leading-relaxed pl-1">
                  {cleanItem}
                </p>
              );
            }

            return (
              <div key={idx} className="flex items-start text-ink text-sm md:text-base leading-relaxed pl-1">
                <span className="mr-3 mt-1.5 shrink-0 flex items-center justify-center select-none">
                  {isOpp && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  {isRedFlag && <span className="w-1.5 h-1.5 rounded-full bg-amber"></span>}
                  {isQuestion && <span className="text-xs font-bold text-amber font-mono">Q.</span>}
                  {isStarter && <span className="text-xs text-stone">✦</span>}
                  {!isOpp && !isRedFlag && !isQuestion && !isStarter && (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone"></span>
                  )}
                </span>
                <span className="text-ink">{cleanItem}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // Default formatting (paragraphs for snapshots or summaries)
    return (
      <p className="text-ink text-sm md:text-base leading-relaxed mt-3 text-left font-sans">
        {content}
      </p>
    );
  };

  return (
    <div 
      className={`h-full flex flex-col rounded-xl border bg-white p-6 md:p-8 transition-all duration-300 premium-shadow premium-shadow-hover ${
        isExecutive 
          ? 'border-l-4 border-l-amber border-chalk' 
          : 'border-chalk'
      }`}
    >
      <span className="text-[10px] md:text-[11px] font-sans font-bold uppercase tracking-widest text-amber block text-left">
        {label}
      </span>
      {renderContent()}
    </div>
  );
}
