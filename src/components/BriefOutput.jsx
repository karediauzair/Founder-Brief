import React, { useState } from 'react';
import BriefCard from './BriefCard';
import html2pdf from 'html2pdf.js';
import { Download, Copy, RefreshCw, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Zap } from 'lucide-react';

export default function BriefOutput({ brief, company, purpose, onReset }) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const confidenceScore = brief?.confidenceScore || 85;
  const confidenceColor = () => {
    if (confidenceScore >= 85) return 'text-green-700 border-green-200 bg-green-50';
    if (confidenceScore >= 70) return 'text-blue-700 border-blue-200 bg-blue-50';
    if (confidenceScore >= 50) return 'text-orange-700 border-orange-200 bg-orange-50';
    return 'text-red-700 border-red-200 bg-red-50';
  };

  const confidenceLabel = () => {
    if (confidenceScore >= 85) return 'High Confidence';
    if (confidenceScore >= 70) return 'Confidence';
    if (confidenceScore >= 50) return 'Likely Confidence';
    return 'Not Confidence';
  };

  const handleCopy = async () => {
    if (!brief) return;

    // Formatting for text copy
    const sourcesText = brief.sources?.map((s, i) => `[${i + 1}] ${s.title}\n    ${s.link}`).join('\n\n') || "No sources provided.";

    const formattedText = `
==================================================
FOUNDERBRIEF: INTELLIGENCE REPORT
==================================================
Target: ${company}
Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
Purpose: ${purpose || "General Intelligence"}

==================================================
1. EXECUTIVE SUMMARY
==================================================
${brief.executiveSummary || "No summary available."}

==================================================
2. COMPANY SNAPSHOT
==================================================
${brief.companySnapshot || "No snapshot available."}

==================================================
3. BUSINESS MODEL
==================================================
${brief.businessModel || "No business model details."}

==================================================
4. MEETING STRATEGY
==================================================
${brief.meetingStrategy || "No strategy available."}

==================================================
5. OPPORTUNITIES
==================================================
${brief.opportunities || "No opportunities listed."}

==================================================
6. RISKS & CHALLENGES
==================================================
${brief.risks || "No risks listed."}

==================================================
7. REPORT CONFIDENCE
==================================================
Score: ${brief.confidenceScore || '--'}%
Notes: ${brief.dataQualityNotes || "No specific data conflicts noted."}

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
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
            {company}
          </h1>
          
          <div className="flex flex-col gap-2 text-sm text-gray-600 font-medium">
            {purpose && (
              <p className="text-gray-900 text-base mb-2">{purpose}</p>
            )}
            <p>Generated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <p>{brief.sources?.length || 0} Sources Used</p>
            <p className="flex items-center gap-1.5">
              Confidence: {brief.confidenceScore || '--'}% 
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ml-2 ${confidenceColor()}`}>
                {confidenceLabel()}
              </span>
            </p>
          </div>
        </div>

        {/* Report Content Grid */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
          {/* Report Confidence Card */}
          <div className="col-span-1 md:col-span-2">
            <BriefCard 
              label="REPORT CONFIDENCE" 
              content={{
                label: confidenceLabel(),
                score: brief.confidenceScore,
                reason: brief.dataQualityNotes || "This report is based on official company information, recent news coverage, and multiple independent sources."
              }} 
              isConfidence={true} 
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <BriefCard label="EXECUTIVE SUMMARY" content={brief.executiveSummary} company={company} />
          </div>
          
          <div className="col-span-1">
            <BriefCard label="COMPANY SNAPSHOT" content={brief.companySnapshot} company={company} />
          </div>
          
          <div className="col-span-1">
            <BriefCard label="BUSINESS MODEL" content={brief.businessModel} company={company} />
          </div>

          <div className="col-span-1 md:col-span-2">
            <BriefCard label="MEETING STRATEGY" content={brief.meetingStrategy} isStrategy={true} company={company} />
          </div>

          <div className="col-span-1">
            <BriefCard label="OPPORTUNITIES" content={brief.opportunities} company={company} />
          </div>

          <div className="col-span-1">
            <BriefCard label="RISKS" content={brief.risks} company={company} />
          </div>

          {/* Sources Transparency */}
          <div className="col-span-1 md:col-span-2">
            <BriefCard 
              label="RESEARCH SOURCES" 
              content={brief.sources} 
              sourceBreakdown={brief.sourceBreakdown} 
              company={company}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
