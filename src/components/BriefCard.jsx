import React from 'react';
import { AlertTriangle, Globe, Newspaper, Briefcase, Database, ChevronRight } from 'lucide-react';

export default function BriefCard({ label, content, isStrategy, isNotes, sourceBreakdown }) {
  const isSources = label === 'RESEARCH SOURCES';

  const renderContent = () => {
    if (!content && !isSources) return <p className="text-gray-400 italic text-sm mt-3">No details available.</p>;

    // 1. Specialized Rendering for Sources Transparency
    if (isSources) {
      return (
        <div className="mt-5">
          {/* Source Breakdown summary if available */}
          {sourceBreakdown && (
            <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> Official: {sourceBreakdown.official || 0}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <Newspaper className="w-3.5 h-3.5 text-purple-600" /> News: {sourceBreakdown.news || 0}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <Briefcase className="w-3.5 h-3.5 text-orange-600" /> Industry: {sourceBreakdown.industry || 0}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <Database className="w-3.5 h-3.5 text-green-600" /> Public/Other: {sourceBreakdown.public || 0}
              </div>
            </div>
          )}

          {Array.isArray(content) && content.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.map((src, idx) => (
                <a
                  key={idx}
                  href={src.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between group transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
                >
                  <div className="flex flex-col text-left overflow-hidden mr-3">
                    <span className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 truncate transition-colors">
                      {src.title}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 truncate max-w-[250px]">
                      {src.link}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No references linked.</p>
          )}
        </div>
      );
    }

    // 2. Specialized Rendering for Data Quality Notes
    if (isNotes) {
      const isConflict = content && typeof content === 'string' && content.toLowerCase().includes('conflict');
      return (
        <div className={`mt-4 p-5 rounded-xl border flex items-start gap-3 ${isConflict ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
          <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${isConflict ? 'text-orange-600' : 'text-gray-500'}`} />
          <div>
            <p className={`text-sm leading-relaxed ${isConflict ? 'text-orange-900' : 'text-gray-700'}`}>
              {content || "No major data conflicts detected during research."}
            </p>
          </div>
        </div>
      );
    }

    // 3. String formatting for Strategy and other lists
    if (typeof content === 'string' && content.includes('\n')) {
      const items = content.split('\n').filter(item => item.trim() !== '');
      
      return (
        <div className={`space-y-4 mt-5 text-left font-sans ${isStrategy ? 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 space-y-0' : ''}`}>
          {items.map((item, idx) => {
            const trimmed = item.trim();
            
            // Markdown-style headers
            if (trimmed.startsWith('###')) {
              const headerText = trimmed.replace(/^###\s*/, '').trim();
              let headerColor = "text-gray-900 border-gray-200";
              
              if (isStrategy) {
                if (headerText.toLowerCase().includes('focus')) headerColor = "text-blue-700 border-blue-100 bg-blue-50/50";
                else if (headerText.toLowerCase().includes('avoid')) headerColor = "text-red-700 border-red-100 bg-red-50/50";
                else if (headerText.toLowerCase().includes('question')) headerColor = "text-purple-700 border-purple-100 bg-purple-50/50";
                else if (headerText.toLowerCase().includes('opportunity')) headerColor = "text-green-700 border-green-100 bg-green-50/50";
              }

              return (
                <div key={idx} className={`${isStrategy ? 'col-span-1 md:col-span-2 mt-6 first:mt-0' : 'mt-8'}`}>
                  <h4 className={`font-bold text-xs tracking-widest uppercase mb-3 px-3 py-2 rounded-lg border ${headerColor}`}>
                    {headerText}
                  </h4>
                </div>
              );
            }

            const cleanItem = item.replace(/^[-*•\d.]\s*/, '').trim();
            const isListItem = item.trim().startsWith('-') || item.trim().startsWith('•') || item.trim().startsWith('*') || item.trim().match(/^\d+\./);
            
            if (!isListItem && !isStrategy) {
              return (
                <p key={idx} className="text-gray-700 text-sm md:text-[15px] leading-relaxed">
                  {cleanItem}
                </p>
              );
            }

            return (
              <div key={idx} className={`flex items-start text-gray-700 text-sm md:text-[15px] leading-relaxed ${isStrategy ? 'mb-3 bg-gray-50/50 p-3 rounded-lg border border-gray-100' : ''}`}>
                <span className="mr-3 shrink-0 flex items-center justify-center select-none text-gray-400 mt-[1px]">
                  •
                </span>
                <span className="text-gray-700">{cleanItem}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // Default string fallback
    return (
      <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed mt-4 text-left font-sans">
        {content}
      </p>
    );
  };

  return (
    <div 
      className={`h-full flex flex-col border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8 ${
        isStrategy ? 'bg-white ring-1 ring-gray-900/5' : 'bg-white'
      }`}
    >
      <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-500 block text-left mb-1">
        {label}
      </span>
      {renderContent()}
    </div>
  );
}
