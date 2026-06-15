import React, { useState } from 'react';
import BriefCard from './BriefCard';

export default function BriefOutput({ brief, company, purpose, onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!brief) return;

    // Build plain-text consulting summary
    let sourcesText = '';
    if (Array.isArray(brief.sources) && brief.sources.length > 0) {
      sourcesText = brief.sources.map(s => `• ${s.title}: ${s.link}`).join('\n');
    } else {
      sourcesText = 'No reference sources found.';
    }

    const formattedText = `FOUNDERBRIEF: EXECUTIVE INTELLIGENCE SUMMARY
Company: ${company.toUpperCase()}
Research Purpose: ${purpose || "General company intelligence"}
Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

==================================================
1. EXECUTIVE SUMMARY
==================================================
${brief.executiveSummary}

==================================================
2. COMPANY SNAPSHOT
==================================================
${brief.companySnapshot}

==================================================
3. BUSINESS OVERVIEW
==================================================
${brief.businessOverview}

==================================================
4. RECENT DEVELOPMENTS
==================================================
${brief.recentDevelopments}

==================================================
5. RISKS & CONSIDERATIONS
==================================================
${brief.risks}

==================================================
6. GOAL-SPECIFIC INTELLIGENCE
==================================================
${brief.goalSpecificIntelligence}

==================================================
7. MEETING STRATEGY
==================================================
${brief.meetingStrategy}

==================================================
8. SOURCES & REFERENCES
==================================================
${sourcesText}

--------------------------------------------------
FounderBrief · Handcrafted Business Intelligence`;

    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy brief: ', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-16 pb-24 px-4 font-sans fade-in">
      
      {/* Editorial Header */}
      <div className="mb-10 text-left border-b border-chalk pb-8">
        <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-amber block">
          EXECUTIVE INTELLIGENCE BRIEF
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink mt-3 leading-tight tracking-tight">
          {company}
        </h1>
        {purpose && (
          <div className="mt-4 p-4 bg-paper rounded-lg border border-chalk">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone block mb-1">
              Customized Research Context
            </span>
            <p className="text-xs text-ink leading-relaxed italic">
              "{purpose}"
            </p>
          </div>
        )}
        <div className="flex items-center gap-3 mt-4 text-[10px] text-stone font-mono uppercase tracking-wider">
          <span>Generated Just Now</span>
          <span>·</span>
          <span>BCG/McKinsey Format</span>
        </div>
      </div>

      {/* Grid Layout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="col-span-1 md:col-span-2">
          <BriefCard label="EXECUTIVE SUMMARY" content={brief.executiveSummary} />
        </div>
        <div className="col-span-1">
          <BriefCard label="COMPANY SNAPSHOT" content={brief.companySnapshot} />
        </div>
        <div className="col-span-1">
          <BriefCard label="BUSINESS OVERVIEW" content={brief.businessOverview} />
        </div>
        <div className="col-span-1">
          <BriefCard label="RECENT DEVELOPMENTS" content={brief.recentDevelopments} />
        </div>
        <div className="col-span-1">
          <BriefCard label="RISKS & CONSIDERATIONS" content={brief.risks} />
        </div>
        <div className="col-span-1">
          <BriefCard label="GOAL-SPECIFIC INTELLIGENCE" content={brief.goalSpecificIntelligence} />
        </div>
        <div className="col-span-1">
          <BriefCard label="MEETING STRATEGY" content={brief.meetingStrategy} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <BriefCard label="SOURCES" content={brief.sources} />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCopy}
          className={`flex-1 rounded-lg px-6 py-3.5 font-semibold text-sm transition-all duration-200 text-center select-none ${
            copied
              ? 'bg-amber/10 border border-amber/30 text-amber'
              : 'bg-amber text-white hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          {copied ? 'Copied ✓' : 'Copy Brief'}
        </button>
        <button
          onClick={onReset}
          className="flex-1 rounded-lg px-6 py-3.5 bg-white border border-chalk text-ink font-semibold text-sm hover:bg-[#F9F7F3] transition-all duration-200 text-center active:scale-[0.98] premium-shadow"
        >
          Search Again
        </button>
      </div>
    </div>
  );
}
