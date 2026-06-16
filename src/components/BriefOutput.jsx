import React, { useState } from 'react';
import BriefCard from './BriefCard';
import html2pdf from 'html2pdf.js';
import { Download, Copy, RefreshCw, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Zap } from 'lucide-react';

export default function BriefOutput({ brief, company, purpose, onReset }) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const confidenceColor = () => {
    if (!brief.confidenceScore) return 'text-gray-500 bg-gray-100 border-gray-200';
    const score = parseInt(brief.confidenceScore, 10);
    if (score >= 90) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const confidenceLabel = () => {
    if (!brief.confidenceScore) return 'Unknown Confidence';
    const score = parseInt(brief.confidenceScore, 10);
    if (score >= 90) return 'High Confidence';
    if (score >= 70) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const handleCopy = async () => {
    if (!brief) return;

    let sourcesText = '';
    if (Array.isArray(brief.sources) && brief.sources.length > 0) {
      sourcesText = brief.sources.map(s => `• ${s.title}: ${s.link}`).join('\n');
    } else {
      sourcesText = 'No reference sources found.';
    }

    const formattedText = `FOUNDERBRIEF: EXECUTIVE INTELLIGENCE SUMMARY
Company: ${company.toUpperCase()}
Research Purpose: ${purpose || "General company intelligence"}
Generated: ${new Date().toLocaleDateString()}
Confidence: ${brief.confidenceScore || 'N/A'}% (${confidenceLabel()})

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
8. DATA QUALITY NOTES
==================================================
${brief.dataQualityNotes || "No specific data conflicts noted."}

==================================================
9. SOURCES & REFERENCES
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

  const handleDownloadPDF = () => {
    setIsExporting(true);
    const element = document.getElementById('report-content');
    
    // Hide buttons temporarily during PDF generation
    const actionBars = document.querySelectorAll('.no-print');
    actionBars.forEach(el => el.style.display = 'none');

    const opt = {
      margin:       10,
      filename:     `FounderBrief-${company.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      actionBars.forEach(el => el.style.display = 'flex'); // flex is standard for these
      setIsExporting(false);
    });
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-12 pb-24 px-4 font-sans fade-in">
      
      {/* Top Navigation / Actions */}
      <div className="max-w-[1000px] mx-auto mb-6 flex justify-between items-center no-print">
        <div className="flex items-center gap-2 text-gray-400 font-medium hover:text-gray-900 cursor-pointer transition-colors" onClick={onReset}>
          <Zap className="w-4 h-4 text-gray-900" />
          <span className="text-sm font-semibold text-gray-900">FounderBrief</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gray-900 border border-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Preparing...' : 'Download PDF'}
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      <div id="report-content" className="max-w-[1000px] mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Editorial Header */}
        <div className="p-10 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  INTELLIGENCE BRIEF
                </span>
                <span className="text-xs font-medium text-gray-400">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-2">
                {company}
              </h1>
              {purpose && (
                <div className="mt-4 inline-flex items-start">
                  <div className="w-1 h-full bg-blue-500 rounded-full mr-3 shrink-0"></div>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-2xl font-medium">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-0.5">Research Purpose</span>
                    {purpose}
                  </p>
                </div>
              )}
            </div>
            
            {/* Metadata Stats Box */}
            <div className="flex flex-row md:flex-col gap-4 bg-[#FAFAFA] p-5 rounded-xl border border-gray-100 shrink-0 min-w-[200px]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Confidence Score
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{brief.confidenceScore || '--'}%</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${confidenceColor()}`}>
                    {confidenceLabel()}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Sources Analyzed
                </span>
                <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  {brief.sources?.length || 0} Trusted Sources
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content Grid */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
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
          
          <div className="col-span-1 md:col-span-2">
            <BriefCard label="GOAL-SPECIFIC INTELLIGENCE" content={brief.goalSpecificIntelligence} />
          </div>
          
          {/* Meeting Strategy - Full Width, Special Styling applied in BriefCard */}
          <div className="col-span-1 md:col-span-2">
            <BriefCard label="MEETING STRATEGY" content={brief.meetingStrategy} isStrategy={true} />
          </div>

          {/* Data Quality Notes */}
          <div className="col-span-1 md:col-span-2">
            <BriefCard label="DATA QUALITY NOTES" content={brief.dataQualityNotes} isNotes={true} />
          </div>

          {/* Sources Transparency */}
          <div className="col-span-1 md:col-span-2">
            <BriefCard 
              label="RESEARCH SOURCES" 
              content={brief.sources} 
              sourceBreakdown={brief.sourceBreakdown} 
            />
          </div>
        </div>
      </div>

      {/* Differentiation Block */}
      <div className="max-w-[1000px] mx-auto mt-12 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm no-print">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">Why FounderBrief?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Traditional Research</div>
            <div className="text-sm text-gray-400 line-through mb-2">Hours of searching</div>
            <div className="text-xs font-semibold text-blue-600 mb-1">FounderBrief</div>
            <div className="text-sm font-semibold text-gray-900">Seconds to insight</div>
          </div>
          <div className="border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-6">
            <div className="text-xs font-semibold text-gray-500 mb-1">Traditional Research</div>
            <div className="text-sm text-gray-400 line-through mb-2">Information gathering</div>
            <div className="text-xs font-semibold text-blue-600 mb-1">FounderBrief</div>
            <div className="text-sm font-semibold text-gray-900">Meeting preparation</div>
          </div>
          <div className="border-t border-gray-100 pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-6">
            <div className="text-xs font-semibold text-gray-500 mb-1">Traditional Research</div>
            <div className="text-sm text-gray-400 line-through mb-2">Generic data</div>
            <div className="text-xs font-semibold text-blue-600 mb-1">FounderBrief</div>
            <div className="text-sm font-semibold text-gray-900">Goal-specific intelligence</div>
          </div>
        </div>
      </div>

    </div>
  );
}
