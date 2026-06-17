import React from 'react';
import { AlertTriangle, Globe, Newspaper, Briefcase, Database, ChevronRight, ShieldCheck, Target, HelpCircle, Zap } from 'lucide-react';

export default function BriefCard({ label, content, isStrategy, isNotes, isConfidence, sourceBreakdown, company }) {
  const isSources = label === 'RESEARCH SOURCES';

  const getSourceType = (link) => {
    if (!link) return { type: "Public Data", icon: Database };
    const lowerLink = link.toLowerCase();
    const lowerCompany = company ? company.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    
    if (lowerCompany && lowerCompany.length > 2 && lowerLink.includes(lowerCompany)) return { type: "Official Website", icon: Globe };
    if (lowerLink.match(/news|forbes|techcrunch|bloomberg|cnbc|wsj|nytimes|reuters/)) return { type: "News Publication", icon: Newspaper };
    if (lowerLink.match(/report|research|gartner|forrester|mckinsey|sec\.gov/)) return { type: "Industry Report", icon: Briefcase };
    return { type: "Public Data", icon: Database };
  };

  const renderContent = () => {
    if (!content && !isSources) return <p className="text-gray-400 italic text-sm mt-3">No details available.</p>;

    // 0. Specialized Rendering for Report Confidence
    if (isConfidence) {
      return (
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-extrabold text-gray-900">{content.score || '--'}%</span>
              <span className="text-sm font-bold tracking-wide uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                {content.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
              {content.reason}
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-white rounded-full border border-gray-200 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      );
    }

    // 1. Specialized Rendering for Sources Transparency
    if (isSources) {
      const calculatedBreakdown = { official: 0, news: 0, industry: 0, public: 0 };
      if (Array.isArray(content)) {
        content.forEach(src => {
          const { type } = getSourceType(src.link);
          if (type === "Official Website") calculatedBreakdown.official++;
          else if (type === "News Publication") calculatedBreakdown.news++;
          else if (type === "Industry Report") calculatedBreakdown.industry++;
          else calculatedBreakdown.public++;
        });
      }
      const breakdownToUse = calculatedBreakdown;

      return (
        <div className="mt-5">
          {/* Source Breakdown summary if available */}
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <Globe className="w-3.5 h-3.5 text-blue-600" /> Official: {breakdownToUse.official}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <Newspaper className="w-3.5 h-3.5 text-purple-600" /> News: {breakdownToUse.news}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <Briefcase className="w-3.5 h-3.5 text-orange-600" /> Industry: {breakdownToUse.industry}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <Database className="w-3.5 h-3.5 text-green-600" /> Public/Other: {breakdownToUse.public}
            </div>
          </div>

          {Array.isArray(content) && content.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {content.map((src, idx) => {
                const { type, icon: Icon } = getSourceType(src.link);
                return (
                  <a
                    key={idx}
                    href={src.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between group transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
                  >
                    <div className="flex flex-col text-left overflow-hidden mr-3 mb-2 sm:mb-0">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 truncate transition-colors mb-1">
                        {src.title}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[400px]">
                        {src.link}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 rounded-full">
                        <Icon className="w-3 h-3" />
                        {type}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors hidden sm:block" />
                    </div>
                  </a>
                );
              })}
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
            
            // Detect headers
            let headerText = null;
            if (trimmed.startsWith('###')) {
              headerText = trimmed.replace(/^###\s*/, '').replace(/\*+/g, '').replace(/:$/, '').trim();
            } else if (trimmed.match(/^\*+[^*]+\*+:?$/)) {
              headerText = trimmed.replace(/\*/g, '').replace(/:$/, '').trim();
            } else if (isStrategy && trimmed.length < 40 && trimmed.endsWith(':') && !trimmed.includes('- ')) {
              headerText = trimmed.replace(/:$/, '').replace(/\*/g, '').trim();
            }
            
            // Workaround for malformed AI output like `*Focus On:**`
            if (!headerText && isStrategy && trimmed.toLowerCase().includes('focus on') && trimmed.length < 30) {
              headerText = "Focus On";
            }
            if (!headerText && isStrategy && trimmed.toLowerCase().includes('avoid') && trimmed.length < 30 && !trimmed.startsWith('-')) {
              headerText = "Avoid";
            }
            if (!headerText && isStrategy && trimmed.toLowerCase().includes('question') && trimmed.length < 30 && !trimmed.startsWith('-')) {
              headerText = "Questions to Ask";
            }
            if (!headerText && isStrategy && trimmed.toLowerCase().includes('opportunity') && trimmed.length < 30 && !trimmed.startsWith('-')) {
              headerText = "Potential Opportunity";
            }

            if (headerText) {
              let headerColor = "text-gray-900 border-gray-200";
              let HeaderIcon = null;
              
              if (isStrategy) {
                if (headerText.toLowerCase().includes('focus')) {
                  headerColor = "text-blue-700 border-blue-200 bg-blue-50";
                  HeaderIcon = Target;
                } else if (headerText.toLowerCase().includes('avoid')) {
                  headerColor = "text-red-700 border-red-200 bg-red-50";
                  HeaderIcon = AlertTriangle;
                } else if (headerText.toLowerCase().includes('question')) {
                  headerColor = "text-purple-700 border-purple-200 bg-purple-50";
                  HeaderIcon = HelpCircle;
                } else if (headerText.toLowerCase().includes('opportunity')) {
                  headerColor = "text-green-700 border-green-200 bg-green-50";
                  HeaderIcon = Zap;
                }
              }

              return (
                <div key={idx} className={`${isStrategy ? 'col-span-1 md:col-span-2 mt-6 first:mt-0' : 'mt-8'}`}>
                  <h4 className={`flex items-center gap-2 font-bold text-xs tracking-widest uppercase mb-3 px-3 py-2 rounded-lg border ${headerColor}`}>
                    {HeaderIcon && <HeaderIcon className="w-4 h-4" />}
                    {headerText}
                  </h4>
                </div>
              );
            }

            const cleanItem = trimmed.replace(/^[-*•\d.]\s*/, '').replace(/\*/g, '').trim();
            const isListItem = trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*') || trimmed.match(/^\d+\./);
            
            if (!isListItem && !isStrategy) {
              return (
                <p key={idx} className="text-gray-700 text-sm md:text-[15px] leading-relaxed">
                  {cleanItem}
                </p>
              );
            }

            if (!cleanItem) return null; // Skip empty list items

            return (
              <div key={idx} className={`flex items-start text-gray-700 text-sm md:text-[15px] leading-relaxed ${isStrategy ? 'mb-3 bg-gray-50/50 p-3 rounded-lg border border-gray-100' : ''}`}>
                <span className="mr-3 shrink-0 flex items-center justify-center select-none text-gray-400 mt-[1px]">
                  •
                </span>
                <span className="text-gray-700 font-medium">{cleanItem}</span>
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
      className={`h-full flex flex-col border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8 break-inside-avoid ${
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
